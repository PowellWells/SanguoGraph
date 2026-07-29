from __future__ import annotations

import argparse
import hashlib
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from pipeline_common import (
    CACHE_DIR,
    CONFIG_PATH,
    DOWNLOAD_MANIFEST_PATH,
    SOURCES_PATH,
    load_json,
    write_json,
)


API_URL = "https://www.wikidata.org/w/api.php"
WIKIDATA_ANONYMOUS_BATCH_LIMIT = 50
DEFAULT_USER_AGENT = (
    "SanGuoKinshipPipeline/0.1 "
    "(Wikidata batch downloader; https://github.com/; local research project)"
)


def chunks(values: list[str], size: int) -> Iterable[list[str]]:
    for start in range(0, len(values), size):
        yield values[start : start + size]


def cache_key(qids: list[str]) -> str:
    stable = "|".join(sorted(qids)).encode("ascii")
    return hashlib.sha256(stable).hexdigest()[:16]


def request_entities(
    qids: list[str],
    cache_dir: Path,
    user_agent: str,
    retries: int = 4,
) -> tuple[dict[str, Any], Path, bool, str]:
    if not 1 <= len(qids) <= 100:
        raise ValueError(f"Wikidata batch must contain 1..100 entities, got {len(qids)}")

    key = cache_key(qids)
    cache_path = cache_dir / f"entities_{key}.json"
    if cache_path.exists():
        return load_json(cache_path), cache_path, True, datetime.fromtimestamp(
            cache_path.stat().st_mtime, tz=timezone.utc
        ).isoformat()

    params = urllib.parse.urlencode(
        {
            "action": "wbgetentities",
            "ids": "|".join(qids),
            "props": "labels|aliases|claims",
            "languages": "zh|zh-hans|zh-hant|en",
            "languagefallback": "1",
            "format": "json",
            "formatversion": "2",
            "origin": "*",
        }
    )
    request = urllib.request.Request(
        f"{API_URL}?{params}",
        headers={
            "User-Agent": user_agent,
            "Accept": "application/json",
        },
    )

    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload_bytes = response.read()
            payload = json.loads(payload_bytes.decode("utf-8"))
            if "error" in payload:
                raise RuntimeError(f"Wikidata API error: {payload['error']}")
            cache_dir.mkdir(parents=True, exist_ok=True)
            # Cache the response exactly as parsed from the API; later stages never edit it.
            write_json(cache_path, payload)
            retrieved_at = datetime.now(timezone.utc).isoformat()
            return payload, cache_path, False, retrieved_at
        except (urllib.error.URLError, TimeoutError, RuntimeError) as exc:
            last_error = exc
            if attempt + 1 < retries:
                time.sleep(2**attempt)
    raise RuntimeError(f"Failed to download Wikidata batch {qids}: {last_error}")


def entity_map(payload: dict[str, Any]) -> dict[str, dict[str, Any]]:
    entities = payload.get("entities", {})
    if isinstance(entities, list):
        return {
            entity["id"]: entity
            for entity in entities
            if isinstance(entity, dict) and entity.get("id")
        }
    return {
        qid: entity
        for qid, entity in entities.items()
        if isinstance(entity, dict) and not entity.get("missing")
    }


def claim_item_targets(entity: dict[str, Any], property_ids: set[str]) -> set[str]:
    targets: set[str] = set()
    claims = entity.get("claims", {})
    for property_id in property_ids:
        for statement in claims.get(property_id, []):
            if statement.get("rank") == "deprecated":
                continue
            datavalue = (
                statement.get("mainsnak", {})
                .get("datavalue", {})
                .get("value")
            )
            if isinstance(datavalue, dict):
                qid = datavalue.get("id")
                if isinstance(qid, str) and qid.startswith("Q"):
                    targets.add(qid)
    return targets


def update_source_registry(downloaded_at: str) -> None:
    registry = load_json(SOURCES_PATH)
    for source in registry["sources"]:
        if source["id"] == "wikidata":
            source["downloaded_at"] = downloaded_at
            break
    write_json(SOURCES_PATH, registry)


def download(depth: int, batch_size: int, config_path: Path) -> dict[str, Any]:
    if depth < 0:
        raise ValueError("--depth must be zero or greater")
    if not 1 <= batch_size <= 100:
        raise ValueError("--batch-size must be between 1 and 100")
    effective_batch_size = min(batch_size, WIKIDATA_ANONYMOUS_BATCH_LIMIT)

    config = load_json(config_path)
    relation_property_ids = set(config["wikidata_properties"].values())
    seeds = sorted({family["root_qid"] for family in config["families"]})
    user_agent = os.environ.get("WIKIDATA_USER_AGENT", DEFAULT_USER_AGENT)

    all_entities: dict[str, dict[str, Any]] = {}
    frontier = seeds
    seen: set[str] = set()
    batch_records: list[dict[str, Any]] = []

    for level in range(depth + 1):
        requested = sorted(set(frontier) - seen)
        if not requested:
            break
        next_frontier: set[str] = set()
        for batch in chunks(requested, effective_batch_size):
            payload, cache_path, from_cache, retrieved_at = request_entities(
                batch, CACHE_DIR, user_agent
            )
            entities = entity_map(payload)
            all_entities.update(entities)
            seen.update(batch)
            batch_records.append(
                {
                    "level": level,
                    "qids": batch,
                    "entity_count": len(entities),
                    "cache_path": cache_path.relative_to(
                        DOWNLOAD_MANIFEST_PATH.parents[2]
                    ).as_posix(),
                    "from_cache": from_cache,
                    "retrieved_at": retrieved_at,
                }
            )
            if level < depth:
                for entity in entities.values():
                    next_frontier.update(
                        claim_item_targets(entity, relation_property_ids)
                    )
        frontier = sorted(next_frontier - seen)

    generated_at = datetime.now(timezone.utc).isoformat()
    manifest = {
        "manifest_version": 1,
        "generated_at": generated_at,
        "api_url": API_URL,
        "config_path": config_path.relative_to(config_path.parents[1]).as_posix(),
        "scope": config["scope"],
        "depth": depth,
        "requested_batch_size": batch_size,
        "effective_batch_size": effective_batch_size,
        "batch_limit_enforced": 100,
        "wikidata_anonymous_batch_limit": WIKIDATA_ANONYMOUS_BATCH_LIMIT,
        "seed_qids": seeds,
        "entity_qids": sorted(all_entities),
        "batches": batch_records,
    }
    write_json(DOWNLOAD_MANIFEST_PATH, manifest)
    update_source_registry(generated_at)
    return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download and immutably cache Wikidata entities in batches."
    )
    parser.add_argument("--depth", type=int, default=1)
    parser.add_argument("--batch-size", type=int, default=100)
    parser.add_argument("--config", type=Path, default=CONFIG_PATH)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    manifest = download(args.depth, args.batch_size, args.config.resolve())
    print(
        f"Cached {len(manifest['entity_qids'])} Wikidata entities "
        f"in {len(manifest['batches'])} batch(es)."
    )


if __name__ == "__main__":
    main()
