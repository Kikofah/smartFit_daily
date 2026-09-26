import { describe, expect, it } from 'vitest';
import { accumulateDailyLog, applyCalorieDeltaToDailyLog, determineLogCompletionStatus } from './dailyLog';

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

describe('applyCalorieDeltaToDailyLog (INT-3 / REQ-13 — session-complete\'s first contribution, and a late/re-synced wearable reading, share this step)', () => {
  it('first-time contribution (session-complete style): delta is the full session kcal, no existing log yet', () => {
    expect(applyCalorieDeltaToDailyLog(undefined, 210, DAILY_TARGET_KCAL)).toEqual({
      accumulatedKcal: 210,
      completionStatus: 'incomplete',
    });
  });

  it('first-time contribution reaching the target exactly → completed', () => {
    expect(applyCalorieDeltaToDailyLog(0, 500, DAILY_TARGET_KCAL)).toEqual({
      accumulatedKcal: 500,
      completionStatus: 'completed',
    });
  });

  it('late wearable reading raises a previously-incomplete day over the target: +40 delta on top of 460 already logged', () => {
    // e.g. MET estimate had contributed 210 kcal; the late wearable reading says 250 → delta +40.
    expect(applyCalorieDeltaToDailyLog(460, 40, DAILY_TARGET_KCAL)).toEqual({
      accumulatedKcal: 500,
      completionStatus: 'completed',
    });
  });

  it('late wearable reading lower than the MET estimate can pull a day back under the target: -60 delta', () => {
    expect(applyCalorieDeltaToDailyLog(520, -60, DAILY_TARGET_KCAL)).toEqual({
      accumulatedKcal: 460,
      completionStatus: 'incomplete',
    });
  });

  it('re-sync for the same session applies a zero delta (new reading equals the already-applied one) — no double count', () => {
    expect(applyCalorieDeltaToDailyLog(500, 0, DAILY_TARGET_KCAL)).toEqual({
      accumulatedKcal: 500,
      completionStatus: 'completed',
    });
  });
});
