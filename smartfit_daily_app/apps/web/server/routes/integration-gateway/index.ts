import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { assertDocExists, NotFoundError } from '../../assertDocExists';
import { asyncHandler } from '../../asyncHandler';
import type { WearablePlatform, WeightRecordSource } from '@smartfit/shared-types';

export const router = Router();

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
 */
router.post(
  '/integrations/smart-scale/sync',
  asyncHandler(async (req, res) => {
    const body = req.body as { weightKg: number; bodyCompositionNote?: string; source: WeightRecordSource };
    await db.collection(`users/${req.userId}/weightRecords`).add({
      ...body,
      recordedAt: new Date().toISOString(),
    });

    // TODO: trigger TDEE recomputation now that weightKg changed (Personalization & Profile).
    return res.status(201).send();
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
