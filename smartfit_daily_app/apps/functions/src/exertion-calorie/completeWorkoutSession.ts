import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';
import { assertDocExists } from '../shared/assertDocExists';

/**
 * POST /workouts/sessions/{sessionId}/complete — REC-2 / REQ-05
 * MET is computed client-side (NFR-01/03); this function validates and
 * persists it, preferring a wearable reading if one already arrived
 * (INT-3). Must give UI feedback within 250ms (NFR-02) — the client shows
 * an optimistic state and does not block on this call's round trip.
 */
export const completeWorkoutSession = onCall<{ sessionId: string; actualDurationMinutes: number; metValue: number; calculatedKcal: number }>(
  async (request) => {
    const userId = request.auth?.uid;
    if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

    const { sessionId, actualDurationMinutes, metValue, calculatedKcal } = request.data;
    const sessionRef = db.doc(`users/${userId}/workoutSessions/${sessionId}`);

    // Referential existence validation (NFR-12) — Firestore has no FK.
    await assertDocExists(sessionRef, 'sessionId not found.');

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
    // all-or-nothing per PLN-3) and trigger streak recompute.
  },
);
