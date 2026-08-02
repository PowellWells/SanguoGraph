# SanguoGraph / 三国人物关系谱

[English](README.md)

SanguoGraph 是一个处于早期阶段、以可追溯史料为核心的三国历史人物关系知识图谱。
当前正式层覆盖200名魏、蜀、吴及汉末群雄主要历史人物，并严格分离已经核验的
历史记录、展示阵营与外部结构化候选。

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

## 当前里程碑

- 固定收录200名人物，全部使用项目本地 `person:sg:*` ID；
- 保持33条父亲、母亲、夫妻、收养和宗族基础关系，不增加政治或战争关系线；
- 首次进入即在前端加载全部200名正式人物，没有当前类型关系的人物作为独立节点显示；
- 每条正式关系可查看《三国志》卷次、短引文和原文链接；
- Cytoscape.js 图谱支持姓名、字、简繁体与别名搜索；
- 支持关系类型筛选和全部、1跳、2跳邻域；
- 使用确定性的家庭分支放射布局，节点向四周扩展并自动避让，跨支线关系绕开
  无关人物；
- 大图默认保持可读缩放，支持平移、全图适配和关系标签智能显隐／强制显示；
- 点击关系可查看方向、时期、身份限定、证据方式、现代解释、争议与核验状态；
- 支持节点展开／收起、锁定、隐藏、保留分支、撤销和核心人物重置；
- 顶部史料数字会随当前筛选变化，并可打开对应人物、关系和原文列表；
- 正史直接记载、正史间接推定、其他古代史料、现代研究、文学作品、
  开放知识库候选和编辑者推断可分别开关；
- 搜索结果提供身份消歧信息，并支持拼音、身份和阵营检索；
- 支持当前200人范围内的双人物最短关系路径查询；
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

请阅读[主要人物范围](docs/MAJOR_PERSON_SCOPE.md)、
[史料政策](docs/SOURCE_POLICY.md)和[数据模式](docs/DATA_SCHEMA.md)。

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
内嵌到 `index.html`，但仍默认隐藏。两种构建都以200名正式人物为适配边界；
当前候选快照仍只覆盖其中一部分人物。sibling、通用 child 和范围外记录均被忽略。

Python 管线、来源和许可证登记见
[候选数据管线](docs/CANDIDATE_PIPELINE.md)。CI 只按 JSON Schema 和固定
SHA-256 校验 processed 文件，不重新下载 Wikidata。

## 许可证

源代码采用 [MIT License](LICENSE)。当前历史数据由项目维护者整理，
独立数据许可证仍在[路线图](docs/ROADMAP.md)中评估；项目不会擅自把第三方数据
声明为 CC0。
