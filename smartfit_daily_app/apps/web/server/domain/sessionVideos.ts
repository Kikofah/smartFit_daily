import type { SessionVideo } from '@smartfit/shared-types';

// Mirrors WorkoutSessionScreen.tsx's own warmup/cooldown stage timing exactly.
export const WARMUP_MINUTES = 3;
export const COOLDOWN_MINUTES = 3;

/**
 * REC-4 / REQ-07 — writes 1 sessionVideo row (role: main) normally, or 3
 * (warmup/main/cooldown) when the picked video's intensity is "high" — same
 * externalVideoId throughout, since warmup/cooldown are time segments of the
 * one continuous video, not separate clips.
 */
export function buildSessionVideos(
  mainVideo: Omit<SessionVideo, 'role'>,
  warmupMinutes: number = WARMUP_MINUTES,
  cooldownMinutes: number = COOLDOWN_MINUTES,
): SessionVideo[] {
  const main: SessionVideo = { ...mainVideo, role: 'main' };
  if (mainVideo.intensity !== 'high') return [main];

  return [
    { ...mainVideo, role: 'warmup', durationMinutes: warmupMinutes },
    main,
    { ...mainVideo, role: 'cooldown', durationMinutes: cooldownMinutes },
  ];
}
