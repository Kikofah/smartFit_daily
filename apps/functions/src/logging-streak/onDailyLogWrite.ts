import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { db } from '../shared/firebaseAdmin';

/**
 * Firestore trigger on users/{userId}/dailyLogs/{date} — PLN-4 / REQ-09, REQ-10
 * Recomputes the streakSnapshot cache every time a daily log or day status
 * changes for this user (strict, no partial credit — see
 * detailed-design/03-planner-logging.md's streak walk-back algorithm).
 */
export const onDailyLogWrite = onDocumentWritten('users/{userId}/dailyLogs/{date}', async (event) => {
  const { userId } = event.params;

  // TODO: implement the streak walk-back algorithm — walk backward day by
  // day from today while completionStatus === 'completed', counting until
  // the first gap.
  const currentStreakDays = 0;

  return db.doc(`users/${userId}`).set(
    { streakSnapshot: { currentStreakDays, computedAt: new Date().toISOString() } },
    { merge: true },
  );
});
