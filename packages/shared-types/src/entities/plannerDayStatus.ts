/**
 * Planner & Day-Status (HLA §3.5) — PLN-1, PLN-2 / REQ-08, 09
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.10-3.11
 */

export interface WeeklyPlanEntry {
  id: string;
  userProfileId: string; // FK -> UserProfile.id
  planDate: string; // ISO-8601 date, unique with userProfileId
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

export interface DayStatus {
  id: string;
  userProfileId: string; // FK -> UserProfile.id
  statusDate: string; // ISO-8601 date, unique with userProfileId
  isCheatRest: boolean;
  setAt: string; // ISO-8601 datetime
}
