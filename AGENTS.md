# Project instructions

SanguoGraph is a source-traceable historical knowledge graph. Keep changes
within the active milestone and preserve the distinction between historical
claims, literary claims, and program-derived relationships.

## Engineering

- Use strict TypeScript and do not introduce `any`.
- Prefer small, focused React components and existing project utilities.
- Do not add a backend, authentication, database, or AI API without an explicit
  milestone decision.
- Do not commit `node_modules`, `dist`, local raw datasets, or generated output.
- Before handing off a change, run lint, tests, data validation, and build.

## Historical data

- Treat external structured datasets as candidate leads, not verified facts.
- Never invent quotations or references.
- Do not add an uncited `confirmed` relation.
- Keep direct records and inferred relationships distinguishable.
- Confirm provenance and license compatibility before importing third-party
  data.

## Project continuity

Maintain at most one project-specific Codex memory or decision record if future
cross-task complexity justifies it. Do not create one for routine changes.

