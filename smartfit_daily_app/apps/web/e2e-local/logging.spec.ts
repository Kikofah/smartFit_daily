import { expect, test } from '@playwright/test';
import { api, createAccount, loginViaUi, onboardViaApi, stubRecommendation, STUB_VIDEO, todayIso, uniqueEmail } from './helpers';

// REC-2 → PLN-3 → PLN-4: finish a workout session, and the daily log + streak
// are written all-or-nothing against the 180 kcal target (onboardViaApi).
// The stub video is cardio/medium (MET 6), so kcal = 6 × 60 kg × minutes / 60.
// page.clock fast-forwards the session timer instead of waiting in real time.

let idToken: string;

test.beforeEach(async ({ page }, testInfo) => {
  const email = uniqueEmail(testInfo);
  idToken = await createAccount(email);
  await onboardViaApi(idToken, 'นักวิ่ง อีทูอี');
  await stubRecommendation(page);
  await loginViaUi(page, email);
  await expect(page.getByText(STUB_VIDEO.title)).toBeVisible();
});

async function runSession(page: import('@playwright/test').Page, minutes: number) {
  await page.clock.install();
  await page.getByText('เริ่มออกกำลังกาย', { exact: true }).click();
  await expect(page).toHaveURL(/\/workout\/session$/);
  await page.clock.runFor(minutes * 60_000);
  await page.getByText('จบเซสชัน', { exact: true }).click();
  await expect(page).toHaveURL(/\/workout\/result$/);
}

async function todayLog() {
  return (await api<{ accumulatedKcal: number; completionStatus: string }>(idToken, 'GET', `/logs/${todayIso()}`)).body;
}

test('31-minute session reaches the 180 kcal target → completed, streak 1 (TC-PLN-3-001/002)', async ({ page }) => {
  await runSession(page, 31); // 6 × 60 × 31/60 = 186 kcal

  await expect(page.getByText('ครบเป้าหมายวันนี้แล้ว')).toBeVisible();
  await expect(page.getByText('186 kcal')).toBeVisible();

  // The complete call is fire-and-forget from the client (NFR-02), so poll.
  await expect.poll(todayLog).toMatchObject({ accumulatedKcal: 186, completionStatus: 'completed' });
  expect((await api<{ currentStreakDays: number }>(idToken, 'GET', '/streak')).body.currentStreakDays).toBe(1);

  await page.getByText('เสร็จสิ้น', { exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('10-minute session stays under the target → incomplete, streak 0 (TC-PLN-3-004)', async ({ page }) => {
  await runSession(page, 10); // 6 × 60 × 10/60 = 60 kcal

  await expect(page.getByText('วันนี้ยังไม่ครบเป้า')).toBeVisible();
  await expect(page.getByText('60 kcal')).toBeVisible();

  await expect.poll(todayLog).toMatchObject({ accumulatedKcal: 60, completionStatus: 'incomplete' });
  expect((await api<{ currentStreakDays: number }>(idToken, 'GET', '/streak')).body.currentStreakDays).toBe(0);
});
