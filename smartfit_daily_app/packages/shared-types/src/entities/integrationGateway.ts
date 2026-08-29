/**
 * Integration Gateway (HLA §3.8) — INT-2, INT-3 / REQ-12, 13
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.16
 */

export type IntegrationType = 'smart_scale' | 'wearable';
export type ConnectionStatus = 'not_connected' | 'connected' | 'consent_withdrawn';

export interface IntegrationConnection {
  id: string;
  userProfileId: string; // FK -> UserProfile.id
  integrationType: IntegrationType;
  connectionStatus: ConnectionStatus;
  connectedAt?: string; // ISO-8601 datetime
}
