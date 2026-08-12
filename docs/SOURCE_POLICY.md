# 三国人物关系谱 · SanguoGraph — Source policy

三国人物关系谱 · SanguoGraph makes relationship claims inspectable rather than merely visual.

## Evidence layers

1. `official_history` — the main text of official histories;
2. `annotated_history` — material preserved in historical annotations;
3. `literature` — literary works such as *Romance of the Three Kingdoms*;
4. `later_tradition` — later legend or retrospective claims;
5. `structured_candidate` — external structured-data discovery leads.

These layers may be compared but must not be merged into one undifferentiated
claim.

The reader-facing filters keep formal source layers independent: direct
official-history records, official-history inferences, other ancient sources,
modern research, literature, and editor inference. Internal open-knowledge
candidates do not enter the public or offline build. Empty formal layers remain
visible with a zero count so absence of data is not mistaken for a negative
historical conclusion.

## Review, certainty, and origin

- `reviewStatus` is the editorial workflow; `certainty` is the claim judgment.
- `origin: recorded` is a directly recorded formal claim.
- `origin: candidate` is a discovery lead and must remain `pending_review`.
- `origin: derived` is a future program inference and must not be presented as
  a direct record.
- `confirmed` requires `verified` plus at least one non-structured historical
  source. Every formal relation, regardless of certainty, must cite at least
  one source record containing a locatable quotation.
- A locatable annotation may be `verified` while remaining `probable` when the
  evidence layer warrants caution.
- “No opposing source recorded” means only that the current project data has
  none; it must not be read as a claim of scholarly consensus.
- Spouse rank is displayed only when the cited wording supports it. A “夫人”
  record derived from a child list is not silently upgraded to wife, successor
  wife, or concubine.

## Candidate sources

Wikidata and other knowledge graphs may identify candidates but cannot by
themselves establish historical fact. They may remain in the non-building
internal research area, but their names, identifiers, URLs, excerpts, and
candidate records must not appear in the front-end or offline artifact.

Do not copy or redistribute third-party data until provenance, license,
compatibility, and transformation requirements have been reviewed. Never
invent quotations, locators, or source links.

## Local research index

The optional local source index is a discovery aid, not a verified evidence
layer. A search hit must be checked against its recorded page revision and
classified as main text, annotation, or another source type before a short
quotation or relationship claim enters the formal graph. Raw corpus caches and
generated indexes remain local and are not distributed with the repository.
