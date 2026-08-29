import { Router } from 'express';
import { randomInt } from 'crypto';
import { db, auth } from '../../firebaseAdmin';
import { authenticate } from '../../middleware/authenticate';
import { asyncHandler } from '../../asyncHandler';

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

function generateCode(): string {
  return String(randomInt(100000, 999999));
}

/** POST /api/pairing/create-code — called from the web app's Profile screen (authenticated). */
router.post(
  '/pairing/create-code',
  authenticate,
  asyncHandler(async (req, res) => {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

    await db.doc(`pairingCodes/${code}`).set({
      uid: req.userId,
      createdAt: new Date().toISOString(),
      expiresAt,
    });

    return res.status(201).json({ code, expiresAt });
  }),
);

/** POST /api/pairing/redeem — called from the mobile companion app. No auth header (that's the point). */
router.post(
  '/pairing/redeem',
  asyncHandler(async (req, res) => {
    const { code } = req.body as { code?: string };
    if (!code) {
      return res.status(400).json({ error: 'code is required' });
    }

    const ref = db.doc(`pairingCodes/${code}`);
    const snapshot = await ref.get();
    const data = snapshot.data();

    if (!data || new Date(data.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'This code is invalid or has expired.' });
    }

    await ref.delete(); // one-time use
    const customToken = await auth.createCustomToken(data.uid);
    return res.json({ customToken });
  }),
);
