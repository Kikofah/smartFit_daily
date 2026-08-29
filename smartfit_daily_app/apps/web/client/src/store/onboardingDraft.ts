import type { ActivityLevel, EquipmentType, GoalType, Sex } from '@smartfit/shared-types';

/**
 * In-memory hand-off between the 4 linear onboarding screens (ONB-1/2/3).
 * Each screen also PUTs its own step to the server as it's confirmed (see
 * server/routes/personalization-profile/index.ts) — this draft only avoids
 * re-fetching what the previous step already computed (e.g. tdeeKcal)
 * within the same onboarding session. Not persisted across a page reload;
 * that's fine since a reload mid-onboarding re-enters at step 1.
 */
export interface OnboardingDraft {
  displayName?: string;
  age?: number;
  sex?: Sex;
  weightKg?: number;
  heightCm?: number;
  activityLevel?: ActivityLevel;
  tdeeKcal?: number;
  equipmentTypes?: EquipmentType[];
  goalType?: GoalType;
}

export const onboardingDraft: OnboardingDraft = {};
