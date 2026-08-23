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
- `docs/features/feature-list.md` — generated table of features per epic, each traceable to its
  `REQ-xx` and source user story.
- `docs/features/user-journeys.md` — generated per-feature user journeys (actor, goal, trigger,
  steps, success state, edge cases).

## Feature List / User Journey generation

When `docs/requirements/product-backlog.md` changes, or a new Feature List / User Journey is
needed, regenerate the docs rather than hand-editing them out of sync with the spec:

- Skill: `.claude/skills/feature-list-journey/SKILL.md` — the methodology (grouping by epic,
  Feature ID scheme, required journey fields, REQ traceability rules).
- Agent: `.claude/agents/feature-journey-writer.md` — a subagent that applies the skill to
  produce/update `docs/features/feature-list.md` and `docs/features/user-journeys.md`.

Every `REQ-xx` in the backlog must be traceable to at least one feature in both generated docs;
anything that can't be mapped goes in an "Open Questions" section instead of being guessed.
