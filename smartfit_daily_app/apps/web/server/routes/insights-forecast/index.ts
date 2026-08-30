import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';

export const router = Router();

// Minimum accumulated daily_log day count before forecasting — NOT resolved
// in detailed-design/04-smart-integrations.md's "จุดที่ยังไม่ได้ระบุ" §1; picked
// pragmatically until that's formally decided.
const MIN_LOG_DAYS_FOR_FORECAST = 3;

// ONB-3/REQ-02's resolved constant.
const KCAL_PER_KG = 7700;

/**
 * GET /api/insights/forecast — INT-1 / REQ-11
 * Requires a target weight (set in ONB-3) and enough accumulated daily_log
 * history — minimum day count is an open point (api-spec.md §4, item 3).
 *
 * The "average daily deficit" is computed as the average of accumulatedKcal
 * actually burned per logged day (NOT `dailyCalorieTargetKcal - accumulatedKcal`
 * as detailed-design/04-smart-integrations.md's step 4 literally states —
 * that reads as a shortfall, which would invert the relationship: less
 * exercise would forecast FASTER weight change. This app tracks exercise
 * burn only (no food-intake logging), so the realized daily deficit is
 * just the kcal burned that day. Flagged for the docs pipeline to correct;
 * confirmed with the user 2026-08-31 to implement the physically-consistent
 * version rather than the literal wording.
 */
router.get(
  '/insights/forecast',
  asyncHandler(async (req, res) => {
    const profile = (await db.doc(`users/${req.userId}`).get()).data();
    const targetWeightKg = profile?.goalSelection?.targetWeightKg;
    if (targetWeightKg === undefined) {
      return res.status(422).json({ error: 'No target weight set (ONB-3).' });
    }

    const logsSnapshot = await db.collection(`users/${req.userId}/dailyLogs`).get();
    if (logsSnapshot.size < MIN_LOG_DAYS_FOR_FORECAST) {
      return res
        .status(422)
        .json({ error: `Not enough daily log history yet (need at least ${MIN_LOG_DAYS_FOR_FORECAST} days).` });
    }

    const accumulatedKcalValues = logsSnapshot.docs.map((d) => (d.data().accumulatedKcal as number | undefined) ?? 0);
    const averageDailyDeficitKcal =
      accumulatedKcalValues.reduce((sum, kcal) => sum + kcal, 0) / accumulatedKcalValues.length;
    if (averageDailyDeficitKcal <= 0) {
      return res.status(422).json({ error: 'No meaningful average daily deficit yet to forecast from.' });
    }

    const latestWeightRecord = await db
      .collection(`users/${req.userId}/weightRecords`)
      .orderBy('recordedAt', 'desc')
      .limit(1)
      .get();
    const currentWeightKg = (latestWeightRecord.docs[0]?.data().weightKg as number | undefined) ?? profile?.weightKg;
    if (currentWeightKg === undefined || currentWeightKg <= targetWeightKg) {
      return res.status(422).json({ error: 'Already at or below target weight, or current weight unknown.' });
    }

    const weightChangePerDayKg = averageDailyDeficitKcal / KCAL_PER_KG;
    const daysToGoal = Math.ceil((currentWeightKg - targetWeightKg) / weightChangePerDayKg);
    const forecastedGoalDate = new Date();
    forecastedGoalDate.setDate(forecastedGoalDate.getDate() + daysToGoal);

    const weightForecastSnapshot = {
      forecastedGoalDate: forecastedGoalDate.toISOString().slice(0, 10),
      averageDailyDeficitKcal,
      computedAt: new Date().toISOString(),
    };

    await db.doc(`users/${req.userId}`).set({ weightForecastSnapshot }, { merge: true });

    return res.json(weightForecastSnapshot);
  }),
);

/**
 * GET /api/insights/weight-records — INT-1 / REQ-11 (api-spec.md §3.7, added 2026-08-31)
 * Optional date range; returns oldest-first for the Progress screen's trend chart.
 */
router.get(
  '/insights/weight-records',
  asyncHandler(async (req, res) => {
    const { fromDate, toDate } = req.query as { fromDate?: string; toDate?: string };

    let query = db
      .collection(`users/${req.userId}/weightRecords`)
      .orderBy('recordedAt', 'asc') as FirebaseFirestore.Query;
    if (fromDate) query = query.where('recordedAt', '>=', fromDate);
    if (toDate) query = query.where('recordedAt', '<=', toDate);

    const snapshot = await query.get();
    return res.json(snapshot.docs.map((d) => d.data()));
  }),
);
