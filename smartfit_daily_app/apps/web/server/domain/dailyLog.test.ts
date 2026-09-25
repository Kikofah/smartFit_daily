import { describe, expect, it } from 'vitest';
import { accumulateDailyLog, determineLogCompletionStatus } from './dailyLog';

const DAILY_TARGET_KCAL = 500; // all TC-PLN-3-* cases below share this target

describe('determineLogCompletionStatus (PLN-3 / REQ-10 — all-or-nothing, no partial credit)', () => {
  it('TC-PLN-3-001 — exactly 100% of target (500/500) → completed (boundary: passes)', () => {
    expect(determineLogCompletionStatus(500, DAILY_TARGET_KCAL)).toBe('completed');
  });

  it('TC-PLN-3-002 — well above target (650/500, 130%) → completed, no extra-credit tier', () => {
    expect(determineLogCompletionStatus(650, DAILY_TARGET_KCAL)).toBe('completed');
  });

  it('TC-PLN-3-003 — 99% of target (495/500) → incomplete (boundary: most important PLN-3 case, no partial credit)', () => {
    expect(determineLogCompletionStatus(495, DAILY_TARGET_KCAL)).toBe('incomplete');
  });

  it('TC-PLN-3-004 — well below target (350/500, 70%) → incomplete', () => {
    expect(determineLogCompletionStatus(350, DAILY_TARGET_KCAL)).toBe('incomplete');
  });
});

describe('accumulateDailyLog (PLN-3 / REQ-10 — a second session the same day adds on, never overwrites)', () => {
  it('first session of the day: no existing log yet', () => {
    expect(accumulateDailyLog(undefined, undefined, 30, 210)).toEqual({
      minutesExercised: 30,
      accumulatedKcal: 210,
    });
  });

  it('TC-PLN-3-002-style: a second session accumulates on top of an earlier one the same day', () => {
    expect(accumulateDailyLog(30, 210, 35, 440)).toEqual({
      minutesExercised: 65,
      accumulatedKcal: 650,
    });
  });
});
