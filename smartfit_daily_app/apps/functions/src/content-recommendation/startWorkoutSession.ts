import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** POST /workouts/sessions — REC-1, REC-4 / REQ-04, REQ-07 */
export const startWorkoutSession = onCall<{ mainExternalVideoId: string }>(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const sessionRef = db.collection(`users/${userId}/workoutSessions`).doc();
  await sessionRef.set({
    startedAt: new Date().toISOString(),
    status: 'in_progress',
    // TODO: also write the 1-3 sessionVideos entries (main + warmup/cooldown
    // if intensity is high) — see database-schema.md §8.2.
  });

  return { sessionId: sessionRef.id };
});
