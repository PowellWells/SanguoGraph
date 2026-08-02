# SanguoGraph / 三国人物关系谱

[简体中文](README.zh-CN.md)

SanguoGraph is an early-stage, source-traceable knowledge graph for historical
relationships in the Three Kingdoms period. The formal layer now covers 200
major historical people across Wei, Shu, Wu, and late-Han groups while keeping
verified records, presentation factions, and external candidates separate.

## Open directly offline

Double-click the repository-root [`index.html`](index.html) to use the complete
graph in a local browser; it automatically opens
[`offline/index.html`](offline/index.html). The offline file embeds its styles,
application code, and candidate data, so it requires no Node.js installation,
local server, or internet connection.

Maintainers can rebuild and validate the offline file with:

```powershell
npm run build:offline
npm run validate:offline
```

## Current milestone

- 200 locally identified people (`person:sg:*`);
- the existing 33 recorded father, mother, spouse, adoptive-parent, and clan
  relationships, with no added political or battle edges;
- all 200 formal people load into the front-end map on first entry; people
  without an in-scope relation remain visible as independent nodes;
- inspectable citations to *Records of the Three Kingdoms* and Pei Songzhi's
  annotations;
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
- a lazy, opt-in Wikidata candidate layer that is hidden by default;
- responsive desktop and mobile layouts.

Wikidata QIDs are external identifiers only. They are never project primary
keys and cannot establish a `confirmed` relationship.

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
npm run validate:processed
npm run build
npm run build:offline
npm run validate:offline
npm audit --omit=dev
```

The production Vite base path is `/sanguo-graph/`, and navigation uses hash
routes so project GitHub Pages refreshes do not require server rewrites.

## Candidate data pipeline

The checked-in `data/processed` layer contains 99 people and 738 unverified
Wikidata-derived candidate relations. The regular website build loads the
candidate module only when a reader enables the switch. The single-file offline
build embeds the same candidate data but still keeps it hidden by default.
Both builds use the 200 formal people as their adaptation boundary; the current
candidate snapshot covers only a subset of them.

The reproducible Python pipeline and source/license registry are documented in
[Candidate data pipeline](docs/CANDIDATE_PIPELINE.md). CI validates the
processed files against JSON Schema and fixed SHA-256 values; it does not
download Wikidata.

## License

Source code is available under the [MIT License](LICENSE). Project-maintained
historical data is currently curated by the maintainers. A standalone data
license remains an open governance decision in the
[roadmap](docs/ROADMAP.md); third-party data is not re-licensed as CC0.
