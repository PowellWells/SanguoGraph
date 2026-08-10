# 本地史料索引

本工具把可公开访问的史料文本缓存到本机，并建立可重复构建的 SQLite
全文索引。它用于快速发现人物、关系和原文线索，不会自动把检索结果写入正式人物或
关系数据。

## 当前语料

当前配置收录中文维基文库《三国志》卷 1—65。每卷记录页面 URL、修订版本号、
修订时间、内容哈希、抓取时间和许可证信息，以便后续核对具体版本。

- 语料配置：`config/source_corpus.json`
- 原始 API 缓存：`data/raw/source_index/`
- SQLite 索引：`data/interim/source_index.sqlite3`

`data/raw` 和 `data/interim` 均被 Git 忽略。仓库只保存配置和构建工具，不分发抓取的
全文或生成的数据库。

中文维基文库页面内容按 CC BY-SA 4.0 提供；实际引用时仍须保留原页面链接和修订
信息，并遵守项目的史料核验规则。

## 使用

需要 Node.js 18+ 和 Python 3。首次建立索引会串行访问 MediaWiki API：

```powershell
npm run sources:build
```

日常检索只访问本地 SQLite，不需要联网：

```powershell
npm run sources:search -- 刘备
npm run sources:search -- 刘备 --volume 32 --limit 5
npm run sources:search -- "先主姓刘"
npm run sources:status
```

离线重建和主动刷新：

```powershell
npm run sources:build -- --offline
npm run sources:refresh
```

`--offline` 只使用已有缓存；缺卷时会直接报错。`sources:refresh` 会重新检查页面修订，
仅重新抓取发生变化或尚未缓存的卷。

如果系统找不到 Python，可设置 `SANGUO_PYTHON` 为解释器路径。索引器只依赖 Python
标准库；支持 SQLite FTS5 trigram 时使用三元全文索引，否则自动退化为精确子串搜索。
两字姓名始终使用精确子串搜索，避免中文分词遗漏。

## 编辑流程

1. 用本地索引发现候选段落。
2. 打开结果中的页面链接，按修订版本核对正文、注文归属和上下文。
3. 判断它属于正史正文、裴注引文、文学材料还是程序推定。
4. 只把人工核验后的短引文、卷次与链接写入正式来源；不得把索引命中直接视为
   `confirmed` 关系。

这一层是研究辅助设施，不是应用后端，也不会被浏览器端或离线版加载。
