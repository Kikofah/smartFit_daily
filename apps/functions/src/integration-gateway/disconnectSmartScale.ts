import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** DELETE /integrations/smart-scale — INT-2 / REQ-12 */
export const disconnectSmartScale = onCall((request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  return db.doc(`users/${userId}`).set(
    { integrationConnections: { smartScale: { connectionStatus: 'consent_withdrawn' } } },
    { merge: true },
  );
});
