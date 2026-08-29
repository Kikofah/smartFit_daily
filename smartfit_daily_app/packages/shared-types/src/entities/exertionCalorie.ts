/**
 * Exertion & Calorie Calculation (HLA §3.4) — REC-2 / REQ-05, INT-3 / REQ-13
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.8-3.9
 */

export type CalorieBurnSource = 'met_formula' | 'wearable';
export type WearablePlatform = 'apple_health' | 'google_health_connect';

/** Embedded map field `actualCalorieBurn` inside a `workoutSessions/{sessionId}` doc — no id/workoutSessionId (§8.2). */
export interface ActualCalorieBurn {
  source: CalorieBurnSource;
  /** Required when source === 'met_formula'. */
  metValue?: number;
  calculatedKcal: number;
}

/** Embedded map field `wearableReading` inside the same `workoutSessions/{sessionId}` doc — no id/workoutSessionId (§8.2); read directly as a sibling field instead of by FK when present. */
export interface WearableReading {
  platform: WearablePlatform;
  calorieValueKcal: number;
  recordedAt: string; // ISO-8601 datetime
}
