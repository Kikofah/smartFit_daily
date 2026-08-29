import { HttpsError } from 'firebase-functions/v2/https';
import type { DocumentReference } from 'firebase-admin/firestore';

/**
 * Referential existence validation (NFR-12) — Firestore has no schema-level
 * foreign keys, so every Cloud Function that receives a client-supplied
 * reference id must confirm the target document exists (and belongs to the
 * calling user, where applicable) before writing.
 *
 * See docs/02-design/02-technical/database-schema.md §8.3.
 */
export async function assertDocExists(ref: DocumentReference, notFoundMessage: string): Promise<void> {
  const snapshot = await ref.get();
  if (!snapshot.exists) {
    throw new HttpsError('not-found', notFoundMessage);
  }
}
