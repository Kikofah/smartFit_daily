import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../shared/firebaseAdmin';
import type { ActivityLevel, Sex } from '@smartfit/shared-types';

interface UpdatePersonalInfoRequest {
  age: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
}

/**
 * PUT /profile/personal-info — ONB-1 / REQ-01
 * TDEE is computed client-side (NFR-01/NFR-03, no network latency) and sent
 * already-calculated; this function only validates and persists it.
 * See docs/02-design/02-technical/detailed-design/01-onboarding-personalization.md.
 */
export const updatePersonalInfo = onCall<UpdatePersonalInfoRequest & { tdeeKcal: number }>((request) => {
  const userId = request.auth?.uid;
  if (!userId) throw new HttpsError('unauthenticated', 'Sign in required.');

  const { age, weightKg, heightCm } = request.data;
  if (age <= 0 || weightKg <= 0 || heightCm <= 0) {
    throw new HttpsError('invalid-argument', 'age/weightKg/heightCm must be positive.');
  }

  return db.doc(`users/${userId}`).set(request.data, { merge: true });
});
