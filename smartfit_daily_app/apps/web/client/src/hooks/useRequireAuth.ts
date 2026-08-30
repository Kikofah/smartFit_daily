import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

/**
 * Redirects to /welcome if no one is signed in — guards against typing a
 * protected URL directly, since App.tsx's routing otherwise has no auth
 * check at all. Waits for AuthContext's isLoading to settle first so it
 * doesn't redirect away during Firebase Auth's session-restore on a hard
 * refresh (same race condition as api.ts reading auth.currentUser too early).
 */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/welcome', { replace: true });
    }
  }, [isLoading, user, navigate]);

  return { user, isLoading };
}
