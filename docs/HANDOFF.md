# 三国人物关系谱 · SanguoGraph 关系覆盖专项交接文档

更新时间：2026-08-14
当前分支：`codex/corrections-license-governance`

## 0. 新窗口接续说明（必须先读）

Round 6“数据冻结与发布验收”已经完成。冻结前依据《后汉书》卷十下补录曹宪、曹节、
曹华三名具名人物，并将原曹操—刘协聚合占位边替换为 3 条父女关系和 3 条婚姻关系：

- 三名新增人物均立即进入现有关系网，不产生新的孤立节点；
- 六条关系均为 `confirmed + verified + direct_record`，引用 URL 为空的本地史料；
- 正式数据冻结为 580 人、358 条家庭关系、189 条史料，其中 186 条可浏览；
- 374 人有关系、206 人孤立，覆盖率 64.5%；
- 展示阵营为魏 286、蜀 122、吴 133、其他 39；
- 全局类型为父亲 199、母亲 54、婚姻 53、养父 6、养母 2、宗族／姻亲 44；
- 关系 JSON SHA-256 为
  `99850ae436763c9f6ce5fad5b06b7cb15fa966405bd2537e74084ae4a35c9f8b`。

按 580 人重新计算，第一阶段需至少 380 人入网／不超过 200 人孤立／覆盖率至少
65.5%，当前仍差 6 人；不通过猜测关系、非亲属边或降低证据标准填充。数据阶段已
冻结。Round 7 已完成史料浏览与来源详情优化：189 条史料可按典籍、史料层、人物与
关系检索，并明确区分人物定位、关系支持和关系反对证据。Round 8 已完成人物、关系与
史料的稳定永久链接，并修复桌面端“史料浏览”和“关于项目”无法滚动到底的问题。
Round 9 已完成结构化纠错／来源建议机制，并建立数据许可证的范围、引入规则和发布
门槛。下一轮为 Round 10：稳定版发布验收；开始前须由维护者明确选择 CC BY 4.0、
ODbL 1.0 或继续不授予独立数据许可。记录见
`docs/CORRECTIONS_LICENSE_GOVERNANCE_ROUND_9.md`。

前端发布边界继续有效：书名、作者、卷次、篇章和史料引文正常展示，但网页与离线
成品不显示、链接或打包维基体系名称、域名、候选数据和 QID。内部 `data/processed`
候选管线可用于研究，但不参与构建；Vite 构建和离线校验会阻止相关内容重新进入前端产物。

## 1. 当前状态

三国人物关系谱 · SanguoGraph 是来源可追溯的三国人物关系知识图谱。项目仍为 React、严格
TypeScript、Vite 和 Cytoscape.js 构建的纯前端应用，没有后端、数据库、登录或
AI API。

当前正式数据：

- 580 个人物；
- 358 条家庭关系；
- 189 条史料，其中 186 条被人物或关系使用并可浏览；
- 374 人至少拥有一条正式关系，206 人完全孤立，覆盖率 64.5%；
- 展示阵营：魏 286、蜀 122、吴 133、其他 39；
- 首次进入前端即加载全部 580 人和 358 条关系；
- 99 个候选人物和 738 条候选关系只保留在内部研究数据，不进入网页或离线成品；
- 离线入口：`E:\SanGuo\offline\index.html`。

人物批次：

- 第一批：24 人；
- 第二批：176 人；
- 第三批：35 人；
- 第四批：35 人；
- 第五批：35 人；
- 第六批：232 位列传级全量人物。
- 第七批：43 位遗漏审计补录人物。

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
宗族关系；卷一至三十复核新增 9 条正文或裴注直接关系，卷三十一至五十复核新增
8 条正文或裴注直接关系，卷五十一至六十五复核再新增 8 条。Round 5 全局审计新增
4 条正文直接关系并净连接 6 人。Round 6 冻结前再新增曹氏三女的 6 条父女及婚姻
关系，并删除 1 条聚合占位边。当前正式关系为 358 条。
关系 JSON 序列化后的 SHA-256 为：

```text
99850ae436763c9f6ce5fad5b06b7cb15fa966405bd2537e74084ae4a35c9f8b
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
- 连线避让使用二维空间索引，仅检查路径附近人物；跨阵营长距离关系在常规候选路径
  仍碰撞时允许使用远距兜底曲线，避免穿过无关节点；
- “适应画布”继续显示全部 580 人，极低缩放使用阵营色点总览；
- 首次加载聚焦曹操，搜索只移动视口，不改变整图根节点。

## 6. 数据与史料红线

- 不伪造引文、卷次、链接或现代学术观点；
- 外部结构化数据只作候选线索；
- Wikidata 不得单独支撑 confirmed 关系；
- 前端不得显示、链接或打包维基体系名称、域名与候选外部标识；书名、卷次、篇章和
  史料引文正常保留，内部研究管线不受此发布边界影响；
- 正文、裴注、地方旧闻、文学叙事和结构化候选必须分层；
- 无法核验的生卒年、别名和政治归属保持空值；
- 不为追求连通性补造关系；
- 每条正式关系必须至少引用一条非空原文摘录；
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
docs/VOLUMES_01_30_RELATIONSHIP_REVIEW.md
docs/VOLUMES_31_50_RELATIONSHIP_REVIEW.md
docs/VOLUMES_51_65_RELATIONSHIP_REVIEW.md
docs/GLOBAL_DATA_EVIDENCE_AUDIT.md
docs/DATA_FREEZE_RELEASE_ACCEPTANCE.md
docs/SOURCE_BROWSER_ROUND_7.md
docs/STABLE_DEEP_LINKS_ROUND_8.md
docs/DATA_LICENSE_GOVERNANCE.md
docs/CORRECTIONS_LICENSE_GOVERNANCE_ROUND_9.md
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
src/data/volumesOneToThirtyRelationshipRelations.ts
src/data/volumesOneToThirtyRelationshipSources.ts
src/data/volumesThirtyOneToFiftyRelationshipRelations.ts
src/data/volumesThirtyOneToFiftyRelationshipSources.ts
src/data/volumesFiftyOneToSixtyFiveRelationshipRelations.ts
src/data/volumesFiftyOneToSixtyFiveRelationshipSources.ts
src/data/globalDataEvidenceAuditRelations.ts
src/data/globalDataEvidenceAuditSources.ts
src/data/dataFreezeOmissionPersons.ts
src/data/dataFreezeOmissionRelations.ts
src/data/dataFreezeOmissionSources.ts
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

- 默认地图加载 580 人、358 条关系；
- 搜索曹节并显示曹操父女与刘协婚姻关系；
- 四阵营计数为 286、122、133、39；
- 页面文案、链接和网络请求均不得指向维基体系；正常史料书名、卷次和引文继续显示；
- “适应画布”显示全部人物，放大后姓名可读；
- 没有节点重叠、连线穿过无关人物或横向页面溢出；
- 控制台没有 warning/error。

仓库已配置 `origin` 远程；通过专题分支和拉取请求交付，不直接改写远程 `main`。

Round 6 完整交付验证已于 2026-08-13 完成：

- `npm run lint` 通过；
- `npm run test -- --reporter=dot --maxWorkers=1` 通过，共 27 个测试文件、132 项测试；
- 数据校验通过：580 人、358 条正式关系、189 条史料；
- 关系覆盖回归通过：374 人入网、206 人孤立、覆盖率 64.5%；
- processed 数据校验通过：99 人、738 条未核验候选、4 个文件哈希一致；
- 本地史料索引 5 项测试通过；
- 生产构建与离线单文件构建通过，候选数据不生成网页分块，`offline/index.html`
  为 872.0 KiB；
- 根入口与离线包校验通过；
- `npm audit --omit=dev` 为 0 个漏洞；
- 桌面验收显示 580 人、358 条关系、186 个可浏览来源；曹节检索及父女／婚姻档案
  正常，主页无维基体系可见文案或外链；
- 390×844 移动端验收无横向溢出，页面控制台无 warning/error。

Round 7 完整交付验证已于 2026-08-13 完成：

- `npm run lint` 通过；
- `npm run test -- --reporter=dot --maxWorkers=1` 通过，共 28 个测试文件、135 项测试；
- 数据、关系覆盖、processed 数据与本地史料索引校验继续通过；
- 生产构建、离线单文件构建和根入口校验通过，`offline/index.html` 为 879.5 KiB；
- `npm audit --omit=dev` 为 0 个漏洞；
- 桌面史料页默认显示 189 条折叠记录；“曹节 刘协”检索返回 1 条并自动展开，引用
  分类显示 3 个人物、6 条支持关系、0 条反对关系；
- 390×844 移动端筛选控件均在视口内，无横向溢出；桌面与移动端控制台均无
  warning/error，且页面无维基体系可见文案或外链。

Round 8 完整交付验证已于 2026-08-14 完成：

- 29 个测试文件、141 项测试全部通过；
- 数据、关系覆盖、processed 数据与本地史料索引校验继续通过；
- 生产构建、离线单文件构建和根入口校验通过，`offline/index.html` 为 882.7 KiB；
- 1366×768 与 390×844 下“史料浏览”“关于项目”均可滚至页尾且无横向溢出；
- 人物、关系、史料永久链接和无效链接回退均通过浏览器验收；
- 前端无维基体系可见文案或外链，控制台无 warning/error，依赖审计为 0 个漏洞。

Round 9 完整交付验证已于 2026-08-14 完成：

- 新增数据纠错与史料来源建议两个 GitHub Issue Form，YAML 与必要字段校验通过；
- 人物、关系和史料反馈入口会预填实体 ID、永久链接、表单与标题；
- 30 个测试文件、143 项测试全部通过；
- 数据、关系覆盖、processed 数据与本地史料索引校验继续通过；
- 生产构建、离线单文件构建和根入口校验通过，`offline/index.html` 为 885.5 KiB；
- 1366×768 与 390×844 浏览器验收无横向溢出，反馈按钮均位于视口内；
- 前端无维基体系可见文案或外链，控制台无 warning/error，依赖审计为 0 个漏洞；
- 数据治理规则已经冻结，但独立数据许可证仍须维护者在 Round 10 前明确批准。
