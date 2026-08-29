import { Router } from 'express';
import { db } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';

export const router = Router();

/** GET /api/logs — PLN-3 / REQ-10. Optional date range; returns newest first. */
router.get(
  '/logs',
  asyncHandler(async (req, res) => {
    const { fromDate, toDate } = req.query as { fromDate?: string; toDate?: string };

    let query = db.collection(`users/${req.userId}/dailyLogs`).orderBy('logDate', 'desc') as FirebaseFirestore.Query;
    if (fromDate) query = query.where('logDate', '>=', fromDate);
    if (toDate) query = query.where('logDate', '<=', toDate);

    const snapshot = await query.get();
    return res.json(snapshot.docs.map((d) => d.data()));
  }),
);

/** GET /api/logs/:date — PLN-3 / REQ-10 */
router.get(
  '/logs/:date',
  asyncHandler<{ date: string }>(async (req, res) => {
    const snapshot = await db.doc(`users/${req.userId}/dailyLogs/${req.params.date}`).get();
    if (!snapshot.exists) {
      return res.status(404).json({ error: 'No log for this date.' });
    }
    return res.json(snapshot.data());
  }),
);

/** GET /api/streak — PLN-4 / REQ-09, REQ-10. Reads the cached streakSnapshot (not computed on-demand). */
router.get(
  '/streak',
  asyncHandler(async (req, res) => {
    const snapshot = await db.doc(`users/${req.userId}`).get();
    return res.json(snapshot.data()?.streakSnapshot ?? { currentStreakDays: 0 });
  }),
);
