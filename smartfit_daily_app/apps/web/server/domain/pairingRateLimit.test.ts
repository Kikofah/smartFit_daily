import { describe, expect, it } from 'vitest';
import {
  isLocked,
  recordFailedAttempt,
  retryAfterSeconds,
  WINDOW_MS,
  type PairingRateLimitState,
} from './pairingRateLimit';

const WINDOW_START = '2026-09-25T10:00:00.000Z';
const NOW_AT_START = new Date(WINDOW_START);

function atOffsetMs(ms: number): Date {
  return new Date(NOW_AT_START.getTime() + ms);
}

describe('pairingRateLimit (INT-0 / REQ-18 — 5 failures per 15-minute window)', () => {
  it('no prior state → not locked, no retry-after', () => {
    expect(isLocked(undefined, NOW_AT_START)).toBe(false);
    expect(retryAfterSeconds(undefined, NOW_AT_START)).toBe(0);
  });

  it('boundary: the 4th failure does not lock', () => {
    let state: PairingRateLimitState | undefined;
    for (let i = 0; i < 4; i++) {
      state = recordFailedAttempt(state, NOW_AT_START);
    }
    expect(state?.failedCount).toBe(4);
    expect(isLocked(state, NOW_AT_START)).toBe(false);
  });

  it('boundary: the 5th failure locks the client', () => {
    let state: PairingRateLimitState | undefined;
    for (let i = 0; i < 5; i++) {
      state = recordFailedAttempt(state, NOW_AT_START);
    }
    expect(state?.failedCount).toBe(5);
    expect(isLocked(state, NOW_AT_START)).toBe(true);
    expect(retryAfterSeconds(state, NOW_AT_START)).toBe(WINDOW_MS / 1000);
  });

  it('boundary: exactly at the 15-minute mark the window has expired → unlocked', () => {
    const lockedState: PairingRateLimitState = { failedCount: 5, windowStartedAt: WINDOW_START };
    expect(isLocked(lockedState, atOffsetMs(WINDOW_MS))).toBe(false);
    expect(retryAfterSeconds(lockedState, atOffsetMs(WINDOW_MS))).toBe(0);
  });

  it('boundary: one millisecond before the 15-minute mark is still locked', () => {
    const lockedState: PairingRateLimitState = { failedCount: 5, windowStartedAt: WINDOW_START };
    expect(isLocked(lockedState, atOffsetMs(WINDOW_MS - 1))).toBe(true);
    expect(retryAfterSeconds(lockedState, atOffsetMs(WINDOW_MS - 1))).toBe(1);
  });

  it('a failure after the window expired starts a fresh window instead of continuing to accumulate', () => {
    const staleState: PairingRateLimitState = { failedCount: 5, windowStartedAt: WINDOW_START };
    const next = recordFailedAttempt(staleState, atOffsetMs(WINDOW_MS + 1));
    expect(next).toEqual({ failedCount: 1, windowStartedAt: atOffsetMs(WINDOW_MS + 1).toISOString() });
    expect(isLocked(next, atOffsetMs(WINDOW_MS + 1))).toBe(false);
  });

  it('success reset: clearing the state (undefined) after a successful redeem leaves the client unlocked', () => {
    // routes/pairing/index.ts models "reset on success" as deleting the Firestore
    // doc, i.e. going back to the undefined/no-prior-state case.
    const resetState: PairingRateLimitState | undefined = undefined;
    expect(isLocked(resetState, NOW_AT_START)).toBe(false);
  });
});
