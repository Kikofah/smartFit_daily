import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** GET /profile — returns 404-equivalent if ONB-1 was never completed. */
export const getProfile = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const snapshot = await db.doc(`users/${userId}`).get();
  const profile = snapshot.data();
  if (!profile || profile.tdeeKcal === undefined) {
    throw new HttpsError('not-found', 'ONB-1 has not been completed yet.');
  }
  return profile;
});
