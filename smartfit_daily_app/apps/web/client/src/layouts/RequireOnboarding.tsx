import { Outlet } from 'react-router-dom';
import { useRequireOnboarding } from '../hooks/useRequireOnboarding';

/**
 * Wraps every main-app route (tabs, workout, log history) — see
 * useRequireOnboarding for the actual redirect-to-next-step logic. Renders
 * nothing while the profile is still loading or onboarding isn't finished
 * yet, so main-app content never flashes on screen before the redirect fires.
 */
export function RequireOnboarding() {
  const { isLoading, isComplete } = useRequireOnboarding();
  if (isLoading || !isComplete) return null;
  return <Outlet />;
}
