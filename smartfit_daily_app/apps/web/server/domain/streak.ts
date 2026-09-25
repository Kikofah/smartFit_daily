import type { LogCompletionStatus } from '@smartfit/shared-types';

// Defensive cap on the walk-back loop, not a business rule — the loop already
// stops at the first gap in practice; this just bounds worst-case cost/looping
// if data were ever pathologically all-"completed" back to the beginning.
export const MAX_WALK_BACK_DAYS = 3650;

/**
 * PLN-4 / REQ-09, REQ-10 — walks backward day by day from today
 * (`dayOffset` 0, -1, -2, ...) while `getCompletionStatus(dayOffset)` is
 * `'completed'`, counting until the first gap — no grace period or partial
 * credit. A Cheat/Rest Day already writes `completionStatus: 'completed'`
 * directly onto that day's log (see routes/planner-day-status), so checking
 * this one field per day already covers both a real completed workout and a
 * Cheat/Rest override.
 *
 * `getCompletionStatus` is injected (rather than this module reading
 * Firestore/Date.now() itself) so the walk-back algorithm stays a pure,
 * synchronously-testable unit — see recomputeStreak.ts for the Firestore-
 * backed caller.
 */
export async function computeCurrentStreakDays(
  getCompletionStatus: (dayOffset: number) => LogCompletionStatus | undefined | Promise<LogCompletionStatus | undefined>,
  maxDays: number = MAX_WALK_BACK_DAYS,
): Promise<number> {
  let currentStreakDays = 0;
  for (let offset = 0; offset > -maxDays; offset--) {
    const status = await getCompletionStatus(offset);
    if (status !== 'completed') break;
    currentStreakDays++;
  }
  return currentStreakDays;
}
