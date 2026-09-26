import { describe, expect, it } from 'vitest';
import { computeWeightForecast, MIN_LOG_DAYS_FOR_FORECAST } from './weightForecast';

// Noon UTC avoids the reference date shifting to a different calendar day
// when `setDate`/`toISOString` cross a local-timezone midnight boundary.
const REFERENCE_DATE = new Date(Date.UTC(2026, 7, 27, 12)); // 27 ส.ค. 2569 (Aug 27, 2026)

/** `days` logged days, each burning `kcal`. */
const logs = (kcal: number, days = MIN_LOG_DAYS_FOR_FORECAST) => Array<number>(days).fill(kcal);

describe('computeWeightForecast (INT-1 / REQ-11)', () => {
  // Fixed 2026-09-25: daysToGoal is now computed as
  // ((current - target) * KCAL_PER_KG) / averageDailyDeficitKcal instead of
  // dividing by an intermediate weightChangePerDayKg, which avoids the
  // floating-point rounding (5 / (500/7700) used to evaluate to
  // 77.00000000000001, bumped to 78 by Math.ceil) that previously made this
  // land on 2026-11-13 instead of the documented 2026-11-12.
  it('TC-INT-1-001 — 80kg → 75kg target, average deficit 500 kcal/day → 77 days out, 12 พ.ย. 2569 (2026-11-12)', () => {
    const accumulatedKcalValues = logs(500); // average = 500 kcal/day
    const outcome = computeWeightForecast(accumulatedKcalValues, 80, 75, REFERENCE_DATE);

    expect('result' in outcome).toBe(true);
    if ('result' in outcome) {
      expect(outcome.result.averageDailyDeficitKcal).toBe(500);
      expect(outcome.result.forecastedGoalDate).toBe('2026-11-12');
    }
  });

  it(`TC-INT-1-002 — fewer than ${MIN_LOG_DAYS_FOR_FORECAST} logged days → 'not_enough_history'`, () => {
    const outcome = computeWeightForecast([500], 80, 75, REFERENCE_DATE);
    expect(outcome).toEqual({ error: 'not_enough_history' });
  });

  it("TC-INT-1-003 — average daily deficit of exactly 0 → 'no_meaningful_deficit'", () => {
    const outcome = computeWeightForecast(logs(0), 80, 75, REFERENCE_DATE);
    expect(outcome).toEqual({ error: 'no_meaningful_deficit' });
  });

  // TC-INT-1-004 describes a food-intake *surplus* (this app currently has no
  // food-intake logging, only exercise-burn kcal which is always >= 0 — see
  // insights-forecast/index.ts's own comment on the deficit interpretation),
  // so it can't literally be reproduced from real accumulatedKcal inputs.
  // The code has a single unified guard (`averageDailyDeficitKcal <= 0`) that
  // covers both "exactly 0" (TC-INT-1-003) and "net negative" — exercised
  // here directly to confirm that guard, which is the same error path
  // TC-INT-1-004 expects.
  it("TC-INT-1-004 — a net-negative average (stand-in for 'opposite direction from goal') → 'no_meaningful_deficit'", () => {
    const outcome = computeWeightForecast(logs(-150), 80, 75, REFERENCE_DATE);
    expect(outcome).toEqual({ error: 'no_meaningful_deficit' });
  });

  it('edge case: current weight already at or below target → already_at_or_below_target', () => {
    expect(computeWeightForecast(logs(500), 75, 75, REFERENCE_DATE)).toEqual({
      error: 'already_at_or_below_target',
    });
    expect(computeWeightForecast(logs(500), 74, 75, REFERENCE_DATE)).toEqual({
      error: 'already_at_or_below_target',
    });
  });

  it('edge case: current weight unknown (undefined) → already_at_or_below_target', () => {
    expect(computeWeightForecast(logs(500), undefined, 75, REFERENCE_DATE)).toEqual({
      error: 'already_at_or_below_target',
    });
  });

  it(`TC-INT-1-009 — boundary: ${MIN_LOG_DAYS_FOR_FORECAST - 1} logged days (one short of a full week) → 'not_enough_history'`, () => {
    expect(computeWeightForecast(logs(500, MIN_LOG_DAYS_FOR_FORECAST - 1), 80, 75, REFERENCE_DATE)).toEqual({
      error: 'not_enough_history',
    });
  });

  it('MIN_LOG_DAYS_FOR_FORECAST is one full week (7), per the 2026-09-26 INT-1 decision', () => {
    expect(MIN_LOG_DAYS_FOR_FORECAST).toBe(7);
  });

  it(`TC-INT-1-010 — boundary: exactly ${MIN_LOG_DAYS_FOR_FORECAST} logged days is enough (not "not_enough_history")`, () => {
    const outcome = computeWeightForecast(logs(100), 80, 75, REFERENCE_DATE);
    expect('result' in outcome).toBe(true);
  });
});
