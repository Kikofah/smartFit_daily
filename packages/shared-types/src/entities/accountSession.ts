/**
 * Account & Session Management (HLA §3.1) — ONB-0 / REQ-14-17
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.1
 *
 * `UserAccount` is a conceptual "thin identity anchor" only — it is not a
 * persisted Firestore document. Every field maps 1:1 onto Firebase
 * Authentication's UserRecord (see tech-stack.md §6.1/§6.3.1).
 */

export type SignupMethod = 'email_password' | 'google' | 'apple';

export interface UserAccount {
  id: string; // Firebase Auth UID — same value used as users/{userId}
  signupMethod: SignupMethod;
  email: string;
  /** Only present when signupMethod === 'email_password'. Never a raw password. */
  credentialReference?: string;
  /** Only present when signupMethod === 'google' | 'apple'. */
  externalProviderReference?: string;
  createdAt: string; // ISO-8601 datetime
}
