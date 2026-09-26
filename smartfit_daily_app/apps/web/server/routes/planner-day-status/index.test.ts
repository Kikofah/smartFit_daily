import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fake } from '../../test/fakeFirebase';
import { buildTestApp, request, TEST_USER_ID } from '../../test/testApp';
import { router } from './index';

vi.mock('../../firebaseAdmin', () => import('../../test/fakeFirebase'));

// Wednesday, noon UTC — the same calendar date in every timezone from UTC-11
// to UTC+11, so the routes' mix of local getDay() and UTC toISOString() agree.
const NOW = new Date('2026-09-23T12:00:00Z');
const TODAY = '2026-09-23';
const YESTERDAY = '2026-09-22';
const TOMORROW = '2026-09-24';
const WEEK = ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27'];

const app = buildTestApp([router]);
const base = `users/${TEST_USER_ID}`;

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});
afterAll(() => vi.useRealTimers());
beforeEach(() => fake.reset());

describe('GET /api/planner/week (PLN-1 / REQ-08)', () => {
  it('returns the fixed Mon–Sun week containing today', async () => {
    const res = await request(app, 'GET', '/api/planner/week');
    expect(res.status).toBe(200);
    expect((res.body as { planDate: string }[]).map((d) => d.planDate)).toEqual(WEEK);
  });

  it('TC-PLN-1-003 — a day left unplanned defaults to automatic (isDefaultAuto = true)', async () => {
    const week = (await request(app, 'GET', '/api/planner/week')).body as { planDate: string; isDefaultAuto: boolean }[];
    expect(week.every((d) => d.isDefaultAuto)).toBe(true);
  });

  it('TC-PLN-1-004 — a past day with a log is read-only; a past day without one and today are not', async () => {
    fake.seed(`${base}/dailyLogs/2026-09-21`, { completionStatus: 'completed' });
    fake.seed(`${base}/dailyLogs/${TODAY}`, { completionStatus: 'incomplete' });
    const week = (await request(app, 'GET', '/api/planner/week')).body as {
      planDate: string;
      isReadOnly: boolean;
      completionStatus?: string;
    }[];
    const byDate = Object.fromEntries(week.map((d) => [d.planDate, d]));
    expect(byDate['2026-09-21']).toMatchObject({ isReadOnly: true, completionStatus: 'completed' });
    expect(byDate[YESTERDAY]?.isReadOnly).toBe(false);
    expect(byDate[TODAY]).toMatchObject({ isReadOnly: false, completionStatus: 'incomplete' });
  });
});

describe('PUT /api/planner/days/:date (PLN-1 / REQ-08)', () => {
  it('TC-PLN-1-001 — set today\'s activity type (no log yet)', async () => {
    const res = await request(app, 'PUT', `/api/planner/days/${TODAY}`, { body: { plannedActivityType: 'cardio' } });
    expect(res.status).toBe(204);
    expect(fake.read(`${base}/weeklyPlanEntries/${TODAY}`)).toEqual({ plannedActivityType: 'cardio', isDefaultAuto: false });
  });

  it('TC-PLN-1-002 — plan a future day in advance', async () => {
    const res = await request(app, 'PUT', `/api/planner/days/${TOMORROW}`, { body: { plannedActivityType: 'strength' } });
    expect(res.status).toBe(204);
    expect(fake.read(`${base}/weeklyPlanEntries/${TOMORROW}`)?.plannedActivityType).toBe('strength');
  });

  it('TC-PLN-1-004 — editing a past day that has a log → 409, plan unchanged', async () => {
    fake.seed(`${base}/dailyLogs/${YESTERDAY}`, { completionStatus: 'completed' });
    const res = await request(app, 'PUT', `/api/planner/days/${YESTERDAY}`, { body: { plannedActivityType: 'hiit' } });
    expect(res.status).toBe(409);
    expect(fake.read(`${base}/weeklyPlanEntries/${YESTERDAY}`)).toBeUndefined();
  });
});

describe('POST/DELETE /api/planner/days/:date/cheat-rest (PLN-2 / REQ-09)', () => {
  it('TC-PLN-2-001 — set Rest Day on today with no log → day marked completed, streak recomputed', async () => {
    const res = await request(app, 'POST', `/api/planner/days/${TODAY}/cheat-rest`);
    expect(res.status).toBe(204);
    expect(fake.read(`${base}/dayStatus/${TODAY}`)?.isCheatRest).toBe(true);
    expect(fake.read(`${base}/dailyLogs/${TODAY}`)).toMatchObject({ completionStatus: 'completed', source: 'cheat_rest_override' });
    expect(fake.read(base)?.streakSnapshot).toMatchObject({ currentStreakDays: 1 });
  });

  it('TC-PLN-2-004 — Cheat Day over today\'s "incomplete" log → completed wins, existing kcal kept', async () => {
    fake.seed(`${base}/dailyLogs/${TODAY}`, { completionStatus: 'incomplete', accumulatedKcal: 300, minutesExercised: 20 });
    const res = await request(app, 'POST', `/api/planner/days/${TODAY}/cheat-rest`);
    expect(res.status).toBe(204);
    expect(fake.read(`${base}/dailyLogs/${TODAY}`)).toMatchObject({
      completionStatus: 'completed',
      accumulatedKcal: 300,
      minutesExercised: 20,
    });
  });

  it('a future day with no log can be pre-set as Cheat/Rest', async () => {
    expect((await request(app, 'POST', `/api/planner/days/${TOMORROW}/cheat-rest`)).status).toBe(204);
  });

  it('TC-PLN-2-006 — a past day is rejected with 409 (no exceptions), nothing written', async () => {
    fake.seed(`${base}/dailyLogs/${YESTERDAY}`, { completionStatus: 'incomplete' });
    const res = await request(app, 'POST', `/api/planner/days/${YESTERDAY}/cheat-rest`);
    expect(res.status).toBe(409);
    expect(fake.read(`${base}/dayStatus/${YESTERDAY}`)).toBeUndefined();
    expect(fake.read(`${base}/dailyLogs/${YESTERDAY}`)?.completionStatus).toBe('incomplete');
  });

  it('TC-PLN-2-005 — undoing today\'s Cheat/Rest before end of day removes the day status', async () => {
    fake.seed(`${base}/dayStatus/${TODAY}`, { isCheatRest: true });
    const res = await request(app, 'DELETE', `/api/planner/days/${TODAY}/cheat-rest`);
    expect(res.status).toBe(204);
    expect(fake.read(`${base}/dayStatus/${TODAY}`)).toBeUndefined();
  });

  it('undoing Cheat/Rest for any day other than today → 409', async () => {
    fake.seed(`${base}/dayStatus/${TOMORROW}`, { isCheatRest: true });
    expect((await request(app, 'DELETE', `/api/planner/days/${TOMORROW}/cheat-rest`)).status).toBe(409);
    expect(fake.read(`${base}/dayStatus/${TOMORROW}`)).toEqual({ isCheatRest: true });
  });
});
