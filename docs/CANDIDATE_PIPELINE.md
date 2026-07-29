# Wikidata candidate pipeline

The candidate pipeline covers one-hop kinship around four configured roots:
Cao Cao, Liu Bei, Sun Quan, and Sima Yi. It is a discovery layer, not the
formal historical graph.

## Directories

```text
config/                 scope and integrity manifests
data/raw/               downloaded caches; ignored by Git
data/interim/           rebuildable normalization state; ignored by Git
data/processed/         checked candidate snapshot
data/sources/           source, license, and permitted-use registry
schemas/                JSON Schema for processed people and relations
scripts/                downloader, normalizer, checks, and pipeline runner
```

## Rebuild

Python 3.10+ and `jsonschema` are required.

```powershell
py -3.12 -m pip install "jsonschema>=4.18,<5"
py -3.12 scripts/run_pipeline.py
```

Do not run the downloader in CI. A rebuild changes the processed snapshot and
therefore requires an intentional review and an update to
`config/processed_integrity.json`.

## Semantics

Processed `father` and `mother` links use child-to-parent direction. The
frontend adapter reverses those links to the formal parent-to-child direction.
It normalizes spouse pairs and ignores sibling, generic child, out-of-scope,
and unsupported records.

Every processed relation remains `verified: false`. `npm run
validate:processed` validates JSON Schema, references, candidate status, and
the four recorded SHA-256 values without writing any files.
