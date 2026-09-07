import { Router } from 'express';
import { auth } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';

/**
 * POST /api/auth/forgot-password — ONB-0 / REQ-16
 * Rejects accounts that signed up via Google, since they have no
 * password to reset. No auth required (the user isn't signed in yet).
 * See docs/02-design/02-technical/detailed-design/01-onboarding-personalization.md#onb-0.
 */
export const router = Router();

router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  // Account enumeration policy (api-spec.md §4, resolved): a nonexistent
  // email falls through to the same 202 "sent" response as a real one below
  // — this is the OWASP-recommended anti-enumeration default for password
  // reset, not an oversight. Only applies to this endpoint; POST
  // /auth/login/email is a direct client-side Firebase Auth SDK call and
  // still exposes auth/user-not-found vs auth/wrong-password distinctly —
  // that half of the same open point is unresolved (would need routing
  // login through our own server to mask, which hasn't been asked for).
  const user = await auth.getUserByEmail(email).catch(() => null);

  const signupMethod = user?.providerData[0]?.providerId;
  if (user && signupMethod !== 'password') {
    return res.status(422).json({
      error: 'This account was created with Google and has no password to reset.',
    });
  }

  if (user) {
    // No email delivery service has been chosen yet (confirmed with the
    // user 2026-09-07) — generatePasswordResetLink gives a real, working
    // Firebase-hosted reset link; logging it server-side is a stand-in for
    // actually emailing it, so the reset flow is testable locally in the
    // meantime. Never put this link in the HTTP response — that would leak
    // account existence and defeat the anti-enumeration behavior above.
    const resetLink = await auth.generatePasswordResetLink(email);
    console.log(`[forgot-password] reset link for ${email}: ${resetLink}`);
  }

  return res.status(202).json({ status: 'sent' });
}));
