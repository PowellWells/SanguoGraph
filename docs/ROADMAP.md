# Roadmap

## Milestone 0 — completed

- React, TypeScript, Vite, Cytoscape.js shell, validation, tests, and Pages CI
- internal candidate pipeline and source/license registry

## Milestone 1 — completed

- 15-person Cao Cao core family
- source-backed base relationships and evidence panels
- search, type filters, all/one-hop/two-hop views
- internal candidate tooling kept outside the public frontend
- formal and processed data quality gates

## Milestone 1.1 — visual frontend completed

- generation-aware family-tree composition instead of generic auto-layout
- canvas controls, smart relationship labels, and live graph counts
- compact first-page data summary
- graph-first mobile reading order with responsive graph controls

## Milestone 1.2 — offline single-file distribution completed

- self-contained `offline/index.html` for direct local use
- no Node.js, local server, or network connection required for readers
- internal candidate data is excluded from the offline artifact
- automated checks prevent external scripts, styles, or data dependencies

## Milestone 1.3 — interaction and evidence loop completed

- relation dossiers with direction, period, qualification, evidence basis,
  modern interpretation, certainty, dispute, decision, and review status
- supporting and opposing evidence slots with conservative empty-state wording
- node expansion/collapse, position locking, hiding, branch isolation, undo,
  core reset, and complete-network actions
- live source counts and an actionable source catalog tied to current filters
- six independent public source-system filters; internal candidates are not shipped
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

## Milestone 2.6 — Source-backed relationship enrichment (completed)

- add the directly recorded Yuan Shao–Yuan Tan/Xi/Shang parent-child links
- add the directly recorded Yuan Xi–Empress Zhen marriage
- keep political, military, office, and inferred relationship lines out of the formal graph
- preserve exact quotations and volume-level links for every added relation

## Milestone 2.7 — Formal relationship coverage (data frozen)

- measure the starting baseline of 187 related and 350 isolated people
- complete all three major-roster research batches and the first volume-20 complete-roster batch at 281 related and 256 isolated people
- complete the first two 65-volume omission-audit groups at 577 people, 318 relations, 325 related people, and 252 isolated people
- complete the major-roster second pass without adding people: 324 relations, 333 related people, and 244 isolated people
- complete the volumes 1-30 review without adding people: 333 relations, 348 related people, and 229 isolated people
- complete the volumes 31-50 review without adding people: 341 relations, 357 related people, and 220 isolated people
- complete the volumes 51-65 review without adding people: 349 relations, 365 related people, and 212 isolated people
- complete the global omission, identity, provenance, and evidence audit without adding people: 353 relations, 371 related people, and 206 isolated people
- complete the Round 6 pre-freeze omission audit by adding Cao Xian, Cao Jie, and Cao Hua with six direct-record relations, replacing one aggregate placeholder: 580 people, 358 relations, 374 related people, and 206 isolated people
- keep a deterministic full isolation audit and prevent coverage regressions in CI
- retain 61 unresolved major-roster people for later review and reduce the sixth-batch isolated count from 206 to 144 people
- reduce isolated people to no more than 200 in the first relationship-enrichment phase
- add only source-backed relationships and keep research leads out of the formal graph
- prioritize relations among the frozen 580-person roster; add an omitted person only when qualified evidence immediately connects that person to the formal network
- require at least one quoted source for every formal relationship and preserve the remaining six-person target gap without weakening evidence standards
- decide political, office, military, and event modeling in a separate milestone
- retain the recalculated six-person Phase A gap instead of weakening the evidence standard; the data stage is frozen even though the 200-isolate threshold remains unmet

## Milestone 2.8 — 65-volume omission audit (completed)

- keep post-freeze discoveries in import batch seven instead of rewriting the 232-person sixth batch
- add the first 20 verified omissions: 18 named mothers from volume 20, Dong Jue, and Sun Lü
- add 24 directly recorded mother-child links and the Sun Quan–Sun Lü father-child link
- add a second 20-person women-and-marriage group with 34 relations and 18 relation-level sources
- keep 27 official-history claims distinct from 7 probable claims carried by Pei Songzhi annotations
- avoid assigning Xiahou lady's unnamed daughter to either Zhang empress without disambiguating evidence
- keep Dong Jue isolated until a separately approved non-family relation model exists
- continue auditing named women, attached biographies, and same-name identities against the local source index
- close the freeze audit with three named Cao daughters located in *Book of the Later Han* and immediately connected to Cao Cao and Liu Xie

## Milestone 3 — evidence system (completed)

- improve source browsing and claim comparison (Round 7 source browser completed)
- provide stable deep links for people, relations, and sources (Round 8 completed)
- add correction and source-suggestion issue forms with entity-aware frontend links (Round 9 completed)
- establish historical-data license scope, intake rules, and release gates (Round 9 completed)
- publish project-maintained formal data under CC BY 4.0 with explicit SanguoGraph attribution and exclusions (Round 10 completed)
- complete v1.0 stable-release metadata, automated release gates, and browser acceptance (Round 10 completed)

## Continuing governance rules

- Review provenance and license compatibility before every external import.
- Reassess whether an API/backend is needed only after the static approach
  reaches practical limits.
- Keep source excerpts, third-party material, and internal research candidates
  outside the project-maintained formal-data license.
- Do not describe third-party material as CC0 or as covered by SanguoGraph's
  CC BY 4.0 notice.
