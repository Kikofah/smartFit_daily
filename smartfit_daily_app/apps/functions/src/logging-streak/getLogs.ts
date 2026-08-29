import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** GET /logs — PLN-3 / REQ-10. Optional date range; returns newest first. */
export const getLogs = onCall<{ fromDate?: string; toDate?: string }>(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  let query = db.collection(`users/${userId}/dailyLogs`).orderBy('logDate', 'desc');
  if (request.data.fromDate) query = query.where('logDate', '>=', request.data.fromDate);
  if (request.data.toDate) query = query.where('logDate', '<=', request.data.toDate);

  const snapshot = await query.get();
  return snapshot.docs.map((d) => d.data());
});
