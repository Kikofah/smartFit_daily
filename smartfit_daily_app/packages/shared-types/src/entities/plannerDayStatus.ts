/**
 * Planner & Day-Status (HLA §3.5) — PLN-1, PLN-2 / REQ-08, 09
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.10-3.11
 */

/** Subcollection doc `users/{userId}/weeklyPlanEntries/{planDate}` — id/userProfileId aren't stored, `planDate` is the doc ID (§8.2). */
export interface WeeklyPlanEntry {
  planDate: string; // ISO-8601 date
  plannedActivityType?: ActivityPlanType;
  isDefaultAuto: boolean;
  /**
   * NOT a persisted column — computed as
   * `planDate < today AND a daily_log exists for the same date` (database-schema.md §3.10 note).
   * Included here only to document the derived shape client/functions should expose.
   */
  isReadOnly?: boolean;
}

export type ActivityPlanType = 'cardio' | 'strength' | 'hiit' | 'rest';

/** Subcollection doc `users/{userId}/dayStatus/{statusDate}` — id/userProfileId aren't stored, `statusDate` is the doc ID (§8.2). */
export interface DayStatus {
  statusDate: string; // ISO-8601 date
  isCheatRest: boolean;
  setAt: string; // ISO-8601 datetime
}
