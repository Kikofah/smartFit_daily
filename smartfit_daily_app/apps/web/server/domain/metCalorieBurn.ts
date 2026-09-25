import type { ActivityType, Intensity } from '@smartfit/shared-types';

/**
 * REC-2 / REQ-05 — kcal = MET × น้ำหนักตัว(kg) × เวลา(ชม.). Mirrors
 * WorkoutSessionScreen.tsx's own MET_TABLE/formula exactly (illustrative
 * table pending the real REC-2 reference — see that file), and the table
 * previously inlined in server/services/videoRecommender.ts.
 */
export const MET_TABLE: Record<ActivityType, Record<Intensity, number>> = {
  cardio: { low: 4, medium: 6, high: 8 },
  strength: { low: 3, medium: 4.5, high: 6 },
  hiit: { low: 6, medium: 8, high: 10 },
};

export function computeMetCalorieBurnKcal(metValue: number, weightKg: number, durationMinutes: number): number {
  return Math.round(metValue * weightKg * (durationMinutes / 60));
}

export type ActualCalorieBurnSource = 'wearable' | 'met_formula';

export interface ActualCalorieBurnResult {
  source: ActualCalorieBurnSource;
  calculatedKcal: number;
}

/**
 * REC-2 / REQ-05, INT-3 / REQ-13 — session-complete (exertion-calorie route)
 * prefers an already-arrived wearable reading over the client's own MET
 * estimate; if no reading arrived, the MET estimate is used as-is.
 */
export function selectActualCalorieBurn(
  wearableCalorieValueKcal: number | undefined,
  calculatedKcal: number,
): ActualCalorieBurnResult {
  if (wearableCalorieValueKcal !== undefined) {
    return { source: 'wearable', calculatedKcal: wearableCalorieValueKcal };
  }
  return { source: 'met_formula', calculatedKcal };
}
