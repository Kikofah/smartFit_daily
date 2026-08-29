import { auth } from './firebase';

/**
 * Fetch wrapper for the Express API (apps/web/server) — replaces the
 * httpsCallable() calls this app used when the backend was Firebase Cloud
 * Functions. Unlike the web client, this app isn't served BY Express, so it
 * needs an absolute base URL, not a same-origin relative one.
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not set — see apps/mobile/.env.example.');
  }
  const idToken = await auth.currentUser?.getIdToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request to ${path} failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/** POST {API_BASE_URL}/api/auth/forgot-password — REQ-16. No auth header needed. */
export async function requestPasswordReset(email: string) {
  if (!API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not set — see apps/mobile/.env.example.');
  }
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? 'Request failed');
  }
}
