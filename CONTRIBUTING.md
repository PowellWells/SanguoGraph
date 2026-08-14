# Contributing to 三国人物关系谱 · SanguoGraph

Thank you for helping build a source-traceable Three Kingdoms relationship
graph. Code and historical-data contributions are both welcome, but data claims
require a higher evidence standard than interface changes.

## Development workflow

1. Create a branch from `main`.
2. Keep each pull request focused on one feature, correction, or dataset group.
3. Run the following commands in PowerShell:

   ```powershell
   npm ci
   npm run lint
   npm run test
   npm run validate:data
   npm run validate:relation-coverage
   npm run validate:processed
   npm run validate:release
   npm run build
   ```

4. Explain the user-visible change and the evidence behind any data change.

Do not commit `node_modules`, `dist`, raw/interim caches, credentials, or
generated build artifacts. Do not hand-edit `data/processed`; rebuild and
review it through the documented candidate pipeline.

## Data contributions

- Use project-local `person:sg:*` IDs rather than names or Wikidata QIDs as
  primary references.
- Preserve official-history, annotated-history, literature, and later-tradition
  layers separately.
- Keep new claims as `pending_review` until a maintainer verifies the source.
- Do not mark a relationship `confirmed` without at least one valid,
  non-structured historical source record.
- Do not invent quotations or fill missing source fields with guesses.
- Provide a direct, verifiable reference wherever lawful and practical.
- Start factual corrections with the structured **数据纠错** issue form and
  source additions with **史料来源建议**; include the entity ID and permanent
  link whenever available.
- Quote only the minimum text necessary to locate and verify a claim. Do not
  paste long passages from modern publications or paywalled works.

Wikidata, encyclopedias, and other knowledge graphs are discovery aids only.
They are not sufficient evidence for a `confirmed` relationship.

## Licensing

By contributing code, you agree that it may be distributed under the MIT
License. By contributing project-maintained historical data or original
editorial descriptions, you agree that your contribution may be distributed
under CC BY 4.0 and confirm that you have the right to provide it on those
terms. Do not import third-party datasets or code unless their license and
provenance are documented and compatible with the project.

The formal data attribution, exclusions, intake rules, and release boundary
are defined in `LICENSE-DATA` and `docs/DATA_LICENSE_GOVERNANCE.md`.
