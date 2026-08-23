# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

smartFit_daily is currently a **spec/documentation-only** repository — no application code exists
yet. Content so far consists of the product requirement spec/backlog and the generated Feature
List / User Journey docs derived from it. There is no build, lint, or test tooling to run yet;
add this section once an app scaffold lands.

## Repository structure

- `docs/requirements/product-backlog.md` — source of truth: Feature List overview, Product
  Backlog (MoSCoW-prioritized user stories), and Requirement Spec (`REQ-01`…`REQ-13`) grouped by
  epic (Onboarding, Daily Recommendation, Planner, Smart Integrations).
- `docs/features/feature-list.md` — a single MoSCoW-prioritized summary table across all epics,
  followed by a full description of each feature below the table.
- `docs/features/user-journeys.md` — per-feature user journeys, each led by a Mermaid diagram with
  a step-by-step description below it (in diagram order, one REQ mapping per step), then
  Actor/Goal/Trigger/Preconditions/Success State/Alt-Edge Cases.

## Feature List / User Journey generation

When `docs/requirements/product-backlog.md` changes, or a Feature List / User Journey needs to be
audited, created, or updated, use the skill/agent below rather than hand-editing the docs out of
sync with the spec:

- Skill: `.claude/skills/feature-list-journey/SKILL.md` — the methodology: audit the backlog for
  gaps first, grouping by epic, Feature ID scheme, REQ traceability rules, and the required
  Feature List / User Journey formats above.
- Agent: `.claude/agents/feature-journey-writer.md` — a subagent that applies the skill to
  produce/update `docs/features/feature-list.md` and `docs/features/user-journeys.md`.

Every `REQ-xx` in the backlog must be traceable to at least one feature in both generated docs.
When the audit finds a gap that would meaningfully change the Steps/Success State/diagram of a
Must- or Should-priority feature, the skill requires stopping to ask the user — with at least 3
possible approaches, their pros/cons, and a recommended approach with reasoning — instead of
guessing. Minor gaps that don't affect journey structure go in an "Open Questions" section instead.
