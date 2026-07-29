# 三国人物亲属关系数据管线

本项目面向三国历史人物亲属关系图。第一版仅覆盖曹操、刘备、孙权、司马懿四个核心人物的一跳亲属，并明确区分历史人物、小说人物、民间传说和暂不能判定的记录。

## 数据原则

- 不把《三国演义》或衍生人物图谱直接当作正史。
- GitHub 参考仓库无明确许可证时一律登记为 `reference_only`，不导入 processed 数据。
- Wikidata 是发现候选关系的结构化入口，不等于史料核验。自动导入关系均为 `verified: false`。
- `verified: true` 仅保留给后续已经由人工对照可靠历史文献的记录。
- 不依据同姓推断 `clan`，也不把普通亲生关系推断为收养关系。
- 原始响应缓存在 `data/raw/wikidata/cache/`；清洗脚本只读取，不改写原始下载内容。

## 目录

```text
config/                 四个核心家族和 Wikidata 属性配置
data/raw/               外部仓库及 Wikidata 原始缓存（不纳入 Git）
data/interim/           标准化过程文件（可重建）
data/processed/         前端和下游使用的最终 JSON
data/sources/           数据源、许可证和用途登记
schemas/                persons.json 与 relations.json 的 JSON Schema
scripts/                下载、标准化、检测和流水线脚本
```

## 运行

需要 Python 3.10+。JSON Schema 校验使用 `jsonschema`；如果环境中没有，可先安装：

```powershell
py -3.12 -m pip install "jsonschema>=4.18,<5"
```

完整运行：

```powershell
py -3.12 scripts/run_pipeline.py
```

分步运行：

```powershell
py -3.12 scripts/download_wikidata.py --depth 1 --batch-size 100
py -3.12 scripts/normalize_data.py
py -3.12 scripts/validate_data.py
```

`download_wikidata.py` 会拒绝大于 100 的批大小；鉴于 Wikidata 匿名 API 当前单批上限为 50，脚本还会把实际请求自动收紧到 50。再次运行会优先复用缓存。要做历史史料校订，可在 `data/interim/curation_overrides.json` 中覆盖关系的 `universe`、`confidence` 和 `verified`，但必须同时加入可追溯来源。

## 关系语义

- `father` / `mother`：source 人物的父亲 / 母亲是 target。
- `child`：source 人物的子女是 target；若同一亲子对已有更具体的 `father` 或 `mother`，标准化时不重复保留 `child`。
- `spouse` / `sibling`：对称关系，输出时每对人物只保留一条。
- `adoptive_parent` / `adoptive_child`：仅接受明确来源，不从普通父母子女关系推断。
- `clan`：仅用于有明确宗族依据的人物对，不按姓氏自动推断。

前端直接读取 `data/processed/graph.json`，当前流程不需要 Neo4j。
