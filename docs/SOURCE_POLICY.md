# Source policy

SanguoGraph exists to make historical relationship claims inspectable rather
than merely visual.

## Evidence layers

Data must distinguish:

1. `official_history` — statements in official historical texts;
2. `annotated_history` — material preserved through historical annotations;
3. `literature` — literary works such as *Romance of the Three Kingdoms*;
4. `later_tradition` — later legends, local traditions, and retrospective
   claims.

These layers may be compared, but they must not be merged into a single claim.

## Review and certainty

`reviewStatus` describes editorial workflow. `certainty` describes the strength
or nature of the claim.

- Candidate imports and initial transcriptions remain `pending_review`.
- A maintainer may set a record to `verified` only after checking the cited
  material.
- `confirmed` requires a verified relationship and at least one valid source.
- `probable` is not a substitute for missing review; the note should explain
  why a claim is provisional.
- `fictional` must use an appropriate literary or later-tradition layer.

## Candidate sources

Wikidata, other public knowledge graphs, encyclopedias, and automated extraction
may identify useful candidates. They cannot by themselves establish a
historical fact. Every accepted confirmation must return to an inspectable
source.

Do not copy or redistribute third-party datasets until their provenance,
license, compatibility, and transformation requirements have been reviewed.

