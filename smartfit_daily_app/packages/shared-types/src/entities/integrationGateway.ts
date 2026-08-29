/**
 * Integration Gateway (HLA §3.8) — INT-2, INT-3 / REQ-12, 13
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.16
 */

export type IntegrationType = 'smart_scale' | 'wearable';
export type ConnectionStatus = 'not_connected' | 'connected' | 'consent_withdrawn';

/** Embedded map field (one of `integrationConnections.smartScale`/`.wearable`) inside `users/{userId}` — no id/userProfileId (§8.2). */
export interface IntegrationConnection {
  /** Redundant with the smartScale/wearable key itself — only set by the seed script today, not the real connect/disconnect routes. */
  integrationType?: IntegrationType;
  connectionStatus: ConnectionStatus;
  connectedAt?: string; // ISO-8601 datetime
}
