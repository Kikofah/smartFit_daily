import { db } from '../../firebaseAdmin';

// Defensive cap on the walk-back loop, not a business rule — the loop already
// stops at the first gap in practice; this just bounds worst-case cost/looping
// if data were ever pathologically all-"completed" back to the beginning.
const MAX_WALK_BACK_DAYS = 3650;

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
 * streak walk-back algorithm: walk backward day by day from today while
 * completionStatus === 'completed', counting until the first gap — no grace
 * period or partial credit. A Cheat/Rest Day already writes
 * completionStatus: 'completed' directly onto that day's dailyLogs entry
 * (see routes/planner-day-status), so checking this one field per day
 * already covers both a real completed workout and a Cheat/Rest override.
 */
export async function recomputeStreak(userId: string): Promise<void> {
  let currentStreakDays = 0;
  for (let offset = 0; offset > -MAX_WALK_BACK_DAYS; offset--) {
    const log = await db.doc(`users/${userId}/dailyLogs/${isoDate(offset)}`).get();
    if (log.data()?.completionStatus !== 'completed') break;
    currentStreakDays++;
  }

  await db.doc(`users/${userId}`).set(
    { streakSnapshot: { currentStreakDays, computedAt: new Date().toISOString() } },
    { merge: true },
  );
}
