import { expect, test } from '@playwright/test';

// Read-only smoke checks against the deployed site — see playwright.config.ts.

test('home page loads the app', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('smartFit_daily');
});

test('signed-out visitor can reach the welcome screen and open login', async ({ page }) => {
  await page.goto('/welcome');
  await expect(page.getByText('สมัครสมาชิก', { exact: true })).toBeVisible();
  await page.getByText('มีบัญชีอยู่แล้ว? เข้าสู่ระบบ').click();
  await expect(page).toHaveURL(/\/login$/);
});

test('API rejects requests without a session (ONB-0 / REQ-15)', async ({ request }) => {
  const res = await request.get('/api/profile');
  expect(res.status()).toBe(401);
});
