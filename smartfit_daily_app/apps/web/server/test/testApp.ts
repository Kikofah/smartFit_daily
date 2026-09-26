import { once } from 'events';
import express, { type Router } from 'express';
import http from 'http';
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

/**
 * Sends one request to `app` on an ephemeral port — avoids adding supertest as a dependency.
 *
 * Uses `http.request` with `agent: false` rather than `fetch`: fetch pools
 * keep-alive connections per host:port, so when the OS hands a later test the
 * port of an already-closed server, fetch could reuse that dead socket and
 * fail with "other side closed" (flaky, ~1 in 8 runs).
 */
export async function request(
  app: express.Express,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  { body, headers }: { body?: unknown; headers?: Record<string, string> } = {},
): Promise<TestResponse> {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const { port } = server.address() as AddressInfo;
    const payload = body === undefined ? undefined : JSON.stringify(body);
    return await new Promise<TestResponse>((resolve, reject) => {
      const req = http.request(
        {
          host: '127.0.0.1',
          port,
          path,
          method,
          agent: false,
          headers: {
            'content-type': 'application/json',
            ...(payload === undefined ? {} : { 'content-length': Buffer.byteLength(payload) }),
            ...headers,
          },
        },
        (res) => {
          let text = '';
          res.setEncoding('utf8');
          res.on('data', (chunk: string) => (text += chunk));
          res.on('end', () => resolve({ status: res.statusCode ?? 0, body: text ? JSON.parse(text) : undefined }));
          res.on('error', reject);
        },
      );
      req.on('error', reject);
      req.end(payload);
    });
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}
