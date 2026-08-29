import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/**
 * GET /insights/forecast — INT-1 / REQ-11
 * Requires a target weight (set in ONB-3) and enough accumulated daily_log
 * history — minimum day count is an open point (api-spec.md §4, item 3).
 */
export const getForecast = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const profile = (await db.doc(`users/${userId}`).get()).data();
  if (!profile?.goalSelection?.targetWeightKg) {
    throw new HttpsError('failed-precondition', 'No target weight set (ONB-3).');
  }

  // TODO: compute forecastedGoalDate/averageDailyDeficitKcal from dailyLogs +
  // weightRecords history, using the 7,700 kcal ≈ 1kg constant (ONB-3/REQ-02).
  return profile.weightForecastSnapshot ?? null;
});
