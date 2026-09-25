import type { LogCompletionStatus } from '@smartfit/shared-types';

/**
 * PLN-3 / REQ-10 — a second (or later) workout session the same day adds
 * onto today's daily_log rather than overwriting it. Pure extraction of the
 * accumulation step from the exertion-calorie route's session-complete
 * handler.
 */
export function accumulateDailyLog(
  existingMinutesExercised: number | undefined,
  existingAccumulatedKcal: number | undefined,
  sessionDurationMinutes: number,
  sessionKcal: number,
): { minutesExercised: number; accumulatedKcal: number } {
  return {
    minutesExercised: (existingMinutesExercised ?? 0) + sessionDurationMinutes,
    accumulatedKcal: (existingAccumulatedKcal ?? 0) + sessionKcal,
  };
}

/**
 * PLN-3 / REQ-10 — all-or-nothing: "completed" only when the accumulated
 * kcal for the day meets or exceeds the daily burn target, no partial
 * credit for anything under 100%, no extra tier above it either.
 */
export function determineLogCompletionStatus(accumulatedKcal: number, dailyCalorieTargetKcal: number): LogCompletionStatus {
  return accumulatedKcal >= dailyCalorieTargetKcal ? 'completed' : 'incomplete';
}
