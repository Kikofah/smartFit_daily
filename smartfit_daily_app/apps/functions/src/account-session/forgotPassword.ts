import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { auth } from '../shared/firebaseAdmin';

/**
 * POST /auth/forgot-password — ONB-0 / REQ-16
 * The only Account & Session Management operation that needs a Cloud
 * Function (tech-stack.md §6.3.1): it must reject accounts that signed up
 * via Google/Apple, since they have no password to reset.
 *
 * See docs/02-design/02-technical/detailed-design/01-onboarding-personalization.md#onb-0.
 */
export const forgotPassword = onCall<{ email: string }>(async (request) => {
  const { email } = request.data;
  if (!email) {
    throw new HttpsError('invalid-argument', 'email is required');
  }

  const user = await auth.getUserByEmail(email).catch(() => null);
  // TODO(open point, api-spec.md §4): behavior when the email doesn't exist
  // at all (account enumeration policy) is not yet specified upstream.

  const signupMethod = user?.providerData[0]?.providerId;
  if (user && signupMethod !== 'password') {
    throw new HttpsError(
      'failed-precondition',
      'This account was created with Google/Apple and has no password to reset.',
    );
  }

  // TODO: send the reset email (Firebase Auth's generatePasswordResetLink +
  // an email delivery mechanism, or the client SDK's sendPasswordResetEmail).
  return { status: 'sent' };
});
