import { describe, expect, it } from 'vitest';
import { computeCurrentStreakDays } from './streak';
import type { LogCompletionStatus } from '@smartfit/shared-types';

/** Builds a `getCompletionStatus(offset)` accessor from an array indexed [today, today-1, today-2, ...]. */
function statusAccessor(statusesFromToday: Array<LogCompletionStatus | undefined>) {
  return (offset: number) => statusesFromToday[-offset];
}

describe('computeCurrentStreakDays (PLN-4 / REQ-09, REQ-10 — strict walk-back, no grace period)', () => {
  it('TC-PLN-4-001 — counts through a Cheat/Rest Day (also "completed") until the first incomplete day → streak 3', async () => {
    // Thu 27 Aug = completed, Wed 26 Aug = completed (Cheat/Rest), Tue 25 Aug = completed, Mon 24 Aug = incomplete.
    const statuses: Array<LogCompletionStatus | undefined> = ['completed', 'completed', 'completed', 'incomplete'];
    await expect(computeCurrentStreakDays(statusAccessor(statuses))).resolves.toBe(3);
  });

  it('TC-PLN-4-002 — today has no log at all (undefined) and no Cheat/Rest Day → streak resets to 0 despite a prior 5-day streak', async () => {
    const statuses: Array<LogCompletionStatus | undefined> = [undefined, 'completed', 'completed', 'completed', 'completed', 'completed'];
    await expect(computeCurrentStreakDays(statusAccessor(statuses))).resolves.toBe(0);
  });

  it('TC-PLN-4-003 — today logged "incomplete" (99% of target, per TC-PLN-3-003) breaks the streak immediately, no grace → streak 0', async () => {
    const statuses: Array<LogCompletionStatus | undefined> = ['incomplete', 'completed', 'completed', 'completed'];
    await expect(computeCurrentStreakDays(statusAccessor(statuses))).resolves.toBe(0);
  });

  it('TC-PLN-4-004 — today logged "incomplete" (90% of target) also breaks the streak immediately, same as 99% → streak 0', async () => {
    const statuses: Array<LogCompletionStatus | undefined> = ['incomplete', 'completed', 'completed', 'completed'];
    await expect(computeCurrentStreakDays(statusAccessor(statuses))).resolves.toBe(0);
  });

  it('edge case: streak broken partway through history (not just at today) stops counting at the first gap', async () => {
    const statuses: Array<LogCompletionStatus | undefined> = ['completed', 'completed', 'incomplete', 'completed', 'completed'];
    await expect(computeCurrentStreakDays(statusAccessor(statuses))).resolves.toBe(2);
  });

  it('edge case: every day within maxDays is completed → capped at maxDays rather than looping forever', async () => {
    const allCompleted = () => 'completed' as const;
    await expect(computeCurrentStreakDays(allCompleted, 5)).resolves.toBe(5);
  });
});
