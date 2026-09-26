import { expect, test } from '@playwright/test';
import { PASSWORD, api, signIn, stubRecommendation, uniqueEmail } from './helpers';

// ONB-0 → ONB-1/2/3 through the real UI against the local emulator stack.

test.beforeEach(async ({ page }) => {
  await stubRecommendation(page); // the dashboard at the end asks for a video
});

test('new user signs up and completes onboarding to the dashboard (ONB-1/2/3)', async ({ page }, testInfo) => {
  const email = uniqueEmail(testInfo);

  await page.goto('/signup');
  await page.getByPlaceholder('name@email.com').fill(email);
  await page.getByPlaceholder('ตั้งรหัสผ่าน').fill(PASSWORD);
  await page.getByText('สมัครสมาชิก', { exact: true }).last().click();

  // ONB-1 — age 25 / 60 kg / 165 cm are the form's defaults.
  await expect(page).toHaveURL(/\/onboarding\/personal-info$/);
  await page.getByPlaceholder('ชื่อ นามสกุล').fill('ทดสอบ อีทูอี');
  await page.getByText('หญิง', { exact: true }).click();
  await page.getByText('ปานกลาง — ออกกำลังกาย 3–5 วัน/สัปดาห์').click();
  await page.getByText('ถัดไป', { exact: true }).click();

  // ONB-2
  await expect(page).toHaveURL(/\/onboarding\/equipment$/);
  await page.getByText('ไม่มีอุปกรณ์', { exact: true }).click();
  await page.getByText('ถัดไป', { exact: true }).click();

  // ONB-3 — tone_up at 60 kg → 60 × 3.0 = 180 kcal/day burn target.
  await expect(page).toHaveURL(/\/onboarding\/goal-select$/);
  await page.getByText('กระชับสัดส่วน', { exact: true }).click();
  await page.getByText('ถัดไป', { exact: true }).click();
  await expect(page).toHaveURL(/\/onboarding\/goal-confirm$/);
  await expect(page.getByText('180', { exact: true })).toBeVisible();
  await page.getByText('เริ่มใช้งาน', { exact: true }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('สวัสดี ทดสอบ อีทูอี')).toBeVisible();

  // What the server actually stored (and computed itself — REQ-02).
  const profile = await api<{
    displayName: string;
    tdeeKcal: number;
    equipmentTypes: string[];
    goalSelection: { goalType: string; dailyCalorieTargetKcal: number };
  }>(await signIn(email), 'GET', '/profile');
  expect(profile.status).toBe(200);
  expect(profile.body).toMatchObject({
    displayName: 'ทดสอบ อีทูอี',
    tdeeKcal: 2085, // Mifflin-St Jeor: female, 25, 60 kg, 165 cm, moderate
    equipmentTypes: ['none'],
    goalSelection: { goalType: 'tone_up', dailyCalorieTargetKcal: 180 },
  });
});

test('personal info with missing fields shows errors and does not advance (AC-ONB-1-02)', async ({ page }, testInfo) => {
  await page.goto('/signup');
  await page.getByPlaceholder('name@email.com').fill(uniqueEmail(testInfo));
  await page.getByPlaceholder('ตั้งรหัสผ่าน').fill(PASSWORD);
  await page.getByText('สมัครสมาชิก', { exact: true }).last().click();
  await expect(page).toHaveURL(/\/onboarding\/personal-info$/);

  await page.getByText('ถัดไป', { exact: true }).click();

  await expect(page.getByText('กรุณาเลือกเพศ เพื่อใช้ในการคำนวณ BMR')).toBeVisible();
  await expect(page.getByText('กรุณาเลือกระดับกิจกรรมของคุณ')).toBeVisible();
  await expect(page).toHaveURL(/\/onboarding\/personal-info$/);
});
