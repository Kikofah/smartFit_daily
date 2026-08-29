import { db } from '../../firebaseAdmin';

/**
 * PLN-4 / REQ-09, REQ-10 — recomputes the streakSnapshot cache.
 *
 * Firebase Cloud Functions had a Firestore trigger (onWrite on
 * dailyLogs/{date}) do this automatically; Express has no equivalent
 * event-driven infrastructure, so every route that writes a daily_log
 * (completeWorkoutSession, setCheatRestDay) calls this directly afterward.
 * See docs/02-design/02-technical/detailed-design/03-planner-logging.md's
 * streak walk-back algorithm.
 */
export async function recomputeStreak(userId: string): Promise<void> {
  // TODO: implement the streak walk-back algorithm — walk backward day by
  // day from today while completionStatus === 'completed', counting until
  // the first gap.
  const currentStreakDays = 0;

  await db.doc(`users/${userId}`).set(
    { streakSnapshot: { currentStreakDays, computedAt: new Date().toISOString() } },
    { merge: true },
  );
}
