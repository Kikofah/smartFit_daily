import { Router } from 'express';
import { FieldPath } from 'firebase-admin/firestore';
import { db } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';

export const router = Router();

/**
 * GET /api/logs — PLN-3 / REQ-10. Optional date range; returns newest first.
 * `dailyLogs/{date}` docs don't store `logDate` as a field (database-schema.md
 * §8.2 — the ISO date is the doc ID itself), so order/filter by document ID
 * (lexicographic = chronological for YYYY-MM-DD) and stitch `logDate` back
 * onto each entry from `d.id` for the client (DailyLog's documented shape).
 *
 * Queries ascending (Firestore auto-indexes `__name__` ascending for free)
 * and reverses in memory for "newest first" — `orderBy(..., 'desc')` on
 * `__name__` needs an explicit composite index to be created/deployed via
 * firestore.indexes.json first, which this avoids entirely.
 */
router.get(
  '/logs',
  asyncHandler(async (req, res) => {
    const { fromDate, toDate } = req.query as { fromDate?: string; toDate?: string };

    let query = db.collection(`users/${req.userId}/dailyLogs`).orderBy(FieldPath.documentId(), 'asc') as FirebaseFirestore.Query;
    if (fromDate) query = query.where(FieldPath.documentId(), '>=', fromDate);
    if (toDate) query = query.where(FieldPath.documentId(), '<=', toDate);

    const snapshot = await query.get();
    return res.json(snapshot.docs.map((d) => ({ logDate: d.id, ...d.data() })).reverse());
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
    return res.json({ logDate: req.params.date, ...snapshot.data() });
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
