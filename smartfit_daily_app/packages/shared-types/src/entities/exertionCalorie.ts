/**
 * Exertion & Calorie Calculation (HLA §3.4) — REC-2 / REQ-05, INT-3 / REQ-13
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.8-3.9
 */

export type CalorieBurnSource = 'met_formula' | 'wearable';
export type WearablePlatform = 'apple_health' | 'google_health_connect';

export interface ActualCalorieBurn {
  id: string;
  workoutSessionId: string; // FK -> WorkoutSession.id, 1:1
  source: CalorieBurnSource;
  /** Required when source === 'met_formula'. */
  metValue?: number;
  calculatedKcal: number;
  /** Required when source === 'wearable'. */
  wearableReadingId?: string; // FK -> WearableReading.id
}

export interface WearableReading {
  id: string;
  workoutSessionId: string; // FK -> WorkoutSession.id
  platform: WearablePlatform;
  calorieValueKcal: number;
  recordedAt: string; // ISO-8601 datetime
}
