# Source policy

SanguoGraph makes relationship claims inspectable rather than merely visual.

## Evidence layers

1. `official_history` — the main text of official histories;
2. `annotated_history` — material preserved in historical annotations;
3. `literature` — literary works such as *Romance of the Three Kingdoms*;
4. `later_tradition` — later legend or retrospective claims;
5. `structured_candidate` — external structured-data discovery leads.

These layers may be compared but must not be merged into one undifferentiated
claim.

The reader-facing filters refine this into seven independent presentation
layers: direct official-history records, official-history inferences, other
ancient sources, modern research, literature, open-knowledge candidates, and
editor inference. Empty layers remain visible with a zero count so absence of
data is not mistaken for a negative historical conclusion.

## Review, certainty, and origin

- `reviewStatus` is the editorial workflow; `certainty` is the claim judgment.
- `origin: recorded` is a directly recorded formal claim.
- `origin: candidate` is a discovery lead and must remain `pending_review`.
- `origin: derived` is a future program inference and must not be presented as
  a direct record.
- `confirmed` requires `verified` plus at least one non-structured historical
  source.
- A locatable annotation may be `verified` while remaining `probable` when the
  evidence layer warrants caution.
- “No opposing source recorded” means only that the current project data has
  none; it must not be read as a claim of scholarly consensus.
- Spouse rank is displayed only when the cited wording supports it. A “夫人”
  record derived from a child list is not silently upgraded to wife, successor
  wife, or concubine.

## Candidate sources

Wikidata and other knowledge graphs may identify candidates but cannot by
themselves establish historical fact. The UI hides candidates by default and
labels them “未经过正史核验”.

Do not copy or redistribute third-party data until provenance, license,
compatibility, and transformation requirements have been reviewed. Never
invent quotations, locators, or source links.
