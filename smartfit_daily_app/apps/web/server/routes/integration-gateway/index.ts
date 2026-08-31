import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { assertDocExists, NotFoundError } from '../../assertDocExists';
import { asyncHandler } from '../../asyncHandler';
import type { ActivityLevel, GoalType, Sex, WearablePlatform, WeightRecordSource } from '@smartfit/shared-types';

export const router = Router();

// Mirrors PersonalInfoScreen.tsx's ONB-1 formula exactly (Mifflin-St Jeor BMR
// × Activity Factor) — recomputed here (server-side) rather than client-side
// per NFR-01/03's usual convention, since this trigger is a device sync/
// background event (detailed-design/04-smart-integrations.md's INT-2
// sequence diagram: "IG->>PP: trigger คำนวณ TDEE ใหม่"), not an interactive
// form submission with a client already computing it.
const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

function computeTdeeKcal(sex: Sex, weightKg: number, heightCm: number, age: number, activityLevel: ActivityLevel) {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
  return Math.round(bmr * ACTIVITY_FACTOR[activityLevel]);
}

// Mirrors GoalConfirmScreen.tsx's ONB-3 formula exactly — see that file for
// why this is weightKg-based rather than TDEE-based.
const GOAL_KCAL_PER_KG: Record<GoalType, number> = {
  lose_weight: 4.5,
  tone_up: 3.0,
  build_endurance: 5.5,
};

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
      updates.goalSelection = { dailyCalorieTargetKcal: Math.round(body.weightKg * GOAL_KCAL_PER_KG[goalType]) };
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
 * POST /api/integrations/wearable/readings — INT-3 / REQ-13
 * If this arrives before session-complete, session-complete will prefer it
 * over the MET estimate. If it never arrives, the MET estimate is used as-is
 * (not an error).
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

    await sessionRef.set(
      { wearableReading: { platform, calorieValueKcal, recordedAt: new Date().toISOString() } },
      { merge: true },
    );
    return res.status(204).send();
  }),
);
