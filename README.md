# smartFit_daily

A daily fitness app: personalized calorie targets, YouTube workout recommendations,
weekly planning with streak tracking, and optional wearable/smart-scale integrations.

## Repository layout

- **`docs/`** — the full documentation pipeline (requirements → design → technical → testing).
  Start at [`docs/01-requirements/01-spec/index.md`](docs/01-requirements/01-spec/index.md) if
  you're new here — every folder has its own `index.md` explaining its purpose.
- **`smartfit_daily_app/`** — the application codebase, an npm-workspaces monorepo:
  - **`apps/web/`** — the main product. One Express.js server (TypeScript) serving both a REST
    API (Firestore via the Admin SDK, replacing the Cloud Functions this project started with)
    and a React + Vite web client (`client/`, pages mirror
    [`docs/02-design/01-prototypes/v1/`](docs/02-design/01-prototypes/v1/), reusing
    `react-native-web` components ported from the original mobile app).
  - **`apps/mobile/`** — a slim React Native + Expo companion app for the two features a website
    can't do: INT-2 (Bluetooth smart-scale sync) and INT-3 (wearable sync via Apple
    HealthKit/Google Health Connect). Everything else lives in `apps/web`.
  - **`packages/shared-types/`** — TypeScript types shared by both apps, mirroring
    [`database-schema.md`](docs/02-design/02-technical/database-schema.md)'s conceptual entities.

## Getting started

```bash
cd smartfit_daily_app
npm install

# apps/web — the main app
npm run web:dev     # Vite dev server (client) + tsx watch (Express server), see apps/web/package.json
npm run web:build && npm run web:start   # production: Express serves the built client itself

# apps/mobile — device-pairing companion app
npm run mobile
```

Copy `smartfit_daily_app/.firebaserc`'s `default` project id to a real Firebase project before
deploying, and set the Firebase env vars each app reads:
`apps/web/client/.env` (copy from `.env.example`, `VITE_FIREBASE_*`),
`apps/web/.env` (copy from `.env.example` — server-side, see "Local Admin SDK credentials" below),
and `apps/mobile/.env` (copy from `.env.example`, `EXPO_PUBLIC_FIREBASE_*` — this app also needs
`EXPO_PUBLIC_API_BASE_URL` pointing at wherever `apps/web`'s Express server runs, since it isn't
served by the same origin the way the web client is).

### Local Admin SDK credentials

`apps/web/server` uses `firebase-admin` (Firestore + Auth token verification) — on real GCP
hosting (Cloud Run, Cloud Functions, etc.) this auto-detects both the project and credentials from
the ambient environment, but locally there's no such environment. Without setup, every route that
touches Firestore or verifies a token fails (the server itself stays up — it's just a 500 per
request — but nothing that needs Firestore/Auth admin access will work). Pick one:

1. Firebase Console → Project settings → Service accounts → Generate new private key, then set
   `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/the/downloaded/key.json` in `apps/web/.env`.
2. Install the `gcloud` CLI and run `gcloud auth application-default login` once on this machine
   (leave `GOOGLE_APPLICATION_CREDENTIALS` unset — it'll find the login automatically).

Either way, keep `FIREBASE_PROJECT_ID` set in `apps/web/.env` too — the Admin SDK needs it to
validate a token's audience claim even before it gets to the credentials check.

### Video recommendation (REC-1) credentials

`GET`/`POST /workouts/today/recommendation` (the daily YouTube video pick) needs two more keys in
`apps/web/.env` beyond Firebase — `YOUTUBE_API_KEY` (YouTube Data API v3, Google Cloud Console) and
`GEMINI_API_KEY` (Google AI Studio, aistudio.google.com — separate from a Gemini Advanced/Google One
subscription, which doesn't grant API access). Without them the route fails gracefully (a caught
error, not a crash) and the dashboard shows its loading/error state instead of a video. See
`apps/web/.env.example`'s inline comments for exactly where to get each key.

### Seeding sample data

`apps/web/scripts/seedSampleUsers.ts` creates 5 realistic sample accounts (varied goals, streaks,
and integration states — including one fresh account with no data yet, for testing empty states)
directly in whichever Firebase project `apps/web/client/.env` points at:

```bash
npm run seed:sample-users --workspace apps/web
```

It authenticates via the client SDK (each sample user signs itself up, then writes only its own
documents), so it needs no Admin SDK credentials — see the script's own header comment for details.
Safe to re-run: existing sample accounts sign in instead of re-signing up, and every write is an
idempotent overwrite.

`apps/web/scripts/seedWeightRecords.ts` adds 5 sample `weightRecords` for one *existing* user (by
Firebase Auth UID) — useful for exercising `GET /insights/weight-records` and the Progress screen's
trend chart without waiting on a real INT-2 smart-scale sync:

```bash
npm run seed:weight-records --workspace apps/web -- <userId>
```

Unlike `seedSampleUsers.ts`, this one uses `firebase-admin` directly (so it needs the Admin SDK
credentials set up above) and isn't idempotent — re-running it for the same user adds duplicate
records rather than skipping them, since each write is a plain `.add()`.

## Status

Application code was scaffolded on 2026-08-29 following the stack decided in
[`tech-stack.md`](docs/02-design/02-technical/tech-stack.md) (React Native + Expo + Firebase
Cloud Functions), then re-architected the same day to Express + a web-first client after a
follow-up decision to drop Cloud Functions and keep React Native only for INT-2/INT-3.
`tech-stack.md` has since been reconciled (2026-08-30/31) to reflect this: Express.js deployed on
Google Cloud Run, replacing Cloud Functions everywhere.

As of 2026-08-31, every screen in the auth, onboarding, daily-workout, planner/logging, and
progress/profile flows is built out against the [`v1` prototypes](docs/02-design/01-prototypes/v1/)
and [`DESIGN.md`](docs/02-design/01-prototypes/DESIGN.md), sharing a component library in
`apps/web/client/src/components/` (`Button`, `Card`, `Input`, `Stepper`, `Chip`, `Switch`,
`CalorieRing`, `VideoCard`, `StreakBadge`, `EmptyState`, `ProgressDots`, `Icon`), and most of it is
wired to real `apps/web/server` routes backed by Firestore rather than mock data:

- **REC-1/REC-3** (video recommendation, `GET`/`POST` under `/workouts/today/recommendation`) —
  YouTube Data API v3 supplies candidates (embeddable ones only), Google Gemini (`gemini-3.6-flash`)
  ranks/picks the best match and estimates its intensity/calories, cached per user per day. The
  workout-session screen plays the real pick back via the official YouTube IFrame Player API, with
  the session timer pausing/resuming in sync with the video's own play/pause state.
- **PLN-3/PLN-4** (all-or-nothing daily logging + streak) — completing a workout session accumulates
  that day's kcal against the daily target (`completionStatus` flips to "ครบเป้าหมาย" once it's met,
  no partial credit), and the streak is recomputed by walking backward day-by-day from today until
  the first gap.
- **INT-1** (weight forecast) — `GET /insights/forecast` computes a real forecasted goal date from
  the average daily calorie deficit actually logged plus the latest weight record, and
  `GET /insights/weight-records` feeds the Progress screen's real trend chart (both cached/read from
  the `weightRecords` subcollection instead of mock data).
- Every protected route now redirects to `/welcome` if no one is signed in (`useRequireAuth`), which
  also fixes the "typed a protected URL directly while signed out" gap the routing previously had.

One known gap remains: the Google/Apple buttons on the auth screens are UI-only stubs with no real
OAuth popup flow wired up yet.
