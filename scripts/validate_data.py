from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from detect_dangling_relations import detect_dangling_relations
from detect_duplicate_relations import (
    detect_duplicate_relations,
    detect_inverse_overlaps,
)
from detect_same_names import detect_same_names
from pipeline_common import PROCESSED_DIR, SCHEMAS_DIR, load_json, write_json


def schema_errors(instance: Any, schema_path: Path) -> list[dict[str, Any]]:
    try:
        from jsonschema import Draft202012Validator, FormatChecker
    except ImportError as exc:
        raise RuntimeError(
            "jsonschema is required for validation; install jsonschema>=4.18,<5"
        ) from exc

    schema = load_json(schema_path)
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    result = []
    for error in sorted(validator.iter_errors(instance), key=lambda item: list(item.path)):
        result.append(
            {
                "path": "/".join(str(part) for part in error.absolute_path),
                "message": error.message,
            }
        )
    return result


def validate(
    persons_path: Path,
    relations_path: Path,
    report_path: Path,
) -> dict[str, Any]:
    persons = load_json(persons_path)
    relations = load_json(relations_path)

    person_schema_errors = schema_errors(
        persons, SCHEMAS_DIR / "persons.schema.json"
    )
    relation_schema_errors = schema_errors(
        relations, SCHEMAS_DIR / "relations.schema.json"
    )
    same_names = detect_same_names(persons)
    duplicate_relations = detect_duplicate_relations(relations)
    inverse_overlaps = detect_inverse_overlaps(relations)
    dangling_relations = detect_dangling_relations(persons, relations)
    invalid_date_ranges = [
        {
            "person_id": person["id"],
            "birth_year": person["birth_year"],
            "death_year": person["death_year"],
        }
        for person in persons
        if person["birth_year"] is not None
        and person["death_year"] is not None
        and person["birth_year"] > person["death_year"]
    ]
    self_relations = [
        relation["id"]
        for relation in relations
        if relation["source_id"] == relation["target_id"]
    ]

    errors = []
    if person_schema_errors:
        errors.append("persons_schema_failed")
    if relation_schema_errors:
        errors.append("relations_schema_failed")
    if duplicate_relations:
        errors.append("duplicate_relations_found")
    if dangling_relations:
        errors.append("dangling_relations_found")
    if invalid_date_ranges:
        errors.append("invalid_date_ranges_found")
    if self_relations:
        errors.append("self_relations_found")

    warnings = []
    if same_names:
        warnings.append("same_name_candidates_require_review")
    if inverse_overlaps:
        warnings.append("parent_child_inverse_overlaps_require_review")
    unverified_count = sum(not relation["verified"] for relation in relations)
    if unverified_count:
        warnings.append("wikidata_relations_are_not_independently_verified")

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "status": "pass" if not errors else "fail",
        "scope": "core_families_v1",
        "summary": {
            "person_count": len(persons),
            "relation_count": len(relations),
            "verified_relation_count": len(relations) - unverified_count,
            "unverified_relation_count": unverified_count,
            "historical_relation_count": sum(
                relation["universe"] == "historical" for relation in relations
            ),
            "novel_relation_count": sum(
                relation["universe"] == "novel" for relation in relations
            ),
            "folklore_relation_count": sum(
                relation["universe"] == "folklore" for relation in relations
            ),
            "uncertain_relation_count": sum(
                relation["universe"] == "uncertain" for relation in relations
            ),
        },
        "errors": errors,
        "warnings": warnings,
        "checks": {
            "persons_schema": {
                "status": "pass" if not person_schema_errors else "fail",
                "errors": person_schema_errors,
            },
            "relations_schema": {
                "status": "pass" if not relation_schema_errors else "fail",
                "errors": relation_schema_errors,
            },
            "same_names": {
                "status": "review" if same_names else "pass",
                "count": len(same_names),
                "items": same_names,
            },
            "duplicate_relations": {
                "status": "pass" if not duplicate_relations else "fail",
                "count": len(duplicate_relations),
                "items": duplicate_relations,
            },
            "parent_child_inverse_overlaps": {
                "status": "review" if inverse_overlaps else "pass",
                "count": len(inverse_overlaps),
                "items": inverse_overlaps,
            },
            "dangling_relations": {
                "status": "pass" if not dangling_relations else "fail",
                "count": len(dangling_relations),
                "items": dangling_relations,
            },
            "invalid_date_ranges": {
                "status": "pass" if not invalid_date_ranges else "fail",
                "count": len(invalid_date_ranges),
                "items": invalid_date_ranges,
            },
            "self_relations": {
                "status": "pass" if not self_relations else "fail",
                "count": len(self_relations),
                "items": self_relations,
            },
        },
    }
    write_json(report_path, report)
    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate processed kinship data.")
    parser.add_argument(
        "--persons", type=Path, default=PROCESSED_DIR / "persons.json"
    )
    parser.add_argument(
        "--relations", type=Path, default=PROCESSED_DIR / "relations.json"
    )
    parser.add_argument(
        "--report",
        type=Path,
        default=PROCESSED_DIR / "validation_report.json",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    report = validate(args.persons, args.relations, args.report)
    print(
        f"Validation {report['status']}: "
        f"{report['summary']['person_count']} persons, "
        f"{report['summary']['relation_count']} relations."
    )
    if report["errors"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

