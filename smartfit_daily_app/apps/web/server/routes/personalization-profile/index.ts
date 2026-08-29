import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';
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
  dailyCalorieTargetKcal: number;
}

const SAFETY_FLOOR_MIN_KCAL = 1200; // exact value tied to sex/age band — see log 2026-08-27

/** PUT /api/profile/goal — ONB-3 / REQ-02 */
router.put(
  '/profile/goal',
  asyncHandler(async (req, res) => {
    const body = req.body as UpdateGoalRequest;
    if (body.goalType === 'lose_weight' && body.targetWeightKg === undefined) {
      return res.status(400).json({ error: 'targetWeightKg is required for goalType "lose_weight".' });
    }

    const isSafetyFloorApplied = body.dailyCalorieTargetKcal <= SAFETY_FLOOR_MIN_KCAL;
    await db.doc(`users/${req.userId}`).set(
      { goalSelection: { ...body, isSafetyFloorApplied } },
      { merge: true },
    );
    return res.status(204).send();
  }),
);
