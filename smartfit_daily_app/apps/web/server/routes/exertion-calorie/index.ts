import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { assertDocExists, NotFoundError } from '../../assertDocExists';
import { asyncHandler } from '../../asyncHandler';
import { recomputeStreak } from '../logging-streak/recomputeStreak';
import type { LogCompletionStatus } from '@smartfit/shared-types';

export const router = Router();

/**
 * POST /api/workouts/sessions/:sessionId/complete — REC-2 / REQ-05
 * MET is computed client-side (NFR-01/03); this route validates and
 * persists it, preferring a wearable reading if one already arrived
 * (INT-3). Must give UI feedback within 250ms (NFR-02) — the client shows
 * an optimistic state and does not block on this call's round trip.
 */
router.post(
  '/workouts/sessions/:sessionId/complete',
  asyncHandler<{ sessionId: string }>(async (req, res) => {
    const { sessionId } = req.params;
    const { actualDurationMinutes, metValue, calculatedKcal } = req.body as {
      actualDurationMinutes: number;
      metValue: number;
      calculatedKcal: number;
    };
    const sessionRef = db.doc(`users/${req.userId}/workoutSessions/${sessionId}`);

    try {
      // Referential existence validation (NFR-12) — Firestore has no FK.
      await assertDocExists(sessionRef, 'sessionId not found.');
    } catch (e) {
      if (e instanceof NotFoundError) return res.status(404).json({ error: e.message });
      throw e;
    }

    const wearableReading = (await sessionRef.get()).data()?.wearableReading;
    const sessionKcal = wearableReading ? wearableReading.calorieValueKcal : calculatedKcal;

    await sessionRef.set(
      {
        status: 'completed',
        actualDurationMinutes,
        actualCalorieBurn: wearableReading
          ? { source: 'wearable', calculatedKcal: wearableReading.calorieValueKcal }
          : { source: 'met_formula', metValue, calculatedKcal },
      },
      { merge: true },
    );

    // PLN-3 all-or-nothing: accumulate this session's minutes/kcal onto
    // today's daily_log (a second session the same day adds on top, it
    // doesn't overwrite), then compare against the daily target — no
    // partial credit even 1% under (detailed-design/03-planner-logging.md).
    const today = new Date().toISOString().slice(0, 10);
    const logRef = db.doc(`users/${req.userId}/dailyLogs/${today}`);
    const existingLog = (await logRef.get()).data();
    const minutesExercised = (existingLog?.minutesExercised ?? 0) + actualDurationMinutes;
    const accumulatedKcal = (existingLog?.accumulatedKcal ?? 0) + sessionKcal;

    const profile = (await db.doc(`users/${req.userId}`).get()).data();
    const goalKcal = profile?.goalSelection?.dailyCalorieTargetKcal ?? 0;
    const completionStatus: LogCompletionStatus = accumulatedKcal >= goalKcal ? 'completed' : 'incomplete';

    await logRef.set(
      { minutesExercised, accumulatedKcal, completionStatus, source: 'workout_session' },
      { merge: true },
    );

    await recomputeStreak(req.userId!);

    return res.status(204).send();
  }),
);
