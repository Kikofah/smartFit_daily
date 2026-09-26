import { expect, test } from '@playwright/test';
import { api, createAccount, loginViaUi, onboardViaApi, stubRecommendation, todayIso, uniqueEmail } from './helpers';

// PLN-1 (weekly plan) and PLN-2 (Cheat/Rest Day) against the local emulator stack.

interface PlannerDayEntry {
  planDate: string;
  plannedActivityType?: string;
  isDefaultAuto: boolean;
  isCheatRest: boolean;
}

let idToken: string;

test.beforeEach(async ({ page }, testInfo) => {
  const email = uniqueEmail(testInfo);
  idToken = await createAccount(email);
  await onboardViaApi(idToken, 'นักวางแผน อีทูอี');
  await stubRecommendation(page);
  await loginViaUi(page, email);
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/planner');
});

async function todayEntry(): Promise<PlannerDayEntry> {
  const week = await api<PlannerDayEntry[]>(idToken, 'GET', '/planner/week');
  expect(week.status).toBe(200);
  const entry = week.body.find((d) => d.planDate === todayIso());
  expect(entry, `today (${todayIso()}) is in the planner week`).toBeDefined();
  return entry!;
}

test("plan today's activity type (TC-PLN-1-001)", async ({ page }) => {
  expect(await todayEntry()).toMatchObject({ isDefaultAuto: true }); // TC-PLN-1-003: unplanned → auto

  await page.getByRole('button', { name: /\(วันนี้\)$/ }).click();
  await page.getByText('HIIT', { exact: true }).click();
  await page.getByText('บันทึก', { exact: true }).click();

  await expect.poll(async () => (await todayEntry()).plannedActivityType).toBe('hiit');
  expect(await todayEntry()).toMatchObject({ isDefaultAuto: false });
});

test('set today as Cheat/Rest Day → day counts as completed, streak 1 (TC-PLN-2-001)', async ({ page }) => {
  await page.getByRole('button', { name: /\(วันนี้\)$/ }).click();
  await page.getByRole('switch').click();
  await page.getByText('บันทึก', { exact: true }).click();

  await expect.poll(async () => (await todayEntry()).isCheatRest).toBe(true);
  const log = await api<{ completionStatus: string }>(idToken, 'GET', `/logs/${todayIso()}`);
  expect(log.body.completionStatus).toBe('completed');
  const streak = await api<{ currentStreakDays: number }>(idToken, 'GET', '/streak');
  expect(streak.body.currentStreakDays).toBe(1);
});
