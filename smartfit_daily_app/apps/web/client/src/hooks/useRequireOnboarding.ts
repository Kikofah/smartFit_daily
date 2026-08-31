import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './useProfile';

/**
 * Redirects to whichever onboarding step (ONB-1/2/3) is next if the signed-in
 * user hasn't finished it yet — guards the main app (tabs, workout, log
 * history) against being reached directly by URL before onboarding is done,
 * the gap App.tsx's own TODO flagged (same one apps/mobile's old
 * app/_layout.tsx had). Mirrors useRequireAuth's shape/pattern.
 */
export function useRequireOnboarding() {
  const { profile, isLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!profile) {
      navigate('/onboarding/personal-info', { replace: true });
    } else if (!profile.equipmentTypes) {
      navigate('/onboarding/equipment', { replace: true });
    } else if (!profile.goalSelection) {
      navigate('/onboarding/goal-select', { replace: true });
    }
  }, [isLoading, profile, navigate]);

  const isComplete = !isLoading && !!profile?.equipmentTypes && !!profile?.goalSelection;
  return { isLoading, isComplete };
}
