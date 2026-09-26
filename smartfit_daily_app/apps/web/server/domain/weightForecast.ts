// Minimum accumulated daily_log day count before forecasting — resolved
// 2026-09-26 as one full week (INT-1 spec § ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว),
// so the average spans PLN-1's Mon–Sun week including Rest/Cheat Days.
export const MIN_LOG_DAYS_FOR_FORECAST = 7;

// ONB-3/REQ-02's resolved constant.
export const KCAL_PER_KG = 7700;

export type WeightForecastError = 'not_enough_history' | 'no_meaningful_deficit' | 'already_at_or_below_target';

export interface WeightForecastResult {
  forecastedGoalDate: string; // ISO-8601 date (YYYY-MM-DD)
  averageDailyDeficitKcal: number;
}

/**
 * INT-1 / REQ-11 — pure extraction of GET /insights/forecast's calculation.
 * `today` is passed in (rather than `new Date()` read inside) so this stays
 * testable/deterministic.
 *
 * The "average daily deficit" is the average of accumulatedKcal actually
 * burned per logged day (NOT `dailyCalorieTargetKcal - accumulatedKcal` as
 * detailed-design/04-smart-integrations.md's step 4 literally states — see
 * the route's own comment for why the physically-consistent version was
 * implemented instead; confirmed with the user 2026-08-31).
 */
export function computeWeightForecast(
  accumulatedKcalValues: number[],
  currentWeightKg: number | undefined,
  targetWeightKg: number,
  today: Date,
): { result: WeightForecastResult } | { error: WeightForecastError } {
  if (accumulatedKcalValues.length < MIN_LOG_DAYS_FOR_FORECAST) {
    return { error: 'not_enough_history' };
  }

  const averageDailyDeficitKcal =
    accumulatedKcalValues.reduce((sum, kcal) => sum + kcal, 0) / accumulatedKcalValues.length;
  if (averageDailyDeficitKcal <= 0) {
    return { error: 'no_meaningful_deficit' };
  }

  if (currentWeightKg === undefined || currentWeightKg <= targetWeightKg) {
    return { error: 'already_at_or_below_target' };
  }

  // Computed as (kg to lose × KCAL_PER_KG) / averageDailyDeficitKcal rather
  // than dividing by an intermediate `weightChangePerDayKg` — the latter
  // (averageDailyDeficitKcal / KCAL_PER_KG, then dividing kg-to-lose by that)
  // is mathematically equivalent but round-trips through an extra floating-
  // point division, e.g. 5 / (500 / 7700) evaluates to 77.00000000000001
  // instead of 77 in IEEE-754, which then got bumped to 78 by Math.ceil —
  // a real bug (TC-INT-1-001 expects 77 days/2026-11-12, not 78/2026-11-13),
  // fixed 2026-09-25 by multiplying before dividing instead.
  const daysToGoal = Math.ceil(((currentWeightKg - targetWeightKg) * KCAL_PER_KG) / averageDailyDeficitKcal);
  const forecastedGoalDate = new Date(today);
  forecastedGoalDate.setDate(forecastedGoalDate.getDate() + daysToGoal);

  return {
    result: {
      forecastedGoalDate: forecastedGoalDate.toISOString().slice(0, 10),
      averageDailyDeficitKcal,
    },
  };
}
