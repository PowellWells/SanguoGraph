from __future__ import annotations

import hashlib
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from pipeline_common import (
    CONFIG_PATH,
    DOWNLOAD_MANIFEST_PATH,
    INTERIM_DIR,
    PROCESSED_DIR,
    load_json,
    person_id,
    wikidata_url,
    write_json,
)


LANGUAGE_PREFERENCE = ("zh", "zh-hans", "zh-cn", "zh-hant", "zh-tw", "en")
SYMMETRIC_RELATIONS = {"spouse", "sibling", "clan"}


def load_cached_entities(manifest: dict[str, Any]) -> dict[str, dict[str, Any]]:
    project_root = DOWNLOAD_MANIFEST_PATH.parents[2]
    entities: dict[str, dict[str, Any]] = {}
    for batch in manifest["batches"]:
        payload = load_json(project_root / batch["cache_path"])
        raw_entities = payload.get("entities", {})
        if isinstance(raw_entities, list):
            for entity in raw_entities:
                if isinstance(entity, dict) and entity.get("id"):
                    entities[entity["id"]] = entity
        else:
            for qid, entity in raw_entities.items():
                if isinstance(entity, dict) and not entity.get("missing"):
                    entities[qid] = entity
    return entities


def language_value(values: dict[str, Any]) -> str | None:
    for language in LANGUAGE_PREFERENCE:
        item = values.get(language)
        if isinstance(item, dict) and item.get("value"):
            return item["value"]
    for item in values.values():
        if isinstance(item, dict) and item.get("value"):
            return item["value"]
    return None


def labels(entity: dict[str, Any]) -> str:
    return language_value(entity.get("labels", {})) or entity["id"]


def aliases(entity: dict[str, Any], primary_name: str) -> list[str]:
    result: set[str] = set()
    alias_map = entity.get("aliases", {})
    for language in LANGUAGE_PREFERENCE:
        for item in alias_map.get(language, []):
            value = item.get("value")
            if value and value != primary_name:
                result.add(value)
    return sorted(result)


def statements(entity: dict[str, Any], property_id: str) -> list[dict[str, Any]]:
    return [
        statement
        for statement in entity.get("claims", {}).get(property_id, [])
        if statement.get("rank") != "deprecated"
    ]


def statement_value(statement: dict[str, Any]) -> Any:
    return statement.get("mainsnak", {}).get("datavalue", {}).get("value")


def item_targets(entity: dict[str, Any], property_id: str) -> list[tuple[str, str]]:
    result = []
    for statement in statements(entity, property_id):
        value = statement_value(statement)
        if isinstance(value, dict) and isinstance(value.get("id"), str):
            result.append((value["id"], statement.get("id", "")))
    return result


def year_from_time(entity: dict[str, Any], property_id: str) -> int | None:
    for statement in statements(entity, property_id):
        value = statement_value(statement)
        if not isinstance(value, dict):
            continue
        # Wikidata encodes a century such as the 3rd century with a placeholder
        # time like +0200-00-00 and precision=7. Treating that as the exact year
        # 200 would create false dates, so this integer field only accepts
        # year-level (or more precise) statements.
        precision = value.get("precision")
        if not isinstance(precision, int) or precision < 9:
            continue
        time_value = value.get("time")
        if not isinstance(time_value, str) or len(time_value) < 5:
            continue
        sign = -1 if time_value.startswith("-") else 1
        digits = time_value[1:5]
        if digits.isdigit():
            return sign * int(digits)
    return None


def courtesy_name(
    entity: dict[str, Any],
    property_id: str,
    entities: dict[str, dict[str, Any]],
) -> str | None:
    for statement in statements(entity, property_id):
        value = statement_value(statement)
        if isinstance(value, str) and value.strip():
            return value.strip()
        if isinstance(value, dict):
            if isinstance(value.get("text"), str):
                return value["text"]
            qid = value.get("id")
            if qid in entities:
                return labels(entities[qid])
    return None


def instance_qids(entity: dict[str, Any], property_id: str) -> set[str]:
    return {qid for qid, _ in item_targets(entity, property_id)}


def entity_universe(entity: dict[str, Any], config: dict[str, Any]) -> str:
    instance_of = instance_qids(
        entity, config["person_properties"]["instance_of"]
    )
    if instance_of & set(config["fictional_entity_qids"]):
        return "novel"
    if instance_of & set(config["historical_human_qids"]):
        return "historical"
    return "uncertain"


def relation_universe(
    source: dict[str, Any],
    target: dict[str, Any],
    config: dict[str, Any],
) -> str:
    universes = {
        entity_universe(source, config),
        entity_universe(target, config),
    }
    if "novel" in universes:
        return "novel"
    if universes == {"historical"}:
        return "historical"
    return "uncertain"


def family_membership(
    entities: dict[str, dict[str, Any]], config: dict[str, Any]
) -> dict[str, list[str]]:
    property_ids = set(config["wikidata_properties"].values())
    adjacency: dict[str, set[str]] = defaultdict(set)
    for qid, entity in entities.items():
        for property_id in property_ids:
            for target_qid, _ in item_targets(entity, property_id):
                if target_qid in entities:
                    adjacency[qid].add(target_qid)
                    adjacency[target_qid].add(qid)

    roots_by_person: dict[str, set[str]] = defaultdict(set)
    max_depth = 1
    for family in config["families"]:
        root = family["root_qid"]
        queue = deque([(root, 0)])
        seen = {root}
        while queue:
            qid, depth = queue.popleft()
            if qid in entities:
                roots_by_person[qid].add(root)
            if depth == max_depth:
                continue
            for neighbor in adjacency.get(qid, set()):
                if neighbor not in seen:
                    seen.add(neighbor)
                    queue.append((neighbor, depth + 1))
    return {qid: sorted(roots) for qid, roots in roots_by_person.items()}


def relation_id(
    source_id: str, target_id: str, relation_type: str, universe: str
) -> str:
    raw = f"{source_id}|{target_id}|{relation_type}|{universe}".encode("utf-8")
    return f"relation:{hashlib.sha256(raw).hexdigest()[:16]}"


def citation(qid: str, statement_id: str | None = None) -> dict[str, str]:
    result = {
        "dataset_id": "wikidata",
        "record_id": qid,
        "url": wikidata_url(qid),
    }
    if statement_id:
        result["locator"] = statement_id
    return result


def make_relation(
    source_qid: str,
    target_qid: str,
    relation_type: str,
    statement_id: str,
    entities: dict[str, dict[str, Any]],
    config: dict[str, Any],
) -> dict[str, Any]:
    source = person_id(source_qid)
    target = person_id(target_qid)
    if relation_type in SYMMETRIC_RELATIONS and target < source:
        source, target = target, source
    universe = relation_universe(
        entities[source_qid], entities[target_qid], config
    )
    confidence = {
        "historical": 0.8,
        "novel": 0.65,
        "folklore": 0.6,
        "uncertain": 0.5,
    }[universe]
    return {
        "id": relation_id(source, target, relation_type, universe),
        "source_id": source,
        "target_id": target,
        "relation_type": relation_type,
        "universe": universe,
        "confidence": confidence,
        "verified": False,
        "sources": [citation(source_qid, statement_id)],
    }


def normalize() -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    config = load_json(CONFIG_PATH)
    manifest = load_json(DOWNLOAD_MANIFEST_PATH)
    entities = load_cached_entities(manifest)
    membership = family_membership(entities, config)
    selected_qids = sorted(membership)
    root_factions = {
        family["root_qid"]: family["faction"] for family in config["families"]
    }

    persons = []
    for qid in selected_qids:
        entity = entities[qid]
        primary_name = labels(entity)
        person = {
            "id": person_id(qid),
            "name_zh": primary_name,
            "aliases": aliases(entity, primary_name),
            "courtesy_name": courtesy_name(
                entity,
                config["person_properties"]["courtesy_name"],
                entities,
            ),
            "birth_year": year_from_time(
                entity, config["person_properties"]["birth_date"]
            ),
            "death_year": year_from_time(
                entity, config["person_properties"]["death_date"]
            ),
            # Faction is only set where explicitly curated in core_families.json.
            "faction": root_factions.get(qid),
            "wikidata_id": qid,
            "family_roots": membership[qid],
            "sources": [citation(qid)],
        }
        persons.append(person)

    properties = config["wikidata_properties"]
    relation_by_key: dict[tuple[str, str, str, str], dict[str, Any]] = {}
    specific_parent_pairs: set[tuple[str, str]] = set()

    # Specific parent properties take precedence over generic child inverses.
    for relation_type in ("father", "mother"):
        property_id = properties[relation_type]
        for source_qid in selected_qids:
            for target_qid, statement_id in item_targets(
                entities[source_qid], property_id
            ):
                if target_qid not in membership:
                    continue
                relation = make_relation(
                    source_qid,
                    target_qid,
                    relation_type,
                    statement_id,
                    entities,
                    config,
                )
                key = (
                    relation["source_id"],
                    relation["target_id"],
                    relation["relation_type"],
                    relation["universe"],
                )
                relation_by_key.setdefault(key, relation)
                specific_parent_pairs.add(
                    (person_id(source_qid), person_id(target_qid))
                )

    for relation_type in ("spouse", "sibling", "child"):
        property_id = properties[relation_type]
        for source_qid in selected_qids:
            for target_qid, statement_id in item_targets(
                entities[source_qid], property_id
            ):
                if target_qid not in membership:
                    continue
                if relation_type == "child" and (
                    person_id(target_qid),
                    person_id(source_qid),
                ) in specific_parent_pairs:
                    continue
                relation = make_relation(
                    source_qid,
                    target_qid,
                    relation_type,
                    statement_id,
                    entities,
                    config,
                )
                key = (
                    relation["source_id"],
                    relation["target_id"],
                    relation["relation_type"],
                    relation["universe"],
                )
                existing = relation_by_key.get(key)
                if existing:
                    existing_locators = {
                        source.get("locator") for source in existing["sources"]
                    }
                    for source in relation["sources"]:
                        if source.get("locator") not in existing_locators:
                            existing["sources"].append(source)
                else:
                    relation_by_key[key] = relation

    relations = sorted(
        relation_by_key.values(),
        key=lambda relation: (
            relation["source_id"],
            relation["target_id"],
            relation["relation_type"],
        ),
    )
    persons.sort(key=lambda person: (person["name_zh"], person["wikidata_id"]))

    generated_at = datetime.now(timezone.utc).isoformat()
    graph = {
        "metadata": {
            "generated_at": generated_at,
            "scope": config["scope"],
            "family_roots": [
                {
                    "qid": family["root_qid"],
                    "name_zh": family["root_name_zh"],
                    "family": family["label"],
                }
                for family in config["families"]
            ],
            "relation_types": [
                "father",
                "mother",
                "spouse",
                "child",
                "sibling",
                "adoptive_parent",
                "adoptive_child",
                "clan",
            ],
            "universe_values": [
                "historical",
                "novel",
                "folklore",
                "uncertain",
            ],
            "note": "Wikidata-derived claims are discovery candidates and are not independently verified historical evidence.",
        },
        "nodes": [
            {
                "id": person["id"],
                "label": person["name_zh"],
                "aliases": person["aliases"],
                "courtesy_name": person["courtesy_name"],
                "birth_year": person["birth_year"],
                "death_year": person["death_year"],
                "faction": person["faction"],
                "wikidata_id": person["wikidata_id"],
                "family_roots": person["family_roots"],
            }
            for person in persons
        ],
        "links": relations,
    }

    write_json(PROCESSED_DIR / "persons.json", persons)
    write_json(PROCESSED_DIR / "relations.json", relations)
    write_json(PROCESSED_DIR / "graph.json", graph)
    write_json(
        INTERIM_DIR / "wikidata_normalized.json",
        {
            "generated_at": generated_at,
            "source_manifest": str(DOWNLOAD_MANIFEST_PATH),
            "persons": persons,
            "relations": relations,
        },
    )
    return persons, relations, graph


def main() -> None:
    persons, relations, _ = normalize()
    print(f"Wrote {len(persons)} persons and {len(relations)} relations.")


if __name__ == "__main__":
    main()
