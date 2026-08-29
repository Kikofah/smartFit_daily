import { useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';
import { useAuth } from '../store/AuthContext';
import type { UserProfile } from '@smartfit/shared-types';

/** Wraps the getProfile Cloud Function — 404-equivalent means ONB-1 was never completed. */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    httpsCallable<void, UserProfile>(functions, 'getProfile')()
      .then((result) => setProfile(result.data))
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, [user]);

  return { profile, isLoading };
}
