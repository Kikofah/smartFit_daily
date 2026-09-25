import { describe, expect, it } from 'vitest';
import { computeDailyCalorieTargetKcal, deriveIsSafetyFloorApplied, SAFETY_FLOOR_MIN_KCAL } from './goalTargets';

describe('computeDailyCalorieTargetKcal (ONB-3 / REQ-02 — burn target, weightKg × per-goal kcal/kg)', () => {
  // TC-ONB-3-001 expects 337.5 kcal/day (75 × 4.5, unrounded), but the actual
  // code (both GoalConfirmScreen.tsx client-side and this server-side
  // extraction, which mirrors it exactly) has always wrapped the result in
  // Math.round(...), producing 338. Preserved as-is per the refactor's
  // behavior-preserving rule — not "fixed" toward either the doc or a
  // never-rounded formula. See the extraction report.
  it.fails('TC-ONB-3-001 — lose_weight, 75kg → doc expects 337.5 kcal/day, code computes Math.round(337.5) = 338', () => {
    expect(computeDailyCalorieTargetKcal(75, 'lose_weight')).toBe(337.5);
  });

  it('TC-ONB-3-002 — tone_up, 75kg → 225.0 kcal/day', () => {
    expect(computeDailyCalorieTargetKcal(75, 'tone_up')).toBe(225);
  });

  // Same Math.round discrepancy as TC-ONB-3-001 above: doc expects 412.5
  // (75 × 5.5, unrounded), code computes Math.round(412.5) = 413.
  it.fails('TC-ONB-3-003 — build_endurance, 75kg → doc expects 412.5 kcal/day, code computes Math.round(412.5) = 413', () => {
    expect(computeDailyCalorieTargetKcal(75, 'build_endurance')).toBe(412.5);
  });

  it('TC-ONB-3-005 — build_endurance, 32kg → 176.0 kcal/day', () => {
    expect(computeDailyCalorieTargetKcal(32, 'build_endurance')).toBe(176);
  });

  it('TC-ONB-3-008 — tone_up, 32kg → 96.0 kcal/day, never floored even though far below SAFETY_FLOOR_MIN_KCAL', () => {
    const result = computeDailyCalorieTargetKcal(32, 'tone_up');
    expect(result).toBe(96);
    expect(result).toBeLessThan(SAFETY_FLOOR_MIN_KCAL);
  });
});

describe('deriveIsSafetyFloorApplied (ONB-3 / REQ-02 — server-side re-derivation for dailyIntakeTargetKcal)', () => {
  it('TC-ONB-3-001 — 2,133 kcal (TDEE 2,633 − 500) is above the floor → false', () => {
    expect(deriveIsSafetyFloorApplied(2133)).toBe(false);
  });

  it('TC-ONB-3-002 — 2,633 kcal (TDEE + 0) is above the floor → false', () => {
    expect(deriveIsSafetyFloorApplied(2633)).toBe(false);
  });

  it('TC-ONB-3-003 — 2,933 kcal (TDEE + 300) is above the floor → false', () => {
    expect(deriveIsSafetyFloorApplied(2933)).toBe(false);
  });

  it('TC-ONB-3-005/008 — floored dailyIntakeTargetKcal of 1,200 kcal → true', () => {
    expect(deriveIsSafetyFloorApplied(SAFETY_FLOOR_MIN_KCAL)).toBe(true);
  });

  // Edge case evident in code, not from a test case: exactly at the floor.
  // GoalConfirmScreen.tsx (client) only floors/flags `isSafetyFloorApplied`
  // when the raw value is STRICTLY LESS THAN SAFETY_FLOOR_MIN_KCAL, so a raw
  // value of exactly 1,200 is sent to the server as `isSafetyFloorApplied:
  // false` — but this server-side re-derivation uses `<=`, so it disagrees
  // at this exact boundary. Preserved as-is per the refactor's
  // behavior-preserving rule (see goalTargets.ts's own comment and the
  // extraction report) — not "fixed" one way or the other.
  it('boundary: dailyIntakeTargetKcal exactly at SAFETY_FLOOR_MIN_KCAL → true server-side (client would say false for the same raw value)', () => {
    expect(deriveIsSafetyFloorApplied(SAFETY_FLOOR_MIN_KCAL)).toBe(true);
  });

  it('boundary: dailyIntakeTargetKcal 1 kcal above the floor → false', () => {
    expect(deriveIsSafetyFloorApplied(SAFETY_FLOOR_MIN_KCAL + 1)).toBe(false);
  });
});
