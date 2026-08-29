import { onCall, HttpsError } from 'firebase-functions/v2/https';

/**
 * POST /workouts/today/recommendation/swap — REC-3 / REQ-06
 * Swaps the current video while keeping today's calorie target. Rejects the
 * previously-suggested video ids accumulated by the client for this session.
 * Matching tolerance is an open point (api-spec.md §4, item 1).
 */
export const swapRecommendation = onCall<{ rejectedExternalVideoIds: string[] }>((request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in required.');

  // TODO: re-run the matching/widen-retry algorithm excluding rejectedExternalVideoIds.
  throw new HttpsError('unimplemented', 'YouTube Data API integration not yet implemented.');
});
