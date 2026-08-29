import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** DELETE /planner/days/{date}/cheat-rest — PLN-2 / REQ-09. Only usable before end-of-day of `date`. */
export const clearCheatRestDay = onCall<{ date: string }>((request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const { date } = request.data;
  const today = new Date().toISOString().slice(0, 10);
  if (date !== today) {
    throw new HttpsError('failed-precondition', 'Cheat/Rest can only be undone on the same day it was set.');
  }

  return db.doc(`users/${userId}/dayStatus/${date}`).delete();
});
