import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fake } from '../../test/fakeFirebase';
import { buildTestApp, request, TEST_USER_ID } from '../../test/testApp';
import { router } from './index';

vi.mock('../../firebaseAdmin', () => import('../../test/fakeFirebase'));

const NOW = new Date('2026-09-23T12:00:00Z');
const TODAY = '2026-09-23';
const app = buildTestApp([router]);
const base = `users/${TEST_USER_ID}`;

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});
afterAll(() => vi.useRealTimers());
beforeEach(() => {
  fake.reset();
  fake.seed(base, { weightKg: 70, goalSelection: { dailyCalorieTargetKcal: 500 } });
  fake.seed(`${base}/workoutSessions/sess_1`, { status: 'in_progress' });
  fake.seed(`${base}/workoutSessions/sess_2`, { status: 'in_progress' });
});

const complete = (sessionId: string, calculatedKcal: number, actualDurationMinutes = 30) =>
  request(app, 'POST', `/api/workouts/sessions/${sessionId}/complete`, {
    body: { actualDurationMinutes, metValue: 6, calculatedKcal },
  });

describe('POST /api/workouts/sessions/:sessionId/complete (REC-2 / REQ-05, PLN-3 / REQ-10)', () => {
  it('TC-REC-2-005 — unknown sessionId → 404 "sessionId not found.", nothing written (NFR-12)', async () => {
    const res = await complete('sess_a1b2c3', 210, 20);
    expect(res).toEqual({ status: 404, body: { error: 'sessionId not found.' } });
    expect(fake.read(`${base}/workoutSessions/sess_a1b2c3`)).toBeUndefined();
    expect(fake.read(`${base}/dailyLogs/${TODAY}`)).toBeUndefined();
  });

  it('TC-REC-2-001 — no wearable reading → MET estimate is stored and logged', async () => {
    expect((await complete('sess_1', 210)).status).toBe(204);
    expect(fake.read(`${base}/workoutSessions/sess_1`)).toMatchObject({
      status: 'completed',
      logDate: TODAY,
      actualCalorieBurn: { source: 'met_formula', calculatedKcal: 210, metValue: 6 },
    });
    expect(fake.read(`${base}/dailyLogs/${TODAY}`)).toMatchObject({ accumulatedKcal: 210, completionStatus: 'incomplete' });
  });

  it('TC-REC-2-004 — a wearable reading already on the session overrides the MET estimate', async () => {
    fake.seed(`${base}/workoutSessions/sess_1`, { status: 'in_progress', wearableReading: { calorieValueKcal: 255 } });
    await complete('sess_1', 238);
    expect(fake.read(`${base}/dailyLogs/${TODAY}`)?.accumulatedKcal).toBe(255);
  });

  it('TC-PLN-3-003 — 495/500 kcal (99%) → incomplete, streak 0', async () => {
    await complete('sess_1', 495);
    expect(fake.read(`${base}/dailyLogs/${TODAY}`)?.completionStatus).toBe('incomplete');
    expect(fake.read(base)?.streakSnapshot).toMatchObject({ currentStreakDays: 0 });
  });

  it('TC-PLN-3-001 — exactly 500/500 kcal → completed, streak 1', async () => {
    await complete('sess_1', 500);
    expect(fake.read(`${base}/dailyLogs/${TODAY}`)?.completionStatus).toBe('completed');
    expect(fake.read(base)?.streakSnapshot).toMatchObject({ currentStreakDays: 1 });
  });

  it('a second session the same day accumulates minutes and kcal instead of overwriting', async () => {
    await complete('sess_1', 300, 25);
    await complete('sess_2', 250, 20);
    expect(fake.read(`${base}/dailyLogs/${TODAY}`)).toMatchObject({
      minutesExercised: 45,
      accumulatedKcal: 550,
      completionStatus: 'completed',
    });
  });
});
