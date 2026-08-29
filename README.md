# smartFit_daily

A daily fitness app: personalized calorie targets, YouTube workout recommendations,
weekly planning with streak tracking, and optional wearable/smart-scale integrations.

## Repository layout

- **`docs/`** — the full documentation pipeline (requirements → design → technical → testing).
  Start at [`docs/01-requirements/01-spec/index.md`](docs/01-requirements/01-spec/index.md) if
  you're new here — every folder has its own `index.md` explaining its purpose.
- **`smartfit_daily_app/`** — the application codebase, an npm-workspaces monorepo:
  - **`apps/mobile/`** — React Native + Expo client (TypeScript, Expo Router). Screens mirror
    [`docs/02-design/01-prototypes/v1/`](docs/02-design/01-prototypes/v1/).
  - **`apps/functions/`** — Firebase Cloud Functions backend (Node.js + TypeScript), one folder
    per conceptual component from
    [`high-level-architecture.md`](docs/02-design/02-technical/high-level-architecture.md#3-conceptual-components).
  - **`packages/shared-types/`** — TypeScript types shared by both apps, mirroring
    [`database-schema.md`](docs/02-design/02-technical/database-schema.md)'s conceptual entities.

## Getting started

```bash
cd smartfit_daily_app
npm install
npm run mobile           # starts the Expo dev server
npm run functions:serve  # builds + starts the Firebase emulator (functions + firestore)
```

Copy `smartfit_daily_app/.firebaserc`'s `default` project id to a real Firebase project before
deploying, and set the `EXPO_PUBLIC_FIREBASE_*` environment variables the mobile app reads in
`smartfit_daily_app/apps/mobile/src/services/firebase.ts` (copy
`apps/mobile/.env.example` to `apps/mobile/.env`).

## Status

Application code was scaffolded on 2026-08-29, following the stack decided in
[`tech-stack.md`](docs/02-design/02-technical/tech-stack.md), and moved into
`smartfit_daily_app/` to keep it separate from the documentation pipeline. Most Cloud Functions
and screens are stubs (see inline `TODO`s) — the documentation in `docs/` remains the source of
truth for business rules, not the code comments.
