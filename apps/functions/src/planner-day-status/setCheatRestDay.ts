import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/**
 * POST /planner/days/{date}/cheat-rest — PLN-2 / REQ-09
 * Can only overwrite an existing log when `date` is today; past days in the
 * fixed week are always read-only (no exceptions, per PLN-1's resolved decision).
 */
export const setCheatRestDay = onCall<{ date: string }>(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const { date } = request.data;
  const today = new Date().toISOString().slice(0, 10);
  if (date !== today) {
    const log = await db.doc(`users/${userId}/dailyLogs/${date}`).get();
    if (log.exists) {
      throw new HttpsError('failed-precondition', 'Only today\'s log can be overridden by Cheat/Rest.');
    }
  }

  await db.doc(`users/${userId}/dayStatus/${date}`).set({
    isCheatRest: true,
    setAt: new Date().toISOString(),
  });

  // "completed wins" — see detailed-design/03-planner-logging.md
  return db.doc(`users/${userId}/dailyLogs/${date}`).set(
    { completionStatus: 'completed', source: 'cheat_rest_override' },
    { merge: true },
  );
});
