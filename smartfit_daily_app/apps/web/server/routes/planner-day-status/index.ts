import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';
import { recomputeStreak } from '../logging-streak/recomputeStreak';
import type { ActivityPlanType, LogCompletionStatus } from '@smartfit/shared-types';

export const router = Router();

function isoDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

interface PlannerDayEntry {
  planDate: string;
  plannedActivityType?: ActivityPlanType;
  isDefaultAuto: boolean;
  isReadOnly: boolean;
  isCheatRest: boolean;
  completionStatus?: LogCompletionStatus;
}

/**
 * GET /api/planner/week — PLN-1 / REQ-08
 * Merges weeklyPlanEntries + dayStatus + dailyLogs for the current Mon-Sun
 * week (detailed-design/03-planner-logging.md's PLN-1 sequence diagram) —
 * the read-only flag per day is NOT persisted, it's derived here as
 * `planDate < today AND a dailyLog exists for the same date`.
 */
router.get(
  '/planner/week',
  asyncHandler(async (req, res) => {
    const today = isoDate(0);
    const mondayOffset = -(((new Date().getDay() + 6) % 7)); // days back to this week's Monday

    const week = await Promise.all(
      Array.from({ length: 7 }, (_, i) => mondayOffset + i).map(async (dayOffset): Promise<PlannerDayEntry> => {
        const date = isoDate(dayOffset);
        const [planSnap, statusSnap, logSnap] = await Promise.all([
          db.doc(`users/${req.userId}/weeklyPlanEntries/${date}`).get(),
          db.doc(`users/${req.userId}/dayStatus/${date}`).get(),
          db.doc(`users/${req.userId}/dailyLogs/${date}`).get(),
        ]);

        return {
          planDate: date,
          plannedActivityType: planSnap.data()?.plannedActivityType,
          isDefaultAuto: planSnap.data()?.isDefaultAuto ?? true,
          isReadOnly: date < today && logSnap.exists,
          isCheatRest: statusSnap.data()?.isCheatRest ?? false,
          completionStatus: logSnap.data()?.completionStatus,
        };
      }),
    );

    return res.json(week);
  }),
);

/** PUT /api/planner/days/:date — PLN-1 / REQ-08. Past days with an existing log are read-only. */
router.put(
  '/planner/days/:date',
  asyncHandler<{ date: string }>(async (req, res) => {
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
  }),
);

/**
 * POST /api/planner/days/:date/cheat-rest — PLN-2 / REQ-09
 * Can only overwrite an existing log when `date` is today; past days in the
 * fixed week are always read-only (no exceptions, per PLN-1's resolved decision).
 */
router.post(
  '/planner/days/:date/cheat-rest',
  asyncHandler<{ date: string }>(async (req, res) => {
    const { date } = req.params;
    const today = new Date().toISOString().slice(0, 10);

    // Unlike PUT /planner/days/:date, this has NO exception for a past day
    // with no log yet — PLN-2's algorithm step 1 rejects any past day outright.
    if (date < today) {
      return res.status(409).json({ error: 'Past days are read-only — Cheat/Rest cannot be set retroactively.' });
    }
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
  }),
);

/** DELETE /api/planner/days/:date/cheat-rest — PLN-2 / REQ-09. Only usable before end-of-day of `date`. */
router.delete(
  '/planner/days/:date/cheat-rest',
  asyncHandler<{ date: string }>(async (req, res) => {
    const { date } = req.params;
    const today = new Date().toISOString().slice(0, 10);
    if (date !== today) {
      return res.status(409).json({ error: 'Cheat/Rest can only be undone on the same day it was set.' });
    }

    await db.doc(`users/${req.userId}/dayStatus/${date}`).delete();
    return res.status(204).send();
  }),
);
