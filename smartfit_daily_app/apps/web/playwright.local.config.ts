import { defineConfig, devices } from '@playwright/test';
import { LOCAL_E2E } from './e2e-local/env';

/**
 * End-to-end tests for flows that WRITE data (onboarding, planner, logging),
 * run against a fully local stack instead of production — see
 * playwright.config.ts for the read-only production specs.
 *
 * Starts, in order: the Firebase Auth + Firestore emulators (in-memory, wiped
 * on every run), the Express API pointed at them, and the Vite client pointed
 * at the Auth emulator. The "demo-" project ID means the emulators can never
 * reach a real Firebase project. YouTube/Gemini keys are blanked so the server
 * can't call them; specs stub the video recommendation in the browser instead.
 *
 * Needs Java 11+ for the Firestore emulator (brew install openjdk@21 — keg-only,
 * so its bin is prepended to PATH below). Run: npm run test:e2e:local
 */
const { projectId: PROJECT_ID, authEmulatorHost: AUTH_EMULATOR, firestoreEmulatorHost: FIRESTORE_EMULATOR, apiPort: API_PORT, webPort: WEB_PORT } =
  LOCAL_E2E;
const JAVA_BIN = process.env.JAVA_BIN ?? '/opt/homebrew/opt/openjdk@21/bin';

export default defineConfig({
  testDir: './e2e-local',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-local' }]],
  use: {
    baseURL: `http://127.0.0.1:${WEB_PORT}`,
    locale: 'th-TH',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: `npx firebase emulators:start --only auth,firestore --project ${PROJECT_ID}`,
      cwd: '../..', // firebase.json lives at smartfit_daily_app/
      url: `http://${AUTH_EMULATOR}`,
      env: { PATH: `${JAVA_BIN}:${process.env.PATH}` },
      // SIGINT lets the Firebase CLI stop its Java emulator; the default
      // SIGKILL left the Firestore emulator orphaned on its port.
      gracefulShutdown: { signal: 'SIGINT', timeout: 15_000 },
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: 'npx tsx server/index.ts',
      url: `http://127.0.0.1:${API_PORT}/api/profile`, // 401 without a token = up
      env: {
        API_PORT: String(API_PORT),
        FIREBASE_PROJECT_ID: PROJECT_ID,
        FIRESTORE_EMULATOR_HOST: FIRESTORE_EMULATOR,
        FIREBASE_AUTH_EMULATOR_HOST: AUTH_EMULATOR,
        YOUTUBE_API_KEY: '',
        GEMINI_API_KEY: '',
      },
      timeout: 60_000,
      reuseExistingServer: false,
    },
    {
      command: `npx vite --host 127.0.0.1 --port ${WEB_PORT} --strictPort`,
      url: `http://127.0.0.1:${WEB_PORT}`,
      env: {
        API_PROXY_TARGET: `http://127.0.0.1:${API_PORT}`,
        VITE_AUTH_EMULATOR_URL: `http://${AUTH_EMULATOR}`,
        VITE_FIREBASE_PROJECT_ID: PROJECT_ID,
        VITE_FIREBASE_API_KEY: 'demo-api-key',
        VITE_FIREBASE_AUTH_DOMAIN: `${PROJECT_ID}.firebaseapp.com`,
      },
      timeout: 60_000,
      reuseExistingServer: false,
    },
  ],
});
