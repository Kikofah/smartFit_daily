import type { GoalType } from '@smartfit/shared-types';

/**
 * ONB-3 / REQ-02 — exercise-burn target (`dailyCalorieTargetKcal`), weightKg ×
 * a per-goalType kcal/kg multiplier. Mirrors GoalConfirmScreen.tsx's
 * GOAL_META[goalType].kcalPerKg exactly (see that file for the rationale) and
 * the values previously inlined in server/routes/integration-gateway/index.ts
 * as GOAL_KCAL_PER_KG. Never floored by SAFETY_FLOOR_MIN_KCAL — see
 * TC-ONB-3-008 (only `dailyIntakeTargetKcal` below gets a safety floor).
 */
export const GOAL_KCAL_PER_KG: Record<GoalType, number> = {
  lose_weight: 4.5,
  tone_up: 3.0,
  build_endurance: 5.5,
};

export function computeDailyCalorieTargetKcal(weightKg: number, goalType: GoalType): number {
  return Math.round(weightKg * GOAL_KCAL_PER_KG[goalType]);
}

// Exact value tied to sex/age band — see log 2026-08-27.
export const SAFETY_FLOOR_MIN_KCAL = 1200;

/**
 * PUT /api/profile/goal (personalization-profile route) re-derives
 * `isSafetyFloorApplied` server-side from the client-computed
 * `dailyIntakeTargetKcal` as a second-layer check, using `<=`.
 *
 * NOTE — known client/server discrepancy at the exact boundary
 * (`dailyIntakeTargetKcal === SAFETY_FLOOR_MIN_KCAL`): the client
 * (GoalConfirmScreen.tsx) only floors and sets `isSafetyFloorApplied = true`
 * when `rawIntakeKcal < SAFETY_FLOOR_MIN_KCAL` (strictly less than) — a raw
 * value exactly equal to 1200 is sent as `isSafetyFloorApplied: false`. This
 * server-side re-derivation instead uses `<=`, so it would recompute `true`
 * for that same exactly-1200 value. Preserved as-is (not "fixed") per the
 * refactor's behavior-preserving rule — see the extraction report for
 * TC/value details.
 */
export function deriveIsSafetyFloorApplied(dailyIntakeTargetKcal: number): boolean {
  return dailyIntakeTargetKcal <= SAFETY_FLOOR_MIN_KCAL;
}
