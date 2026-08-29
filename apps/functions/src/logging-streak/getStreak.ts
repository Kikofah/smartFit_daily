import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** GET /streak — PLN-4 / REQ-09, REQ-10. Reads the cached streakSnapshot (not computed on-demand). */
export const getStreak = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const snapshot = await db.doc(`users/${userId}`).get();
  return snapshot.data()?.streakSnapshot ?? { currentStreakDays: 0 };
});
