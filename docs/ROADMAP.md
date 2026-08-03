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
- canvas controls, smart relationship labels, and live graph counts
- compact first-page data summary
- graph-first mobile reading order with responsive graph controls

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

## Milestone 2 — Cao and Xiahou clans (completed)

- first verified expansion adds Cao Ren, Cao Hong, Cao Xiu, Cao Zhen,
  Cao Shuang, Xiahou Dun, Xiahou Yuan, Xiahou Shang, and Xiahou Xuan
- add only source-located parent, adoption, and bounded clan relationships
- scale through deterministic radial family branches, collision avoidance,
  routed secondary edges, and readable focus-first navigation
- populate disputed-source comparison with independently reviewed claims
- design, but do not silently persist, carefully scoped relationship inference

## Milestone 2.1 — major historical roster (completed)

- expand the verified formal roster from 24 to 200 major historical people
- keep the formal relationship set fixed at 33 family, marriage, adoption,
  and bounded clan relations
- keep people without an in-scope relationship searchable and available in
  the explicit complete-map view
- store visual faction independently from historical affiliation
- locate new people in *Records of the Three Kingdoms*, *Book of the Later
  Han*, or *Book of Jin* without importing structured-candidate claims
- leave unreviewed dates and relationships unknown rather than filling them
  from Wikidata

## Milestone 2.2 — family expansion batch three (completed)

- add 35 close-family people around the reviewed major roster
- expand the six existing family relation types to 110 source-linked edges
- keep political, battle, office, alliance, and faction edges out of scope
- display probable, later-tradition, and literary claims as dashed lines
- keep literary identity and presentation faction separate from formal history

## Milestone 2.3 — Wei family expansion batch four (completed)

- add 35 named relatives around existing Xiahou, Cao, and major Wei generals
- add exactly one necessary family edge for each new person
- keep all additions within father and bounded clan relationships
- distinguish main-text records from relationships supplied by Pei annotations
- preserve the fixed Wei-top, Shu-lower-left, and Wu-lower-right map sectors

## Milestone 2.4 — Shu family expansion batch five (completed)

- add 35 named relatives around the Liu, Zhuge, and major Shu families
- add exactly one necessary family edge for each new person
- keep additions within father, adoptive-father, and bounded clan relations
- show six Liu Shan son claims from Pei annotations as probable dashed edges
- keep visual Shu placement separate from each person's recorded affiliations

## Milestone 2.5 — Complete biographical roster batch six (completed)

- add 232 named annal, biography, and attached-biography subjects in one batch
- freeze the complete 537-person manifest and cover all 65 Sanguozhi volumes
- keep the formal relationship set unchanged at 180 records
- place relation-free people in deterministic Wei, Shu, Wu, and neutral grids
- preserve presentation factions separately from sourced affiliations

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
