import { Router } from 'express';
import type { DocumentReference } from 'firebase-admin/firestore';
import { db } from '../../firebaseAdmin';
import { assertDocExists, NotFoundError } from '../../assertDocExists';
import { asyncHandler } from '../../asyncHandler';
import { computeTdeeKcal } from '../../domain/tdee';
import { computeDailyCalorieTargetKcal } from '../../domain/goalTargets';
import { selectActualCalorieBurn } from '../../domain/metCalorieBurn';
import { applyCalorieDeltaToDailyLog } from '../../domain/dailyLog';
import { recomputeStreak } from '../logging-streak/recomputeStreak';
import type { GoalType, WearablePlatform, WeightRecordSource, WorkoutSession } from '@smartfit/shared-types';

export const router = Router();

// computeTdeeKcal mirrors PersonalInfoScreen.tsx's ONB-1 formula exactly
// (Mifflin-St Jeor BMR × Activity Factor) — recomputed here (server-side)
// rather than client-side per NFR-01/03's usual convention, since this
// trigger is a device sync/background event
// (detailed-design/04-smart-integrations.md's INT-2 sequence diagram:
// "IG->>PP: trigger คำนวณ TDEE ใหม่"), not an interactive form submission
// with a client already computing it. See server/domain/tdee.ts.

/** POST /api/integrations/smart-scale/connect — INT-2 / REQ-12. Must follow a consent prompt (NFR-05). */
router.post(
  '/integrations/smart-scale/connect',
  asyncHandler(async (req, res) => {
    await db.doc(`users/${req.userId}`).set(
      { integrationConnections: { smartScale: { connectionStatus: 'connected', connectedAt: new Date().toISOString() } } },
      { merge: true },
    );
    return res.status(204).send();
  }),
);

/** DELETE /api/integrations/smart-scale — INT-2 / REQ-12 */
router.delete(
  '/integrations/smart-scale',
  asyncHandler(async (req, res) => {
    await db.doc(`users/${req.userId}`).set(
      { integrationConnections: { smartScale: { connectionStatus: 'consent_withdrawn' } } },
      { merge: true },
    );
    return res.status(204).send();
  }),
);

/**
 * POST /api/integrations/smart-scale/sync — INT-2 / REQ-12
 * Same endpoint whether the value came from Bluetooth or was typed manually
 * after a failed connection (client-side fallback) — only `source` differs.
 * A second sync on the same calendar day (e.g. re-weighing, or fixing a typo
 * in the manual form) overwrites that day's record rather than adding a
 * duplicate — one weight_record per user per day, latest write wins.
 */
router.post(
  '/integrations/smart-scale/sync',
  asyncHandler(async (req, res) => {
    const body = req.body as { weightKg: number; bodyCompositionNote?: string; source: WeightRecordSource };
    const recordedAt = new Date().toISOString();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const weightRecordsRef = db.collection(`users/${req.userId}/weightRecords`);
    const todaysRecord = await weightRecordsRef
      .where('recordedAt', '>=', startOfDay.toISOString())
      .where('recordedAt', '<', endOfDay.toISOString())
      .limit(1)
      .get();

    const existingDoc = todaysRecord.docs[0];
    if (existingDoc) {
      await existingDoc.ref.set({ ...body, recordedAt }, { merge: true });
    } else {
      await weightRecordsRef.add({ ...body, recordedAt });
    }

    const profile = (await db.doc(`users/${req.userId}`).get()).data();
    const updates: Record<string, unknown> = { weightKg: body.weightKg };

    if (profile?.sex && profile?.heightCm !== undefined && profile?.age !== undefined && profile?.activityLevel) {
      updates.tdeeKcal = computeTdeeKcal(profile.sex, body.weightKg, profile.heightCm, profile.age, profile.activityLevel);
    }
    // The daily exercise-calorie target is weightKg-based (ONB-3/REQ-02) —
    // recompute it here too now that weight changed, so it never goes stale
    // between smart-scale syncs.
    if (profile?.goalSelection?.goalType) {
      const goalType = profile.goalSelection.goalType as GoalType;
      updates.goalSelection = { dailyCalorieTargetKcal: computeDailyCalorieTargetKcal(body.weightKg, goalType) };
    }

    await db.doc(`users/${req.userId}`).set(updates, { merge: true });

    return res.status(204).send();
  }),
);

/** POST /api/integrations/wearable/connect — INT-3 / REQ-13. Must follow a consent prompt (NFR-05). */
router.post(
  '/integrations/wearable/connect',
  asyncHandler(async (req, res) => {
    await db.doc(`users/${req.userId}`).set(
      { integrationConnections: { wearable: { connectionStatus: 'connected', connectedAt: new Date().toISOString() } } },
      { merge: true },
    );
    return res.status(204).send();
  }),
);

/** DELETE /api/integrations/wearable — INT-3 / REQ-13 */
router.delete(
  '/integrations/wearable',
  asyncHandler(async (req, res) => {
    await db.doc(`users/${req.userId}`).set(
      { integrationConnections: { wearable: { connectionStatus: 'consent_withdrawn' } } },
      { merge: true },
    );
    return res.status(204).send();
  }),
);

/**
 * GET /api/integrations/wearable/latest-session — INT-3 / REQ-13
 * Lets the mobile companion app (which has no workout-logging UI of its
 * own — that lives entirely in apps/web's Planner) find which session to
 * attach a wearable reading to: the user's most recent workoutSessions doc
 * from the last 24h, ordered by startedAt desc. 404 if none in that window.
 * `actualDurationMinutes` is only set once the session is completed (see
 * POST /workouts/sessions/:sessionId/complete below) — the caller should
 * treat a missing/zero value (or status still "in_progress") as "finish the
 * workout on the web first," not compute a zero-length window.
 */
router.get(
  '/integrations/wearable/latest-session',
  asyncHandler(async (req, res) => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const snapshot = await db
      .collection(`users/${req.userId}/workoutSessions`)
      .where('startedAt', '>=', since)
      .orderBy('startedAt', 'desc')
      .limit(1)
      .get();

    const doc = snapshot.docs[0];
    if (!doc) {
      return res.status(404).json({ error: 'No workout session in the last 24h.' });
    }

    const data = doc.data() as WorkoutSession;
    return res.json({
      sessionId: doc.id,
      startedAt: data.startedAt,
      actualDurationMinutes: data.actualDurationMinutes,
      status: data.status,
      hasWearableReading: Boolean(data.wearableReading),
    });
  }),
);

/**
 * POST /api/integrations/wearable/readings — INT-3 / REQ-13
 * Always stores `wearableReading`. If the session hasn't been completed yet
 * (no `actualCalorieBurn`), that's all this does — session-complete will
 * read `wearableReading` itself and prefer it over the MET estimate
 * (selectActualCalorieBurn). But a reading that arrives (or is re-synced)
 * *after* session-complete would otherwise sit unused — session-complete
 * only looks at `wearableReading` once, at completion time — so if the
 * session is already completed, this retroactively swaps its
 * `actualCalorieBurn` to the wearable value and corrects that day's already-
 * accumulated `dailyLogs` entry by the delta (not the full kcal — a day can
 * have several sessions, and a repeated sync for the same session must not
 * double-count what it already contributed), all in one transaction so the
 * session/log pair never observes a half-applied state. `recomputeStreak`
 * runs after the transaction commits, same as session-complete does.
 *
 * The log corrected is the one session-complete fed (`session.logDate`, set
 * there), not today's — the mobile app may sync up to 24h later, e.g. after
 * midnight. Sessions completed before `logDate` existed fall back to the
 * date of `startedAt`.
 */
router.post(
  '/integrations/wearable/readings',
  asyncHandler(async (req, res) => {
    const { sessionId, platform, calorieValueKcal } = req.body as {
      sessionId: string;
      platform: WearablePlatform;
      calorieValueKcal: number;
    };
    const sessionRef = db.doc(`users/${req.userId}/workoutSessions/${sessionId}`);

    try {
      // Referential existence validation (NFR-12) — Firestore has no FK.
      await assertDocExists(sessionRef, 'sessionId not found.');
    } catch (e) {
      if (e instanceof NotFoundError) return res.status(404).json({ error: e.message });
      throw e;
    }

    const recordedAt = new Date().toISOString();
    const profileRef = db.doc(`users/${req.userId}`);

    const appliedToLog = await db.runTransaction(async (transaction) => {
      // All reads first — Firestore transactions require every get() before any write.
      const sessionSnap = await transaction.get(sessionRef);
      const session = sessionSnap.data() as WorkoutSession | undefined;
      const isCompleted = Boolean(session?.actualCalorieBurn);

      let previousSessionKcal = 0;
      let goalKcal = 0;
      let existingAccumulatedKcal: number | undefined;
      let logRef: DocumentReference | undefined;
      if (isCompleted) {
        const logDate = session!.logDate ?? session!.startedAt.slice(0, 10);
        logRef = db.doc(`users/${req.userId}/dailyLogs/${logDate}`);
        const [logSnap, profileSnap] = await Promise.all([transaction.get(logRef), transaction.get(profileRef)]);
        previousSessionKcal = session!.actualCalorieBurn!.calculatedKcal;
        goalKcal = profileSnap.data()?.goalSelection?.dailyCalorieTargetKcal ?? 0;
        existingAccumulatedKcal = logSnap.data()?.accumulatedKcal;
      }

      // Now the writes.
      const sessionUpdate: Record<string, unknown> = { wearableReading: { platform, calorieValueKcal, recordedAt } };
      if (isCompleted) {
        // Second arg is unreachable here (selectActualCalorieBurn always
        // takes the wearable branch when its first arg is defined) — passed
        // for type-fit only, same rule as session-complete's own call.
        sessionUpdate.actualCalorieBurn = selectActualCalorieBurn(calorieValueKcal, previousSessionKcal);
      }
      transaction.set(sessionRef, sessionUpdate, { merge: true });

      if (!isCompleted || !logRef) return false;

      const calorieDeltaKcal = calorieValueKcal - previousSessionKcal;
      const { accumulatedKcal, completionStatus } = applyCalorieDeltaToDailyLog(existingAccumulatedKcal, calorieDeltaKcal, goalKcal);
      transaction.set(logRef, { accumulatedKcal, completionStatus }, { merge: true });
      return true;
    });

    if (appliedToLog) {
      await recomputeStreak(req.userId!);
    }

    return res.status(200).json({ appliedToLog, calculatedKcal: calorieValueKcal });
  }),
);
