# Data schema

Formal source files live in `src/data`; the original 24-person family data
remains in JSON, the 176-person major roster is maintained in `majorPersons.ts`
and `majorSources.ts`, the third family batch is maintained in
`familyPersons.ts`, `familyRelations.ts`, and `familySources.ts`, and the
fourth Wei-family batch is maintained in the three `fourthFamily*.ts` files,
and the fifth Shu-family batch is maintained in the three `fifthFamily*.ts`
files. The sixth biographical roster is authored in
`src/data/sixthRoster/manifest.ts`, converted to people in `persons.ts`, and
frozen together with all earlier batches in `completeRosterManifest.ts`.
Strict TypeScript interfaces in `src/domain` are the application model.

## Person

| Field | Meaning |
| --- | --- |
| `id` | Project-local stable ID matching `person:sg:*` |
| `name`, `courtesyName`, `otherNames` | Display name, courtesy name, and search aliases |
| `reviewStatus` | `pending_review` or `verified` |
| `sourceIds` | Historical sources used to verify the person record |
| `visualFaction` | Optional presentation-only `wei`, `shu`, `wu`, or `other`; never a formal political-affiliation claim |
| `importBatch` | Project ingestion batch: `1` for the original 24 people, `2` for the 176-person major-roster expansion, `3` for the 35-person first family expansion, `4` for the 35-person Wei-family expansion, `5` for the 35-person Shu-family expansion, `6` for the 232-person complete biographical roster |
| `externalIds.wikidata` | Optional external QID; never a primary key |

A verified formal person must cite at least one non-structured historical
source.

## Relation

Formal base types are `father_of`, `mother_of`, `spouse_of`,
`adoptive_father_of`, `adoptive_mother_of`, and `clan_relative_of`.
`clan_relative_of` is undirected and records only a source-backed bounded
kinship label such as 从弟、族子、从子 or 姑子. It must not be expanded into
unrecorded intermediate ancestors.

| Field | Meaning |
| --- | --- |
| `sourcePersonId`, `targetPersonId` | Direction is parent to child; spouse is undirected |
| `origin` | `recorded`, `candidate`, or `derived` |
| `certainty` | `confirmed`, `probable`, `disputed`, or `fictional` |
| `reviewStatus` | Editorial state, independent of certainty |
| `historicalLayer` | Includes official, annotated, literary, tradition, or structured candidate |
| `sourceIds` | Evidence references |
| `claim.periodLabel` | Approximate effective period; unknown dates stay explicit |
| `claim.relationshipQualifier` | More precise identity such as successor wife or rank unknown |
| `claim.evidenceBasis` | Direct record, indirect inference, editor inference, or structured candidate |
| `claim.modernInterpretation` | Bounded modern-language explanation of what the evidence supports |
| `claim.disputeStatus` | No opposition recorded, not assessed, disputed, conflicting, or rejected |
| `claim.decisionStatus` | Candidate, pending, confirmed, disputed, or rejected |
| `claim.opposingSourceIds` | Sources that oppose or qualify the current conclusion |
| `claim.scholarlyViews` | Attributed scholarly positions; empty until a locatable study is entered |

Only `origin: recorded` may appear in `src/data/relations.json`. Candidate
relations are adapted at runtime; derived relations are not implemented. The
claim object is optional while older formal records are migrated. The UI
creates a conservative presentation profile when it is absent and explicitly
labels missing dates and unrecorded opposing evidence.

Successive marriages are stored as separate `spouse_of` records when each is
directly supported by historical evidence. A later marriage never overwrites
an earlier one; for example, the graph may retain both 袁熙—甄氏 and 曹丕—甄氏.

## HistoricalSource

Source types are `primary`, `secondary`, `literary`, and
`structured_dataset`. A source stores work, section, author/commentator,
optional short quotation, full reference, URL, layer, review state, and note.

## Validation

`npm run validate:data` checks local ID format, uniqueness, references,
verified-person evidence, confirmed-relation historical evidence, candidate
review state, spouse duplicates, directed parent cycles, and formal-origin
restrictions. When claim metadata is present it also checks opposing-source
references and consistency between a confirmed relation and its decision state.

`npm run validate:processed` checks the candidate snapshot against JSON Schema,
references, unverified state, and fixed SHA-256 values without rewriting it.
