import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** GET /logs/{date} — PLN-3 / REQ-10 */
export const getLogByDate = onCall<{ date: string }>(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const snapshot = await db.doc(`users/${userId}/dailyLogs/${request.data.date}`).get();
  if (!snapshot.exists) {
    throw new HttpsError('not-found', 'No log for this date.');
  }
  return snapshot.data();
});
