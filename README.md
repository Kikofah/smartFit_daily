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
`apps/web/client/.env` (copy from `.env.example`, `VITE_FIREBASE_*`) and
`apps/mobile/.env` (copy from `.env.example`, `EXPO_PUBLIC_FIREBASE_*` — this app also needs
`EXPO_PUBLIC_API_BASE_URL` pointing at wherever `apps/web`'s Express server runs, since it isn't
served by the same origin the way the web client is).

## Status

Application code was scaffolded on 2026-08-29 following the stack decided in
[`tech-stack.md`](docs/02-design/02-technical/tech-stack.md) (React Native + Expo + Firebase
Cloud Functions), then re-architected the same day to Express + a web-first client after a
follow-up decision to drop Cloud Functions and keep React Native only for INT-2/INT-3. Most
routes and screens are stubs (see inline `TODO`s) — the documentation in `docs/` remains the
source of truth for business rules, not the code comments. `tech-stack.md` itself has not yet
been updated to reflect this change — treat the code as ahead of the docs on this point.
