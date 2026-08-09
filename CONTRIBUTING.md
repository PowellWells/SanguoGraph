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

Wikidata, encyclopedias, and other knowledge graphs are discovery aids only.
They are not sufficient evidence for a `confirmed` relationship.

## Licensing

By contributing code, you agree that it may be distributed under the MIT
License. Do not import third-party datasets or code unless their license and
provenance are documented and compatible with the project.

The standalone license for project-maintained historical data is not yet
settled; see `docs/ROADMAP.md`.
