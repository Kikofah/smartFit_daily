import { Router } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fake } from '../test/fakeFirebase';
import { buildTestApp, request } from '../test/testApp';
import { authenticate } from './authenticate';

vi.mock('../firebaseAdmin', () => import('../test/fakeFirebase'));

const echo = Router();
echo.get('/whoami', (req, res) => res.json({ userId: req.userId }));
const app = buildTestApp([Router().use(authenticate), echo], { userId: null });

beforeEach(() => {
  fake.reset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('authenticate middleware (ONB-0 / REQ-15 — every data route needs a verified session)', () => {
  it('no Authorization header → 401', async () => {
    expect((await request(app, 'GET', '/api/whoami')).status).toBe(401);
  });

  it('invalid or expired token → 401', async () => {
    const res = await request(app, 'GET', '/api/whoami', { headers: { authorization: 'Bearer expired' } });
    expect(res.status).toBe(401);
  });

  it('valid token → request proceeds with req.userId set from the token', async () => {
    fake.addIdToken('good-token', 'uid_123');
    const res = await request(app, 'GET', '/api/whoami', { headers: { authorization: 'Bearer good-token' } });
    expect(res).toEqual({ status: 200, body: { userId: 'uid_123' } });
  });
});
