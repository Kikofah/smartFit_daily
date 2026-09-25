import type { ActivityLevel, Sex } from '@smartfit/shared-types';

/**
 * ONB-1 / REQ-01 — Mifflin-St Jeor BMR × Activity Factor.
 * Pure, behavior-preserving extraction of the formula that used to live
 * inline in server/routes/integration-gateway/index.ts (and is duplicated
 * client-side in client/src/pages/onboarding/PersonalInfoScreen.tsx — see
 * that file's own copy of ACTIVITY_FACTOR/computeTdeeKcal, kept in sync by
 * hand since the client can't import from server/, see this module's
 * mention in the refactor report).
 */
export const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function computeTdeeKcal(sex: Sex, weightKg: number, heightCm: number, age: number, activityLevel: ActivityLevel): number {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
  return Math.round(bmr * ACTIVITY_FACTOR[activityLevel]);
}
