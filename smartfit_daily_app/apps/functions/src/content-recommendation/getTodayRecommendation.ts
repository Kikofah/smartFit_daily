import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/**
 * GET /workouts/today/recommendation — REC-1, REC-4 / REQ-04, REQ-07
 * Matches a YouTube video to today's remaining calorie target, widening the
 * search on repeated misses (matching/widen-retry logic — see
 * detailed-design/02-daily-youtube-recommendation.md). Returns no-content if
 * today is a Cheat/Rest Day.
 */
export const getTodayRecommendation = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const today = new Date().toISOString().slice(0, 10);
  const dayStatus = await db.doc(`users/${userId}/dayStatus/${today}`).get();
  if (dayStatus.data()?.isCheatRest) {
    return null; // 204-equivalent: no recommendation on a Cheat/Rest Day
  }

  // TODO: call the YouTube Data API v3 (external boundary, HLA §6.1) and
  // apply the matching/widen-retry algorithm.
  throw new HttpsError('unimplemented', 'YouTube Data API integration not yet implemented.');
});
