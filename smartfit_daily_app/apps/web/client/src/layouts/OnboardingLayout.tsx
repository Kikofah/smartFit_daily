import { Outlet } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import type { UserProfile } from '@smartfit/shared-types';

export interface OnboardingContext {
  profile: UserProfile | null;
  isLoading: boolean;
}

/**
 * Wraps the 4 onboarding steps (ONB-1/2/3) so GET /api/profile is fetched
 * once per onboarding session via useProfile, instead of once per screen.
 * Each step reads the shared result with useOutletContext<OnboardingContext>()
 * rather than calling useProfile itself.
 */
export function OnboardingLayout() {
  const { profile, isLoading } = useProfile();
  return <Outlet context={{ profile, isLoading } satisfies OnboardingContext} />;
}
