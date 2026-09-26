import type { GoalType } from '@smartfit/shared-types';

/**
 * ONB-3 / REQ-02 — exercise-burn target (`dailyCalorieTargetKcal`), weightKg ×
 * a per-goalType kcal/kg multiplier. Shared by both apps/web/client (see
 * GoalConfirmScreen.tsx's import of this module) and apps/web/server (this
 * file, imported by integration-gateway/index.ts and
 * personalization-profile/index.ts) — a single source of truth instead of
 * the hand-synced duplicate this module replaced (see 2026-09-25 round-1
 * refactor report).
 */
export const GOAL_KCAL_PER_KG: Record<GoalType, number> = {
  lose_weight: 4.5,
  tone_up: 3.0,
  build_endurance: 5.5,
};

/**
 * Per TC-ONB-3-001/003 (docs are the source of truth, confirmed 2026-09-25):
 * stores/returns the exact value, unrounded (e.g. 75 × 4.5 = 337.5) — the
 * pre-2026-09-25 code wrapped this in Math.round, which contradicted those
 * test cases' documented expected values. Rounding is now a display-only
 * concern, applied at each render site instead (see e.g.
 * GoalConfirmScreen.tsx, CalorieRing.tsx, PlannerScreen.tsx) — comparisons
 * against this value (PLN-3 completion, REC-1 remaining-kcal) must keep
 * using the exact value, not a rounded one.
 */
export function computeDailyCalorieTargetKcal(weightKg: number, goalType: GoalType): number {
  return weightKg * GOAL_KCAL_PER_KG[goalType];
}

// TDEE ± per-goalType delta — REQ-02. Reinstated 2026-08-31 alongside the
// exercise-burn target above; see GoalConfirmScreen.tsx's original comment
// on why this isn't consumed by anything else in the app yet.
export const GOAL_INTAKE_DELTA_KCAL: Record<GoalType, number> = {
  lose_weight: -500,
  tone_up: 0,
  build_endurance: 300,
};

// Exact value tied to sex/age band — see log 2026-08-27.
export const SAFETY_FLOOR_MIN_KCAL = 1200;

export interface DailyIntakeTarget {
  dailyIntakeTargetKcal: number;
  isSafetyFloorApplied: boolean;
}

/**
 * ONB-3 / REQ-02 — `dailyIntakeTargetKcal` = TDEE ± per-goalType delta,
 * floored at SAFETY_FLOOR_MIN_KCAL. REQ-02 says intake must not go BELOW
 * 1,200 ("ห้ามต่ำกว่า 1,200 kcal"), so the floor applies only when the raw
 * value is STRICTLY LESS THAN 1,200 — a raw value of exactly 1,200 is not
 * "below" it, so `isSafetyFloorApplied` is false in that case (confirmed
 * 2026-09-25). Used both by GoalConfirmScreen.tsx (client-side preview
 * during onboarding) and, authoritatively, by
 * personalization-profile/index.ts's PUT /profile/goal (round 3, 2026-09-25)
 * — the previous approach of re-deriving this flag server-side from only the
 * already-floored `dailyIntakeTargetKcal` number (a since-removed
 * `deriveIsSafetyFloorApplied`) could never distinguish a genuinely-floored
 * value from a raw-exactly-1,200 value, since both arrive as exactly 1,200 —
 * so it could never actually persist `true`. Recomputing from the raw
 * `tdeeKcal` server-side removes that ambiguity entirely.
 */
export function computeDailyIntakeTarget(tdeeKcal: number, goalType: GoalType): DailyIntakeTarget {
  const rawIntakeKcal = tdeeKcal + GOAL_INTAKE_DELTA_KCAL[goalType];
  const isSafetyFloorApplied = rawIntakeKcal < SAFETY_FLOOR_MIN_KCAL;
  return {
    dailyIntakeTargetKcal: isSafetyFloorApplied ? SAFETY_FLOOR_MIN_KCAL : rawIntakeKcal,
    isSafetyFloorApplied,
  };
}
