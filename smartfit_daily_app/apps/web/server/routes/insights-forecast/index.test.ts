import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fake } from '../../test/fakeFirebase';
import { buildTestApp, request, TEST_USER_ID } from '../../test/testApp';
import { router } from './index';

vi.mock('../../firebaseAdmin', () => import('../../test/fakeFirebase'));

const app = buildTestApp([router]);
const base = `users/${TEST_USER_ID}`;

/** Seeds `days` consecutive daily logs ending 2026-08-26, each burning `kcal`. */
function seedLogs(days: number, kcal: number) {
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.UTC(2026, 7, 26 - i)).toISOString().slice(0, 10);
    fake.seed(`${base}/dailyLogs/${d}`, { accumulatedKcal: kcal });
  }
}

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-08-27T12:00:00Z'));
});
afterAll(() => vi.useRealTimers());
beforeEach(() => {
  fake.reset();
  fake.seed(base, { weightKg: 80, goalSelection: { targetWeightKg: 75 } });
});

describe('GET /api/insights/forecast (INT-1 / REQ-11 — minimum 7 logged days)', () => {
  it('no target weight set → 422', async () => {
    fake.seed(base, { weightKg: 80 });
    expect((await request(app, 'GET', '/api/insights/forecast')).status).toBe(422);
  });

  it('TC-INT-1-002 — 1 logged day → 422 not enough history', async () => {
    seedLogs(1, 500);
    const res = await request(app, 'GET', '/api/insights/forecast');
    expect(res.status).toBe(422);
    expect((res.body as { error: string }).error).toContain('at least 7 days');
  });

  it('TC-INT-1-009 — boundary: 6 logged days → still 422', async () => {
    seedLogs(6, 500);
    expect((await request(app, 'GET', '/api/insights/forecast')).status).toBe(422);
  });

  it('TC-INT-1-001 / TC-INT-1-010 — exactly 7 days averaging 500 kcal, 80 → 75 kg → 2026-11-12, snapshot cached on the profile', async () => {
    seedLogs(7, 500);
    const res = await request(app, 'GET', '/api/insights/forecast');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ forecastedGoalDate: '2026-11-12', averageDailyDeficitKcal: 500 });
    expect(fake.read(base)?.weightForecastSnapshot).toMatchObject({ forecastedGoalDate: '2026-11-12' });
  });

  it('the latest synced weight record (INT-2) takes precedence over the profile weight', async () => {
    seedLogs(7, 500);
    fake.seed(`${base}/weightRecords/w1`, { weightKg: 79, recordedAt: '2026-08-20T08:00:00Z' });
    fake.seed(`${base}/weightRecords/w2`, { weightKg: 78, recordedAt: '2026-08-26T08:00:00Z' });
    const res = await request(app, 'GET', '/api/insights/forecast');
    // (78 − 75) × 7,700 / 500 = 46.2 → 47 days after 2026-08-27
    expect(res.body).toMatchObject({ forecastedGoalDate: '2026-10-13' });
  });
});
