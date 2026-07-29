from __future__ import annotations

import argparse

from download_wikidata import download
from normalize_data import normalize
from pipeline_common import CONFIG_PATH, PROCESSED_DIR
from validate_data import validate


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download, normalize, and validate the first kinship dataset."
    )
    parser.add_argument("--depth", type=int, default=1)
    parser.add_argument("--batch-size", type=int, default=100)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    manifest = download(args.depth, args.batch_size, CONFIG_PATH)
    persons, relations, _ = normalize()
    report = validate(
        PROCESSED_DIR / "persons.json",
        PROCESSED_DIR / "relations.json",
        PROCESSED_DIR / "validation_report.json",
    )
    print(
        "Pipeline complete: "
        f"{len(manifest['entity_qids'])} cached entities, "
        f"{len(persons)} persons, {len(relations)} relations, "
        f"validation={report['status']}."
    )
    if report["status"] != "pass":
        raise SystemExit(1)


if __name__ == "__main__":
    main()

