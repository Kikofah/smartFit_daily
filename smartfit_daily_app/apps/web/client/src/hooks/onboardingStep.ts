import type { UserProfile } from '@smartfit/shared-types';

/** Next unfinished onboarding step (ONB-1/2/3) for a profile, or null once it's complete. */
export function nextOnboardingStep(profile: UserProfile | null): string | null {
  if (!profile) return '/onboarding/personal-info';
  if (!profile.equipmentTypes) return '/onboarding/equipment';
  if (!profile.goalSelection) return '/onboarding/goal-select';
  return null;
}
