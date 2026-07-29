from __future__ import annotations

import argparse
from collections import defaultdict
from pathlib import Path
from typing import Any

from pipeline_common import PROCESSED_DIR, load_json


SYMMETRIC_TYPES = {"spouse", "sibling", "clan"}
INVERSE_TYPES = {
    "father": "child",
    "mother": "child",
    "adoptive_parent": "adoptive_child",
    "adoptive_child": "adoptive_parent",
}


def directed_key(relation: dict[str, Any]) -> tuple[str, str, str, str]:
    source_id = relation["source_id"]
    target_id = relation["target_id"]
    relation_type = relation["relation_type"]
    universe = relation["universe"]
    if relation_type in SYMMETRIC_TYPES:
        source_id, target_id = sorted((source_id, target_id))
    return source_id, target_id, relation_type, universe


def semantic_key(relation: dict[str, Any]) -> tuple[str, str, str]:
    source_id = relation["source_id"]
    target_id = relation["target_id"]
    relation_type = relation["relation_type"]
    if relation_type in SYMMETRIC_TYPES:
        source_id, target_id = sorted((source_id, target_id))
        return source_id, target_id, relation_type
    if relation_type in {"father", "mother", "adoptive_parent"}:
        return source_id, target_id, relation_type
    if relation_type == "child":
        return target_id, source_id, "parent_or_child"
    if relation_type == "adoptive_child":
        return target_id, source_id, "adoptive_parent"
    return source_id, target_id, relation_type


def detect_duplicate_relations(
    relations: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    groups: dict[tuple[str, str, str, str], list[str]] = defaultdict(list)
    for relation in relations:
        groups[directed_key(relation)].append(relation["id"])
    return [
        {
            "key": list(key),
            "relation_ids": relation_ids,
        }
        for key, relation_ids in sorted(groups.items())
        if len(relation_ids) > 1
    ]


def detect_inverse_overlaps(
    relations: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    parent_pairs: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for relation in relations:
        relation_type = relation["relation_type"]
        if relation_type in {"father", "mother"}:
            pair = (relation["source_id"], relation["target_id"])
        elif relation_type == "child":
            pair = (relation["target_id"], relation["source_id"])
        else:
            continue
        parent_pairs[pair].append(relation)

    overlaps = []
    for pair, items in sorted(parent_pairs.items()):
        types = {item["relation_type"] for item in items}
        if "child" in types and ({"father", "mother"} & types):
            overlaps.append(
                {
                    "child_id": pair[0],
                    "parent_id": pair[1],
                    "relation_ids": [item["id"] for item in items],
                    "relation_types": sorted(types),
                }
            )
    return overlaps


def main() -> None:
    parser = argparse.ArgumentParser(description="Detect duplicate relations.")
    parser.add_argument(
        "--relations", type=Path, default=PROCESSED_DIR / "relations.json"
    )
    args = parser.parse_args()
    relations = load_json(args.relations)
    duplicates = detect_duplicate_relations(relations)
    inverse_overlaps = detect_inverse_overlaps(relations)
    print(f"exact/symmetric duplicates: {len(duplicates)}")
    print(f"parent-child inverse overlaps: {len(inverse_overlaps)}")


if __name__ == "__main__":
    main()

