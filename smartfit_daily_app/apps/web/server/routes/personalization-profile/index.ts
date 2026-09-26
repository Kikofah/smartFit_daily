import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';
import { computeDailyCalorieTargetKcal, computeDailyIntakeTarget } from '../../domain/goalTargets';
import type { ActivityLevel, EquipmentType, GoalType, Sex } from '@smartfit/shared-types';

export const router = Router();

/** GET /api/profile — 404-equivalent if ONB-1 was never completed. */
router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const snapshot = await db.doc(`users/${req.userId}`).get();
    const profile = snapshot.data();
    if (!profile || profile.tdeeKcal === undefined) {
      return res.status(404).json({ error: 'ONB-1 has not been completed yet.' });
    }
    return res.json(profile);
  }),
);

interface UpdatePersonalInfoRequest {
  displayName: string;
  age: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  tdeeKcal: number; // computed client-side (NFR-01/03, no network latency)
}

/** PUT /api/profile/personal-info — ONB-1 / REQ-01 */
router.put(
  '/profile/personal-info',
  asyncHandler(async (req, res) => {
    const body = req.body as UpdatePersonalInfoRequest;
    if (!body.displayName?.trim()) {
      return res.status(400).json({ error: 'displayName must not be empty.' });
    }
    if (body.age <= 0 || body.weightKg <= 0 || body.heightCm <= 0) {
      return res.status(400).json({ error: 'age/weightKg/heightCm must be positive.' });
    }

    await db.doc(`users/${req.userId}`).set(body, { merge: true });
    return res.status(204).send();
  }),
);

/** PUT /api/profile/equipment — ONB-2 / REQ-03. "none" is mutually exclusive with everything else. */
router.put(
  '/profile/equipment',
  asyncHandler(async (req, res) => {
    const { equipmentTypes } = req.body as { equipmentTypes: EquipmentType[] };
    if (equipmentTypes.includes('none') && equipmentTypes.length > 1) {
      return res.status(400).json({ error: '"none" cannot be combined with other equipment.' });
    }

    await db.doc(`users/${req.userId}`).set({ equipmentTypes }, { merge: true });
    return res.status(204).send();
  }),
);

interface UpdateGoalRequest {
  goalType: GoalType;
  targetWeightKg?: number;
  // Legacy fields from older clients (pre-2026-09-25) that computed these
  // themselves and sent them along — no longer trusted, see below. Accepted
  // but ignored for backward compatibility; a current client doesn't need
  // to send them at all.
  dailyCalorieTargetKcal?: number;
  dailyIntakeTargetKcal?: number;
}

/**
 * PUT /api/profile/goal — ONB-3 / REQ-02
 * `dailyCalorieTargetKcal` (exercise-burn target) and `dailyIntakeTargetKcal`
 * + `isSafetyFloorApplied` (TDEE ± per-goalType delta, floored at
 * SAFETY_FLOOR_MIN_KCAL) are now computed authoritatively here, server-side,
 * from the user's already-stored `weightKg`/`tdeeKcal` (ONB-1) — NOT trusted
 * from the request body. Fixed 2026-09-25 (round 3): re-deriving
 * `isSafetyFloorApplied` from only the client's already-floored
 * `dailyIntakeTargetKcal` number (the old `deriveIsSafetyFloorApplied`) could
 * never tell a genuinely-floored value apart from a raw-exactly-1,200 value —
 * both arrive as exactly 1,200 — so it could never actually persist `true`.
 * Recomputing from the raw `tdeeKcal` here removes that ambiguity entirely.
 *
 * If ONB-1 hasn't been completed yet (`weightKg`/`tdeeKcal` not stored), this
 * rejects with 409 rather than falling back to the client-sent legacy
 * fields — trusting client-sent numbers is exactly the bug being fixed, so
 * silently falling back to them for this one edge case would reintroduce it.
 */
router.put(
  '/profile/goal',
  asyncHandler(async (req, res) => {
    const body = req.body as UpdateGoalRequest;
    if (body.goalType === 'lose_weight' && body.targetWeightKg === undefined) {
      return res.status(400).json({ error: 'targetWeightKg is required for goalType "lose_weight".' });
    }

    const profile = (await db.doc(`users/${req.userId}`).get()).data();
    if (profile?.weightKg === undefined || profile?.tdeeKcal === undefined) {
      return res.status(409).json({ error: 'ONB-1 (personal info / TDEE) must be completed before setting a goal.' });
    }

    const dailyCalorieTargetKcal = computeDailyCalorieTargetKcal(profile.weightKg, body.goalType);
    const { dailyIntakeTargetKcal, isSafetyFloorApplied } = computeDailyIntakeTarget(profile.tdeeKcal, body.goalType);

    const goalSelection: {
      goalType: GoalType;
      dailyCalorieTargetKcal: number;
      dailyIntakeTargetKcal: number;
      isSafetyFloorApplied: boolean;
      targetWeightKg?: number;
    } = { goalType: body.goalType, dailyCalorieTargetKcal, dailyIntakeTargetKcal, isSafetyFloorApplied };
    // Only set when provided — an explicit `undefined` field value throws in
    // the Firestore Admin SDK (ignoreUndefinedProperties isn't enabled).
    if (body.targetWeightKg !== undefined) {
      goalSelection.targetWeightKg = body.targetWeightKg;
    }

    await db.doc(`users/${req.userId}`).set({ goalSelection }, { merge: true });
    return res.status(204).send();
  }),
);
