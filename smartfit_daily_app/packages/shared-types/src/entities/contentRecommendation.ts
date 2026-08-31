/**
 * Content Recommendation (HLA §3.3) — REC-1, REC-3, REC-4 / REQ-04, 06, 07
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.5-3.7
 *
 * Shape follows §8.2's Stack Mapping: `session_video`/`session_rejected_video`
 * are embedded arrays on the same `workoutSessions/{sessionId}` doc, and
 * `actual_calorie_burn`/`wearable_reading` (exertionCalorie.ts) are embedded
 * sibling maps on it too — none of them are separate id/FK-keyed rows.
 */
import type { ActualCalorieBurn, WearableReading } from './exertionCalorie';

export type WorkoutSessionStatus = 'in_progress' | 'completed' | 'stopped_early';
export type VideoRole = 'main' | 'warmup' | 'cooldown';
export type ActivityType = 'cardio' | 'strength' | 'hiit';
export type Intensity = 'low' | 'medium' | 'high';

/** Subcollection doc `users/{userId}/workoutSessions/{sessionId}` — id is the Firestore doc ID, never a stored field (§8.2). */
export interface WorkoutSession {
  startedAt: string; // ISO-8601 datetime
  /** Set on complete; whether it includes warmup/cooldown time is an open point (api-spec.md §4). */
  actualDurationMinutes?: number;
  status: WorkoutSessionStatus;
  /** Embedded array (1-3 items: main + optional warmup/cooldown), written by POST /workouts/sessions. */
  sessionVideos?: SessionVideo[];
  /** Embedded array, each item written on a REC-3 swap within the same session. */
  rejectedVideoIds?: SessionRejectedVideo[];
  /** Embedded map, written by the session-complete route. */
  actualCalorieBurn?: ActualCalorieBurn;
  /** Embedded map, written if an INT-3 wearable reading arrives (before or after session-complete). */
  wearableReading?: WearableReading;
}

/** Embedded array item within `WorkoutSession.sessionVideos` — no id/workoutSessionId (§8.2). */
export interface SessionVideo {
  role: VideoRole;
  externalVideoId: string; // YouTube video id (external boundary, HLA §6.1)
  activityType: ActivityType;
  intensity: Intensity;
  durationMinutes: number;
}

/** Embedded array item within `WorkoutSession.rejectedVideoIds` — no id/workoutSessionId (§8.2). */
export interface SessionRejectedVideo {
  externalVideoId: string;
  rejectedAt: string; // ISO-8601 datetime
}
