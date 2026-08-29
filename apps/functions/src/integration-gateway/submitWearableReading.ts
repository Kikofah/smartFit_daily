import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';
import { assertDocExists } from '../shared/assertDocExists';
import type { WearablePlatform } from '@smartfit/shared-types';

/**
 * POST /integrations/wearable/readings — INT-3 / REQ-13
 * If this arrives before sessionComplete, sessionComplete will prefer it
 * over the MET estimate. If it never arrives, the MET estimate is used as-is
 * (not an error).
 */
export const submitWearableReading = onCall<{ sessionId: string; platform: WearablePlatform; calorieValueKcal: number }>(
  async (request) => {
    const userId = request.auth?.uid;
    if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

    const { sessionId, platform, calorieValueKcal } = request.data;
    const sessionRef = db.doc(`users/${userId}/workoutSessions/${sessionId}`);

    // Referential existence validation (NFR-12) — Firestore has no FK.
    await assertDocExists(sessionRef, 'sessionId not found.');

    return sessionRef.set(
      { wearableReading: { platform, calorieValueKcal, recordedAt: new Date().toISOString() } },
      { merge: true },
    );
  },
);
