import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests against the deployed web app (Firebase Hosting → Cloud Run).
 * Defaults to production; point at another deployment with
 * E2E_BASE_URL=https://... npm run test:e2e.
 *
 * These run against real, shared infrastructure, so specs must stay
 * read-only — no sign-ups or writes that would create real user data.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'https://smartfit-daily.web.app',
    locale: 'th-TH',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    // Mobile-first design (DESIGN.md), so also check a phone-sized viewport.
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
