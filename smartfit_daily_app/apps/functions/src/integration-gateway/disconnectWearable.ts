import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';

/** DELETE /integrations/wearable — INT-3 / REQ-13 */
export const disconnectWearable = onCall((request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  return db.doc(`users/${userId}`).set(
    { integrationConnections: { wearable: { connectionStatus: 'consent_withdrawn' } } },
    { merge: true },
  );
});
