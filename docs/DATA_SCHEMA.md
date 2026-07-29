# Data schema

Formal source files live in `src/data`; strict TypeScript interfaces in
`src/domain` are the application model.

## Person

| Field | Meaning |
| --- | --- |
| `id` | Project-local stable ID matching `person:sg:*` |
| `name`, `courtesyName`, `otherNames` | Display name, courtesy name, and search aliases |
| `reviewStatus` | `pending_review` or `verified` |
| `sourceIds` | Historical sources used to verify the person record |
| `externalIds.wikidata` | Optional external QID; never a primary key |

A verified formal person must cite at least one non-structured historical
source.

## Relation

Formal base types are `father_of`, `mother_of`, `spouse_of`,
`adoptive_father_of`, and `adoptive_mother_of`. `clan_relative_of` remains
reserved for a later milestone.

| Field | Meaning |
| --- | --- |
| `sourcePersonId`, `targetPersonId` | Direction is parent to child; spouse is undirected |
| `origin` | `recorded`, `candidate`, or `derived` |
| `certainty` | `confirmed`, `probable`, `disputed`, or `fictional` |
| `reviewStatus` | Editorial state, independent of certainty |
| `historicalLayer` | Includes official, annotated, literary, tradition, or structured candidate |
| `sourceIds` | Evidence references |

Only `origin: recorded` may appear in `src/data/relations.json`. Candidate
relations are adapted at runtime; derived relations are not implemented.

## HistoricalSource

Source types are `primary`, `secondary`, `literary`, and
`structured_dataset`. A source stores work, section, author/commentator,
optional short quotation, full reference, URL, layer, review state, and note.

## Validation

`npm run validate:data` checks local ID format, uniqueness, references,
verified-person evidence, confirmed-relation historical evidence, candidate
review state, spouse duplicates, directed parent cycles, and formal-origin
restrictions.

`npm run validate:processed` checks the candidate snapshot against JSON Schema,
references, unverified state, and fixed SHA-256 values without rewriting it.
