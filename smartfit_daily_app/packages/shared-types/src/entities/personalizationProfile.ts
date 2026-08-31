/**
 * Personalization & Profile (HLA §3.2) — ONB-1/2/3 / REQ-01, 02, 03
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.2-3.4
 *
 * Shape follows §8.2's Stack Mapping (physical, not the conceptual/logical
 * §3 tables): `id`/`user_account_id` are never stored — the Firebase Auth
 * UID doubles as this document's own ID (`users/{userId}`), and every
 * 1:1/bounded child table (`goal_selection`, `equipment_selection`,
 * `streak_snapshot`, `weight_forecast_snapshot`, `integration_connection`)
 * is an embedded field on the same document rather than a separate
 * id/FK-keyed row.
 */
import type { StreakSnapshot } from './loggingStreak';
import type { WeightForecastSnapshot } from './insightsForecast';
import type { IntegrationConnection } from './integrationGateway';

export type Sex = 'female' | 'male';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type GoalType = 'lose_weight' | 'tone_up' | 'build_endurance';
export type EquipmentType = 'none' | 'dumbbell' | 'full_gym';

export interface UserProfile {
  displayName: string;
  age: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  tdeeKcal: number;
  /** Embedded array field — absent until ONB-2 (equipment_selection, §8.2) is completed. */
  equipmentTypes?: EquipmentType[];
  /** Embedded map field — absent until ONB-3 (goal_selection, §8.2) is completed. */
  goalSelection?: GoalSelection;
  /** Embedded map field, cached by Logging & Streak (streak_snapshot, §8.2). */
  streakSnapshot?: StreakSnapshot;
  /** Embedded map field, cached by Insights & Forecast (weight_forecast_snapshot, §8.2). */
  weightForecastSnapshot?: WeightForecastSnapshot;
  /** Embedded map field with 2 fixed keys per INT-2/INT-3 (integration_connection, §8.2). */
  integrationConnections?: {
    smartScale: IntegrationConnection;
    wearable: IntegrationConnection;
  };
}

/**
 * Embedded map field `goalSelection` inside `users/{userId}` — no id/userProfileId (§8.2).
 * Carries two distinct calorie figures (confirmed 2026-08-31, reinstating
 * intake tracking alongside the exercise-burn target added the same day):
 * `dailyCalorieTargetKcal` is a pure exercise-burn target (weightKg × a
 * per-goalType kcal/kg multiplier) — this is the number REC-1/PLN-3/INT-1
 * actually consume today, since the app tracks exercise burn only.
 * `dailyIntakeTargetKcal` is the original TDEE ± per-goalType delta
 * (diet-style net energy-balance target, floored at `isSafetyFloorApplied`
 * per REQ-02) — not consumed by anything yet, kept/displayed for a future
 * food-intake logging feature so the safety-floor protection isn't lost.
 */
export interface GoalSelection {
  goalType: GoalType;
  /** Required when goalType === 'lose_weight'. */
  targetWeightKg?: number;
  dailyCalorieTargetKcal: number;
  dailyIntakeTargetKcal: number;
  isSafetyFloorApplied: boolean;
}
