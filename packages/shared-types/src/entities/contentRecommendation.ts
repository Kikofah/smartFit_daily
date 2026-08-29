/**
 * Content Recommendation (HLA §3.3) — REC-1, REC-3, REC-4 / REQ-04, 06, 07
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.5-3.7
 */

export type WorkoutSessionStatus = 'in_progress' | 'completed' | 'stopped_early';
export type VideoRole = 'main' | 'warmup' | 'cooldown';
export type ActivityType = 'cardio' | 'strength' | 'hiit';
export type Intensity = 'low' | 'medium' | 'high';

export interface WorkoutSession {
  id: string;
  userProfileId: string; // FK -> UserProfile.id
  startedAt: string; // ISO-8601 datetime
  /** Set on complete; whether it includes warmup/cooldown time is an open point (api-spec.md §4). */
  actualDurationMinutes?: number;
  status: WorkoutSessionStatus;
}

export interface SessionVideo {
  id: string;
  workoutSessionId: string; // FK -> WorkoutSession.id (1-3 rows: main + optional warmup/cooldown)
  role: VideoRole;
  externalVideoId: string; // YouTube video id (external boundary, HLA §6.1)
  activityType: ActivityType;
  intensity: Intensity;
  durationMinutes: number;
}

export interface SessionRejectedVideo {
  id: string;
  workoutSessionId: string; // FK -> WorkoutSession.id
  externalVideoId: string;
  rejectedAt: string; // ISO-8601 datetime
}
