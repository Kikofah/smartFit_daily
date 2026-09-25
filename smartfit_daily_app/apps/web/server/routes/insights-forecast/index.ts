import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';
import { computeWeightForecast, MIN_LOG_DAYS_FOR_FORECAST } from '../../domain/weightForecast';

export const router = Router();

const FORECAST_ERROR_MESSAGES = {
  not_enough_history: `Not enough daily log history yet (need at least ${MIN_LOG_DAYS_FOR_FORECAST} days).`,
  no_meaningful_deficit: 'No meaningful average daily deficit yet to forecast from.',
  already_at_or_below_target: 'Already at or below target weight, or current weight unknown.',
} as const;

/**
 * GET /api/insights/forecast — INT-1 / REQ-11
 * Requires a target weight (set in ONB-3) and enough accumulated daily_log
 * history — minimum day count is an open point (api-spec.md §4, item 3).
 * Calculation itself lives in server/domain/weightForecast.ts (see that
 * module's own comment on the average-daily-deficit interpretation).
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
    const accumulatedKcalValues = logsSnapshot.docs.map((d) => (d.data().accumulatedKcal as number | undefined) ?? 0);

    const latestWeightRecord = await db
      .collection(`users/${req.userId}/weightRecords`)
      .orderBy('recordedAt', 'desc')
      .limit(1)
      .get();
    const currentWeightKg = (latestWeightRecord.docs[0]?.data().weightKg as number | undefined) ?? profile?.weightKg;

    const forecast = computeWeightForecast(accumulatedKcalValues, currentWeightKg, targetWeightKg, new Date());
    if ('error' in forecast) {
      return res.status(422).json({ error: FORECAST_ERROR_MESSAGES[forecast.error] });
    }

    const weightForecastSnapshot = { ...forecast.result, computedAt: new Date().toISOString() };
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
