import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';
import type { ActivityPlanType } from '@smartfit/shared-types';

/** PUT /planner/days/{date} — PLN-1 / REQ-08. Past days with an existing log are read-only. */
export const updatePlanDay = onCall<{ date: string; plannedActivityType?: ActivityPlanType }>(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const { date, plannedActivityType } = request.data;
  const isPast = date < new Date().toISOString().slice(0, 10);
  if (isPast) {
    const log = await db.doc(`users/${userId}/dailyLogs/${date}`).get();
    if (log.exists) {
      throw new HttpsError('failed-precondition', 'Past days with a log entry are read-only.');
    }
  }

  return db.doc(`users/${userId}/weeklyPlanEntries/${date}`).set(
    { plannedActivityType, isDefaultAuto: plannedActivityType === undefined },
    { merge: true },
  );
});
