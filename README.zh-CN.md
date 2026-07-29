# SanguoGraph / 三国人物关系谱

[English](README.md)

SanguoGraph 是一个处于早期阶段、以可追溯史料为核心的三国历史人物关系知识图谱。
Milestone 1 展示曹操核心家庭，并严格分离已经核验的历史记录与外部结构化候选。

## 直接使用（无需安装）

双击仓库根目录的 [`index.html`](index.html) 即可在本地浏览器中使用完整图谱；
它会自动打开 [`offline/index.html`](offline/index.html)。
这个文件已经内嵌页面样式、程序和候选数据，不需要安装 Node.js、不需要启动服务器，
也不依赖网络连接。

项目维护者可运行以下命令重新生成并检查离线文件：

```powershell
npm run build:offline
npm run validate:offline
```

## Milestone 1

- 固定收录15名人物，全部使用项目本地 `person:sg:*` ID；
- 收录23条父亲、母亲、夫妻和收养基础关系；
- 每条正式关系可查看《三国志》卷次、短引文和原文链接；
- Cytoscape.js 图谱支持姓名、字、简繁体与别名搜索；
- 支持关系类型筛选和全部、1跳、2跳邻域；
- 使用桌面世代谱系与移动端双行谱系布局，并提供缩放和全图适配控制；
- Wikidata 候选层按需加载、默认关闭，失败不影响正式图谱；
- 保留桌面三栏和移动端纵向布局。

Wikidata QID 只保存为外部标识，不能成为项目主键，也不能单独支撑
`confirmed` 关系。

## 史料原则

- 正史正文、注引材料、文学叙事和结构化候选必须分层。
- `certainty` 表达关系判断，`reviewStatus` 表达编辑核验流程。
- `confirmed` 必须同时为 `verified`，并至少引用一条非结构化数据集的历史文献。
- 候选关系和未来程序派生关系不得写入正式关系 JSON。
- 不伪造短引文、卷次或链接。

请阅读[史料政策](docs/SOURCE_POLICY.md)和[数据模式](docs/DATA_SCHEMA.md)。

## 本地开发

需要 Node.js 18.18+ 和 npm：

```powershell
npm install
npm run dev
```

完整质量检查：

```powershell
npm run lint
npm run test
npm run validate:data
npm run validate:processed
npm run build
npm run build:offline
npm run validate:offline
npm audit --omit=dev
```

生产构建的 Vite base path 为 `/sanguo-graph/`，并使用 Hash 路由，
适配项目型 GitHub Pages 的直接刷新。

## Wikidata 候选管线

已提交的 `data/processed` 包含99人、738条 Wikidata 派生的未核验候选关系。
常规网页构建只在用户主动开启开关时按需加载候选模块；单文件离线版将同一份候选数据
内嵌到 `index.html`，但仍默认隐藏。两种构建都只适配15名正式人物范围内的 father、
mother、spouse；sibling、通用 child 和范围外记录均被忽略。

Python 管线、来源和许可证登记见
[候选数据管线](docs/CANDIDATE_PIPELINE.md)。CI 只按 JSON Schema 和固定
SHA-256 校验 processed 文件，不重新下载 Wikidata。

## 许可证

源代码采用 [MIT License](LICENSE)。当前历史数据由项目维护者整理，
独立数据许可证仍在[路线图](docs/ROADMAP.md)中评估；项目不会擅自把第三方数据
声明为 CC0。
