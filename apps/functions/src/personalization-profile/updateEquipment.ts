import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';
import type { EquipmentType } from '@smartfit/shared-types';

/**
 * PUT /profile/equipment — ONB-2 / REQ-03
 * Multi-select, but "none" is mutually exclusive with every other option
 * (decision resolved 2026-08-27 — see 01-spec/20260823-01-onboarding-personalization.md).
 */
export const updateEquipment = onCall<{ equipmentTypes: EquipmentType[] }>((request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const { equipmentTypes } = request.data;
  if (equipmentTypes.includes('none') && equipmentTypes.length > 1) {
    throw new HttpsError('invalid-argument', '"none" cannot be combined with other equipment.');
  }

  return db.doc(`users/${userId}`).set({ equipmentTypes }, { merge: true });
});
