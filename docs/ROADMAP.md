# Roadmap

## Milestone 0 — completed

- React, TypeScript, Vite, Cytoscape.js shell, validation, tests, and Pages CI
- Wikidata candidate pipeline and source/license registry

## Milestone 1 — completed

- 15-person Cao Cao core family
- source-backed base relationships and evidence panels
- search, type filters, all/one-hop/two-hop views
- lazy, default-hidden Wikidata candidate overlay
- formal and processed data quality gates

## Milestone 1.1 — visual frontend completed

- generation-aware family-tree composition instead of generic auto-layout
- visible relationship labels, canvas controls, and live graph counts
- compact first-page data summary
- graph-first mobile reading order with a dedicated two-row descendant layout

## Milestone 1.2 — offline single-file distribution completed

- self-contained `offline/index.html` for direct local use
- no Node.js, local server, or network connection required for readers
- embedded candidate layer remains opt-in and hidden by default
- automated checks prevent external scripts, styles, or data dependencies

## Milestone 1.3 — interaction and evidence loop completed

- relation dossiers with direction, period, qualification, evidence basis,
  modern interpretation, certainty, dispute, decision, and review status
- supporting and opposing evidence slots with conservative empty-state wording
- node expansion/collapse, position locking, hiding, branch isolation, undo,
  core reset, and complete-network actions
- live source counts and an actionable source catalog tied to current filters
- seven independent source-system filters with candidates disabled by default
- disambiguating search cards, pinyin/context search, and shortest-path queries

## Milestone 2 — Cao and Xiahou clans

- expand the verified person set only where sources can be located
- populate disputed-source comparison with independently reviewed claims
- design, but do not silently persist, carefully scoped relationship inference

## Milestone 3 — evidence system

- improve source browsing and claim comparison
- add correction and source-suggestion issue templates
- consider stable deep links for people and claims

## Open governance decisions

- Select a standalone license for project-maintained historical data.
- Review provenance and license compatibility before every external import.
- Reassess whether an API/backend is needed only after the static approach
  reaches practical limits.

Until the data-license decision is complete, do not describe third-party or
project-maintained data as CC0.
