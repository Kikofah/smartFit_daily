import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fake } from '../../test/fakeFirebase';
import { buildTestApp, request, TEST_USER_ID } from '../../test/testApp';
import { router } from './index';

vi.mock('../../firebaseAdmin', () => import('../../test/fakeFirebase'));

const app = buildTestApp([router]);
const userPath = `users/${TEST_USER_ID}`;

beforeEach(() => fake.reset());

describe('PUT /api/profile/equipment (ONB-2 / REQ-03)', () => {
  it('TC-ONB-2-001 — a single item (dumbbell) is saved as the equipment filter', async () => {
    const res = await request(app, 'PUT', '/api/profile/equipment', { body: { equipmentTypes: ['dumbbell'] } });
    expect(res.status).toBe(204);
    expect(fake.read(userPath)?.equipmentTypes).toEqual(['dumbbell']);
  });

  it('TC-ONB-2-002 — multi-select (dumbbell + full_gym) is saved as-is', async () => {
    const res = await request(app, 'PUT', '/api/profile/equipment', { body: { equipmentTypes: ['dumbbell', 'full_gym'] } });
    expect(res.status).toBe(204);
    expect(fake.read(userPath)?.equipmentTypes).toEqual(['dumbbell', 'full_gym']);
  });

  it('TC-ONB-2-003 — "none" alone is accepted', async () => {
    const res = await request(app, 'PUT', '/api/profile/equipment', { body: { equipmentTypes: ['none'] } });
    expect(res.status).toBe(204);
    expect(fake.read(userPath)?.equipmentTypes).toEqual(['none']);
  });

  it('"none" combined with other equipment → 400, nothing written', async () => {
    const res = await request(app, 'PUT', '/api/profile/equipment', { body: { equipmentTypes: ['none', 'dumbbell'] } });
    expect(res.status).toBe(400);
    expect(fake.read(userPath)).toBeUndefined();
  });

  it('TC-ONB-2-004 — changing equipment later replaces the filter and keeps other profile fields', async () => {
    fake.seed(userPath, { displayName: 'ต้น', tdeeKcal: 2633, equipmentTypes: ['none'] });
    const res = await request(app, 'PUT', '/api/profile/equipment', { body: { equipmentTypes: ['full_gym'] } });
    expect(res.status).toBe(204);
    expect(fake.read(userPath)).toMatchObject({ displayName: 'ต้น', tdeeKcal: 2633, equipmentTypes: ['full_gym'] });
  });
});

describe('GET/PUT /api/profile (ONB-1 / REQ-01)', () => {
  it('GET before ONB-1 is completed → 404', async () => {
    expect((await request(app, 'GET', '/api/profile')).status).toBe(404);
  });

  it('PUT personal-info with an empty displayName → 400', async () => {
    const res = await request(app, 'PUT', '/api/profile/personal-info', {
      body: { displayName: '  ', age: 30, sex: 'male', weightKg: 75, heightCm: 175, activityLevel: 'moderate', tdeeKcal: 2633 },
    });
    expect(res.status).toBe(400);
  });

  it('PUT personal-info with a non-positive weight → 400', async () => {
    const res = await request(app, 'PUT', '/api/profile/personal-info', {
      body: { displayName: 'ต้น', age: 30, sex: 'male', weightKg: 0, heightCm: 175, activityLevel: 'moderate', tdeeKcal: 2633 },
    });
    expect(res.status).toBe(400);
  });

  it('TC-ONB-1-001 — valid personal info is saved, then GET returns it', async () => {
    const body = { displayName: 'ต้น', age: 30, sex: 'male', weightKg: 75, heightCm: 175, activityLevel: 'moderate', tdeeKcal: 2633 };
    expect((await request(app, 'PUT', '/api/profile/personal-info', { body })).status).toBe(204);
    const res = await request(app, 'GET', '/api/profile');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(body);
  });
});

describe('PUT /api/profile/goal (ONB-3 / REQ-02 — targets computed server-side)', () => {
  it('before ONB-1 is completed → 409', async () => {
    const res = await request(app, 'PUT', '/api/profile/goal', { body: { goalType: 'tone_up' } });
    expect(res.status).toBe(409);
  });

  it('lose_weight without targetWeightKg → 400', async () => {
    fake.seed(userPath, { weightKg: 75, tdeeKcal: 2633 });
    const res = await request(app, 'PUT', '/api/profile/goal', { body: { goalType: 'lose_weight' } });
    expect(res.status).toBe(400);
  });

  it('TC-ONB-3-001 — lose_weight, 75kg/TDEE 2,633 → burn 337.5, intake 2,133; client-sent numbers are ignored', async () => {
    fake.seed(userPath, { weightKg: 75, tdeeKcal: 2633 });
    const res = await request(app, 'PUT', '/api/profile/goal', {
      body: { goalType: 'lose_weight', targetWeightKg: 70, dailyCalorieTargetKcal: 9999, dailyIntakeTargetKcal: 9999 },
    });
    expect(res.status).toBe(204);
    expect(fake.read(userPath)?.goalSelection).toEqual({
      goalType: 'lose_weight',
      targetWeightKg: 70,
      dailyCalorieTargetKcal: 337.5,
      dailyIntakeTargetKcal: 2133,
      isSafetyFloorApplied: false,
    });
  });
});
