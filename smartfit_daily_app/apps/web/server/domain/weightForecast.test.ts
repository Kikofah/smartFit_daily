import { describe, expect, it } from 'vitest';
import { computeWeightForecast, MIN_LOG_DAYS_FOR_FORECAST } from './weightForecast';

// Noon UTC avoids the reference date shifting to a different calendar day
// when `setDate`/`toISOString` cross a local-timezone midnight boundary.
const REFERENCE_DATE = new Date(Date.UTC(2026, 7, 27, 12)); // 27 ส.ค. 2569 (Aug 27, 2026)

describe('computeWeightForecast (INT-1 / REQ-11)', () => {
  // TC-INT-1-001 expects daysToGoal = 5 / (500/7700) = exactly 77 (→
  // 2026-11-12), but `5 / (500 / 7700)` evaluates to 77.00000000000001 in
  // IEEE-754 floating point, so Math.ceil(...) in the actual code (preserved
  // as-is from the pre-refactor route) bumps it to 78 days → 2026-11-13.
  // Not "fixed" either direction per the refactor's behavior-preserving
  // rule — see the extraction report.
  it.fails(
    'TC-INT-1-001 — 80kg → 75kg target, average deficit 500 kcal/day → doc expects 77 days/2026-11-12, code computes 78 days/2026-11-13 (floating-point ceil)',
    () => {
      const accumulatedKcalValues = [500, 500, 500]; // average = 500 kcal/day
      const outcome = computeWeightForecast(accumulatedKcalValues, 80, 75, REFERENCE_DATE);

      expect('result' in outcome).toBe(true);
      if ('result' in outcome) {
        expect(outcome.result.averageDailyDeficitKcal).toBe(500);
        expect(outcome.result.forecastedGoalDate).toBe('2026-11-12');
      }
    },
  );

  it('TC-INT-1-001 (actual computed behavior) — averageDailyDeficitKcal is correct; forecastedGoalDate lands on 2026-11-13 due to the floating-point quirk above', () => {
    const outcome = computeWeightForecast([500, 500, 500], 80, 75, REFERENCE_DATE);
    expect('result' in outcome).toBe(true);
    if ('result' in outcome) {
      expect(outcome.result.averageDailyDeficitKcal).toBe(500);
      expect(outcome.result.forecastedGoalDate).toBe('2026-11-13');
    }
  });

  it(`TC-INT-1-002 — fewer than ${MIN_LOG_DAYS_FOR_FORECAST} logged days → 'not_enough_history'`, () => {
    const outcome = computeWeightForecast([500], 80, 75, REFERENCE_DATE);
    expect(outcome).toEqual({ error: 'not_enough_history' });
  });

  it("TC-INT-1-003 — average daily deficit of exactly 0 → 'no_meaningful_deficit'", () => {
    const outcome = computeWeightForecast([0, 0, 0], 80, 75, REFERENCE_DATE);
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
    const outcome = computeWeightForecast([-150, -150, -150], 80, 75, REFERENCE_DATE);
    expect(outcome).toEqual({ error: 'no_meaningful_deficit' });
  });

  it('edge case: current weight already at or below target → already_at_or_below_target', () => {
    expect(computeWeightForecast([500, 500, 500], 75, 75, REFERENCE_DATE)).toEqual({
      error: 'already_at_or_below_target',
    });
    expect(computeWeightForecast([500, 500, 500], 74, 75, REFERENCE_DATE)).toEqual({
      error: 'already_at_or_below_target',
    });
  });

  it('edge case: current weight unknown (undefined) → already_at_or_below_target', () => {
    expect(computeWeightForecast([500, 500, 500], undefined, 75, REFERENCE_DATE)).toEqual({
      error: 'already_at_or_below_target',
    });
  });

  it(`boundary: exactly ${MIN_LOG_DAYS_FOR_FORECAST} logged days is enough (not "not_enough_history")`, () => {
    const outcome = computeWeightForecast([100, 100, 100], 80, 75, REFERENCE_DATE);
    expect('result' in outcome).toBe(true);
  });
});
