/**
 * Insights & Forecast (HLA §3.7) — INT-1, INT-2 / REQ-11, 12
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.14-3.15
 */

export type WeightRecordSource = 'manual' | 'smart_scale_sync';

/** Subcollection doc `users/{userId}/weightRecords/{recordId}` — id is the auto-generated Firestore doc ID, never a stored field (§8.2). */
export interface WeightRecord {
  weightKg: number;
  bodyCompositionNote?: string;
  recordedAt: string; // ISO-8601 datetime
  source: WeightRecordSource;
}

/** Embedded map field `weightForecastSnapshot` inside `users/{userId}` — no id/userProfileId (§8.2). */
export interface WeightForecastSnapshot {
  forecastedGoalDate: string; // ISO-8601 date
  averageDailyDeficitKcal: number;
  computedAt: string; // ISO-8601 datetime
}
