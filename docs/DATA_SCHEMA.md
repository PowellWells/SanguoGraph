# Data schema

Milestone 0 stores source files as JSON in `src/data`. TypeScript interfaces in
`src/domain` are the canonical application model.

## Person

Important fields:

| Field | Meaning |
| --- | --- |
| `id` | Stable identifier, independent of names and titles |
| `name` | Preferred display name |
| `courtesyName` | Courtesy name, or `null` |
| `otherNames` | Other attested names; empty when none are recorded |
| `birthYear`, `deathYear` | Integer year or `null` |
| `historicity` | `historical`, `fictional`, or `disputed` |
| `reviewStatus` | `pending_review` or `verified` |
| `note` | Review or editorial note |

## Relation

Only foundational relationships are stored in source data:

- `father_of`
- `mother_of`
- `spouse_of`
- `adoptive_father_of`
- `adoptive_mother_of`
- `clan_relative_of`

Each relation references two person IDs. Its `certainty` is one of
`confirmed`, `probable`, `disputed`, or `fictional`; its `historicalLayer` is
`official_history`, `annotated_history`, `literature`, or `later_tradition`.

`sourceIds` references entries in `sources.json`. A `confirmed` relationship
must be `verified` and include at least one valid source ID.

Inverse and derived relations are not written into the raw relationship file.
When inference is implemented, it must preserve the distinction between
recorded and derived statements.

## HistoricalSource

A source record stores bibliographic identity, section, author or commentator,
an optional short quotation, reference, URL, source type, historical layer,
review status, and editorial note.

`quotation` may be `null`. Missing evidence must never be replaced with
invented text.

## Validation

`npm run validate:data` checks:

- duplicate IDs within each entity collection;
- person references at both ends of every relation;
- self-relations;
- source references;
- verification and source requirements for confirmed relations.

