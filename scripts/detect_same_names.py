from __future__ import annotations

import argparse
from collections import defaultdict
from pathlib import Path
from typing import Any

from pipeline_common import PROCESSED_DIR, load_json


def normalize_name(name: str) -> str:
    return "".join(name.split()).casefold()


def detect_same_names(persons: list[dict[str, Any]]) -> list[dict[str, Any]]:
    index: dict[str, list[dict[str, str]]] = defaultdict(list)
    for person in persons:
        names = {person["name_zh"], *person.get("aliases", [])}
        for name in names:
            normalized = normalize_name(name)
            if normalized:
                index[normalized].append(
                    {
                        "person_id": person["id"],
                        "matched_name": name,
                        "primary_name": person["name_zh"],
                    }
                )

    collisions = []
    for normalized, matches in sorted(index.items()):
        person_ids = sorted({match["person_id"] for match in matches})
        if len(person_ids) > 1:
            collisions.append(
                {
                    "normalized_name": normalized,
                    "person_ids": person_ids,
                    "matches": matches,
                }
            )
    return collisions


def main() -> None:
    parser = argparse.ArgumentParser(description="Detect identical names and aliases.")
    parser.add_argument(
        "--persons", type=Path, default=PROCESSED_DIR / "persons.json"
    )
    args = parser.parse_args()
    collisions = detect_same_names(load_json(args.persons))
    print(f"same-name collision groups: {len(collisions)}")
    for collision in collisions:
        print(collision)


if __name__ == "__main__":
    main()

