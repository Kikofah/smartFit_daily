import { api } from './api';
import type { UserProfile } from '@smartfit/shared-types';

/**
 * GET /api/profile — used here only to seed device-pairing.tsx's connected/
 * disconnected state on screen mount. There's no dedicated status endpoint
 * for either integration (see integration-gateway/index.ts — only connect/
 * disconnect/sync/readings routes exist), but the profile doc already
 * carries `integrationConnections.{smartScale,wearable}.connectionStatus`
 * (§8.2), so this is the only source of truth available.
 *
 * Returns `undefined` if the profile doesn't exist yet (404 — ONB-1 not
 * completed on the web app) or the request otherwise fails — the screen
 * treats that the same as "not connected", which is already its default.
 */
export async function getIntegrationConnections(): Promise<UserProfile['integrationConnections'] | undefined> {
  try {
    const profile = await api.get<UserProfile>('/api/profile');
    return profile.integrationConnections;
  } catch {
    return undefined;
  }
}
