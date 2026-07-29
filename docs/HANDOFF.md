# SanguoGraph 扩图阶段交接文档

更新时间：2026-07-29  
当前分支：`main`  
已验证实现基线：`27b0e74 feat: expand verified Cao Xiahou graph`

## 1. 项目当前状态

SanguoGraph 是一个以可定位史料为依据的三国人物关系知识图谱。目前没有
后端、数据库、登录或 AI API，正式图谱和离线单文件均由 React、TypeScript、
Vite 与 Cytoscape.js 构建。

当前正式层：

- 24 个人物；
- 33 条亲属、婚姻、收养或宗族／姻亲关系；
- 11 条历史文献来源；
- 默认显示曹操及其直接关系，共 18 人、27 条关系、9 条相关史料；
- “查看完整关系网”显示全部 24 人、33 条关系；
- 支持搜索、筛选、人物与关系档案、史料列表、节点探索和双人物最短路径。

当前只读候选层：

- 99 个 Wikidata 候选人物；
- 738 条未核验候选关系；
- 候选默认隐藏、按需加载，不在 CI 中重新下载；
- `data/processed` 的四个文件由哈希和 JSON Schema 保护。

当前可直接双击使用的离线入口：

```text
E:\SanGuo\offline\index.html
```

## 2. 当前 24 人

原曹操核心家庭：

```text
曹腾、曹嵩、曹操、丁夫人、卞夫人、刘夫人、环夫人、
曹昂、曹丕、曹彰、曹植、曹熊、曹冲、曹据、曹宇
```

Milestone 2 第一批曹氏—夏侯氏人物：

```text
曹仁、曹洪、曹休、曹真、曹爽、
夏侯惇、夏侯渊、夏侯尚、夏侯玄
```

项目内部人物 ID 继续使用 `person:sg:*`，关系 ID 使用
`relation:sg:*`。Wikidata QID 只能保存为外部标识，不得成为项目主键。

## 3. 本轮新增证据与关系

新增资料均以《三国志》卷九《魏书九·诸夏侯曹传》正文为主要证据，完整审核
矩阵见：

```text
docs/MILESTONE_2_EVIDENCE.md
```

已确认并核验的新增关系：

- 曹操与曹仁、曹洪、曹休、曹真的宗族关系；
- 曹真为曹爽之父；
- 夏侯惇与夏侯渊为同族；
- 夏侯渊与夏侯尚为宗族长辈、晚辈；
- 夏侯尚为夏侯玄之父；
- 曹爽与夏侯玄为姑表亲。

曹操“收养与诸子同”曹真的记录已录为 `adoptive_father_of`，但可信度为
`probable`、决定状态为 `pending_review`。这条边表达古籍中的收养照料语境，
不等同于现代法律意义上的确定收养。

本轮没有加入战争、敌对、主从、官职或政治事件关系，也没有补造史书未载姓名
的中间父母节点。

## 4. 视觉阵营约定

“魏、蜀、吴、其他”是图谱展示分类，不要求严格等同于人物生前已经建立的正式
政权。视觉阵营与正式史料字段 `Person.factions` 分开维护。

当前视觉阵营：

- 曹腾、曹嵩：其他；
- 其余 22 人：魏。

本轮新增 9 人均按用户确认显示为魏。不可根据卒年自动把曹昂、曹冲、丁夫人、
刘夫人、环夫人等改回“东汉／其他”。

当前视觉规则：

- 魏蓝、蜀红、吴绿、其他灰；
- 男性深色、女性浅色；
- 已核验且有正式史料的人物使用实线框；
- 待核验、虚构或缺少正式史料的人物使用虚线框；
- `recorded + confirmed + verified` 的关系使用实线；
- probable、disputed 和 candidate 等关系使用虚线；
- 配偶、宗族与姻亲是无向连线；
- 父母和收养关系保留方向。

实现位置：

```text
src/services/graphVisualEncoding.ts
src/services/relationPresentation.ts
src/components/graph/GraphLegend.tsx
src/components/graph/RelationshipGraph.tsx
```

## 5. 布局与交互现状

旧的 15 人硬编码坐标已经移除。布局服务位于：

```text
src/services/graphLayout.ts
src/services/graphLayout.test.ts
```

当前布局会：

- 根据父母、收养、配偶和带“族子／从子”等限定的宗族关系计算代际；
- 让配偶处于同代；
- 紧凑视图自动换行，避免后代节点挤成一排；
- 忽略候选边对正式层初始布局的影响；
- 保留用户锁定节点的位置；
- 对没有父母边的同代人物优先按家族和关系顺序组织。

首屏不会一次塞入 24 人。默认只显示曹操及其直接关系；搜索隐藏人物会把该人物
加入当前探索集。例如搜索“夏侯惇”后，当前人物数从 18 增至 19。用户也可从
人物档案选择“查看完整关系网”进入全部 24 人视图。

## 6. 史料与数据红线

- 不得编造原文、卷次、链接或现代学术观点；
- 外部结构化数据只能提供候选线索；
- Wikidata 不能单独支撑 `confirmed` 关系；
- 正式关系必须至少引用一条非 `structured_dataset` 来源；
- `certainty` 与 `reviewStatus` 必须继续分离；
- 正式 JSON 中不得写入 candidate 或 derived；
- 直接记录、间接推定、编辑者推断和候选关系必须可区分；
- 宗族边只表达引文直接支持的范围，不得自动补出中间谱系；
- `clan_relative_of` 是无向关系，反向重复边会被数据校验器拒绝；
- 无法可靠核验的关系宁可暂不进入默认图谱；
- `data/processed` 是生成的只读候选层，不得手工编辑；
- 扩充人物前必须确认第三方数据的来源和许可证兼容性。

必读规范：

```text
AGENTS.md
docs/DATA_SCHEMA.md
docs/SOURCE_POLICY.md
docs/CANDIDATE_PIPELINE.md
docs/ROADMAP.md
docs/MILESTONE_2_EVIDENCE.md
```

## 7. 关键代码入口

```text
src/pages/HomePage.tsx
```

维护默认核心集合、筛选、选择、候选加载、路径查询、节点显隐和详情状态。

```text
src/components/graph/RelationshipGraph.tsx
src/services/graphLayout.ts
```

创建 Cytoscape 实例、处理节点和关系样式，并根据正式关系生成可扩展布局。

```text
src/services/graphSelectors.ts
src/services/personSearch.ts
src/services/relationshipPath.ts
src/services/sourceLayers.ts
```

分别处理邻域、搜索、路径和来源层筛选。

```text
src/services/dataValidator.ts
scripts/validate-data.ts
scripts/validate-processed.ts
```

负责正式数据引用、重复关系、来源以及候选快照的质量门禁。

## 8. 后续扩图建议

下一批不要直接大规模录入。先根据活跃里程碑确定一个可核验分支，再建立人物、
关系、短引文与可信度矩阵。可选方向包括：

1. 继续补充曹氏—夏侯氏中证据明确的父子、婚姻或宗族关系；
2. 开始刘备或孙权核心家庭，但应单独确认本轮名单和视觉阵营；
3. 为现有 24 人补充可定位的现代学术争议层，而不是添加更多无证据节点。

若继续扩充曹氏—夏侯氏，应优先核验新增人物能否通过直接史料连接现有图谱，
并避免仅凭“族子”“从子”等称谓推导未记载的精确父系谱链。

## 9. 当前验证基线

最近一次完整验证结果：

```text
npm run lint                  通过
npm run test                  51/51 通过
npm run validate:data         24人 / 33关系 / 11史料，通过
npm run validate:processed    99人 / 738候选关系 / 4文件哈希一致
npm run build                 通过
npm run build:offline         通过
npm run validate:offline      通过
```

浏览器验收：

- 1366×768：默认 18 人／27 关系，完整 24 人／33 关系，无页面滚动；
- 搜索“夏侯惇”：隐藏支线按需加入，人物数为 19；
- 390×844：无横向溢出，图谱画布宽度适配窄屏；
- 浏览器控制台无 warning 或 error。

仓库当前没有配置 Git 远端。不要声称已经部署或推送。

## 10. 可直接粘贴到新窗口的任务提示

```text
你正在继续开发 E:\SanGuo 中的 SanguoGraph / 三国人物关系谱。

请先完整读取 AGENTS.md 和 docs/HANDOFF.md，再检查 Git 状态、正式数据、候选
数据和最近提交。不要重新实现已经完成的布局或扩图功能。

当前正式层为 24 人、33 条关系、11 条史料；Milestone 2 已加入曹仁、曹洪、
曹休、曹真、曹爽、夏侯惇、夏侯渊、夏侯尚、夏侯玄。曹真被曹操收养的边是
probable / pending_review，不得自行提升为 confirmed。

继续扩图前，请提出明确的新增名单、关系范围、视觉阵营和史料核验方案，并只对
会显著影响结果的范围选择向我确认。不要加入战争、敌对、主从、官职或政治事件
关系，除非我明确扩大本轮关系模型。

必须保留史料分层、核验规则、视觉阵营约定、默认核心视图、候选按需加载、
GitHub Pages base path、Hash 路由和离线单文件入口。实现后运行 lint、全部
测试、两类数据校验、生产构建、离线构建和离线校验，并进行桌面与窄屏浏览器
验收；最后创建本地提交，不要 git push。
```
