import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';
import type { WeightRecordSource } from '@smartfit/shared-types';

/**
 * POST /integrations/smart-scale/sync — INT-2 / REQ-12
 * Same endpoint whether the value came from Bluetooth or was typed manually
 * after a failed connection (client-side fallback) — only `source` differs.
 */
export const syncSmartScale = onCall<{ weightKg: number; bodyCompositionNote?: string; source: WeightRecordSource }>(
  async (request) => {
    const userId = request.auth?.uid;
    if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

    await db.collection(`users/${userId}/weightRecords`).add({
      ...request.data,
      recordedAt: new Date().toISOString(),
    });

    // TODO: trigger TDEE recomputation now that weightKg changed (Personalization & Profile).
  },
);
