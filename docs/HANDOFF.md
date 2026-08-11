# 三国人物关系谱 · SanguoGraph 关系覆盖专项交接文档

更新时间：2026-08-11
当前分支：`codex/major-roster-second-pass`

## 0. 新窗口接续说明（必须先读）

Round 1“第二批主要人物二次复核”已经完成实现。本阶段基于 `283e832 merge: publish
relation coverage audit`，对 71 名主要人物执行本地 65 卷索引亲属词定向复核，并坚持
零人物扩张：

- 新增 6 条既有节点之间的姻亲／宗族关系和 6 条关系级史料；
- 刘协—曹操、张绣—曹均、张鲁—曹宇、王凌—王允 4 条正文关系为
  `confirmed + verified`；
- 郭淮—王凌来自裴注引《世语》，陆绩—张温为裴注明确婚姻链的有界推定，两条保持
  `probable + pending_review`；
- 人物维持 577，正式关系增至 324，史料增至 162；
- 333 人有关系、244 人孤立，覆盖率 57.7%；主要人物队列降至 64 人，第六批降至
  179 人；
- 全局类型为父亲 187、母亲 53、婚姻 42、养父 6、养母 2、宗族／姻亲 34；
- 关系 JSON SHA-256 为
  `b986827354cebaecbeec944b8e970de355bcc03f060f22271c0022531516e439`。

下一轮为 Round 2：卷 1—30 既有孤立人物关系复核。继续优先现有 577 人，只在遗漏
人物能由合格史料立即接入正式网络时才评估补录；不得为覆盖率降低证据标准。

## 1. 当前状态

三国人物关系谱 · SanguoGraph 是来源可追溯的三国人物关系知识图谱。项目仍为 React、严格
TypeScript、Vite 和 Cytoscape.js 构建的纯前端应用，没有后端、数据库、登录或
AI API。

当前正式数据：

- 577 个人物；
- 324 条家庭关系；
- 162 条史料；
- 333 人至少拥有一条正式关系，244 人完全孤立，覆盖率 57.7%；
- 展示阵营：魏 283、蜀 122、吴 133、其他 39；
- 首次进入前端即加载全部 577 人和 324 条关系；
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
女性及 34 条父母、婚姻和宗族关系。主要人物二次复核再新增 6 条既有节点间的姻亲与
宗族关系。当前正式关系为 324 条。
关系 JSON 序列化后的 SHA-256 为：

```text
b986827354cebaecbeec944b8e970de355bcc03f060f22271c0022531516e439
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
docs/MAJOR_ROSTER_SECOND_PASS.md
src/data/completeRosterManifest.ts
src/data/sixthRoster/manifest.ts
src/data/seventhSourceAuditBatchOnePersons.ts
src/data/seventhSourceAuditBatchOneRelations.ts
src/data/seventhSourceAuditBatchOneSources.ts
src/data/seventhSourceAuditBatchTwoPersons.ts
src/data/seventhSourceAuditBatchTwoRelations.ts
src/data/seventhSourceAuditBatchTwoSources.ts
src/data/majorRosterSecondPassRelations.ts
src/data/majorRosterSecondPassSources.ts
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

- 默认地图加载 577 人、324 条关系；
- 搜索王蕃并显示“第六批全量导入”；
- 四阵营计数为 283、122、133、39；
- “适应画布”显示全部人物，放大后姓名可读；
- 没有节点重叠、连线穿过无关人物或横向页面溢出；
- 控制台没有 warning/error。

仓库已配置 `origin` 远程；通过专题分支和拉取请求交付，不直接改写远程 `main`。

本轮交付验证已于 2026-08-11 完成：

- `npm run lint` 通过；
- `npm run test` 通过，共 21 个测试文件、114 项测试；
- 数据校验通过：577 人、324 条正式关系、162 条史料；
- 关系覆盖回归通过：333 人入网、244 人孤立、覆盖率 57.7%；
- processed 数据校验通过：99 人、738 条未核验候选、4 个文件哈希一致；
- 生产构建与离线单文件构建通过，`offline/index.html` 为 1219.9 KiB；
- 根入口与离线包校验通过；
- `npm audit --omit=dev` 为 0 个漏洞；
- 1366×768 桌面验收显示 577 人、324 条关系、159 个可浏览来源，刘协档案正确显示曹操为“岳父”；
- 390×844 移动端验收无横向溢出，页面控制台无 warning/error。
