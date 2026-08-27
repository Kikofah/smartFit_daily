# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains no application source code, package manifest, or build/test
tooling. It is an **Obsidian vault** (see `.obsidian/`, gitignored) used purely for project
documentation. There are no commands to build, lint, or test yet — when code is added, this file
should be updated with the actual commands (build/lint/test/single-test) and a description of the
real architecture.

## Current focus: Requirements, Backlog & User Journeys

Work so far has moved through the first two stages of the documentation pipeline:

- `docs/01-requirements/01-spec/` — one **Requirements** doc per epic (Onboarding & Personalization,
  Daily YouTube Recommendation, Planner & Logging, Smart Integrations), each with scope, business
  rules (`REQ-01`…`REQ-13`), acceptance criteria, confirmed decisions, and open points.
- `docs/01-requirements/backlog.md` — the **Product Backlog**: a single summary table of every
  feature (`ONB-1`…`INT-3`) with its Epic, MoSCoW priority, related `REQ-xx`, and linked spec doc,
  followed by a full description of each feature.
- `docs/02-design/01-prototypes/user-journeys.md` — the **User Journey** for every feature: a
  Mermaid diagram first, then a step-by-step walkthrough in the same order with a `REQ-xx` mapping
  per step, then Actor/Goal/Trigger/Preconditions/Success State/Alt-Edge Cases.
- `docs/02-design/01-prototypes/DESIGN.md` — the **Design System**: Brand Identity & CI, Design
  Tokens (colors, typography, spacing), UI Components & Patterns, and UX Guidelines & Rules, in an
  Earth Tone + Minimalist + Muji-inspired style. Check it before designing any new screen/component.

Downstream stages (`02-plan`, `03-task`, `02-design/02-technical`, `03-testing`, `04-retrospectives`)
are scaffolded but not the current priority — don't populate them speculatively; let them get filled
in once the backlog is actually picked up for planning/build.

`index.md` in each `docs/` folder is a **structural description of the folder's purpose only** — it
is not where actual content goes. Add real documents as new files alongside `index.md`, never by
overwriting it.

### Keeping Requirement, Feature List/Backlog, and User Journey consistent

These three layers must always agree and stay current: **Requirement** (`01-spec/*.md`, the source
of truth), **Product Backlog / Feature List** (`backlog.md`), and **User Journey**
(`user-journeys.md`). Trigger a consistency check/update whenever *any one* of them changes — not
just when a spec doc changes: a requirement doc is created/edited, `backlog.md` or
`user-journeys.md` is edited directly (this can introduce drift from the spec — never assume it's
still in sync), or the user directly asks to audit/create/update any of the three.

1. If the feature being asked about has no corresponding doc yet in `docs/01-requirements/01-spec/`,
   write that requirement doc first (see "Requirement workflow" below).
2. Invoke the `feature-list-journey` skill (`.claude/skills/feature-list-journey/SKILL.md`) or the
   `feature-journey-writer` agent (`.claude/agents/feature-journey-writer.md`) to do the actual
   work — don't hand-edit `backlog.md` or `user-journeys.md` directly outside of that workflow,
   since it's what audits all three layers for REQ coverage, Feature ID parity, and fact
   consistency, and reconciles whichever is out of date.
3. When the audit finds spec and a downstream doc directly contradicting each other, it must stop
   and ask the user — with **at least 3 options** (e.g. keep the spec's version, keep the
   downstream version, or a third reconciling option), the **reasoning/pros/cons of each**, and
   **one recommended option with its rationale** — rather than silently picking a side. A doc that's
   merely stale (spec changed, downstream hasn't caught up yet) gets updated directly, no need to
   ask. Once the user answers a real conflict, the decision is recorded in the owning spec doc's
   "ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว" section first, then referenced from `backlog.md`/
   `user-journeys.md` — never written there as the source. Minor gaps that don't affect a Must/
   Should feature's structure go in an "Open Questions" / "จุดที่ยังไม่ได้ระบุ" section instead.
4. Required output formats (do not deviate without updating the skill/agent too):
   - `backlog.md`: one combined summary table across **all** epics at the top (Feature ID, name,
     Epic, **MoSCoW Priority**, related `REQ-xx`, linked spec doc), followed by a full description
     of each feature below the table (why it has its priority, what it does, how it connects to
     other features).
   - `user-journeys.md`: one entry per feature, always **Mermaid diagram first**, then a
     description that walks through the diagram in the same order with an explicit `REQ-xx`
     mapping on every step, then Actor/Persona, Goal, Trigger, Preconditions, Success State,
     Alt/Edge Cases.
5. Every `REQ-xx` across all of `01-spec/` must be traceable to at least one feature in both
   `backlog.md` and `user-journeys.md`, with the same Feature ID set in both places. All three
   layers must cross-link to each other.

### Requirement workflow (`01-spec/`)

1. File name: `{YYYYMMDD}-{RUNNING_NO}-{short-topic-slug}.md`, e.g.
   `20260823-01-onboarding-personalization.md`. `RUNNING_NO` is a 2-digit global sequence (`01`,
   `02`, ...), not reset per day. Each file corresponds to one epic; a genuinely new, unrelated
   feature area gets its own file rather than being appended to an existing epic's doc.
2. Before writing a new requirement, check existing files in `01-spec/` for overlap. If the new
   requirement references or overlaps an existing one, explicitly decide (and record in the new
   doc, under a "ความสัมพันธ์กับเอกสารอื่น" section) whether it should be merged into the existing
   doc or kept as a separate one.
3. If anything about the requirement is ambiguous or has multiple reasonable designs, suggest a
   recommendation and ask the user before finalizing — don't silently assume. Anything asked and
   resolved goes in a "ข้อสมมติฐาน/การตัดสินใจที่ยืนยันแล้ว" section; anything still unresolved goes
   in a "จุดที่ยังไม่ได้ระบุ / ควรยืนยันเพิ่มเติม" section, so it isn't silently dropped.
4. After creating/updating a requirement doc, update `docs/01-requirements/backlog.md` and
   `docs/02-design/01-prototypes/user-journeys.md` via the `feature-list-journey` skill/agent (see
   "Keeping Requirement, Feature List/Backlog, and User Journey consistent" above) rather than
   hand-editing them out of sync with the spec.
5. Summarize the work done in `docs/05-log/{YYYYMMDD}-log.md` (create if it doesn't exist for that
   date; append if it does).

### Building HTML prototypes

Screen-level prototypes live in versioned folders `docs/02-design/01-prototypes/v{N}/` (`v1`, `v2`,
...), each a self-contained set of HTML files. Never hand-build these — invoke the
`prototype-builder` skill (`.claude/skills/prototype-builder/SKILL.md`) or `prototype-writer` agent
(`.claude/agents/prototype-writer.md`), which:

1. Combines all four sources for whatever's in scope (default: every feature; can be narrowed to a
   Feature ID/Epic/screen) — `01-spec/`, `backlog.md`, `user-journeys.md`, and `DESIGN.md` — never
   just one of them.
2. Refuses to guess styling: if `DESIGN.md` doesn't exist yet, it stops and asks the user to help
   create it (color tone, style direction, reference images/logo) before building anything.
3. Always proposes the screen list/plan and waits for the user to confirm (or request changes)
   before creating any file.
4. On every re-run where a version folder already exists, always asks the user whether to create a
   new version (`v{N+1}`) or edit the latest one (`v{N}`) — with a recommendation and its
   reasoning (new version for a new/changed requirement or a change worth comparing against the
   old one; edit-in-place for a small fix to a not-yet-reviewed version) — never decides this
   silently, even when it has a clear recommendation.
5. Uses the ask-user protocol (≥3 options, pros/cons, one recommendation) for any other ambiguity —
   e.g. a layout the User Journey doesn't specify in enough detail, or a component/token `DESIGN.md`
   doesn't have yet.

### Language

Existing documentation content (all `index.md` files, and any requirement/backlog/journey files) is
written in **Thai**, matching the project's working language. Write new content in Thai, with
English technical terms where natural (e.g. streak, wearable, deficit, TDEE). This `CLAUDE.md` file
itself stays in English, as instructions for Claude Code.

## Documentation structure

The `docs/` folder follows a fixed, numbered pipeline convention (same as this user's other
projects). Each stage feeds into the next, and every folder's `index.md` explains its purpose and
links to its upstream/downstream neighbors — read the relevant `index.md` before adding a document
to make sure it goes in the right place:

1. `docs/01-requirements/` — requirements:
   - `01-spec/` — **Requirements** (see above), one file per epic
   - `backlog.md` — **Product Backlog / Feature List** (see above; not a subfolder, a single file)
   - `02-plan/` — currently unused (roadmap/phasing, once picked up)
   - `03-task/` — task breakdown derived from the backlog (concrete to-dos, status, owners)
2. `docs/02-design/` — design derived from requirements:
   - `01-prototypes/` — UI/UX prototypes, wireframes, user flow, design system — holds
     `user-journeys.md`, `DESIGN.md`, and versioned HTML prototype folders `v1/`, `v2/`, ...
   - `02-technical/` — technical design: architecture, database schema, API design, tech choices
3. `docs/03-testing/` — testing derived from design:
   - `01-test-plan/` — test cases/scenarios, test data, in/out of scope
   - `02-test-result/` — actual pass/fail results and bugs found
4. `docs/04-retrospectives/` — retrospectives per phase/sprint/milestone (what went well, what to
   improve, action items), informed by test results and the log
5. `docs/05-log/` — chronological changelog/decision log of significant project events
6. `docs/00-archived/` — superseded or cancelled documents; **never delete a doc directly, move it
   here instead** to preserve decision history

When adding project documentation, place it in the stage-appropriate folder rather than at the repo
root, and follow the upstream/downstream references noted in each `index.md`.
