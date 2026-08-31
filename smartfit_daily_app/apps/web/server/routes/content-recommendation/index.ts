import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';
import { searchWorkoutVideos } from '../../services/youtube';
import { pickBestVideo, type PickedVideo } from '../../services/videoRecommender';
import type { ActivityType, EquipmentType, Intensity, SessionVideo } from '@smartfit/shared-types';

export const router = Router();

// Mirrors WorkoutSessionScreen.tsx's own warmup/cooldown stage timing exactly.
const WARMUP_MINUTES = 3;
const COOLDOWN_MINUTES = 3;

/** Maps the user's equipment profile to a YouTube search query — ONB-2/REQ-03. */
function buildSearchQuery(equipmentTypes: EquipmentType[]): string {
  if (equipmentTypes.length === 0 || equipmentTypes.includes('none')) return 'bodyweight home workout no equipment';
  if (equipmentTypes.includes('full_gym')) return 'gym workout';
  return 'dumbbell home workout';
}

/** Cached on users/{userId} — see database-schema.md §8.2's embed-vs-subcollection criteria: 1:1 with the user, only the latest value matters, no independent query pattern. */
interface TodaysRecommendation {
  computedFor: string; // ISO-8601 date
  video: PickedVideo;
  rejectedVideoIds: string[];
}

async function computeRecommendation(userId: string, excludeIds: string[]): Promise<PickedVideo | null> {
  const profile = (await db.doc(`users/${userId}`).get()).data();
  const goalKcal = profile?.goalSelection?.dailyCalorieTargetKcal ?? 0;
  const equipmentTypes: EquipmentType[] = profile?.equipmentTypes ?? [];
  const weightKg = profile?.weightKg ?? 60;

  const today = new Date().toISOString().slice(0, 10);
  const accumulatedKcal = (await db.doc(`users/${userId}/dailyLogs/${today}`).get()).data()?.accumulatedKcal ?? 0;
  const remainingKcal = Math.max(goalKcal - accumulatedKcal, 0);

  const candidates = await searchWorkoutVideos(buildSearchQuery(equipmentTypes), excludeIds);
  return pickBestVideo(candidates, remainingKcal, equipmentTypes, weightKg);
}

/**
 * GET /api/workouts/today/recommendation — REC-1, REC-4 / REQ-04, REQ-07
 * Matches a YouTube video to today's remaining calorie target via the
 * YouTube Data API (candidates) + Claude (ranking/estimation) — see
 * detailed-design/02-daily-youtube-recommendation.md. Returns no-content if
 * today is a Cheat/Rest Day. Cached per user per day so repeat dashboard
 * loads don't re-hit YouTube/Claude every time.
 */
router.get(
  '/workouts/today/recommendation',
  asyncHandler(async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const dayStatus = await db.doc(`users/${req.userId}/dayStatus/${today}`).get();
    if (dayStatus.data()?.isCheatRest) {
      return res.status(204).send(); // no recommendation on a Cheat/Rest Day
    }

    const userRef = db.doc(`users/${req.userId}`);
    const existing = (await userRef.get()).data()?.todaysRecommendation as TodaysRecommendation | undefined;
    if (existing?.computedFor === today) {
      return res.json(existing.video);
    }

    const video = await computeRecommendation(req.userId!, []);
    if (!video) {
      return res.status(409).json({ error: 'No matching video found.' });
    }

    const recommendation: TodaysRecommendation = { computedFor: today, video, rejectedVideoIds: [] };
    await userRef.set({ todaysRecommendation: recommendation }, { merge: true });
    return res.json(video);
  }),
);

/**
 * POST /api/workouts/today/recommendation/swap — REC-3 / REQ-06
 * Re-runs the match against a fresh YouTube search, excluding every video
 * already shown today (the current pick + everything previously rejected).
 * Matching tolerance is an open point (api-spec.md §4, item 1).
 */
router.post(
  '/workouts/today/recommendation/swap',
  asyncHandler(async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const userRef = db.doc(`users/${req.userId}`);
    const existing = (await userRef.get()).data()?.todaysRecommendation as TodaysRecommendation | undefined;

    const rejectedVideoIds = [
      ...(existing?.rejectedVideoIds ?? []),
      ...(existing?.video ? [existing.video.externalVideoId] : []),
    ];

    const video = await computeRecommendation(req.userId!, rejectedVideoIds);
    if (!video) {
      return res.status(409).json({ error: 'No more matching videos found.' });
    }

    const recommendation: TodaysRecommendation = { computedFor: today, video, rejectedVideoIds };
    await userRef.set({ todaysRecommendation: recommendation }, { merge: true });
    return res.json(video);
  }),
);

/**
 * POST /api/workouts/sessions — REC-1, REC-4 / REQ-04, REQ-07
 * Writes 1 sessionVideos row (role: main) normally, or 3 (warmup/main/cooldown,
 * per detailed-design/02-daily-youtube-recommendation.md's REC-4 sequence
 * diagram) when the picked video's intensity is "high" — same externalVideoId
 * throughout, since warmup/cooldown are time segments of the one continuous
 * video (see WorkoutSessionScreen.tsx's stage timer), not separate clips.
 */
router.post(
  '/workouts/sessions',
  asyncHandler(async (req, res) => {
    const { externalVideoId, activityType, intensity, durationMinutes } = req.body as {
      externalVideoId: string;
      activityType: ActivityType;
      intensity: Intensity;
      durationMinutes: number;
    };

    const mainVideo: SessionVideo = { role: 'main', externalVideoId, activityType, intensity, durationMinutes };
    const sessionVideos: SessionVideo[] =
      intensity === 'high'
        ? [
            { role: 'warmup', externalVideoId, activityType, intensity, durationMinutes: WARMUP_MINUTES },
            mainVideo,
            { role: 'cooldown', externalVideoId, activityType, intensity, durationMinutes: COOLDOWN_MINUTES },
          ]
        : [mainVideo];

    const sessionRef = db.collection(`users/${req.userId}/workoutSessions`).doc();
    await sessionRef.set({
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      sessionVideos,
    });

    return res.status(201).json({ sessionId: sessionRef.id });
  }),
);
