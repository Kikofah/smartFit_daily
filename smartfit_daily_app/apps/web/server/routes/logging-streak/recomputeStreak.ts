import { db } from '../../firebaseAdmin';
import { computeCurrentStreakDays } from '../../domain/streak';

function isoDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

/**
 * PLN-4 / REQ-09, REQ-10 — recomputes the streakSnapshot cache.
 *
 * Firebase Cloud Functions had a Firestore trigger (onWrite on
 * dailyLogs/{date}) do this automatically; Express has no equivalent
 * event-driven infrastructure, so every route that writes a daily_log
 * (completeWorkoutSession, setCheatRestDay) calls this directly afterward.
 * See docs/02-design/02-technical/detailed-design/03-planner-logging.md's
 * streak walk-back algorithm, extracted (pure, Firestore-free) to
 * server/domain/streak.ts's computeCurrentStreakDays — this function just
 * wires that algorithm up to Firestore reads for a real userId.
 */
export async function recomputeStreak(userId: string): Promise<void> {
  const currentStreakDays = await computeCurrentStreakDays(async (offset) => {
    const log = await db.doc(`users/${userId}/dailyLogs/${isoDate(offset)}`).get();
    return log.data()?.completionStatus;
  });

  await db.doc(`users/${userId}`).set(
    { streakSnapshot: { currentStreakDays, computedAt: new Date().toISOString() } },
    { merge: true },
  );
}
