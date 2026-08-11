# 三国人物关系谱 · SanguoGraph 关系覆盖专项交接文档

更新时间：2026-08-11
当前分支：`codex/relation-coverage-audit`

## 0. 新窗口接续说明（必须先读）

第七批遗漏审计第二组已经完成。本阶段在 `4380b29 feat: add first source-audit roster
batch` 之后新增 20 名女性、34 条关系和 18 条关系级史料，并完成以下收尾：

- 正式图谱更新为 577 人、318 条关系、156 条史料；
- 27 条正文关系为 `confirmed + verified`，7 条裴注关系为
  `probable + pending_review`；
- 覆盖统计为 325 人有关系、252 人孤立、覆盖率 56.3%；
- 为新增密集家族边扩展了布局贝塞尔控制点候选，边避障测试通过；
- 《嵇氏谱》“林子之女”已按上文“林薨，子纬嗣”纠正为“曹林之子的女儿”：人物标为
  “曹林孙女”，曹林与嵇康妻之间仅建立注引层 `clan_relative_of`，不再误作父女；
- 第二组关系类型为 12 条 `father_of`、4 条 `mother_of`、16 条 `spouse_of`、
  2 条 `clan_relative_of`；全局类型为 187、53、42、28（另有养父 6、养母 2）；
- 关系 JSON SHA-256 已更新为
  `514bc1b1b06957ec4c247df132452a5eebe6fb9e9f7837e63919e18f0dd5f240`。

本阶段已重跑 ESLint、110 项 Vitest、正式数据校验、关系覆盖回归、候选数据 4 个哈希、
生产构建、系统临时目录离线单文件构建与校验，以及 `npm audit --omit=dev`，均通过。

### 当前工作区边界

以下 6 个文件在本轮开始前已有未提交修改，属于用户原有界面展示工作，不得随本轮数据
提交；`offline/index.html` 也未被本轮离线构建覆盖：

```text
offline/index.html
src/components/person/PathResultPanel.tsx
src/components/person/PersonPanel.test.tsx
src/components/person/PersonPanel.tsx
src/services/relationPresentation.test.ts
src/services/relationPresentation.ts
```

上述 6 个文件继续保持未暂存，属于用户原有界面展示工作，不包含在第二组审计提交中。
后续任务开始前应先检查这些未提交修改，避免覆盖或误纳入其他提交。

## 1. 当前状态

三国人物关系谱 · SanguoGraph 是来源可追溯的三国人物关系知识图谱。项目仍为 React、严格
TypeScript、Vite 和 Cytoscape.js 构建的纯前端应用，没有后端、数据库、登录或
AI API。

当前正式数据：

- 577 个人物；
- 318 条家庭关系；
- 156 条史料；
- 325 人至少拥有一条正式关系，252 人完全孤立，覆盖率 56.3%；
- 展示阵营：魏 283、蜀 122、吴 133、其他 39；
- 首次进入前端即加载全部 577 人和 318 条关系；
- 99 个 Wikidata 候选人物和 738 条候选关系仍默认隐藏；
- 离线入口：`E:\SanGuo\offline\index.html`。

人物批次：

- 第一批：24 人；
- 第二批：176 人；
- 第三批：35 人；
- 第四批：35 人；
- 第五批：35 人；
- 第六批：232 位列传级全量人物。
- 第七批：40 位全 65 卷遗漏审计补录人物。

`Person.importBatch` 允许 `1 | 2 | 3 | 4 | 5 | 6 | 7`；第六批档案显示
“第六批全量导入”，第七批显示“第七批遗漏审计”。

## 2. 第六批名单与来源

完整范围、去重规则、计数、授权边界与布局规则见：

```text
docs/SIXTH_COMPLETE_ROSTER.md
```

主要实现文件：

```text
src/data/sixthRoster/manifest.ts
src/data/sixthRoster/persons.ts
src/data/completeRosterManifest.ts
src/data/majorSources.ts
```

第六批名单以《三国志》65 卷的本纪、独立列传和具名附传为基线，排除民族或
政权集合、无法区分的“某子等”、偶然提名者与新的文学或传闻人物。
新增人物每人至少引用一条已核验的《三国志》卷级史料。

## 3. 袁氏家庭关系补充与关系红线

第六批人物导入完成后，依据《三国志》卷五《文昭甄皇后传》和卷六《袁绍传》
袁氏补充新增 4 条原文明确关系；关系覆盖三批随后新增 16 条魏系、27 条吴系和
8 条蜀系与其他关系；第六批名册首轮再新增 24 条卷二十宗室父子关系。第七批遗漏
审计第一组补录 24 条卷二十母子关系和 1 条孙权—孙虑父子关系；第二组补录 20 名
女性及 34 条父母、婚姻和宗族关系。当前正式关系为 318 条，其中第二组 27 条来自
正史正文，7 条来自裴注所引古代史料并保持待复核。
关系 JSON 序列化后的 SHA-256 为：

```text
514bc1b1b06957ec4c247df132452a5eebe6fb9e9f7837e63919e18f0dd5f240
```

正式基础类型仍只有：

```text
father_of
mother_of
spouse_of
adoptive_father_of
adoptive_mother_of
clan_relative_of
```

不增加战争、敌对、主从、官职、联盟、事件或阵营关系。传闻、裴注存疑与文学关系
继续以虚线表达，不代表已获正史承认。

## 4. 展示阵营与历史归属

“魏、蜀、吴、其他”只是前端颜色和空间分类。`Person.visualFaction` 与
`Person.factions` 必须分开维护。第六批的 `factions` 默认为空，不从卷次或
展示阵营反推正式政治归属。

曹腾、曹嵩继续显示为其他，原曹操核心家庭其余 13 人继续显示为魏。

## 5. 地图布局与缩放

- 有正式关系的家庭分量继续使用确定性放射布局；
- 无关系人物进入阵营外围网格：魏在上、蜀在左下、吴在右下、其他在下方；
- 旧人物按原数据顺序先占位，第六批按冻结名单顺序追加；
- 桌面最小中心距为 112px，紧凑视图为 104px；
- 连线避让使用二维空间索引，仅检查路径附近人物；
- “适应画布”继续显示全部 577 人，极低缩放使用阵营色点总览；
- 首次加载聚焦曹操，搜索只移动视口，不改变整图根节点。

## 6. 数据与史料红线

- 不伪造引文、卷次、链接或现代学术观点；
- 外部结构化数据只作候选线索；
- Wikidata 不得单独支撑 confirmed 关系；
- 正文、裴注、地方旧闻、文学叙事和结构化候选必须分层；
- 无法核验的生卒年、别名和政治归属保持空值；
- 不为追求连通性补造关系；
- `data/processed` 是生成的只读候选层，不手工编辑。

## 7. 关键文件

```text
AGENTS.md
docs/DATA_SCHEMA.md
docs/SOURCE_POLICY.md
docs/CANDIDATE_PIPELINE.md
docs/SIXTH_COMPLETE_ROSTER.md
docs/SEVENTH_SOURCE_AUDIT_BATCH_1.md
docs/SEVENTH_SOURCE_AUDIT_BATCH_2.md
src/data/completeRosterManifest.ts
src/data/sixthRoster/manifest.ts
src/data/seventhSourceAuditBatchOnePersons.ts
src/data/seventhSourceAuditBatchOneRelations.ts
src/data/seventhSourceAuditBatchOneSources.ts
src/data/seventhSourceAuditBatchTwoPersons.ts
src/data/seventhSourceAuditBatchTwoRelations.ts
src/data/seventhSourceAuditBatchTwoSources.ts
src/services/graphLayout.ts
src/services/graphViewport.ts
```

## 8. 交付检查

交付前必须运行：

```powershell
npm run lint
npm run test
npm run validate:data
npm run validate:relation-coverage
npm run validate:processed
npm run build
npm run build:offline
npm run validate:offline
npm audit --omit=dev
```

浏览器验收尺寸为 1366×768 和 390×844，需确认：

- 默认地图加载 577 人、318 条关系；
- 搜索王蕃并显示“第六批全量导入”；
- 四阵营计数为 283、122、133、39；
- “适应画布”显示全部人物，放大后姓名可读；
- 没有节点重叠、连线穿过无关人物或横向页面溢出；
- 控制台没有 warning/error。

仓库已配置 `origin` 远程；通过专题分支和拉取请求交付，不直接改写远程 `main`。

本轮实测：lint 与 110 项测试通过，正式数据为 577／318／156；关系覆盖回归校验
通过，基线为 325 人有关系、252 人孤立。首页完整图谱引用 153 条史料。候选数据仍
为 99／738 且四个哈希一致；生产构建、临时目录离线构建和离线内联检查均通过，
`offline/index.html` 的既有未提交版本未被覆盖。最大连通分量扩展到 220 人后，
布局仍通过确定性、节点无重叠和边不穿越无关人物测试；扩展的贝塞尔控制点候选能够
绕开新增密集家族节点。
