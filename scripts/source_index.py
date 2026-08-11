from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sqlite3
import sys
import tempfile
import time
import unittest
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Iterable


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = PROJECT_ROOT / "config" / "source_corpus.json"
RAW_ROOT = PROJECT_ROOT / "data" / "raw" / "source_index"
DATABASE_PATH = PROJECT_ROOT / "data" / "interim" / "source_index.sqlite3"
USER_AGENT = (
    "SanguoGraphSourceIndexer/1.0 "
    "(https://github.com/powellwells/SanguoGraph)"
)
BLOCK_TAGS = {
    "blockquote",
    "br",
    "dd",
    "div",
    "dt",
    "li",
    "p",
    "table",
    "td",
    "th",
    "tr",
}
SKIPPED_TAGS = {"script", "style"}
SKIPPED_CLASSES = {
    "mw-editsection",
    "mw-references-wrap",
    "navbox",
    "reference",
}
SKIPPED_IDS = {"headerContainer"}


@dataclass(frozen=True)
class CorpusConfig:
    corpus_id: str
    work: str
    api_endpoint: str
    page_url_pattern: str
    page_title_pattern: str
    volume_start: int
    volume_end: int
    variant: str
    license_name: str
    license_url: str
    source_policy_url: str
    license_note: str

    def title(self, volume: int) -> str:
        return self.page_title_pattern.format(volume=volume)

    def page_url(self, volume: int) -> str:
        return self.page_url_pattern.format(volume=volume)

    def volumes(self) -> range:
        return range(self.volume_start, self.volume_end + 1)


@dataclass(frozen=True)
class TextSegment:
    section: str
    text: str


@dataclass(frozen=True)
class SearchResult:
    work: str
    volume: int
    section: str
    text: str
    page_url: str
    revision_id: int


class ArticleTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._segments: list[TextSegment] = []
        self._buffer: list[str] = []
        self._heading_buffer: list[str] = []
        self._section = "正文"
        self._heading_tag: str | None = None
        self._skip_depth = 0

    @property
    def segments(self) -> list[TextSegment]:
        self._flush()
        return self._segments

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        attributes = dict(attrs)
        class_names = set(attributes.get("class", "").split())
        if self._skip_depth > 0:
            self._skip_depth += 1
            return
        if (
            tag in SKIPPED_TAGS
            or attributes.get("id") in SKIPPED_IDS
            or class_names.intersection(SKIPPED_CLASSES)
        ):
            self._skip_depth = 1
            return
        if re.fullmatch(r"h[1-6]", tag):
            self._flush()
            self._heading_tag = tag
            self._heading_buffer = []
            return
        if tag in BLOCK_TAGS:
            self._flush()

    def handle_endtag(self, tag: str) -> None:
        if self._skip_depth > 0:
            self._skip_depth -= 1
            return
        if self._heading_tag == tag:
            heading = clean_text("".join(self._heading_buffer))
            if heading:
                self._section = heading
            self._heading_tag = None
            self._heading_buffer = []
            return
        if tag in BLOCK_TAGS:
            self._flush()

    def handle_data(self, data: str) -> None:
        if self._skip_depth > 0:
            return
        if self._heading_tag:
            self._heading_buffer.append(data)
        else:
            self._buffer.append(data)

    def _flush(self) -> None:
        text = clean_text("".join(self._buffer))
        self._buffer = []
        if len(text) < 2:
            return
        if self._segments and self._segments[-1] == TextSegment(
            self._section,
            text,
        ):
            return
        self._segments.append(TextSegment(self._section, text))


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def load_corpora() -> list[CorpusConfig]:
    payload = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    if payload.get("schemaVersion") != 1:
        raise ValueError("不支持的史料语料配置版本。")
    corpora: list[CorpusConfig] = []
    for item in payload.get("corpora", []):
        license_info = item["license"]
        corpora.append(
            CorpusConfig(
                corpus_id=item["id"],
                work=item["work"],
                api_endpoint=item["apiEndpoint"],
                page_url_pattern=item["pageUrlPattern"],
                page_title_pattern=item["pageTitlePattern"],
                volume_start=int(item["volumeStart"]),
                volume_end=int(item["volumeEnd"]),
                variant=item["variant"],
                license_name=license_info["name"],
                license_url=license_info["url"],
                source_policy_url=license_info["sourcePolicyUrl"],
                license_note=license_info["note"],
            )
        )
    if not corpora:
        raise ValueError("史料语料配置中没有 corpus。")
    return corpora


def atomic_write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w",
        encoding="utf-8",
        dir=path.parent,
        delete=False,
        suffix=".tmp",
    ) as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temporary_path = Path(handle.name)
    os.replace(temporary_path, path)


def request_json(
    endpoint: str,
    params: dict[str, str],
    retries: int = 5,
) -> dict[str, Any]:
    query = urllib.parse.urlencode(params)
    request = urllib.request.Request(
        f"{endpoint}?{query}",
        headers={
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
            "User-Agent": USER_AGENT,
        },
    )
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                content_encoding = response.headers.get("Content-Encoding")
                body = response.read()
                if content_encoding == "gzip":
                    import gzip

                    body = gzip.decompress(body)
                payload = json.loads(body.decode("utf-8"))
            if "error" in payload:
                error_code = payload["error"].get("code", "unknown")
                if error_code == "maxlag" and attempt + 1 < retries:
                    time.sleep(2 ** attempt)
                    continue
                raise RuntimeError(
                    f"MediaWiki API 错误：{error_code} "
                    f"{payload['error'].get('info', '')}"
                )
            return payload
        except (urllib.error.URLError, TimeoutError) as error:
            if attempt + 1 >= retries:
                raise RuntimeError(f"MediaWiki API 请求失败：{error}") from error
            time.sleep(2 ** attempt)
    raise RuntimeError("MediaWiki API 请求超过重试次数。")


def fetch_revision_manifest(
    corpus: CorpusConfig,
    delay_seconds: float,
) -> dict[str, Any]:
    pages: list[dict[str, Any]] = []
    titles = [corpus.title(volume) for volume in corpus.volumes()]
    for start in range(0, len(titles), 40):
        payload = request_json(
            corpus.api_endpoint,
            {
                "action": "query",
                "prop": "revisions",
                "rvprop": "ids|timestamp|sha1",
                "rvslots": "main",
                "titles": "|".join(titles[start : start + 40]),
                "format": "json",
                "formatversion": "2",
                "maxlag": "5",
            },
        )
        pages.extend(payload.get("query", {}).get("pages", []))
        time.sleep(delay_seconds)
    return {
        "corpusId": corpus.corpus_id,
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "pages": pages,
    }


def fetch_page(
    corpus: CorpusConfig,
    volume: int,
) -> dict[str, Any]:
    payload = request_json(
        corpus.api_endpoint,
        {
            "action": "parse",
            "page": corpus.title(volume),
            "prop": "text|wikitext|revid|displaytitle|sections",
            "variant": corpus.variant,
            "format": "json",
            "formatversion": "2",
            "maxlag": "5",
        },
    )
    if "parse" not in payload:
        raise RuntimeError(f"卷{volume} API 响应缺少 parse 数据。")
    payload["sourceIndex"] = {
        "corpusId": corpus.corpus_id,
        "volume": volume,
        "pageUrl": corpus.page_url(volume),
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "license": {
            "name": corpus.license_name,
            "url": corpus.license_url,
            "sourcePolicyUrl": corpus.source_policy_url,
            "note": corpus.license_note,
        },
    }
    return payload


def cached_revision_id(path: Path) -> int | None:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        return int(payload["parse"]["revid"])
    except (FileNotFoundError, KeyError, TypeError, ValueError, json.JSONDecodeError):
        return None


def download_corpus(
    corpus: CorpusConfig,
    refresh: bool,
    offline: bool,
    delay_seconds: float,
) -> None:
    corpus_root = RAW_ROOT / corpus.corpus_id
    manifest_path = corpus_root / "revision_manifest.json"
    if refresh and offline:
        raise ValueError("--refresh 与 --offline 不能同时使用。")
    if refresh or not manifest_path.exists():
        if offline:
            raise FileNotFoundError(f"离线模式缺少：{manifest_path}")
        print(f"下载 {corpus.work} 修订清单……")
        atomic_write_json(
            manifest_path,
            fetch_revision_manifest(corpus, delay_seconds),
        )

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    revision_ids = {
        page["title"]: int(page["revisions"][0]["revid"])
        for page in manifest.get("pages", [])
        if page.get("revisions")
    }

    for volume in corpus.volumes():
        page_path = corpus_root / f"volume-{volume:02d}.json"
        if page_path.exists():
            if not refresh:
                continue
            current_revision = revision_ids.get(corpus.title(volume))
            if current_revision == cached_revision_id(page_path):
                continue
        if offline:
            raise FileNotFoundError(f"离线模式缺少：{page_path}")
        print(f"下载 {corpus.work} 卷{volume:02d}……")
        atomic_write_json(page_path, fetch_page(corpus, volume))
        time.sleep(delay_seconds)


def parse_segments(html: str) -> list[TextSegment]:
    parser = ArticleTextParser()
    parser.feed(html)
    parser.close()
    return parser.segments


def revision_metadata(corpus: CorpusConfig) -> dict[str, dict[str, Any]]:
    path = RAW_ROOT / corpus.corpus_id / "revision_manifest.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    result: dict[str, dict[str, Any]] = {}
    for page in payload.get("pages", []):
        revisions = page.get("revisions", [])
        if revisions:
            result[page["title"]] = revisions[0]
    return result


def create_schema(connection: sqlite3.Connection) -> str:
    connection.executescript(
        """
        PRAGMA foreign_keys = ON;
        CREATE TABLE metadata (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
        CREATE TABLE documents (
          id INTEGER PRIMARY KEY,
          corpus_id TEXT NOT NULL,
          work TEXT NOT NULL,
          volume INTEGER NOT NULL,
          title TEXT NOT NULL,
          page_url TEXT NOT NULL,
          revision_id INTEGER NOT NULL,
          revision_timestamp TEXT NOT NULL,
          revision_sha1 TEXT NOT NULL,
          content_sha256 TEXT NOT NULL,
          fetched_at TEXT NOT NULL,
          license_name TEXT NOT NULL,
          license_url TEXT NOT NULL,
          source_policy_url TEXT NOT NULL,
          raw_path TEXT NOT NULL,
          plain_text TEXT NOT NULL,
          UNIQUE(corpus_id, volume)
        );
        CREATE TABLE segments (
          id INTEGER PRIMARY KEY,
          document_id INTEGER NOT NULL REFERENCES documents(id),
          ordinal INTEGER NOT NULL,
          section TEXT NOT NULL,
          text TEXT NOT NULL,
          UNIQUE(document_id, ordinal)
        );
        CREATE INDEX segments_document_id ON segments(document_id);
        """
    )
    try:
        connection.execute(
            "CREATE VIRTUAL TABLE segments_fts "
            "USING fts5(text, section, content='segments', "
            "content_rowid='id', tokenize='trigram')"
        )
        return "trigram"
    except sqlite3.OperationalError:
        return "none"


def build_database(corpora: Iterable[CorpusConfig]) -> None:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = DATABASE_PATH.with_suffix(".sqlite3.tmp")
    if temporary_path.exists():
        temporary_path.unlink()
    connection = sqlite3.connect(temporary_path)
    try:
        tokenizer = create_schema(connection)
        document_count = 0
        segment_count = 0
        latest_fetch = ""
        for corpus in corpora:
            metadata_by_title = revision_metadata(corpus)
            for volume in corpus.volumes():
                raw_path = (
                    RAW_ROOT
                    / corpus.corpus_id
                    / f"volume-{volume:02d}.json"
                )
                payload = json.loads(raw_path.read_text(encoding="utf-8"))
                parsed = payload["parse"]
                source_index = payload["sourceIndex"]
                title = parsed["title"]
                revision = metadata_by_title.get(title, {})
                revision_id = int(parsed["revid"])
                revision_timestamp = str(revision.get("timestamp", ""))
                revision_sha1 = str(revision.get("sha1", ""))
                wikitext = str(parsed.get("wikitext", ""))
                html = str(parsed.get("text", ""))
                segments = parse_segments(html)
                if not segments:
                    raise RuntimeError(f"{title} 没有可索引正文。")
                plain_text = "\n".join(segment.text for segment in segments)
                cursor = connection.execute(
                    """
                    INSERT INTO documents (
                      corpus_id, work, volume, title, page_url,
                      revision_id, revision_timestamp, revision_sha1,
                      content_sha256, fetched_at, license_name,
                      license_url, source_policy_url, raw_path, plain_text
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        corpus.corpus_id,
                        corpus.work,
                        volume,
                        title,
                        source_index["pageUrl"],
                        revision_id,
                        revision_timestamp,
                        revision_sha1,
                        hashlib.sha256(wikitext.encode("utf-8")).hexdigest(),
                        source_index["fetchedAt"],
                        corpus.license_name,
                        corpus.license_url,
                        corpus.source_policy_url,
                        raw_path.relative_to(PROJECT_ROOT).as_posix(),
                        plain_text,
                    ),
                )
                document_id = int(cursor.lastrowid)
                connection.executemany(
                    """
                    INSERT INTO segments (document_id, ordinal, section, text)
                    VALUES (?, ?, ?, ?)
                    """,
                    [
                        (document_id, ordinal, segment.section, segment.text)
                        for ordinal, segment in enumerate(segments, start=1)
                    ],
                )
                document_count += 1
                segment_count += len(segments)
                latest_fetch = max(latest_fetch, source_index["fetchedAt"])
        connection.executemany(
            "INSERT INTO metadata (key, value) VALUES (?, ?)",
            [
                ("schema_version", "1"),
                ("fts_tokenizer", tokenizer),
                ("document_count", str(document_count)),
                ("segment_count", str(segment_count)),
                ("latest_fetch", latest_fetch),
                ("built_at", datetime.now(timezone.utc).isoformat()),
            ],
        )
        if tokenizer == "trigram":
            connection.execute(
                "INSERT INTO segments_fts(segments_fts) VALUES('rebuild')"
            )
        connection.commit()
    finally:
        connection.close()
    os.replace(temporary_path, DATABASE_PATH)


def database_metadata(connection: sqlite3.Connection) -> dict[str, str]:
    return dict(connection.execute("SELECT key, value FROM metadata"))


def search_database(
    connection: sqlite3.Connection,
    query: str,
    limit: int,
    volume: int | None,
) -> list[SearchResult]:
    query = clean_text(query)
    if not query:
        raise ValueError("搜索词不能为空。")
    metadata = database_metadata(connection)
    use_fts = metadata.get("fts_tokenizer") == "trigram" and len(query) >= 3
    volume_clause = " AND d.volume = ?" if volume is not None else ""
    parameters: list[Any]
    if use_fts:
        escaped = '"' + query.replace('"', '""') + '"'
        sql = f"""
          SELECT d.work, d.volume, s.section, s.text, d.page_url,
                 d.revision_id
          FROM segments_fts
          JOIN segments s ON s.id = segments_fts.rowid
          JOIN documents d ON d.id = s.document_id
          WHERE segments_fts MATCH ?{volume_clause}
          ORDER BY bm25(segments_fts), d.volume, s.ordinal
          LIMIT ?
        """
        parameters = [escaped]
    else:
        sql = f"""
          SELECT d.work, d.volume, s.section, s.text, d.page_url,
                 d.revision_id
          FROM segments s
          JOIN documents d ON d.id = s.document_id
          WHERE instr(s.text, ?) > 0{volume_clause}
          ORDER BY d.volume, s.ordinal
          LIMIT ?
        """
        parameters = [query]
    if volume is not None:
        parameters.append(volume)
    parameters.append(limit)
    return [SearchResult(*row) for row in connection.execute(sql, parameters)]


def highlighted_excerpt(text: str, query: str, radius: int = 48) -> str:
    position = text.find(query)
    if position < 0:
        return text[: radius * 2] + ("…" if len(text) > radius * 2 else "")
    start = max(0, position - radius)
    end = min(len(text), position + len(query) + radius)
    prefix = "…" if start > 0 else ""
    suffix = "…" if end < len(text) else ""
    return (
        prefix
        + text[start:position]
        + "【"
        + text[position : position + len(query)]
        + "】"
        + text[position + len(query) : end]
        + suffix
    )


def command_build(args: argparse.Namespace) -> None:
    corpora = load_corpora()
    for corpus in corpora:
        download_corpus(
            corpus,
            refresh=args.refresh,
            offline=args.offline,
            delay_seconds=args.delay,
        )
    print("构建 SQLite 史料索引……")
    build_database(corpora)
    command_status(argparse.Namespace())


def command_search(args: argparse.Namespace) -> None:
    if not DATABASE_PATH.exists():
        raise FileNotFoundError("本地史料索引不存在，请先运行 npm run sources:build。")
    query = " ".join(args.query)
    connection = sqlite3.connect(DATABASE_PATH)
    try:
        results = search_database(connection, query, args.limit, args.volume)
    finally:
        connection.close()
    if not results:
        print(f"没有找到：{query}")
        return
    for index, result in enumerate(results, start=1):
        print(
            f"[{index}] 《{result.work}》卷{result.volume:02d} · "
            f"{result.section} · revision {result.revision_id}"
        )
        print(highlighted_excerpt(result.text, query))
        print(result.page_url)


def command_status(_: argparse.Namespace) -> None:
    if not DATABASE_PATH.exists():
        print("本地史料索引尚未建立。")
        return
    connection = sqlite3.connect(DATABASE_PATH)
    try:
        metadata = database_metadata(connection)
        works = connection.execute(
            "SELECT work, COUNT(*) FROM documents GROUP BY work ORDER BY work"
        ).fetchall()
    finally:
        connection.close()
    size_mib = DATABASE_PATH.stat().st_size / 1024 / 1024
    print(
        f"史料索引：{metadata.get('document_count', '0')} 卷，"
        f"{metadata.get('segment_count', '0')} 个文本段，"
        f"FTS={metadata.get('fts_tokenizer', 'none')}，"
        f"{size_mib:.2f} MiB。"
    )
    for work, count in works:
        print(f"- {work}：{count} 卷")
    print(f"最近抓取：{metadata.get('latest_fetch', '未知')}")
    print(f"数据库：{DATABASE_PATH}")


class SourceIndexTests(unittest.TestCase):
    def test_html_parser_keeps_sections_and_removes_edit_controls(self) -> None:
        segments = parse_segments(
            '<h2>先主传<span class="mw-editsection">编辑</span></h2>'
            '<p>先主姓刘，讳备。</p><sup class="reference">[1]</sup>'
        )
        self.assertEqual(
            segments,
            [TextSegment("先主传", "先主姓刘，讳备。")],
        )

    def test_excerpt_marks_exact_query(self) -> None:
        self.assertIn("【刘备】", highlighted_excerpt("先主刘备字玄德", "刘备"))

    def test_parser_skips_wikisource_header(self) -> None:
        segments = parse_segments(
            '<div id="headerContainer"><p>参阅维基百科中的：刘备</p></div>'
            '<h2>先主 刘备</h2><p>先主姓刘，讳备，字玄德。</p>'
        )
        self.assertEqual(
            segments,
            [TextSegment("先主 刘备", "先主姓刘，讳备，字玄德。")],
        )

    def test_cached_revision_id_reads_parse_revision(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "volume.json"
            path.write_text('{"parse":{"revid":2583378}}', encoding="utf-8")
            self.assertEqual(cached_revision_id(path), 2583378)

    def test_sqlite_search_supports_two_character_names(self) -> None:
        connection = sqlite3.connect(":memory:")
        tokenizer = create_schema(connection)
        connection.executemany(
            "INSERT INTO metadata (key, value) VALUES (?, ?)",
            [("fts_tokenizer", tokenizer), ("schema_version", "1")],
        )
        document_id = connection.execute(
            """
            INSERT INTO documents VALUES (
              NULL, 'test', '三国志', 32, '三國志/卷32', 'https://example.test',
              1, '', '', 'hash', 'now', 'license', 'https://license.test',
              'https://policy.test', 'raw.json', '先主刘备字玄德'
            )
            """
        ).lastrowid
        connection.execute(
            "INSERT INTO segments VALUES (NULL, ?, 1, '先主传', '先主刘备字玄德')",
            (document_id,),
        )
        if tokenizer == "trigram":
            connection.execute(
                "INSERT INTO segments_fts(segments_fts) VALUES('rebuild')"
            )
        results = search_database(connection, "刘备", 5, None)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].volume, 32)
        connection.close()


def command_test(_: argparse.Namespace) -> None:
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(SourceIndexTests)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    if not result.wasSuccessful():
        raise SystemExit(1)


def create_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="下载、索引和检索 SanguoGraph 本地史料语料。"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    build_parser = subparsers.add_parser("build", help="下载缺失快照并重建索引。")
    build_parser.add_argument("--refresh", action="store_true", help="重新下载全部快照。")
    build_parser.add_argument("--offline", action="store_true", help="只使用已有快照。")
    build_parser.add_argument(
        "--delay",
        type=float,
        default=0.2,
        help="连续 API 请求之间的秒数，默认 0.2。",
    )
    build_parser.set_defaults(handler=command_build)

    search_parser = subparsers.add_parser("search", help="搜索本地史料索引。")
    search_parser.add_argument("query", nargs="+", help="人物名或原文短语。")
    search_parser.add_argument("--limit", type=int, default=10, help="最多返回结果数。")
    search_parser.add_argument("--volume", type=int, help="只搜索指定卷次。")
    search_parser.set_defaults(handler=command_search)

    status_parser = subparsers.add_parser("status", help="显示本地索引状态。")
    status_parser.set_defaults(handler=command_status)

    test_parser = subparsers.add_parser("test", help="运行史料索引单元测试。")
    test_parser.set_defaults(handler=command_test)
    return parser


def main() -> None:
    parser = create_argument_parser()
    args = parser.parse_args()
    if getattr(args, "limit", 1) <= 0:
        parser.error("--limit 必须大于 0。")
    if getattr(args, "delay", 0) < 0:
        parser.error("--delay 不能小于 0。")
    try:
        args.handler(args)
    except (FileNotFoundError, RuntimeError, ValueError) as error:
        print(f"史料索引失败：{error}", file=sys.stderr)
        raise SystemExit(1) from error


if __name__ == "__main__":
    main()
