from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

from pipeline_common import PROCESSED_DIR, load_json


def detect_dangling_relations(
    persons: list[dict[str, Any]],
    relations: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    person_ids = {person["id"] for person in persons}
    dangling = []
    for relation in relations:
        missing = [
            endpoint
            for endpoint in ("source_id", "target_id")
            if relation[endpoint] not in person_ids
        ]
        if missing:
            dangling.append(
                {
                    "relation_id": relation["id"],
                    "missing_endpoints": missing,
                    "source_id": relation["source_id"],
                    "target_id": relation["target_id"],
                }
            )
    return dangling


def main() -> None:
    parser = argparse.ArgumentParser(description="Detect dangling relations.")
    parser.add_argument(
        "--persons", type=Path, default=PROCESSED_DIR / "persons.json"
    )
    parser.add_argument(
        "--relations", type=Path, default=PROCESSED_DIR / "relations.json"
    )
    args = parser.parse_args()
    dangling = detect_dangling_relations(
        load_json(args.persons), load_json(args.relations)
    )
    print(f"dangling relations: {len(dangling)}")
    for item in dangling:
        print(item)


if __name__ == "__main__":
    main()

