import { Router, type Request } from 'express';
import { randomInt, createHash } from 'crypto';
import { db, auth } from '../../firebaseAdmin';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../asyncHandler';
import {
  isLocked,
  recordFailedAttempt,
  retryAfterSeconds,
  type PairingRateLimitState,
} from '../../domain/pairingRateLimit';

/**
 * Device-pairing handoff (added 2026-08-29) — replaces the mobile companion
 * app's old email/password login. The web app (already signed in) creates a
 * short-lived one-time code; entering it in the mobile app exchanges it for
 * a Firebase custom token, so no credential is ever typed on the device.
 * Not tied to any HLA conceptual component — this is purely an auth
 * handoff mechanism, not a business entity from database-schema.md.
 */
export const router = Router();

const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CODE_GENERATION_ATTEMPTS = 5;

function generateCode(): string {
  // Upper bound is exclusive — 1000000, not 999999, so "999999" is reachable.
  return String(randomInt(100000, 1000000));
}

/**
 * INT-0 / REQ-18 — the failed-redeem-attempt counter is keyed by a hash of
 * the client IP, never the raw IP itself (see pairingRedeemAttempts/{key} in
 * routes/pairing/index.ts's redeem handler).
 */
function rateLimitKeyFor(req: Request): string {
  // req.ip depends on the trust-proxy hop count in server/index.ts. Temporary
  // diagnostic: set LOG_FORWARDED_FOR=1 to log the raw header chain once in
  // production so TRUST_PROXY_HOPS can be set correctly, then unset it (the
  // header contains client IPs). If req.ip is ever missing, fall back to one
  // shared bucket rather than skip the limit.
  if (process.env.LOG_FORWARDED_FOR === '1') {
    console.log('pairing redeem x-forwarded-for:', req.headers['x-forwarded-for'], 'req.ip:', req.ip);
  }
  const ip = req.ip ?? 'unknown';
  return createHash('sha256').update(ip).digest('hex');
}

/**
 * INT-0 — a signed-in account may have at most one live pairing code at a
 * time; deletes any existing ones for this uid before a new one is created,
 * so only the newest code still works.
 */
async function invalidateExistingCodesFor(uid: string): Promise<void> {
  const existing = await db.collection('pairingCodes').where('uid', '==', uid).get();
  if (existing.empty) return;
  const batch = db.batch();
  existing.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

/**
 * `.create()` fails instead of silently overwriting if a doc already exists
 * under that 6-digit code (a live collision would otherwise let a new code
 * hijack another user's still-active one via `.set()`). A handful of retries
 * with a fresh code keeps the odds of ever exhausting them astronomically low
 * (~1-in-900,000 chance of collision per attempt).
 */
async function createUniqueCode(uid: string, expiresAt: string): Promise<string> {
  for (let attempt = 0; attempt < CODE_GENERATION_ATTEMPTS; attempt++) {
    const code = generateCode();
    try {
      await db.doc(`pairingCodes/${code}`).create({
        uid,
        createdAt: new Date().toISOString(),
        expiresAt,
      });
      return code;
    } catch (e) {
      const alreadyExists = (e as { code?: number | string }).code === 6 || (e as { code?: number | string }).code === 'already-exists';
      if (!alreadyExists) throw e;
      // Collision on a live code — loop and try another one.
    }
  }
  throw new Error('Could not generate a unique pairing code.');
}

/** POST /api/pairing/create-code — called from the web app's Profile screen (authenticated). */
router.post(
  '/pairing/create-code',
  authenticate,
  asyncHandler(async (req, res) => {
    const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

    await invalidateExistingCodesFor(req.userId!);
    const code = await createUniqueCode(req.userId!, expiresAt);

    return res.status(201).json({ code, expiresAt });
  }),
);

/**
 * POST /api/pairing/redeem — called from the mobile companion app. No auth
 * header (that's the point).
 *
 * INT-0 / REQ-18 — rate-limited per client IP: 5 failed attempts within a
 * 15-minute window locks that client out (429 + Retry-After) until the
 * window expires. Checked *before* even looking up the code, so a locked-out
 * client can't keep probing codes while locked. Counter state lives in
 * Firestore (not memory) since Cloud Run can run multiple instances, and is
 * updated inside the same transaction as the code check-and-delete so
 * concurrent requests from the same client can't race past the threshold,
 * and so a code can never be redeemed twice.
 */
router.post(
  '/pairing/redeem',
  asyncHandler(async (req, res) => {
    const { code } = req.body as { code?: string };
    if (!code) {
      return res.status(400).json({ error: 'code is required' });
    }

    const now = new Date();
    const rateLimitRef = db.doc(`pairingRedeemAttempts/${rateLimitKeyFor(req)}`);

    // Fast pre-check outside the transaction: an already-locked client is
    // rejected without ever touching the pairingCodes collection.
    const preCheckState = (await rateLimitRef.get()).data() as PairingRateLimitState | undefined;
    if (isLocked(preCheckState, now)) {
      res.set('Retry-After', String(retryAfterSeconds(preCheckState, now)));
      return res.status(429).json({ error: 'Too many failed pairing attempts. Try again later.' });
    }

    const result = await db.runTransaction(async (tx) => {
      const rateLimitSnap = await tx.get(rateLimitRef);
      const rateLimitState = rateLimitSnap.data() as PairingRateLimitState | undefined;

      // Re-check inside the transaction in case another request just used up
      // the last allowed attempt between the pre-check and here.
      if (isLocked(rateLimitState, now)) {
        return { outcome: 'locked' as const, retryAfterSeconds: retryAfterSeconds(rateLimitState, now) };
      }

      const codeRef = db.doc(`pairingCodes/${code}`);
      const codeSnap = await tx.get(codeRef);
      const data = codeSnap.data();

      if (!data || new Date(data.expiresAt) < now) {
        tx.set(rateLimitRef, recordFailedAttempt(rateLimitState, now));
        return { outcome: 'invalid' as const };
      }

      tx.delete(codeRef); // one-time use
      tx.delete(rateLimitRef); // success resets this client's counter
      return { outcome: 'ok' as const, uid: data.uid as string };
    });

    if (result.outcome === 'locked') {
      res.set('Retry-After', String(result.retryAfterSeconds));
      return res.status(429).json({ error: 'Too many failed pairing attempts. Try again later.' });
    }
    if (result.outcome === 'invalid') {
      return res.status(410).json({ error: 'This code is invalid or has expired.' });
    }

    const customToken = await auth.createCustomToken(result.uid);
    return res.json({ customToken });
  }),
);
