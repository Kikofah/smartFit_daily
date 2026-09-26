import { expect, type Page, type TestInfo } from '@playwright/test';
import { LOCAL_E2E } from './env';

const API_BASE = `http://127.0.0.1:${LOCAL_E2E.apiPort}/api`;
const AUTH_EMULATOR_BASE = `http://${LOCAL_E2E.authEmulatorHost}/identitytoolkit.googleapis.com/v1`;

export const PASSWORD = 'E2ePass!2026';

/** One fresh account per test (and per browser project) — the emulator is shared across parallel workers. */
export function uniqueEmail(testInfo: TestInfo): string {
  const slug = testInfo.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 30);
  return `e2e-${testInfo.project.name}-${slug}-${Date.now()}@smartfit.test`;
}

/** Today in the same form the server keys daily logs by (UTC date — see routes/exertion-calorie). */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Creates an email/password account directly in the Auth emulator and returns a fresh ID token. */
export async function createAccount(email: string): Promise<string> {
  const res = await fetch(`${AUTH_EMULATOR_BASE}/accounts:signUp?key=demo-api-key`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true }),
  });
  expect(res.ok, `Auth emulator signUp failed (${res.status})`).toBe(true);
  return ((await res.json()) as { idToken: string }).idToken;
}

/** Signs in against the Auth emulator — for reading state back through the real API after a UI flow. */
export async function signIn(email: string): Promise<string> {
  const res = await fetch(`${AUTH_EMULATOR_BASE}/accounts:signInWithPassword?key=demo-api-key`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true }),
  });
  expect(res.ok, `Auth emulator signIn failed (${res.status})`).toBe(true);
  return ((await res.json()) as { idToken: string }).idToken;
}

/** Calls the real Express API (backed by the emulators) as the given user. */
export async function api<T = unknown>(
  idToken: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<{ status: number; body: T }> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${idToken}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, body: (text ? JSON.parse(text) : undefined) as T };
}

/**
 * Completes ONB-1/2/3 through the API (not the UI) for specs that start after
 * onboarding: female, 25, 60 kg, 165 cm, moderate, no equipment, "tone_up" —
 * so dailyCalorieTargetKcal = 60 × 3.0 = 180 (server-computed).
 */
export async function onboardViaApi(idToken: string, displayName: string): Promise<void> {
  const personal = await api(idToken, 'PUT', '/profile/personal-info', {
    displayName,
    age: 25,
    sex: 'female',
    weightKg: 60,
    heightCm: 165,
    activityLevel: 'moderate',
    tdeeKcal: 2085,
  });
  expect(personal.status).toBeLessThan(300);
  expect((await api(idToken, 'PUT', '/profile/equipment', { equipmentTypes: ['none'] })).status).toBeLessThan(300);
  expect((await api(idToken, 'PUT', '/profile/goal', { goalType: 'tone_up' })).status).toBeLessThan(300);
}

export async function loginViaUi(page: Page, email: string): Promise<void> {
  await page.goto('/login');
  await page.getByPlaceholder('name@email.com').fill(email);
  await page.getByPlaceholder('รหัสผ่านของคุณ').fill(PASSWORD);
  await page.getByText('เข้าสู่ระบบ', { exact: true }).last().click();
}

/** A fixed stand-in for the YouTube+Gemini pick. An empty externalVideoId makes WorkoutSessionScreen run as a plain timer (no YouTube player). */
export const STUB_VIDEO = {
  externalVideoId: '',
  title: 'E2E คาร์ดิโอ 30 นาที',
  durationMinutes: 30,
  activityType: 'cardio',
  intensity: 'medium',
  estimatedKcal: 180,
  includesWarmupCooldown: false,
};

/** Stubs the only route that would reach YouTube/Gemini; everything else hits the real local API. */
export async function stubRecommendation(page: Page): Promise<void> {
  await page.route('**/api/workouts/today/recommendation', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(STUB_VIDEO) }),
  );
}
