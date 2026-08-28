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

Downstream stages `02-plan`, `03-task`, and `04-retrospectives` are scaffolded but not the current
priority — don't populate them speculatively; let them get filled in once the backlog is actually
picked up for planning/build. `03-testing` and `02-design/02-technical` are empty of actual content
too, but unlike the others they already have a dedicated skill/agent ready to populate them (see
"Building the test suite" and "Building the High Level Architecture doc" below) — build into them
when actually asked, they just haven't been exercised much yet.

`index.md` in each `docs/` folder is a **structural description of the folder's purpose only** — it
is not where actual content goes. Add real documents as new files alongside `index.md`, never by
overwriting it.

### Skills & agents at a glance

Five skill/agent pairs automate this pipeline — never hand-write the files they own. Each is
detailed in its own subsection below; use this table to find the right one first.

| Skill (agent) | Produces | Use when |
|---|---|---|
| `feature-list-journey` (`feature-journey-writer`) | `backlog.md`, `user-journeys.md` | A requirement doc, `backlog.md`, or `user-journeys.md` changes, `prototype-builder`/`architecture-builder` flags a discrepancy, or you're asked to audit/create/update any of the three. Also audits (but never writes) whether `acceptance-criteria.md`/`test-plan.md`/`test-cases/*.md`/prototypes/the architecture doc went stale as a result, and tells you which sibling skill to run if so (see "Keeping Requirement, Feature List/Backlog, and User Journey consistent"). |
| `prototype-builder` (`prototype-writer`) | `docs/02-design/01-prototypes/v{N}/` (HTML) | Asked to build, mockup, or update a screen prototype, or to check whether an existing prototype is still consistent with the other six docs. Audits (but never writes) Requirement/Backlog/Feature List/User Journey/Acceptance Criteria/Test Case/Test Plan for drift, and hands any needed fix to whichever skill owns that file (see "Building HTML prototypes"). |
| `architecture-builder` (`architecture-writer`) | `docs/02-design/02-technical/high-level-architecture.md` | Asked to create, update, or audit the conceptual (stack-agnostic) High Level Architecture doc. Audits (but never writes) Requirement/Backlog/Feature List/User Journey/Prototype for drift, and hands any needed fix to whichever skill owns that file (see "Building the High Level Architecture doc"). |
| `test-suite-builder` (`test-suite-writer`) | `acceptance-criteria.md`, `test-plan.md`, `test-cases/{epic-slug}.md` | Asked to create/update/audit acceptance criteria, a test plan, or test cases, or when `feature-list-journey`/`prototype-builder` flags one as stale. Re-checks its own outputs against current upstream every run (see "Building the test suite"). |
| `pipeline-orchestrator` (`pipeline-runner`) | Chains `feature-list-journey` and `test-suite-builder` for one requirement | Asked to take a requirement (new or changed) all the way through Requirement → Backlog/Feature List/User Journey → Acceptance Criteria/Test Plan/Test Case in one continuous invocation, instead of running each skill separately (see "Running the full pipeline in one go"). Does not touch Prototype or the Architecture doc — both stay separate, explicitly-requested steps. |

Together `feature-list-journey`, `prototype-builder`, `architecture-builder`, and `test-suite-builder`
cover the full chain end to end — Requirement → Backlog/Feature List → User Journey → Prototype /
Architecture → Acceptance Criteria → Test Plan/Test Case — plus the cross-links between Prototype,
Architecture, and every other layer (a prototype or the architecture doc can each reveal something
no other doc captured yet, not just go stale from one). A change anywhere in it should eventually be
reflected everywhere connected to it. No skill writes another's files; each audits across the seams
it touches and tells you (or the right agent) which one to run next. `pipeline-orchestrator` doesn't
add new rules of its own — it just runs `feature-list-journey` then `test-suite-builder` back to
back for a given requirement so the user doesn't have to invoke each stage by hand.

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
   consistency, and reconciles whichever is out of date. After reconciling, it also checks (lightly,
   not a full audit) whether `acceptance-criteria.md`/`test-plan.md`/`test-cases/*.md` already exist
   and, if so, whether they're now stale relative to what just changed — it never edits those itself,
   it just says so in its report so `test-suite-builder` can be run next.
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

### Running the full pipeline in one go

The three steps above — write the Requirement doc, then run `feature-list-journey`, then run
`test-suite-builder` — are normally invoked one at a time. When the user wants a requirement (new or
changed) to flow all the way through to Backlog/Feature List/User Journey **and**
Acceptance Criteria/Test Plan/Test Case without asking for each stage separately, invoke the
`pipeline-orchestrator` skill (`.claude/skills/pipeline-orchestrator/SKILL.md`) or `pipeline-runner`
agent (`.claude/agents/pipeline-runner.md`) instead of doing the three steps manually.

`pipeline-orchestrator` has no rules of its own — it's a sequencer that re-reads `CLAUDE.md`'s
Requirement workflow (above) and the two skills' own files each time it runs, then does Stage 1
(Requirement) → Stage 2 (`feature-list-journey`'s full methodology) → Stage 3
(`test-suite-builder`'s full methodology) back to back for one requirement. It does not skip or
soften any stage's ask-user protocol — a stage that needs to stop and ask (ambiguous requirement,
spec/downstream contradiction, NFR bootstrap) still stops and asks, with the same ≥3-options/pros-
cons/recommendation format; the orchestrator only removes the need to manually invoke each stage.
It explicitly excludes Prototype — if Stage 2's freshness check finds a prototype has gone stale, it
says so in its report and recommends running `prototype-builder` separately, rather than doing that
work itself. For more than one distinct requirement in the same request, it runs one
`pipeline-runner` per requirement, sequentially (never in parallel, to avoid `RUNNING_NO`/Feature ID
collisions), and logs the whole run as one entry in `docs/05-log/{YYYYMMDD}-log.md`.

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
3. **Prototype Consistency Audit**: before proposing a build/update plan, if a prototype version
   already exists it audits each screen against Requirement, Backlog/Feature List, User Journey,
   Acceptance Criteria, Test Case, and Test Plan (skip whichever of the latter three don't exist
   yet) — not just DESIGN.md tokens. A screen that's simply stale gets updated through the normal
   build flow below. A screen that reveals something new no other doc captures, or that flatly
   contradicts one, is never resolved silently — it goes through the ask-user protocol (≥3 options:
   accept the prototype's version and update the source doc, rebuild the prototype to match the
   source doc, or flag as an open question) — and once decided, the fix for any file this skill
   doesn't own gets handed to whichever skill does (`feature-list-journey` for Requirement/Backlog/
   Feature List/User Journey, `test-suite-builder` for Acceptance Criteria/Test Plan/Test Case) as
   part of the same piece of work, not just a suggestion for later.
4. Always proposes the screen list/plan (including anything the audit found) and waits for the user
   to confirm (or request changes) before creating any file.
5. On every re-run where a version folder already exists, always asks the user whether to create a
   new version (`v{N+1}`) or edit the latest one (`v{N}`) — with a recommendation and its
   reasoning (new version for a new/changed requirement or a change worth comparing against the
   old one; edit-in-place for a small fix to a not-yet-reviewed version) — never decides this
   silently, even when it has a clear recommendation.
6. Uses the ask-user protocol (≥3 options, pros/cons, one recommendation) for any other ambiguity —
   e.g. a layout the User Journey doesn't specify in enough detail, or a component/token `DESIGN.md`
   doesn't have yet.

### Building the High Level Architecture doc

A single conceptual architecture doc, invoke the `architecture-builder` skill
(`.claude/skills/architecture-builder/SKILL.md`) or `architecture-writer` agent
(`.claude/agents/architecture-writer.md`) to create/update/audit it — never hand-write it:

- `docs/02-design/02-technical/high-level-architecture.md` — system context, conceptual
  components/modules (named by responsibility, not by framework), data flow per user journey
  (one Mermaid diagram per related group of journeys, each step mapped back to a `user-journeys.md`
  step number), conceptual data entities (no DB schema — no types/keys), external integration
  boundaries (YouTube, Health API/wearable, Bluetooth smart scale, tied to the relevant NFRs), and
  cross-cutting concerns referencing the NFR doc conceptually.

**The single rule that matters most for this doc: it must stay conceptual, never tied to a
technical stack.** No specific framework, database, cloud provider, language, or API style names —
describe everything by function/role instead (e.g. "mobile client", "a structured data store",
"server-side compute layer"). The one exception is an external system's name that a requirement
doc already fixes as a business fact (e.g. "YouTube" in REQ-04, "Apple Health/Google Health
Connect" in REQ-13) — those are documented as external integration boundaries, not as the team's
chosen stack. This doc is meant to precede whatever stack-specific documents eventually land
alongside it in `02-technical/` (database schema, API design, tech choices) once the team picks a
stack — it is not those documents.

It's a single file, not versioned like the prototypes — update it in place. Default scope is the
entire backlog; it can be narrowed to a Feature ID, an Epic, or one section of the doc. Like
`prototype-builder`, it treats `01-spec/` (including the NFR doc), `backlog.md`, and
`user-journeys.md` as read-only upstream, and only informationally references the prototype
(`docs/02-design/01-prototypes/v*/`) if one exists — it never edits any of those, handing fixes to
`feature-list-journey` or `prototype-builder` instead. Always proposes a content outline (which
components, which data flows, which integration boundaries) for the user to confirm before writing.
Re-run this whenever `01-spec/`, `backlog.md`, or `user-journeys.md` changes, or when the doc has
been hand-edited directly — it audits itself for staleness/contradiction against those three (plus
a self-check that no stack-specific wording crept in) before writing anything, using the same
≥3-options/pros-cons/recommendation ask-user protocol as every other skill here for any real
ambiguity or conflict. This skill is **not** part of `pipeline-orchestrator` — same treatment as
Prototype, it stays a separate, explicitly-requested step.

### Building the test suite (Acceptance Criteria, Test Plan, Test Cases)

Three test artifacts, invoke the `test-suite-builder` skill (`.claude/skills/test-suite-builder/SKILL.md`)
or `test-suite-writer` agent (`.claude/agents/test-suite-writer.md`) to create/update them — never
hand-write them:

- `docs/01-requirements/acceptance-criteria.md` — Given-When-Then per backlog item (Feature ID),
  grouped by Epic. ID format `AC-{FeatureID}-{2-digit}`.
- `docs/03-testing/01-test-plan/test-plan.md` — one file for the whole project: scope, test types,
  environment, risk management, entry/exit criteria.
- `docs/03-testing/01-test-plan/test-cases/{epic-slug}.md` — one file per epic (slug matches the
  corresponding `01-spec/` file), step-by-step cases grouped by Feature ID, each with at minimum
  Test ID (`TC-{FeatureID}-{3-digit}`), name, pre-condition, steps, expected result, test data, and
  references (REQ-xx, AC ID, user journey section).

This skill/agent treats `01-spec/`, `backlog.md`, and `user-journeys.md` as **read-only upstream** —
if they're inconsistent with each other, that's `feature-list-journey`'s job to fix first, not this
one's. Its only two allowed writes to upstream are: a one-line link added to each `01-spec/*.md`'s
existing (checklist-style) "Acceptance Criteria" section pointing at the new
`acceptance-criteria.md` (kept as an informal summary, not removed), and creating a **new**
Non-Functional Requirement doc in `01-spec/` when one doesn't exist yet (see below) — never editing
an existing `01-spec/*.md`'s substantive content, `backlog.md`, or `user-journeys.md` otherwise.

Default scope is the entire backlog; it can be narrowed to a Feature ID, an Epic, or just one of the
three output documents. Because `test-plan.md` needs Non-Functional Requirements and none exist yet
in `01-spec/`, the first time it's built the skill must stop and ask the user (≥3 NFR-framing
options with pros/cons and a recommendation) before authoring a new
`01-spec/{YYYYMMDD}-{RUNNING_NO}-non-functional-requirements.md` doc to derive from — never
inventing NFR numbers directly inside `test-plan.md`. The same ask-user protocol (≥3 options,
pros/cons, one recommendation) applies to any other gap, e.g. an edge case implied by a test case
but not actually documented anywhere upstream — flag it, don't invent test coverage for undefined
behavior.

Re-run this whenever `01-spec/`, `backlog.md`, or `user-journeys.md` changes too — not just the
first time these three docs are built. If any of them already exist, the skill audits them for
staleness against current upstream *before* writing anything (Feature ID/REQ parity, new features
with no AC/test case yet, decision values that changed since the AC/test data was written, and
whether `test-plan.md`'s scope still matches current MoSCoW priorities) and fixes only what's
actually stale — never assume "no one told me anything changed" means it's still fresh.

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
   - `01-spec/` — **Requirements** (see above), one file per epic (plus, once bootstrapped, a
     Non-Functional Requirements doc — see "Building the test suite" below)
   - `backlog.md` — **Product Backlog / Feature List** (see above; not a subfolder, a single file)
   - `acceptance-criteria.md` — **Acceptance Criteria**, Given-When-Then per backlog item (see
     "Building the test suite" below; not a subfolder, a single file)
   - `02-plan/` — currently unused (roadmap/phasing, once picked up)
   - `03-task/` — task breakdown derived from the backlog (concrete to-dos, status, owners)
2. `docs/02-design/` — design derived from requirements:
   - `01-prototypes/` — UI/UX prototypes, wireframes, user flow, design system — holds
     `user-journeys.md`, `DESIGN.md`, and versioned HTML prototype folders `v1/`, `v2/`, ...
   - `02-technical/` — technical design: holds `high-level-architecture.md` (the conceptual,
     stack-agnostic architecture — see "Building the High Level Architecture doc" above), plus,
     once a stack is chosen, database schema/API design/tech-choice docs (not yet populated)
3. `docs/03-testing/` — testing derived from design:
   - `01-test-plan/` — holds `test-plan.md` (one file, whole-project test strategy) and
     `test-cases/{epic-slug}.md` (one file per epic) — see "Building the test suite" below
   - `02-test-result/` — actual pass/fail results and bugs found
4. `docs/04-retrospectives/` — retrospectives per phase/sprint/milestone (what went well, what to
   improve, action items), informed by test results and the log
5. `docs/05-log/` — chronological changelog/decision log of significant project events
6. `docs/00-archived/` — superseded or cancelled documents; **never delete a doc directly, move it
   here instead** to preserve decision history

When adding project documentation, place it in the stage-appropriate folder rather than at the repo
root, and follow the upstream/downstream references noted in each `index.md`.
