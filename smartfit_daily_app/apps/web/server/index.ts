import 'dotenv/config'; // must run before any other import touches process.env (firebaseAdmin.ts does, transitively)
import express from 'express';
import path from 'path';
import { authenticate } from './middleware/authenticate';
import { NotFoundError } from './assertDocExists';

import { router as accountSessionRouter } from './routes/account-session/forgotPassword';
import { router as pairingRouter } from './routes/pairing';
import { router as personalizationProfileRouter } from './routes/personalization-profile';
import { router as contentRecommendationRouter } from './routes/content-recommendation';
import { router as exertionCalorieRouter } from './routes/exertion-calorie';
import { router as plannerDayStatusRouter } from './routes/planner-day-status';
import { router as loggingStreakRouter } from './routes/logging-streak';
import { router as insightsForecastRouter } from './routes/insights-forecast';
import { router as integrationGatewayRouter } from './routes/integration-gateway';

// Defense-in-depth alongside asyncHandler (see asyncHandler.ts) — logs
// instead of silently killing the process if something still slips through
// outside any request's promise chain.
process.on('unhandledRejection', (reason) => console.error('Unhandled rejection:', reason));

const app = express();
app.use(express.json());

// ONB-0 / REQ-14-17 — sign-up/login/logout are direct Firebase Authentication
// client SDK calls (see client/src/services/authService.ts); forgot-password
// is the one operation that needs a server route, and it runs before the
// user has a session, so it's mounted without `authenticate`.
app.use('/api/auth', accountSessionRouter);

// Device-pairing handoff (2026-08-29) — mixed auth requirements per route
// (create-code needs a signed-in web user, redeem deliberately doesn't), so
// it applies `authenticate` itself per-route rather than via this blanket
// mount — see routes/pairing/index.ts.
app.use('/api', pairingRouter);

// Every other route needs a verified Firebase ID token (see
// server/middleware/authenticate.ts, replacing Cloud Functions' onCall()
// request.auth.uid).
const api = express.Router();
api.use(authenticate);
api.use(personalizationProfileRouter);
api.use(contentRecommendationRouter);
api.use(exertionCalorieRouter);
api.use(plannerDayStatusRouter);
api.use(loggingStreakRouter);
api.use(insightsForecastRouter);
api.use(integrationGatewayRouter);
app.use('/api', api);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Internal server error.' });
});

// Serves the Vite-built client (apps/web/dist-client) in production. In
// development, Vite's own dev server handles the client and proxies /api
// here instead (see vite.config.ts).
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../dist-client');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// API_PORT takes priority over the generic PORT for local dev, where
// unrelated tooling (e.g. a dev-preview harness) may inject PORT for
// whatever process it considers "the" server — Vite (5173), not this one.
// Falls back to PORT in production, since that's what most hosts
// (Cloud Run, Render, etc.) inject and expect the app to respect.
const port = Number(process.env.API_PORT) || Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`smartFit_daily web server listening on :${port}`));
