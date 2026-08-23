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

Downstream stages (`02-plan`, `03-task`, `02-design/02-technical`, `03-testing`, `04-retrospectives`)
are scaffolded but not the current priority — don't populate them speculatively; let them get filled
in once the backlog is actually picked up for planning/build.

`index.md` in each `docs/` folder is a **structural description of the folder's purpose only** — it
is not where actual content goes. Add real documents as new files alongside `index.md`, never by
overwriting it.

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
   below) rather than hand-editing them out of sync with the spec.
5. Summarize the work done in `docs/05-log/{YYYYMMDD}-log.md` (create if it doesn't exist for that
   date; append if it does).

### Product Backlog & Feature List (`backlog.md`)

A single markdown file in `docs/01-requirements/backlog.md`: one combined summary table across all
epics (Feature ID, name, Epic, **MoSCoW Priority**, related `REQ-xx`, linked spec doc), followed by
a full description of each feature below the table (why it has its priority, what it does, how it
connects to other features).

### User Journeys (`docs/02-design/01-prototypes/user-journeys.md`)

One entry per feature, always in this order: Mermaid diagram first, then a description that walks
through the diagram in the same order with an explicit `REQ-xx` mapping per step, then Actor/
Persona, Goal, Trigger, Preconditions, Success State, Alt/Edge Cases. Gaps that don't affect a
Must/Should feature's structure are listed in an "Open Questions" section rather than guessed.

### Language

Existing documentation content (all `index.md` files, and any requirement/backlog/journey files) is
written in **Thai**, matching the project's working language. Write new content in Thai, with
English technical terms where natural (e.g. streak, wearable, deficit, TDEE). This `CLAUDE.md` file
itself stays in English, as instructions for Claude Code.

### Automation for this workflow

The requirement → backlog → user journey pipeline is automated:

- Skill `feature-list-journey` (`.claude/skills/feature-list-journey/SKILL.md`) — the methodology:
  audit `01-spec/` for gaps first (asking the user, with ≥3 options and a recommendation, whenever a
  gap would materially change a Must/Should feature's journey), then produce/update `backlog.md` and
  `user-journeys.md` in the formats described above.
- Agent `feature-journey-writer` (`.claude/agents/feature-journey-writer.md`) — applies the skill.

Prefer invoking this skill/agent over hand-editing `backlog.md` or `user-journeys.md` directly. If
the conventions above change, update the skill/agent files too, not just this section.

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
   - `01-prototypes/` — UI/UX prototypes, wireframes, user flow — currently holds `user-journeys.md`
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
