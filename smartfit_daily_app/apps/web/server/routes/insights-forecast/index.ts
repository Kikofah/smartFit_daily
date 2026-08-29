import { Router } from 'express';
import { db } from '../../firebaseAdmin';

export const router = Router();

/**
 * GET /api/insights/forecast — INT-1 / REQ-11
 * Requires a target weight (set in ONB-3) and enough accumulated daily_log
 * history — minimum day count is an open point (api-spec.md §4, item 3).
 */
router.get('/insights/forecast', async (req, res) => {
  const profile = (await db.doc(`users/${req.userId}`).get()).data();
  if (!profile?.goalSelection?.targetWeightKg) {
    return res.status(422).json({ error: 'No target weight set (ONB-3).' });
  }

  // TODO: compute forecastedGoalDate/averageDailyDeficitKcal from dailyLogs +
  // weightRecords history, using the 7,700 kcal ≈ 1kg constant (ONB-3/REQ-02).
  return res.json(profile.weightForecastSnapshot ?? null);
});
