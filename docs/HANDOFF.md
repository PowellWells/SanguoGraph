# 三国人物关系谱 · SanguoGraph 新窗口交班基线

更新时间：2026-08-14

基线版本：v1.0.0

目标分支：`main`

## 0. 新窗口接续说明（先读本节）

Round 1—10 已全部完成，SanguoGraph 当前路线图已经收口为 v1.0 稳定版。新窗口不要
继续以 Round 11 名义自动扩展旧路线；应先确认用户的新任务属于数据增补、界面功能、
发布维护还是新的知识图谱层，再建立独立范围和验收标准。

开始新任务前：

1. 运行 `git status --short --branch`，确认从最新 `main` 开始且没有未归属改动；
2. 阅读本文件中与任务有关的边界，不必重新扫描全部历史轮次文档；
3. 新开发使用 `codex/` 前缀专题分支，除非用户明确要求直接修改或推送 `main`；
4. 数据、许可证、前端去维基和离线直接打开能力均属于已冻结基线，不能无意回退。

## 1. 当前完成状态

### 路线图

- Milestone 0—3 已完成；
- Round 6 完成数据冻结；
- Round 7 完成史料浏览；
- Round 8 完成人物、关系、史料永久链接及长页面滚动修复；
- Round 9 完成结构化纠错、来源建议和数据许可证治理；
- Round 10 完成 CC BY 4.0 决策、v1.0 元数据、发布门禁和稳定版验收。

### 正式数据快照

- 人物：580；
- 正式家庭关系：358；
- 史料：189，其中 186 条被人物或关系使用并可浏览；
- 有关系人物：374；
- 孤立人物：206；
- 覆盖率：64.5%；
- 连通分量：58；
- 最大连通分量：241 人；
- 展示阵营：魏 286、蜀 122、吴 133、其他 39；
- 正式关系类型：父亲 199、母亲 54、婚姻 53、养父 6、养母 2、宗族／姻亲 44。

人物批次为 `1 | 2 | 3 | 4 | 5 | 6 | 7`。第六批是 232 位列传级全量人物，
第七批是 43 位遗漏审计人物。当前正式人物、关系和史料在 v1.0 不再继续改动，除非
新任务明确要求数据增补或纠错并提供足够证据。

### 已知未完成指标

第一阶段关系覆盖目标按 580 人重新计算为至少 380 人入网、至多 200 人孤立、覆盖率
至少 65.5%。当前仍差 6 人。v1.0 接受并记录这一证据约束缺口，不通过猜测关系、降低
证据标准或混入战争、官职、事件、阵营关系来填补。

## 2. 产品与技术现状

项目是纯前端 React 18、严格 TypeScript、Vite 6 和 Cytoscape.js 应用：

- 没有后端、数据库、登录、在线编辑或 AI API；
- 首次进入加载全部 580 人和 358 条关系；
- 支持人物搜索、身份消歧、阵营浏览、关系过滤、史料层过滤和双人物最短路径；
- 人物、关系和史料使用稳定 Hash Deep Link；
- 人物、关系和史料档案提供 GitHub 数据纠错和来源建议入口；
- 史料浏览支持典籍、卷篇、人物与关系检索，并区分人物定位、支持证据和反对证据；
- 网页版适配 GitHub Pages；离线版为单文件 `offline/index.html`。

根目录 `index.html` 必须继续保留 `file:` 到 `./offline/index.html` 的跳转。用户会直接
双击根文件使用应用；任何用户可见修改后必须重新运行：

```powershell
npm run build:offline
npm run validate:offline
```

## 3. 数据与史料红线

- 每条正式关系必须至少有一条非空原文摘录；
- `confirmed` 关系必须同时是 `verified`，并有非结构化候选史料支持；
- 正史正文、正史间接推定、其他古代史料、现代研究、文学作品和编辑者推断必须分层；
- 外部结构化数据只作候选线索，不能单独支撑正式关系；
- 不伪造引文、卷次、链接、生卒年、别名、身份或政治归属；
- `data/processed` 是内部只读候选层，不参与网页和离线构建，不手工编辑；
- 正式基础关系类型仍只有 `father_of`、`mother_of`、`spouse_of`、
  `adoptive_father_of`、`adoptive_mother_of`、`clan_relative_of`；
- 战争、敌对、主从、官职、联盟、事件、地点和阵营边需要新的里程碑决定，不能混入
  当前家庭关系层。

## 4. 前端发布边界

正式网页和离线成品不得显示、链接或打包维基体系名称、域名、候选数据或 QID。
书名、作者、卷次、篇章和合法使用的史料短摘录正常展示。内部研究脚本、候选管线和
维护文档可以保留必要的来源与许可证记录，但不得进入前端产物。

`scripts/frontend-policy-guard.ts`、`src/data/frontendPublicationPolicy.test.ts` 和
`scripts/validate-offline.ts` 会共同阻止禁用内容进入发布成品，不要绕过这些门禁。

## 5. 阵营与历史身份

“魏、蜀、吴、其他”是图谱颜色与空间布局使用的展示阵营，不等同于人物生前的正式
政治归属。`Person.visualFaction` 与 `Person.factions` 必须分开维护，不能从卷次、
家族或颜色反推历史政治身份。

曹操 15 人核心家庭中，曹腾、曹嵩显示为“其他”，其余 13 人显示为“魏”。

## 6. 许可证基线

- 软件代码：根目录 `LICENSE`，MIT License；
- 项目有权授权的正式结构化数据：根目录 `LICENSE-DATA`，CC BY 4.0；
- 指定署名：`数据来源：三国人物关系谱 · SanguoGraph（CC BY 4.0）`；
- 转载或再利用还应提供许可证信息并说明是否修改；
- 史料摘录、现代出版物、图片、第三方材料和内部候选不属于 SanguoGraph 数据授权；
- 新贡献者的数据与原创编辑说明按 `CONTRIBUTING.md` 接受 CC BY 4.0 发布。

不要把软件说成 CC BY 4.0，也不要把第三方材料说成 MIT、CC BY 4.0 或 CC0。

## 7. 关键文件

### 发布与连续性

```text
index.html
offline/index.html
package.json
CHANGELOG.md
LICENSE
LICENSE-DATA
CONTRIBUTING.md
docs/ROADMAP.md
docs/STABLE_RELEASE_ROUND_10.md
docs/DATA_LICENSE_GOVERNANCE.md
```

### 正式数据

```text
src/data/index.ts
src/data/persons.json
src/data/relations.json
src/data/sources.json
src/data/completeRosterManifest.ts
src/data/sixthRoster/
src/data/seventhSourceAuditBatchOnePersons.ts
src/data/seventhSourceAuditBatchTwoPersons.ts
```

### 应用与门禁

```text
src/App.tsx
src/pages/HomePage.tsx
src/pages/SourcesPage.tsx
src/pages/AboutPage.tsx
src/services/deepLinks.ts
src/services/feedbackLinks.ts
src/services/graphLayout.ts
scripts/validate-data.ts
scripts/audit-relation-coverage.ts
scripts/validate-processed.ts
scripts/validate-release.ts
scripts/validate-offline.ts
scripts/frontend-policy-guard.ts
```

## 8. 完整交付检查

任何用户可见功能、数据或发布边界变更在交付前运行：

```powershell
npm run lint
npm run test -- --reporter=dot --maxWorkers=1
npm run validate:data
npm run validate:relation-coverage
npm run validate:processed
npm run test:source-index
npm run validate:release
npm run build
npm run build:offline
npm run validate:offline
npm audit --omit=dev
```

涉及页面布局、交互或发布文案时，还要在 1366×768 与 390×844 验收：

- 无横向溢出；
- 史料浏览和关于项目可滚动到底；
- 控制台无 warning/error；
- 前端无禁用的维基体系可见内容或链接；
- 首页人数、关系数和阵营计数未意外回退；
- 根目录直接打开和离线成品仍然可用。

## 9. v1.0 最后验证结果

2026-08-14 的 Round 10 验收结果：

- 30 个测试文件、143 项测试通过；
- 正式数据、关系覆盖、processed 候选和本地史料索引校验通过；
- 稳定版、生产构建、离线构建和根入口校验通过；
- `offline/index.html` 为 885.8 KiB；
- 依赖审计为 0 个漏洞；
- 桌面与移动端关于页、史料页滚动正常；
- 曹节可搜索，并正确显示曹操为父、刘协为丈夫；
- 前端无维基体系可见文案或外链，控制台无 warning/error。

详细历史不要重新堆入本文件；按需查阅 `docs/` 下 Round 6—10 验收记录、关系覆盖
审计文件、数据模式和史料政策。本文件只维护新窗口继续工作的当前基线。
