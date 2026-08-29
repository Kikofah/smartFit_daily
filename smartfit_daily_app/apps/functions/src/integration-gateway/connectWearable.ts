import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** POST /integrations/wearable/connect — INT-3 / REQ-13. Must follow a consent prompt (NFR-05). */
export const connectWearable = onCall((request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  return db.doc(`users/${userId}`).set(
    { integrationConnections: { wearable: { connectionStatus: 'connected', connectedAt: new Date().toISOString() } } },
    { merge: true },
  );
});
