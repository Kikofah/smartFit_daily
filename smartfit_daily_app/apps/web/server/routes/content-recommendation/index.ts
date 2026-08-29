import { Router } from 'express';
import { db } from '../../firebaseAdmin';

export const router = Router();

/**
 * GET /api/workouts/today/recommendation — REC-1, REC-4 / REQ-04, REQ-07
 * Matches a YouTube video to today's remaining calorie target, widening the
 * search on repeated misses (matching/widen-retry logic — see
 * detailed-design/02-daily-youtube-recommendation.md). Returns no-content if
 * today is a Cheat/Rest Day.
 */
router.get('/workouts/today/recommendation', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const dayStatus = await db.doc(`users/${req.userId}/dayStatus/${today}`).get();
  if (dayStatus.data()?.isCheatRest) {
    return res.status(204).send(); // no recommendation on a Cheat/Rest Day
  }

  // TODO: call the YouTube Data API v3 (external boundary, HLA §6.1) and
  // apply the matching/widen-retry algorithm.
  return res.status(501).json({ error: 'YouTube Data API integration not yet implemented.' });
});

/**
 * POST /api/workouts/today/recommendation/swap — REC-3 / REQ-06
 * Matching tolerance is an open point (api-spec.md §4, item 1).
 */
router.post('/workouts/today/recommendation/swap', async (req, res) => {
  // TODO: re-run the matching/widen-retry algorithm excluding
  // req.body.rejectedExternalVideoIds.
  return res.status(501).json({ error: 'YouTube Data API integration not yet implemented.' });
});

/** POST /api/workouts/sessions — REC-1, REC-4 / REQ-04, REQ-07 */
router.post('/workouts/sessions', async (req, res) => {
  const sessionRef = db.collection(`users/${req.userId}/workoutSessions`).doc();
  await sessionRef.set({
    startedAt: new Date().toISOString(),
    status: 'in_progress',
    // TODO: also write the 1-3 sessionVideos entries (main + warmup/cooldown
    // if intensity is high) — see database-schema.md §8.2.
  });

  return res.status(201).json({ sessionId: sessionRef.id });
});
