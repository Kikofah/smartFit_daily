import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** POST /integrations/smart-scale/connect — INT-2 / REQ-12. Must follow a consent prompt (NFR-05). */
export const connectSmartScale = onCall((request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  return db.doc(`users/${userId}`).set(
    { integrationConnections: { smartScale: { connectionStatus: 'connected', connectedAt: new Date().toISOString() } } },
    { merge: true },
  );
});
