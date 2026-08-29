import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../store/AuthContext';
import type { UserProfile } from '@smartfit/shared-types';

/** Wraps GET /api/profile — 404-equivalent means ONB-1 was never completed. */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    api
      .get<UserProfile>('/profile')
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, [user]);

  return { profile, isLoading };
}
