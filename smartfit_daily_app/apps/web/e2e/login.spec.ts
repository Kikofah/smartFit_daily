import { expect, test, type Page } from '@playwright/test';

// ONB-0 / REQ-15 login checks against the deployed site — see playwright.config.ts.
// Must stay read-only: no sign-ups, and the successful-login case stubs the
// workout routes so the dashboard doesn't cache a recommendation (a Firestore
// write + YouTube/AI calls) as a side effect of being opened.

// Seeded by scripts/seedSampleUsers.ts — a freshly onboarded account, so
// login lands on the Daily Dashboard. Override with E2E_LOGIN_EMAIL/PASSWORD.
const LOGIN_EMAIL = process.env.E2E_LOGIN_EMAIL ?? 'sample.arunee@smartfit-daily.test';
const LOGIN_PASSWORD = process.env.E2E_LOGIN_PASSWORD ?? 'SampleSeed#2026';
const LOGIN_DISPLAY_NAME = process.env.E2E_LOGIN_DISPLAY_NAME ?? 'อรุณี เริ่มต้นใหม่';

async function fillLogin(page: Page, email: string, password: string) {
  await page.getByPlaceholder('name@email.com').fill(email);
  await page.getByPlaceholder('รหัสผ่านของคุณ').fill(password);
  await page.getByText('เข้าสู่ระบบ', { exact: true }).last().click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test('empty email and password show validation errors and stay on login', async ({ page }) => {
  await page.getByText('เข้าสู่ระบบ', { exact: true }).last().click();

  await expect(page.getByText('กรุณากรอกอีเมล')).toBeVisible();
  await expect(page.getByText('กรุณากรอกรหัสผ่าน')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('wrong credentials show an error and stay on login', async ({ page }) => {
  // A non-existent account, so repeated runs can't trip Firebase's
  // too-many-attempts lockout on the real sample account used below.
  await fillLogin(page, 'e2e.no-such-user@smartfit-daily.test', 'wrong-password');

  await expect(page.getByText('อีเมลหรือรหัสผ่านไม่ถูกต้อง')).toBeVisible();
  await expect(page.getByText(/Firebase|auth\//)).toHaveCount(0);
  await expect(page).toHaveURL(/\/login$/);
});

test('TC-ONB-0-002 — valid credentials log in to the dashboard and the session survives a reload', async ({ page }) => {
  await page.route('**/api/workouts/**', (route) => route.fulfill({ status: 204 }));

  await fillLogin(page, LOGIN_EMAIL, LOGIN_PASSWORD);

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText(`สวัสดี ${LOGIN_DISPLAY_NAME}`)).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText(`สวัสดี ${LOGIN_DISPLAY_NAME}`)).toBeVisible();
});

test('signed-out visitor opening a protected page is redirected to welcome', async ({ page }) => {
  await page.goto('/planner');

  await expect(page).toHaveURL(/\/welcome$/);
  await expect(page.getByText('สมัครสมาชิก', { exact: true })).toBeVisible();
});
