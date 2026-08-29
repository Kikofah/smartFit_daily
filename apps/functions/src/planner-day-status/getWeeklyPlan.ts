import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/**
 * GET /planner/week — PLN-1 / REQ-08
 * The read-only flag per day is NOT persisted — it's computed as
 * `planDate < today AND a dailyLog exists for the same date`
 * (database-schema.md §3.10).
 */
export const getWeeklyPlan = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  // TODO: fetch the current Mon-Sun week's weeklyPlanEntries + dailyLogs and
  // merge in the derived isReadOnly flag per day.
  return db.collection(`users/${userId}/weeklyPlanEntries`).get().then((snap) => snap.docs.map((d) => d.data()));
});
