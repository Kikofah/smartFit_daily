import express, { type Router } from 'express';
import type { AddressInfo } from 'net';
import { NotFoundError } from '../assertDocExists';

export const TEST_USER_ID = 'user_test';

/**
 * Mounts `routers` the same way server/index.ts does (JSON body parsing, the
 * same error handler), but with a stub that sets `req.userId` instead of the
 * real `authenticate` middleware — pass `userId: null` to mount without it
 * (for routes that deliberately run unauthenticated, or to test
 * `authenticate` itself by passing it in `routers`).
 */
export function buildTestApp(routers: Router[], { userId = TEST_USER_ID }: { userId?: string | null } = {}) {
  const app = express();
  app.use(express.json());
  const api = express.Router();
  if (userId !== null) {
    api.use((req, _res, next) => {
      req.userId = userId;
      next();
    });
  }
  routers.forEach((r) => api.use(r));
  app.use('/api', api);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
    return res.status(500).json({ error: String(err) });
  });
  return app;
}

export interface TestResponse {
  status: number;
  body: unknown;
}

/** Sends one request to `app` on an ephemeral port — avoids adding supertest as a dependency. */
export async function request(
  app: express.Express,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  { body, headers }: { body?: unknown; headers?: Record<string, string> } = {},
): Promise<TestResponse> {
  const server = app.listen(0);
  try {
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: { 'content-type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : undefined };
  } finally {
    server.close();
  }
}
