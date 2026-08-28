# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains no application source code, package manifest, or build/test
tooling. It is an **Obsidian vault** (see `.obsidian/`, gitignored) used purely for project
documentation. There are no commands to build, lint, or test yet — when code is added, this file
should be updated with the actual commands (build/lint/test/single-test) and a description of the
real architecture.

## Documentation pipeline status

The pipeline has moved well past initial requirements — most stages now have real content, each
owned by a dedicated skill/agent pair (see "Skills & agents at a glance" below for which is which).
Re-running a skill on an already-populated stage audits and updates it; it doesn't start from
scratch.

**Populated with real content:**

- `docs/01-requirements/01-spec/` — 5 Requirement docs: one per epic (Onboarding & Personalization,
  Daily YouTube Recommendation, Planner & Logging, Smart Integrations) plus a Non-Functional
  Requirements doc, each with scope, business rules (`REQ-01`…`REQ-13`, `NFR-01`…`NFR-08`), confirmed
  decisions, and open points.
- `docs/01-requirements/backlog.md` — the **Product Backlog**: a single summary table of every
  feature (`ONB-1`…`INT-3`) with its Epic, MoSCoW priority, related `REQ-xx`, and linked spec doc,
  followed by a full description of each feature.
- `docs/01-requirements/acceptance-criteria.md` — Given-When-Then per backlog item.
- `docs/02-design/01-prototypes/user-journeys.md` — the **User Journey** for every feature: a
  Mermaid diagram first, then a step-by-step walkthrough in the same order with a `REQ-xx` mapping
  per step, then Actor/Goal/Trigger/Preconditions/Success State/Alt-Edge Cases.
- `docs/02-design/01-prototypes/DESIGN.md` — the **Design System**: Brand Identity & CI, Design
  Tokens (colors, typography, spacing), UI Components & Patterns, and UX Guidelines & Rules, in an
  Earth Tone + Minimalist + Muji-inspired style. Check it before designing any new screen/component.
- `docs/02-design/01-prototypes/v1/` — 12 self-contained HTML screen prototypes covering every
  feature.
- `docs/02-design/02-technical/high-level-architecture.md` — conceptual, stack-agnostic system
  architecture.
- `docs/02-design/02-technical/api-spec.md` and `database-schema.md` — conceptual API operations and
  a logical/relational data model, one level more concrete than the HLA doc.
- `docs/02-design/02-technical/detailed-design/{epic-slug}.md` — sequence diagrams, state diagrams,
  and algorithm write-ups, one file per epic.
- `docs/02-design/02-technical/tech-stack.md` — the one genuinely stack-specific doc in
  `02-technical/` (React Native + Expo, Supabase/PostgreSQL, chosen via an intensive Discovery
  Questionnaire on 2026-08-28), distinct from the conceptual docs that precede it.
- `docs/03-testing/01-test-plan/test-plan.md` and `test-cases/{epic-slug}.md` — project-wide test
  strategy and step-by-step test cases.
- `docs/01-requirements/02-plan/release-plan.md` — 3 phases (MVP Phase / Next Phase / Future Phase)
  derived from MoSCoW + verified dependency (no Must feature depends on a Should/Could one), with a
  Mermaid dependency map — no time estimates by design.
- `docs/01-requirements/03-task/{phase-slug}.md` — one task per Feature ID per phase, status-only
  (no Owner field), covering all 13 Feature IDs across the 3 phases.

**Still scaffolded, not populated — don't fill speculatively, wait until actually asked:**

- `docs/03-testing/02-test-result/` — actual pass/fail results and bugs found, once tests are
  executed.
- `docs/04-retrospectives/` — once a phase/sprint/milestone actually completes.

`docs/05-log/{YYYYMMDD}-log.md` is the ongoing changelog — every skill run above should summarize
its work there (create the file for that date if it doesn't exist yet, append if it does).

`index.md` in each `docs/` folder is a **structural description of the folder's purpose only** — it
is not where actual content goes. Add real documents as new files alongside `index.md`, never by
overwriting it.

### Skills & agents at a glance

Ten skill/agent pairs automate this pipeline — never hand-write the files they own. Each is
detailed in its own subsection below; use this table to find the right one first.

| Skill (agent) | Produces | Use when |
|---|---|---|
| `feature-list-journey` (`feature-journey-writer`) | `backlog.md`, `user-journeys.md` | A requirement doc, `backlog.md`, or `user-journeys.md` changes, `prototype-builder`/`architecture-builder`/`api-db-spec-builder`/`detailed-design-builder`/`plan-task-builder` flags a discrepancy, or you're asked to audit/create/update any of the three. Also audits (but never writes) whether `acceptance-criteria.md`/`test-plan.md`/`test-cases/*.md`/prototypes/the architecture doc/the API-DB spec docs/the detailed design docs/the release plan & task breakdown docs went stale as a result, and tells you which sibling skill to run if so (see "Keeping Requirement, Feature List/Backlog, and User Journey consistent"). |
| `prototype-builder` (`prototype-writer`) | `docs/02-design/01-prototypes/v{N}/` (HTML) | Asked to build, mockup, or update a screen prototype, or to check whether an existing prototype is still consistent with the other six docs. Audits (but never writes) Requirement/Backlog/Feature List/User Journey/Acceptance Criteria/Test Case/Test Plan for drift, and hands any needed fix to whichever skill owns that file (see "Building HTML prototypes"). |
| `architecture-builder` (`architecture-writer`) | `docs/02-design/02-technical/high-level-architecture.md` | Asked to create, update, or audit the conceptual (stack-agnostic) High Level Architecture doc. Audits (but never writes) Requirement/Backlog/Feature List/User Journey/Prototype for drift, and hands any needed fix to whichever skill owns that file (see "Building the High Level Architecture doc"). |
| `api-db-spec-builder` (`api-db-spec-writer`) | `docs/02-design/02-technical/api-spec.md`, `docs/02-design/02-technical/database-schema.md` | Asked to create, update, or audit the conceptual API Spec (REST-style convention) or Database Schema/ER model (logical data types). Requires `high-level-architecture.md` to exist first — refuses to invent components/entities not already in it. Audits (but never writes) the HLA doc/Requirement/Backlog/User Journey/Prototype for drift, and hands any needed fix to whichever skill owns that file (see "Building the API Spec & Database Schema"). |
| `detailed-design-builder` (`detailed-design-writer`) | `docs/02-design/02-technical/detailed-design/{epic-slug}.md` (one per epic) | Asked to create, update, or audit the conceptual Detailed Design docs — Mermaid sequence diagrams (mandatory), state diagrams, and algorithm write-ups. Requires `high-level-architecture.md`, `api-spec.md`, and `database-schema.md` to all exist first — refuses to invent components/operations/tables not already in them. Audits (but never writes) those three plus Requirement/Backlog/User Journey/Prototype for drift, and hands any needed fix to whichever skill owns that file (see "Building the Detailed Design docs"). |
| `tech-stack-builder` (`tech-stack-writer`) | `docs/02-design/02-technical/tech-stack.md` | Asked to create, update, or audit the Tech Stack doc, or to help choose an appropriate technology stack. The one skill that picks real technologies rather than staying conceptual — runs an intensive Discovery Questionnaire with the user first (full on first run, only affected areas on re-runs). Requires the HLA, API Spec, Database Schema, and Detailed Design docs to all exist first. Never silently changes an actual stack choice, even for "merely stale" drift — always asks the user first, since real migration cost is involved (see "Building the Tech Stack doc"). |
| `test-suite-builder` (`test-suite-writer`) | `acceptance-criteria.md`, `test-plan.md`, `test-cases/{epic-slug}.md` | Asked to create/update/audit acceptance criteria, a test plan, or test cases, or when `feature-list-journey`/`prototype-builder` flags one as stale. Re-checks its own outputs against current upstream every run (see "Building the test suite"). |
| `plan-task-builder` (`plan-task-writer`) | `docs/01-requirements/02-plan/release-plan.md`, `docs/01-requirements/03-task/{phase-slug}.md` | Asked to create, update, or audit the release/phase plan or the per-phase task breakdown. Divides the backlog into phases with a hybrid MoSCoW + dependency-aware strategy (dependency signals come only from `01-spec/` business rules or the HLA's component relationships — never invented), then lists one task per Feature ID by default (finer sub-tasks only when scope narrows to one feature and Detailed Design exists for it). No time estimates and no Owner column — status-only (Not Started/In Progress/Done), since there's no real team or velocity data yet. Requires Requirement/Backlog/User Journey to exist first; everything else (HLA, Detailed Design, Acceptance Criteria, Test Plan) is optional context. Audits (but never writes) Requirement/Backlog/User Journey for drift, and hands any needed fix to `feature-list-journey` (see "Building the Plan/Phase/Release & Task Breakdown docs"). |
| `pipeline-orchestrator` (`pipeline-runner`) | Chains `feature-list-journey` and `test-suite-builder` for one requirement | Asked to take a requirement (new or changed) all the way through Requirement → Backlog/Feature List/User Journey → Acceptance Criteria/Test Plan/Test Case in one continuous invocation, instead of running each skill separately (see "Running the full pipeline in one go"). Does not touch Prototype, the Architecture doc, the API/DB spec docs, the Detailed Design docs, the Tech Stack doc, or the Plan/Task Breakdown docs — all six stay separate, explicitly-requested steps. |
| `technical-design-orchestrator` (`technical-design-runner`) | Chains `architecture-builder` → `api-db-spec-builder` → `detailed-design-builder`, then an audit-only NFR Review | Asked to run the Architecture → API/DB Spec → Detailed Design chain continuously instead of invoking each separately, with a Non-Functional Requirements Review tacked on at the end (see "Running the technical design pipeline in one go"). The NFR Review stage is this orchestrator's own methodology (no skill owns "NFR review" outright) — it reports gaps against the just-updated HLA/Detailed Design/DESIGN.md/tech-stack.md but never edits the NFR doc; running `test-suite-builder` to apply anything found is a separate, explicit choice. Does not touch Prototype or Tech Stack, and is not a substitute for `pipeline-orchestrator` (different chain entirely). |

Together `feature-list-journey`, `prototype-builder`, `architecture-builder`, `api-db-spec-builder`,
`detailed-design-builder`, `tech-stack-builder`, `test-suite-builder`, and `plan-task-builder` cover
the full chain end to end — Requirement → Backlog/Feature List → User Journey → Prototype /
Architecture → API Spec/Database Schema → Detailed Design → Tech Stack → Acceptance Criteria → Test
Plan/Test Case, plus Backlog/Feature List → Release Plan/Phase → Task Breakdown as a parallel
downstream branch — plus the cross-links between Prototype, Architecture, the API/DB spec docs, the
Detailed Design docs, the Tech Stack doc, the Plan/Task Breakdown docs, and every other layer (each
can reveal something no other doc captured yet, not just go stale from one). A change anywhere in it
should eventually be reflected everywhere connected to it. No skill writes another's files; each
audits across the seams it touches and tells you (or the right agent) which one to run next.
`tech-stack-builder` is the one exception to "audits auto-fix merely-stale drift" — because it's the
only skill choosing real technology, it always asks before changing an actual stack recommendation,
even when the drift is otherwise unremarkable. `pipeline-orchestrator` doesn't add new rules of its
own — it just runs `feature-list-journey` then `test-suite-builder` back to back for a given
requirement so the user doesn't have to invoke each stage by hand. `technical-design-orchestrator`
similarly sequences `architecture-builder` → `api-db-spec-builder` → `detailed-design-builder` without
adding rules of its own to those three, but its 4th stage (NFR Review) is genuinely new methodology —
see "Running the technical design pipeline in one go" below.

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

### Running the technical design pipeline in one go

Architecture → API Spec/Database Schema → Detailed Design are normally invoked one at a time, each a
separate, explicitly-requested step (see their own sections below). When the user wants that chain to
run continuously — plus a check of whether the NFR doc needs updating afterward — without invoking
`architecture-builder`, `api-db-spec-builder`, and `detailed-design-builder` by hand, invoke the
`technical-design-orchestrator` skill (`.claude/skills/technical-design-orchestrator/SKILL.md`) or
`technical-design-runner` agent (`.claude/agents/technical-design-runner.md`) instead.

Like `pipeline-orchestrator`, the first 3 stages have no rules of their own — it re-reads each
builder's skill/agent files every run and applies their full methodology (audit, propose outline,
wait for confirmation, write) in sequence: HLA → API Spec/Database Schema → Detailed Design. It
doesn't skip or soften any stage's ask-user protocol. Defaults to the entire backlog, accepts a
narrower scope (Feature ID/Epic) matching the three builders' own convention — not a raw requirement
input like `pipeline-orchestrator`, since these three work from Requirement/Backlog/User Journey that
already exist rather than authoring a new requirement.

**Stage 4 (Non-Functional Requirements Review) is new** — no other skill in this pipeline owns
"reviewing whether the NFR doc needs updating." It's audit-only by design (confirmed with the user
2026-08-28): it reads the just-updated HLA §6/§7, Detailed Design's Stack Mapping Appendix, DESIGN.md
§4, and tech-stack.md's Discovery Questionnaire answers for NFR-relevant content not yet formalized —
the same kind of check that surfaced NFR-09/10/11 earlier — and reports findings in three buckets
(stale content, new candidates with clear evidence, genuinely unclear points needing the ask-user
protocol). It **never edits `01-spec/`** itself; running `test-suite-builder` to actually apply any
finding is a separate choice the user makes after reading the report. If no NFR doc exists yet, this
stage is skipped with a note to run `test-suite-builder`'s NFR bootstrap first.

Not a substitute for `pipeline-orchestrator` (different chain: that one is Requirement → Backlog/
Feature List/User Journey → Acceptance Criteria/Test Plan/Test Case). Excludes Prototype and Tech
Stack — both stay separate, explicitly-requested steps, same treatment as everywhere else in this
pipeline.

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
chosen stack. This doc is meant to precede the next layer down — the conceptual API Spec and
Database Schema built by `api-db-spec-builder` (see "Building the API Spec & Database Schema"
below) — and, further out, whatever genuinely stack-specific documents (tech choices, actual DBMS/
framework decisions) eventually land in `02-technical/` once the team picks a stack. It is not
those documents.

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

**Stack Mapping Appendix** (added 2026-08-28, once `tech-stack.md` exists): a final "ภาคผนวก: Stack
Mapping" section is the one place in this doc allowed to name real technologies — it mirrors (never
independently edits) the relevant slice of `tech-stack.md`'s § Mapping from Conceptual Docs →
Concrete Stack, mapping each Conceptual Component to its real implementation. It's entirely optional
— skipped, not a gap, when `tech-stack.md` doesn't exist yet, so this skill stays fully usable in a
project that never adopts a concrete stack. Drift between the appendix and `tech-stack.md` is
auto-fixable without the ask-user protocol, since it's a pure mechanical re-sync of a decision made
elsewhere, not a new decision.

### Building the API Spec & Database Schema

Two conceptual docs one level more concrete than the HLA doc, invoke the `api-db-spec-builder` skill
(`.claude/skills/api-db-spec-builder/SKILL.md`) or `api-db-spec-writer` agent
(`.claude/agents/api-db-spec-writer.md`) to create/update/audit them — never hand-write them:

- `docs/02-design/02-technical/api-spec.md` — API operations grouped by the HLA's conceptual
  components, each with an HTTP verb + conceptual resource path, request/response payloads
  referencing the HLA's data entities, error/edge cases, and relevant NFRs.
- `docs/02-design/02-technical/database-schema.md` — a logical/relational data model derived 1:1
  (or documented if not) from the HLA's conceptual data entities: a Mermaid `erDiagram`, per-table
  column details (logical types only), relationships/constraints (including which business rules
  can't be enforced at the schema level and belong to which HLA component instead), and optional
  access-pattern notes.

**These stay conceptual like the HLA doc, with exactly two allowed exceptions the user confirmed:**
API Spec may use a REST-style convention (HTTP verb + resource path + status code) as a neutral
lingua franca — no framework route syntax, no real domain, no named auth mechanism. Database Schema
may use logical/abstract data types (`string`, `integer`, `decimal`, `boolean`, `date`, `datetime`,
`enum`, `identifier`) — never a DBMS-specific type or syntax. Everything else follows the HLA doc's
no-stack-names rule, including the same external-system-name exception (YouTube, Apple Health/
Google Health Connect).

**Hard prerequisite**: `high-level-architecture.md` must already exist. If it doesn't, this skill
stops immediately and tells the user to run `architecture-builder` first — unlike `test-suite-builder`'s
NFR bootstrap, this skill is *not* allowed to create the HLA doc itself, since `architecture-builder`
owns it. Every operation and table must trace back to a component/data entity already in the HLA
doc; if a genuinely new one seems needed, that's flagged through the ask-user protocol with sending
it back to `architecture-builder` as one of the options, not invented directly here.

Both are single files, not versioned. Default scope is the entire HLA doc; can be narrowed to a
component, Feature ID, Epic, or just one of the two docs. Treats the HLA doc, `01-spec/` (including
the NFR doc), `backlog.md`, and `user-journeys.md` as read-only upstream, and only informationally
references the prototype if one exists — never edits any of those, handing fixes to
`architecture-builder`, `feature-list-journey`, or `prototype-builder` instead. Always proposes a
content outline (which operations, which tables, key relationships) for the user to confirm before
writing. Re-run this whenever the HLA doc, `01-spec/`, `backlog.md`, or `user-journeys.md` changes,
or when either doc has been hand-edited directly — it audits itself for staleness/contradiction
against those before writing anything, using the same ≥3-options/pros-cons/recommendation ask-user
protocol as every other skill here. Not part of `pipeline-orchestrator` — same treatment as
Prototype and the HLA doc, it stays a separate, explicitly-requested step.

**Stack Mapping Appendix** (added 2026-08-28, once `tech-stack.md` exists): both `api-spec.md` and
`database-schema.md` get their own final "ภาคผนวก: Stack Mapping" section — a third allowed exception
to the no-stack-names rule alongside REST convention and logical data types. `api-spec.md`'s mirrors
`tech-stack.md` § 6.3 (REST convention → real routing); `database-schema.md`'s mirrors § 6.2 (logical
type → the real DBMS column type). Both are skip-if-absent (not a gap) and auto-sync without the
ask-user protocol when `tech-stack.md` changes, same as the HLA doc's appendix.

### Building the Detailed Design docs

The next layer down from the API Spec/Database Schema, invoke the `detailed-design-builder` skill
(`.claude/skills/detailed-design-builder/SKILL.md`) or `detailed-design-writer` agent
(`.claude/agents/detailed-design-writer.md`) to create/update/audit them — never hand-write them:

- `docs/02-design/02-technical/detailed-design/{epic-slug}.md` (one file per epic, slug matching
  `01-spec/`/`test-cases/`) — grouped by Feature ID, each with a Mermaid `sequenceDiagram` (mandatory
  for every feature), a Mermaid `stateDiagram-v2` for entities with a meaningful state transition
  (not every feature needs one), and a step-by-step algorithm write-up for calculation-heavy features
  (TDEE, MET, safety floor, all-or-nothing logging, streak, forecast).

**Stays conceptual with no new exceptions** — unlike the API Spec/Database Schema doc, this one
doesn't need to ask for stack-adjacent allowances: sequence diagrams, state diagrams, and
plain-language algorithm steps are inherently technology-neutral notation already. Participants in a
sequence diagram must be a Conceptual Component from the HLA doc or a generic actor — never a named
framework/service. Algorithms are written as numbered natural-language/pseudocode steps, never real
code in any language.

**Hard prerequisite**: `high-level-architecture.md`, `api-spec.md`, and `database-schema.md` must
all already exist. If any is missing, this skill stops immediately and tells the user which upstream
skill to run first (`architecture-builder`, then `api-db-spec-builder`) — it is not allowed to create
any of them itself. Every participant, operation, table, and state referenced must trace back to
something already in those three docs; a genuinely new one gets flagged through the ask-user
protocol with sending it back to the owning skill as one of the options, not invented directly here.

One file per epic (not versioned). Default scope is the entire backlog; can be narrowed to a Feature
ID or an Epic. Treats the HLA doc, API Spec, Database Schema, `01-spec/` (including the NFR doc),
`backlog.md`, and `user-journeys.md` as read-only upstream, and only informationally references the
prototype if one exists — never edits any of those, handing fixes to `architecture-builder`,
`api-db-spec-builder`, `feature-list-journey`, or `prototype-builder` instead. Always proposes a
content outline (which features get a sequence diagram, which entities get a state diagram, which
features get an algorithm write-up) for the user to confirm before writing. Re-run this whenever any
of its three required upstream docs, `01-spec/`, `backlog.md`, or `user-journeys.md` changes, or
when a detailed-design doc has been hand-edited directly — it audits itself for staleness/
contradiction against all of those before writing anything, using the same
≥3-options/pros-cons/recommendation ask-user protocol as every other skill here. Not part of
`pipeline-orchestrator` — same treatment as Prototype, the HLA doc, and the API/DB spec docs, it
stays a separate, explicitly-requested step.

**Stack Mapping Appendix** (added 2026-08-28, once `tech-stack.md` exists): each per-epic file gets a
final "ภาคผนวก: Stack Mapping" section, its first-ever allowed exception to the no-stack-names rule
(this doc previously needed none, since sequence/state diagrams and pseudocode are inherently
stack-neutral). It mirrors the slice of `tech-stack.md` § 6.1 relevant to the Components appearing in
that epic's diagrams, and notes for each calculation-heavy feature whether execution is client-side
or via an Edge Function, per `tech-stack.md`'s NFR-01/NFR-03 rationale. Skip-if-absent (not a gap),
auto-syncs without the ask-user protocol.

### Building the Tech Stack doc

The one document in this pipeline that deliberately breaks from "stay conceptual" — invoke the
`tech-stack-builder` skill (`.claude/skills/tech-stack-builder/SKILL.md`) or `tech-stack-writer`
agent (`.claude/agents/tech-stack-writer.md`) to create/update/audit it, and to help the user
actually choose a stack — never hand-write it:

- `docs/02-design/02-technical/tech-stack.md` — real technology choices per layer (mobile/client,
  backend/API, database engine, authentication, hosting/infra, third-party integration setup,
  CI/CD & dev tooling), the Discovery Questionnaire answers they were derived from, rationale,
  alternatives considered, and — critically — a mapping from each conceptual doc's abstractions to
  the concrete stack (HLA components → real modules/services, `database-schema.md` logical types →
  the chosen DBMS's real column types, `api-spec.md`'s REST convention → the chosen framework's real
  routing).

**Every other document in `02-technical/` must stay conceptual with no stack names; this one must
have them.** Recommendations here name real frameworks, languages, database engines, and cloud
providers — vague functional language ("a mobile client") is a failure here, not a virtue.

**Hard prerequisite**: `high-level-architecture.md`, `api-spec.md`, `database-schema.md`, and
`detailed-design/*.md` must all already exist (all four, not just the first three) — if any is
missing, this skill stops immediately and tells the user which upstream skill to run first, in
order: `architecture-builder` → `api-db-spec-builder` → `detailed-design-builder`. It is not allowed
to create any of them itself.

**Runs an intensive Discovery Questionnaire before recommending anything — this is the one skill
here that asks proactively, not just when something is unclear**, because the context it needs
(team background, budget, timeline, compliance needs) doesn't exist in any project doc. On first run
(no `tech-stack.md` yet) it covers every dimension: platform targets, team background,
hosting/infra preference, backend approach preference (custom vs. Backend-as-a-Service), budget/
scale tier, timeline, data compliance/residency (ties to NFR-04/05/06), and offline support — spread
across multiple `AskUserQuestion` rounds (at most 4 questions each). On later re-runs, it only
re-asks the dimensions actually affected by whatever upstream changed, not the full questionnaire
again. For any single decision with more than one real option (e.g. native vs. cross-platform
mobile, custom backend vs. BaaS, SQL vs. NoSQL), it still proposes ≥3 named real technologies with
pros/cons and a recommendation rather than picking silently, even when one option looks technically
best — this is a decision the user has to own.

Single file, not versioned. Treats the HLA doc, API Spec, Database Schema, Detailed Design docs,
`01-spec/` (including the NFR doc), `backlog.md`, and `user-journeys.md` as read-only upstream, and
only informationally references the prototype if one exists — never edits any of those, handing
fixes to `architecture-builder`, `api-db-spec-builder`, `detailed-design-builder`, or
`feature-list-journey` instead. Always proposes the recommended stack for the user to confirm before
writing.

**The one skill in this pipeline that never silently auto-fixes "merely stale" drift.** Every other
skill here updates non-conflicting staleness on its own and only asks the user about genuine
contradictions or new information. `tech-stack-builder` is different: because changing a real
technology choice carries real migration cost, *any* upstream change that could plausibly affect an
actual stack choice (a new external integration the current stack doesn't support, an NFR change
that shifts a requirement, new scope needing a platform capability) gets routed back through a
targeted mini Discovery Questionnaire and the ask-user protocol — never updated on its own, even
when the "obvious" answer seems clear. Drift that's cosmetic only (a stale link, wording that no
longer matches but doesn't change the actual recommendation) is fine to fix directly. Not part of
`pipeline-orchestrator` — same treatment as the rest of `02-technical/`'s docs, it stays a separate,
explicitly-requested step.

**Bidirectional awareness with the Stack Mapping Appendices** (added 2026-08-28): the HLA doc, API
Spec, Database Schema, and Detailed Design docs each carry a "ภาคผนวก: Stack Mapping" section that
mirrors this doc's § Mapping from Conceptual Docs → Concrete Stack. When a run of this skill actually
changes that mapping (a different DBMS, a different routing convention, a different client-side/
server-side split), it flags in its report which of those appendices may now be stale and recommends
running the owning skill next — it never edits those files itself.

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

### Building the Plan/Phase/Release & Task Breakdown docs

Two more documents derived from the backlog, invoke the `plan-task-builder` skill
(`.claude/skills/plan-task-builder/SKILL.md`) or `plan-task-writer` agent
(`.claude/agents/plan-task-writer.md`) to create/update/audit them — never hand-write them:

- `docs/01-requirements/02-plan/release-plan.md` — divides the backlog into phases/releases using a
  **hybrid MoSCoW + dependency-aware strategy** (confirmed with the user 2026-08-28): MoSCoW sets the
  primary phase structure (Must → Should → Could), but a Should/Could feature that a Must feature
  actually depends on gets pulled forward. Per phase: objective, Feature IDs included, dependency
  notes, and Entry/Exit Criteria mirroring `test-plan.md`'s pattern, plus a Mermaid dependency map
  across phases.
- `docs/01-requirements/03-task/{phase-slug}.md` (one file per phase) — a task list for that phase,
  one task per Feature ID by default, with a Task ID, name, Feature ID/REQ references, and a
  **Status-only** field (Not Started/In Progress/Done, defaulting to Not Started on creation and
  never reset on a re-run unless the user explicitly asks) — no Owner column and no time estimates,
  since the project has no real team or velocity data yet.

**The rule that matters most for this pair: never invent a dependency, an estimate, or a sub-task
that isn't traceable to an existing document.** Cross-feature dependencies may only come from a
business rule in `01-spec/*.md` or from a Conceptual Component's "คุยกับ" relationship in
`high-level-architecture.md` §3 (if that doc exists) — guessing that two features are related is not
allowed. Time estimates are out of scope entirely (confirmed with the user 2026-08-28) — both docs
sequence work, they don't schedule it. The task list defaults to one task per Feature ID; finer
sub-tasks (UI/logic/API/tests split out) are only allowed when scope is narrowed to a specific
feature **and** that feature already has a `detailed-design/{epic-slug}.md` entry to ground the
breakdown in — otherwise stay at Feature-ID granularity.

**Hard prerequisite**: `01-spec/*.md` (every epic), `backlog.md`, and `user-journeys.md` must already
exist — if any is missing, this skill stops immediately and tells the user to run
`feature-list-journey` first. Unlike `api-db-spec-builder`/`detailed-design-builder`/
`tech-stack-builder`, nothing else in `02-technical/` is required: the High Level Architecture,
API Spec/Database Schema, Detailed Design, and Tech Stack docs are purely optional context here (used
for dependency detection or sub-task grounding when they exist) since phase/release planning is a
project-management decision, not a technical one.

Single file plus one file per phase, neither versioned. Default scope is the entire backlog; can be
narrowed to a Feature ID, an Epic, or one phase. Treats `01-spec/`, `backlog.md`, and
`user-journeys.md` as read-only upstream — never edits any of those, handing fixes to
`feature-list-journey` instead. Always proposes the phase breakdown and task file list for the user
to confirm before writing. Re-run this whenever `01-spec/`, `backlog.md`, or `user-journeys.md`
changes, or when a plan/task doc has been hand-edited directly — it audits itself for staleness
against those three before writing anything (a feature whose MoSCoW priority changed should move
phase; a new Feature ID needs a task entry), using the same ≥3-options/pros-cons/recommendation
ask-user protocol as every other skill here for any real ambiguity (e.g. whether an unclear
dependency is real). Not part of `pipeline-orchestrator` — same treatment as Prototype and the four
`02-technical/` docs, it stays a separate, explicitly-requested step.

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
   - `02-plan/` — **Release Plan**: phase/milestone breakdown of the backlog (see "Building the
     Plan/Phase/Release & Task Breakdown docs" below; not versioned, a single file)
   - `03-task/` — **Task Breakdown**, one file per phase, status-only (no Owner field until a real
     team exists — see "Building the Plan/Phase/Release & Task Breakdown docs" below)
2. `docs/02-design/` — design derived from requirements:
   - `01-prototypes/` — UI/UX prototypes, wireframes, user flow, design system — holds
     `user-journeys.md`, `DESIGN.md`, and versioned HTML prototype folders `v1/`, `v2/`, ...
   - `02-technical/` — technical design: holds `high-level-architecture.md` (the conceptual,
     stack-agnostic architecture — see "Building the High Level Architecture doc" above),
     `api-spec.md` and `database-schema.md` (one level more concrete, still stack-agnostic except
     for the REST-convention/logical-type exceptions — see "Building the API Spec & Database
     Schema" above), `detailed-design/{epic-slug}.md` (sequence/state diagrams and algorithms, still
     conceptual with no new exceptions needed — see "Building the Detailed Design docs" above), and
     `tech-stack.md` (the one genuinely stack-specific doc here — real framework/DBMS/hosting
     choices, picked via an intensive Discovery Questionnaire — see "Building the Tech Stack doc"
     above)
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
