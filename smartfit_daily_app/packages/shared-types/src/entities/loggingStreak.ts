/**
 * Logging & Streak (HLA §3.6) — PLN-3, PLN-4 / REQ-09, 10
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.12-3.13
 */

export type LogCompletionStatus = 'completed' | 'incomplete'; // all-or-nothing, no partial credit
export type LogSource = 'workout_session' | 'cheat_rest_override';

export interface DailyLog {
  /** Subcollection doc ID `users/{userId}/dailyLogs/{logDate}` (§8.2) — not itself a stored field. */
  logDate: string; // ISO-8601 date
  minutesExercised: number;
  accumulatedKcal: number;
  completionStatus: LogCompletionStatus;
  source: LogSource;
}

/** Embedded map field `streakSnapshot` inside `users/{userId}` — no id/userProfileId (§8.2). */
export interface StreakSnapshot {
  currentStreakDays: number;
  /** Must be recomputed whenever this user's daily_log/day_status changes. */
  computedAt: string; // ISO-8601 datetime
}
