import type { ActivityType, Intensity } from '@smartfit/shared-types';

/** In-memory hand-off from DailyDashboardScreen -> WorkoutSessionScreen -> WorkoutResultScreen. */
export interface WorkoutVideoDraft {
  /** YouTube video ID (REC-1/REC-4) — absent for a placeholder/mock video. */
  externalVideoId?: string;
  title: string;
  durationMinutes: number;
  activityType: ActivityType;
  activityTypeLabel: string;
  intensity: Intensity;
  estimatedKcal: number;
  includesWarmupCooldown: boolean;
}

export interface WorkoutDraft {
  sessionId?: string;
  video?: WorkoutVideoDraft;
  weightKg?: number;
  goalKcal?: number;
  accumulatedKcalBeforeSession?: number;
}

export const workoutDraft: WorkoutDraft = {};
