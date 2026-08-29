/**
 * Insights & Forecast (HLA §3.7) — INT-1, INT-2 / REQ-11, 12
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.14-3.15
 */

export type WeightRecordSource = 'manual' | 'smart_scale_sync';

export interface WeightRecord {
  id: string;
  userProfileId: string; // FK -> UserProfile.id
  weightKg: number;
  bodyCompositionNote?: string;
  recordedAt: string; // ISO-8601 datetime
  source: WeightRecordSource;
}

export interface WeightForecastSnapshot {
  id: string;
  userProfileId: string; // FK -> UserProfile.id, 1:1
  forecastedGoalDate: string; // ISO-8601 date
  averageDailyDeficitKcal: number;
  computedAt: string; // ISO-8601 datetime
}
