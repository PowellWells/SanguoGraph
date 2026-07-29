from __future__ import annotations

import json
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = PROJECT_ROOT / "config" / "core_families.json"
RAW_WIKIDATA_DIR = PROJECT_ROOT / "data" / "raw" / "wikidata"
CACHE_DIR = RAW_WIKIDATA_DIR / "cache"
DOWNLOAD_MANIFEST_PATH = RAW_WIKIDATA_DIR / "download_manifest.json"
INTERIM_DIR = PROJECT_ROOT / "data" / "interim"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
SOURCES_PATH = PROJECT_ROOT / "data" / "sources" / "sources.json"
SCHEMAS_DIR = PROJECT_ROOT / "schemas"

RELATION_TYPES = (
    "father",
    "mother",
    "spouse",
    "child",
    "sibling",
    "adoptive_parent",
    "adoptive_child",
    "clan",
)
UNIVERSES = ("historical", "novel", "folklore", "uncertain")


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def person_id(qid: str) -> str:
    return f"person:wd:{qid}"


def wikidata_url(qid: str) -> str:
    return f"https://www.wikidata.org/wiki/{qid}"

