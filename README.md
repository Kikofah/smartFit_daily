# smartFit_daily

A daily fitness app: personalized calorie targets, YouTube workout recommendations,
weekly planning with streak tracking, and optional wearable/smart-scale integrations.

## Repository layout

This is an npm-workspaces monorepo:

- **`apps/mobile/`** — React Native + Expo client (TypeScript, Expo Router). Screens mirror
  [`docs/02-design/01-prototypes/v1/`](docs/02-design/01-prototypes/v1/).
- **`apps/functions/`** — Firebase Cloud Functions backend (Node.js + TypeScript), one folder
  per conceptual component from
  [`high-level-architecture.md`](docs/02-design/02-technical/high-level-architecture.md#3-conceptual-components).
- **`packages/shared-types/`** — TypeScript types shared by both apps, mirroring
  [`database-schema.md`](docs/02-design/02-technical/database-schema.md)'s conceptual entities.
- **`docs/`** — the full documentation pipeline (requirements → design → technical → testing).
  Start at [`docs/01-requirements/01-spec/index.md`](docs/01-requirements/01-spec/index.md) if
  you're new here — every folder has its own `index.md` explaining its purpose.

## Getting started

```bash
npm install
npm run mobile           # starts the Expo dev server
npm run functions:serve  # builds + starts the Firebase emulator (functions + firestore)
```

Copy `.firebaserc`'s `default` project id to a real Firebase project before deploying, and set
the `EXPO_PUBLIC_FIREBASE_*` environment variables the mobile app reads in
`apps/mobile/src/services/firebase.ts`.

## Status

Application code was scaffolded on 2026-08-29, following the stack decided in
[`tech-stack.md`](docs/02-design/02-technical/tech-stack.md). Most Cloud Functions and screens
are stubs (see inline `TODO`s) — the documentation in `docs/` remains the source of truth for
business rules, not the code comments.
