import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fake } from '../../test/fakeFirebase';
import { buildTestApp, request, TEST_USER_ID } from '../../test/testApp';
import { searchWorkoutVideos, type YoutubeCandidate } from '../../services/youtube';
import { pickBestVideo, type PickedVideo } from '../../services/videoRecommender';
import { router } from './index';

vi.mock('../../firebaseAdmin', () => import('../../test/fakeFirebase'));
// External boundaries (YouTube Data API, Gemini) are stubbed — these tests
// cover the route's own logic: query building, caching, exclusions, Cheat/Rest.
vi.mock('../../services/youtube', () => ({ searchWorkoutVideos: vi.fn() }));
vi.mock('../../services/videoRecommender', () => ({ pickBestVideo: vi.fn() }));

const NOW = new Date('2026-09-23T12:00:00Z');
const TODAY = '2026-09-23';
const app = buildTestApp([router]);
const base = `users/${TEST_USER_ID}`;

const candidate = (id: string): YoutubeCandidate => ({ externalVideoId: id, title: id, description: '', durationMinutes: 30 });
const picked = (id: string): PickedVideo => ({
  externalVideoId: id,
  title: id,
  durationMinutes: 30,
  activityType: 'cardio',
  intensity: 'medium',
  estimatedKcal: 210,
  includesWarmupCooldown: false,
});

const search = vi.mocked(searchWorkoutVideos);
const pick = vi.mocked(pickBestVideo);

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});
afterAll(() => vi.useRealTimers());
beforeEach(() => {
  fake.reset();
  search.mockReset();
  pick.mockReset();
  search.mockResolvedValue([candidate('vid_a'), candidate('vid_b')]);
  pick.mockImplementation(async ([first]) => (first ? picked(first.externalVideoId) : null));
  fake.seed(base, { weightKg: 70, equipmentTypes: ['none'], goalSelection: { dailyCalorieTargetKcal: 315 } });
});

describe('GET /api/workouts/today/recommendation (REC-1 / REQ-04)', () => {
  it('TC-REC-1-001 — "none" equipment → bodyweight search; remaining kcal = daily target; result cached for today', async () => {
    const res = await request(app, 'GET', '/api/workouts/today/recommendation');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ externalVideoId: 'vid_a' });
    expect(search).toHaveBeenCalledWith('bodyweight home workout no equipment', []);
    expect(pick).toHaveBeenCalledWith(expect.any(Array), 315, ['none'], 70);
    expect(fake.read(base)?.todaysRecommendation).toMatchObject({ computedFor: TODAY, rejectedVideoIds: [] });
  });

  it('TC-REC-1-002 — dumbbell equipment → dumbbell search query', async () => {
    fake.seed(base, { weightKg: 70, equipmentTypes: ['dumbbell'], goalSelection: { dailyCalorieTargetKcal: 315 } });
    await request(app, 'GET', '/api/workouts/today/recommendation');
    expect(search).toHaveBeenCalledWith('dumbbell home workout', []);
  });

  it('kcal already burned today is subtracted from the target passed to the picker', async () => {
    fake.seed(`${base}/dailyLogs/${TODAY}`, { accumulatedKcal: 200 });
    await request(app, 'GET', '/api/workouts/today/recommendation');
    expect(pick).toHaveBeenCalledWith(expect.any(Array), 115, ['none'], 70);
  });

  it('a second request the same day returns the cached pick without calling YouTube/AI again', async () => {
    await request(app, 'GET', '/api/workouts/today/recommendation');
    const res = await request(app, 'GET', '/api/workouts/today/recommendation');
    expect(res.body).toMatchObject({ externalVideoId: 'vid_a' });
    expect(search).toHaveBeenCalledTimes(1);
  });

  it('TC-REC-1-003 — no usable candidates after one search → 409, no retry with widened criteria', async () => {
    search.mockResolvedValue([]);
    const res = await request(app, 'GET', '/api/workouts/today/recommendation');
    expect(res.status).toBe(409);
    expect(search).toHaveBeenCalledTimes(1);
  });

  it('TC-REC-1-004 — today is a Cheat Day → 204, no recommendation computed', async () => {
    fake.seed(`${base}/dayStatus/${TODAY}`, { isCheatRest: true });
    const res = await request(app, 'GET', '/api/workouts/today/recommendation');
    expect(res.status).toBe(204);
    expect(search).not.toHaveBeenCalled();
  });
});

describe('POST /api/workouts/today/recommendation/swap (REC-3 / REQ-06)', () => {
  it('TC-REC-3-001 — swap excludes the current video and keeps the same calorie target', async () => {
    await request(app, 'GET', '/api/workouts/today/recommendation'); // shows vid_a
    search.mockResolvedValue([candidate('vid_b')]);
    const res = await request(app, 'POST', '/api/workouts/today/recommendation/swap');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ externalVideoId: 'vid_b' });
    expect(search).toHaveBeenLastCalledWith('bodyweight home workout no equipment', ['vid_a']);
    expect(pick).toHaveBeenLastCalledWith(expect.any(Array), 315, ['none'], 70);
    expect(fake.read(base)?.goalSelection).toEqual({ dailyCalorieTargetKcal: 315 });
  });

  it('a second swap excludes every video already shown today', async () => {
    await request(app, 'GET', '/api/workouts/today/recommendation');
    search.mockResolvedValue([candidate('vid_b')]);
    await request(app, 'POST', '/api/workouts/today/recommendation/swap');
    search.mockResolvedValue([candidate('vid_c')]);
    await request(app, 'POST', '/api/workouts/today/recommendation/swap');
    expect(search).toHaveBeenLastCalledWith(expect.any(String), ['vid_a', 'vid_b']);
    expect(fake.read(base)?.todaysRecommendation).toMatchObject({ rejectedVideoIds: ['vid_a', 'vid_b'] });
  });

  it('TC-REC-3-002 — no candidates left → 409, previous recommendation kept', async () => {
    await request(app, 'GET', '/api/workouts/today/recommendation');
    search.mockResolvedValue([]);
    const res = await request(app, 'POST', '/api/workouts/today/recommendation/swap');
    expect(res.status).toBe(409);
    expect(fake.read(base)?.todaysRecommendation).toMatchObject({ video: { externalVideoId: 'vid_a' } });
  });
});

describe('POST /api/workouts/sessions (REC-1, REC-4 / REQ-07)', () => {
  it('TC-REC-4-001 — high intensity → warmup + main + cooldown segments are stored', async () => {
    const res = await request(app, 'POST', '/api/workouts/sessions', {
      body: { externalVideoId: 'vid_h', activityType: 'hiit', intensity: 'high', durationMinutes: 20 },
    });
    expect(res.status).toBe(201);
    const { sessionId } = res.body as { sessionId: string };
    const session = fake.read(`${base}/workoutSessions/${sessionId}`);
    expect(session?.status).toBe('in_progress');
    expect((session?.sessionVideos as { role: string }[]).map((v) => v.role)).toEqual(['warmup', 'main', 'cooldown']);
  });

  it('TC-REC-4-002 — medium intensity → a single main segment', async () => {
    const res = await request(app, 'POST', '/api/workouts/sessions', {
      body: { externalVideoId: 'vid_m', activityType: 'cardio', intensity: 'medium', durationMinutes: 25 },
    });
    const { sessionId } = res.body as { sessionId: string };
    expect((fake.read(`${base}/workoutSessions/${sessionId}`)?.sessionVideos as unknown[]).length).toBe(1);
  });
});
