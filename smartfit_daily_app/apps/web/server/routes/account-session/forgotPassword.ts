import { Router } from 'express';
import { auth } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';

/**
 * POST /api/auth/forgot-password — ONB-0 / REQ-16
 * Rejects accounts that signed up via Google/Apple, since they have no
 * password to reset. No auth required (the user isn't signed in yet).
 * See docs/02-design/02-technical/detailed-design/01-onboarding-personalization.md#onb-0.
 */
export const router = Router();

router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  const user = await auth.getUserByEmail(email).catch(() => null);
  // TODO(open point, api-spec.md §4): behavior when the email doesn't exist
  // at all (account enumeration policy) is not yet specified upstream.

  const signupMethod = user?.providerData[0]?.providerId;
  if (user && signupMethod !== 'password') {
    return res.status(422).json({
      error: 'This account was created with Google/Apple and has no password to reset.',
    });
  }

  // TODO: send the reset email (Admin SDK's generatePasswordResetLink +
  // an email delivery mechanism).
  return res.status(202).json({ status: 'sent' });
}));
