import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { recomputeStreak } from '../logging-streak/recomputeStreak';
import type { ActivityPlanType } from '@smartfit/shared-types';

export const router = Router();

/**
 * GET /api/planner/week — PLN-1 / REQ-08
 * The read-only flag per day is NOT persisted — it's computed as
 * `planDate < today AND a dailyLog exists for the same date`
 * (database-schema.md §3.10).
 */
router.get('/planner/week', async (req, res) => {
  // TODO: fetch the current Mon-Sun week's weeklyPlanEntries + dailyLogs and
  // merge in the derived isReadOnly flag per day.
  const snapshot = await db.collection(`users/${req.userId}/weeklyPlanEntries`).get();
  return res.json(snapshot.docs.map((d) => d.data()));
});

/** PUT /api/planner/days/:date — PLN-1 / REQ-08. Past days with an existing log are read-only. */
router.put('/planner/days/:date', async (req, res) => {
  const { date } = req.params;
  const { plannedActivityType } = req.body as { plannedActivityType?: ActivityPlanType };

  const isPast = date < new Date().toISOString().slice(0, 10);
  if (isPast) {
    const log = await db.doc(`users/${req.userId}/dailyLogs/${date}`).get();
    if (log.exists) {
      return res.status(409).json({ error: 'Past days with a log entry are read-only.' });
    }
  }

  await db.doc(`users/${req.userId}/weeklyPlanEntries/${date}`).set(
    { plannedActivityType, isDefaultAuto: plannedActivityType === undefined },
    { merge: true },
  );
  return res.status(204).send();
});

/**
 * POST /api/planner/days/:date/cheat-rest — PLN-2 / REQ-09
 * Can only overwrite an existing log when `date` is today; past days in the
 * fixed week are always read-only (no exceptions, per PLN-1's resolved decision).
 */
router.post('/planner/days/:date/cheat-rest', async (req, res) => {
  const { date } = req.params;
  const today = new Date().toISOString().slice(0, 10);
  if (date !== today) {
    const log = await db.doc(`users/${req.userId}/dailyLogs/${date}`).get();
    if (log.exists) {
      return res.status(409).json({ error: "Only today's log can be overridden by Cheat/Rest." });
    }
  }

  await db.doc(`users/${req.userId}/dayStatus/${date}`).set({
    isCheatRest: true,
    setAt: new Date().toISOString(),
  });

  // "completed wins" — see detailed-design/03-planner-logging.md
  await db.doc(`users/${req.userId}/dailyLogs/${date}`).set(
    { completionStatus: 'completed', source: 'cheat_rest_override' },
    { merge: true },
  );
  await recomputeStreak(req.userId!);

  return res.status(204).send();
});

/** DELETE /api/planner/days/:date/cheat-rest — PLN-2 / REQ-09. Only usable before end-of-day of `date`. */
router.delete('/planner/days/:date/cheat-rest', async (req, res) => {
  const { date } = req.params;
  const today = new Date().toISOString().slice(0, 10);
  if (date !== today) {
    return res.status(409).json({ error: 'Cheat/Rest can only be undone on the same day it was set.' });
  }

  await db.doc(`users/${req.userId}/dayStatus/${date}`).delete();
  return res.status(204).send();
});
