import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { assertDocExists, NotFoundError } from '../../assertDocExists';
import { recomputeStreak } from '../logging-streak/recomputeStreak';

export const router = Router();

/**
 * POST /api/workouts/sessions/:sessionId/complete — REC-2 / REQ-05
 * MET is computed client-side (NFR-01/03); this route validates and
 * persists it, preferring a wearable reading if one already arrived
 * (INT-3). Must give UI feedback within 250ms (NFR-02) — the client shows
 * an optimistic state and does not block on this call's round trip.
 */
router.post('/workouts/sessions/:sessionId/complete', async (req, res) => {
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

  // TODO: also create the corresponding daily_log entry (Logging & Streak,
  // all-or-nothing per PLN-3) before recomputing the streak.
  await recomputeStreak(req.userId!);

  return res.status(204).send();
});
