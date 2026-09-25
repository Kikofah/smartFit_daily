/**
 * INT-0 / REQ-18 — brute-force protection for POST /pairing/redeem. The
 * server runs on Cloud Run and can scale to multiple instances, so the
 * failure counter can't live in process memory (see routes/pairing/index.ts,
 * which persists `PairingRateLimitState` to Firestore keyed by a hash of the
 * client IP). This module only decides, given a state + "now", whether a
 * client is locked out and what the next state should be — no Firestore/
 * Express/Date.now() in here, so it stays synchronously testable.
 */
export interface PairingRateLimitState {
  failedCount: number;
  windowStartedAt: string; // ISO
}

export const MAX_FAILED_ATTEMPTS = 5;
export const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function windowElapsedMs(state: PairingRateLimitState, now: Date): number {
  return now.getTime() - new Date(state.windowStartedAt).getTime();
}

/** True once a client has hit MAX_FAILED_ATTEMPTS within a still-active window. */
export function isLocked(state: PairingRateLimitState | undefined, now: Date): boolean {
  if (!state) return false;
  return state.failedCount >= MAX_FAILED_ATTEMPTS && windowElapsedMs(state, now) < WINDOW_MS;
}

/** Seconds until the current window expires and the client can retry — 0 when not locked. */
export function retryAfterSeconds(state: PairingRateLimitState | undefined, now: Date): number {
  if (!isLocked(state, now)) return 0;
  // isLocked already confirmed `state` is defined here.
  return Math.ceil((WINDOW_MS - windowElapsedMs(state as PairingRateLimitState, now)) / 1000);
}

/**
 * Given the current state and a fresh failed redeem attempt, returns the
 * state to persist. A failure with no prior state, or one whose window has
 * already expired, starts a brand-new window; a failure inside an active
 * window just increments it.
 */
export function recordFailedAttempt(state: PairingRateLimitState | undefined, now: Date): PairingRateLimitState {
  if (!state || windowElapsedMs(state, now) >= WINDOW_MS) {
    return { failedCount: 1, windowStartedAt: now.toISOString() };
  }
  return { failedCount: state.failedCount + 1, windowStartedAt: state.windowStartedAt };
}
