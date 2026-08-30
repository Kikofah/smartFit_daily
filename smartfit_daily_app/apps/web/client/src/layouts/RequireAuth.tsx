import { Outlet } from 'react-router-dom';
import { useRequireAuth } from '../hooks/useRequireAuth';

/**
 * Wraps every protected route in App.tsx — see useRequireAuth for the actual
 * redirect-if-signed-out logic. Renders nothing while auth is still
 * resolving or once a redirect has been triggered, so protected content
 * never flashes on screen first.
 */
export function RequireAuth() {
  const { user, isLoading } = useRequireAuth();
  if (isLoading || !user) return null;
  return <Outlet />;
}
