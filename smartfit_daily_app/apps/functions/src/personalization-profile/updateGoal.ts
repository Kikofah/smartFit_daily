import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';
import type { GoalType } from '@smartfit/shared-types';

interface UpdateGoalRequest {
  goalType: GoalType;
  targetWeightKg?: number;
  dailyCalorieTargetKcal: number; // client computes TDEE +/- offset, then safety floor
}

const SAFETY_FLOOR_MIN_KCAL = 1200; // exact value tied to sex/age band — see log 2026-08-27

/** PUT /profile/goal — ONB-3 / REQ-02 */
export const updateGoal = onCall<UpdateGoalRequest>((request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const { goalType, targetWeightKg, dailyCalorieTargetKcal } = request.data;
  if (goalType === 'lose_weight' && targetWeightKg === undefined) {
    throw new HttpsError('invalid-argument', 'targetWeightKg is required for goalType "lose_weight".');
  }

  const isSafetyFloorApplied = dailyCalorieTargetKcal <= SAFETY_FLOOR_MIN_KCAL;

  return db.doc(`users/${userId}`).set(
    { goalSelection: { ...request.data, isSafetyFloorApplied } },
    { merge: true },
  );
});
