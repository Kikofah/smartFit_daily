import { describe, expect, it } from 'vitest';
import { computeDailyCalorieTargetKcal, computeDailyIntakeTarget, SAFETY_FLOOR_MIN_KCAL } from './goalTargets';

describe('computeDailyCalorieTargetKcal (ONB-3 / REQ-02 — burn target, weightKg × per-goal kcal/kg, exact/unrounded)', () => {
  it('TC-ONB-3-001 — lose_weight, 75kg → 337.5 kcal/day (exact, not rounded to 338)', () => {
    expect(computeDailyCalorieTargetKcal(75, 'lose_weight')).toBe(337.5);
  });

  it('TC-ONB-3-002 — tone_up, 75kg → 225.0 kcal/day', () => {
    expect(computeDailyCalorieTargetKcal(75, 'tone_up')).toBe(225);
  });

  it('TC-ONB-3-003 — build_endurance, 75kg → 412.5 kcal/day (exact, not rounded to 413)', () => {
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

describe('computeDailyIntakeTarget (ONB-3 / REQ-02 — TDEE ± per-goal delta, floored at SAFETY_FLOOR_MIN_KCAL)', () => {
  it('TC-ONB-3-001 — lose_weight, TDEE 2,633 → 2,133 kcal/day, not floored', () => {
    expect(computeDailyIntakeTarget(2633, 'lose_weight')).toEqual({
      dailyIntakeTargetKcal: 2133,
      isSafetyFloorApplied: false,
    });
  });

  it('TC-ONB-3-002 — tone_up, TDEE 2,633 → 2,633 kcal/day (maintenance), not floored', () => {
    expect(computeDailyIntakeTarget(2633, 'tone_up')).toEqual({
      dailyIntakeTargetKcal: 2633,
      isSafetyFloorApplied: false,
    });
  });

  it('TC-ONB-3-003 — build_endurance, TDEE 2,633 → 2,933 kcal/day, not floored', () => {
    expect(computeDailyIntakeTarget(2633, 'build_endurance')).toEqual({
      dailyIntakeTargetKcal: 2933,
      isSafetyFloorApplied: false,
    });
  });

  it('TC-ONB-3-005 — build_endurance, TDEE 783 → raw 1,083 is below the floor → floored to 1,200, isSafetyFloorApplied = true', () => {
    expect(computeDailyIntakeTarget(783, 'build_endurance')).toEqual({
      dailyIntakeTargetKcal: 1200,
      isSafetyFloorApplied: true,
    });
  });

  it('TC-ONB-3-008 — tone_up, TDEE 783 → raw 783 is below the floor → floored to 1,200, isSafetyFloorApplied = true (contrasts with dailyCalorieTargetKcal, which is never floored)', () => {
    expect(computeDailyIntakeTarget(783, 'tone_up')).toEqual({
      dailyIntakeTargetKcal: 1200,
      isSafetyFloorApplied: true,
    });
  });

  it('boundary: raw intake exactly at SAFETY_FLOOR_MIN_KCAL is NOT floored (REQ-02: floor applies only strictly below 1,200)', () => {
    // tone_up has a +0 delta, so TDEE 1200 → raw exactly 1200.
    expect(computeDailyIntakeTarget(SAFETY_FLOOR_MIN_KCAL, 'tone_up')).toEqual({
      dailyIntakeTargetKcal: SAFETY_FLOOR_MIN_KCAL,
      isSafetyFloorApplied: false,
    });
  });

  it('boundary: raw intake 1 kcal below SAFETY_FLOOR_MIN_KCAL is floored', () => {
    expect(computeDailyIntakeTarget(SAFETY_FLOOR_MIN_KCAL - 1, 'tone_up')).toEqual({
      dailyIntakeTargetKcal: SAFETY_FLOOR_MIN_KCAL,
      isSafetyFloorApplied: true,
    });
  });
});
