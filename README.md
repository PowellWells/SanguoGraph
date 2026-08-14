# 三国人物关系谱 · SanguoGraph

[简体中文](README.zh-CN.md) · [English](README.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md)

![Cover for 三国人物关系谱 · SanguoGraph](docs/assets/readme-cover.png)

> **Explore online:** [Open the relationship graph](https://powellwells.github.io/SanguoGraph/)

三国人物关系谱 · SanguoGraph is an early-stage, source-traceable knowledge graph for historical
relationships in the Three Kingdoms period. The formal layer now covers 580
historical or explicitly literary-layer people across Wei, Shu, Wu, and
late-Han groups while keeping verified records, presentation factions,
literary claims, and internal research candidates separate.

## Open directly offline

Double-click the repository-root [`index.html`](index.html) to use the complete
graph in a local browser; it automatically opens
[`offline/index.html`](offline/index.html). The offline file embeds its styles,
application code, and formal data, so it requires no Node.js installation,
local server, or internet connection.

Maintainers can rebuild and validate the offline file with:

```powershell
npm run build:offline
npm run validate:offline
```

## Current milestone

- 580 locally identified people (`person:sg:*`) across seven import batches;
- 358 recorded father, mother, spouse, adoptive-parent, and clan relationships,
  with no political or battle edges;
- 374 people currently have at least one formal relationship while 206 remain
  isolated; the active [formal relationship coverage](docs/RELATION_COVERAGE.md)
  milestone has completed its global omission and evidence audit;
- all 580 formal people load into the front-end map on first entry; people
  without an in-scope relation remain visible as independent nodes;
- a searchable, layered source browser that distinguishes person locators,
  supporting relation evidence, and opposing evidence;
- stable hash links that open a specific person, relation, or source in both
  hosted and direct-open offline builds;
- Cytoscape.js graph with search, relation filters, and all/one-hop/two-hop
  views;
- deterministic radial family-branch layouts with collision-free spacing,
  routed cross-branch edges, readable focus zoom, and full-map fit controls;
- smart relation labels that declutter at distant zoom and can be forced on
  from the graph toolbar;
- relation dossiers covering direction, period, qualification, evidence basis,
  interpretation, certainty, dispute, decision, and review state;
- node expansion/collapse, locking, hiding, branch isolation, undo, and reset;
- live, filter-aware source counts and an actionable source catalog;
- independent source-system filters rather than a single mixed trust layer;
- disambiguating search with pinyin/context matching and two-person shortest
  paths;
- candidate datasets remain internal research inputs and are excluded from public builds;
- responsive desktop and mobile layouts, with native scrolling on long source
  and about pages.

External identifiers used by internal research are never project primary keys
and cannot establish a `confirmed` relationship.

## Evidence policy

- Official-history, annotated-history, literary, and structured-candidate
  claims remain separate.
- `certainty` describes the claim; `reviewStatus` describes editorial review.
- A `confirmed` relation must be `verified` and cite at least one historical
  source that is not a structured dataset.
- Candidate or program-derived relationships are never written into the formal
  relationship JSON.
- Quotations and references must not be invented.

See the [major-person scope](docs/MAJOR_PERSON_SCOPE.md),
[source policy](docs/SOURCE_POLICY.md), and
[data schema](docs/DATA_SCHEMA.md).

Maintainers can also build a local-only full-text index of all 65 volumes of
*Records of the Three Kingdoms* for faster research:

```powershell
npm run sources:build
npm run sources:search -- 刘备 --volume 32
```

Search hits never create formal relationships automatically. See the
[local source index guide](docs/LOCAL_SOURCE_INDEX.md) for provenance,
licensing, refresh, and review rules.

## Local development

Requires Node.js 18.18+ and npm.

```powershell
npm install
npm run dev
```

Run the complete quality gate:

```powershell
npm run lint
npm run test
npm run validate:data
npm run validate:relation-coverage
npm run validate:processed
npm run build
npm run build:offline
npm run validate:offline
npm audit --omit=dev
```

The production Vite base path is `/SanguoGraph/`, and navigation uses hash
routes so project GitHub Pages refreshes do not require server rewrites.

## Candidate data pipeline

The checked-in `data/processed` layer contains 99 people and 738 unverified
Wikidata-derived candidate relations for maintainer research only. Website and
single-file offline builds neither load nor embed this candidate layer and do
not send candidate external identifiers to the browser.

The reproducible Python pipeline and source/license registry are documented in
[Candidate data pipeline](docs/CANDIDATE_PIPELINE.md). CI validates the
processed files against JSON Schema and fixed SHA-256 values; it does not
download Wikidata.

## License

Source code is available under the [MIT License](LICENSE). Project-maintained
historical data is currently curated by the maintainers. A standalone data
license remains an open governance decision in the
[roadmap](docs/ROADMAP.md); third-party data is not re-licensed as CC0.
