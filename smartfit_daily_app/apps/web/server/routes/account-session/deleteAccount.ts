import { Router } from 'express';
import { db, auth } from '../../firebaseAdmin';
import { asyncHandler } from '../../asyncHandler';

export const router = Router();

// Every users/{userId} subcollection per database-schema.md §8.2 — todaysRecommendation,
// streakSnapshot, weightForecastSnapshot etc. are embedded maps on the user doc itself
// and go with it in a single .delete(), not listed here.
const SUBCOLLECTIONS = ['dailyLogs', 'dayStatus', 'weeklyPlanEntries', 'weightRecords', 'workoutSessions'];

/**
 * DELETE /api/account — ONB-0 / NFR-06
 * Permanently deletes the signed-in user's data: every subcollection under
 * users/{userId}, any pending pairing code (INT-0), the profile doc itself,
 * then the Firebase Auth account. database-schema.md §6 item 6 leaves
 * retention-vs-immediate-delete as an open point (no PDPA/audit policy
 * decided yet) — this implements the simpler immediate hard-delete rather
 * than a retention window, since nothing upstream has asked for one.
 * Irreversible; the client must confirm before calling this.
 *
 * Idempotent: a repeat call with a still-valid (but stale — the underlying
 * account is already gone) ID token finds nothing left to delete and
 * succeeds the same way, rather than 500ing on auth.deleteUser's
 * auth/user-not-found.
 */
router.delete(
  '/account',
  asyncHandler(async (req, res) => {
    const userId = req.userId!;

    for (const name of SUBCOLLECTIONS) {
      const snapshot = await db.collection(`users/${userId}/${name}`).get();
      if (snapshot.empty) continue;
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    // Pairing codes (routes/pairing/index.ts) are keyed by code, not userId,
    // and normally self-clean via redemption or their 5-minute TTL — this
    // just closes the narrow window where one was created but never
    // redeemed/expired yet at the moment the account is deleted.
    const pendingCodes = await db.collection('pairingCodes').where('uid', '==', userId).get();
    if (!pendingCodes.empty) {
      const batch = db.batch();
      pendingCodes.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    await db.doc(`users/${userId}`).delete();
    try {
      await auth.deleteUser(userId);
    } catch (e) {
      if ((e as { code?: string }).code !== 'auth/user-not-found') throw e;
    }

    return res.status(204).send();
  }),
);
