import { describe, expect, it } from 'vitest';
import { buildSessionVideos, COOLDOWN_MINUTES, WARMUP_MINUTES } from './sessionVideos';

const baseVideo = { externalVideoId: 'abc123', activityType: 'hiit' as const };

describe('buildSessionVideos (REC-4 / REQ-07 — automatic warmup/cooldown for high-intensity videos)', () => {
  it('TC-REC-4-001 — high intensity main video (20 min) → warmup(3) + main(20) + cooldown(3), 26 min total', () => {
    const sessionVideos = buildSessionVideos({ ...baseVideo, intensity: 'high', durationMinutes: 20 });

    expect(sessionVideos).toEqual([
      { ...baseVideo, intensity: 'high', role: 'warmup', durationMinutes: WARMUP_MINUTES },
      { ...baseVideo, intensity: 'high', role: 'main', durationMinutes: 20 },
      { ...baseVideo, intensity: 'high', role: 'cooldown', durationMinutes: COOLDOWN_MINUTES },
    ]);
    const totalMinutes = sessionVideos.reduce((sum, v) => sum + v.durationMinutes, 0);
    expect(totalMinutes).toBe(26);
  });

  it('TC-REC-4-002 — medium intensity main video (25 min) → single main segment only, no warmup/cooldown', () => {
    const sessionVideos = buildSessionVideos({
      externalVideoId: 'def456',
      activityType: 'cardio',
      intensity: 'medium',
      durationMinutes: 25,
    });

    expect(sessionVideos).toEqual([
      { externalVideoId: 'def456', activityType: 'cardio', intensity: 'medium', role: 'main', durationMinutes: 25 },
    ]);
  });

  it('low intensity also gets no warmup/cooldown (only "high" triggers insertion)', () => {
    const sessionVideos = buildSessionVideos({ ...baseVideo, intensity: 'low', durationMinutes: 15 });
    expect(sessionVideos).toHaveLength(1);
    expect(sessionVideos[0]?.role).toBe('main');
  });
});
