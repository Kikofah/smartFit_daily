import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fake } from '../../test/fakeFirebase';
import { buildTestApp, request } from '../../test/testApp';
import { router } from './forgotPassword';

vi.mock('../../firebaseAdmin', () => import('../../test/fakeFirebase'));

// Mounted without a user, like server/index.ts mounts it (no session yet).
const app = buildTestApp([router], { userId: null });

beforeEach(() => {
  fake.reset();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('POST /api/forgot-password (ONB-0 / REQ-16)', () => {
  it('missing email → 400', async () => {
    expect((await request(app, 'POST', '/api/forgot-password', { body: {} })).status).toBe(400);
  });

  it('TC-ONB-0-003 — email/password account → 202 "sent", reset link never returned in the response', async () => {
    fake.addUser('ton@example.com', 'password');
    const res = await request(app, 'POST', '/api/forgot-password', { body: { email: 'ton@example.com' } });
    expect(res).toEqual({ status: 202, body: { status: 'sent' } });
  });

  it('TC-ONB-0-004 — Google account → 422 (no password to reset)', async () => {
    fake.addUser('g@example.com', 'google.com');
    const res = await request(app, 'POST', '/api/forgot-password', { body: { email: 'g@example.com' } });
    expect(res.status).toBe(422);
  });

  it('unknown email → same 202 as a real account (anti-enumeration)', async () => {
    const res = await request(app, 'POST', '/api/forgot-password', { body: { email: 'nobody@example.com' } });
    expect(res).toEqual({ status: 202, body: { status: 'sent' } });
  });
});
