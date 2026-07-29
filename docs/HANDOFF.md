# SanguoGraph 扩图阶段交接文档

更新时间：2026-07-29  
当前分支：`main`  
已验证实现基线：`3860099 fix: apply Cao family visual faction naming`

## 1. 项目当前状态

SanguoGraph 是一个以可定位史料为依据的三国人物关系知识图谱。目前没有
后端、数据库、登录或 AI API，正式图谱和离线单文件均由 React、TypeScript、
Vite 与 Cytoscape.js 构建。

当前正式层：

- 15 个人物；
- 23 条基础亲属关系；
- 6 条历史文献来源；
- 关系范围仅包括父亲、母亲、夫妻、养父和养母；
- 默认打开“曹操—环夫人”关系档案；
- 支持搜索、筛选、人物与关系档案、史料列表、节点探索和双人物最短路径。

当前只读候选层：

- 99 个 Wikidata 候选人物；
- 738 条未核验候选关系；
- 候选默认隐藏、按需加载，不在 CI 中重新下载；
- `data/processed` 的四个文件由哈希和 JSON Schema 保护。

当前可直接双击使用的离线入口是：

```text
E:\SanGuo\offline\index.html
```

## 2. 当前15人

```text
曹腾、曹嵩、曹操、丁夫人、卞夫人、刘夫人、环夫人、
曹昂、曹丕、曹彰、曹植、曹熊、曹冲、曹据、曹宇
```

项目内部人物 ID 必须继续使用 `person:sg:*`，关系 ID 使用
`relation:sg:*`。Wikidata QID 只能保存为外部标识，不得成为项目主键。

## 3. 用户已经确认的视觉命名

“魏、蜀、吴、其他”是图谱的视觉阵营，不要求严格等同于人物生前已经建立的
正式政权。视觉阵营必须与正式史料字段 `Person.factions` 分开维护。

当前15人的视觉阵营：

- 曹腾、曹嵩：其他；
- 其余13人：魏。

不可根据人物卒年把曹昂、曹冲、丁夫人、刘夫人、环夫人等自动改回“东汉／
其他”。后续人物的视觉阵营应按用户确认的图谱命名录入。

当前视觉规则：

- 魏：蓝色；
- 蜀：红色；
- 吴：绿色；
- 其他：灰色；
- 男性使用较深颜色，女性使用较浅颜色；
- 已核验且有正式史料的人物使用实线框；
- 待核验、虚构或缺少正式史料的人物使用虚线框；
- `recorded + confirmed + verified` 的关系使用实线；
- 其他关系，包括 probable、disputed 和 candidate，使用虚线。

实现位置：

```text
src/services/graphVisualEncoding.ts
src/services/graphVisualEncoding.test.ts
src/components/graph/GraphLegend.tsx
src/components/graph/RelationshipGraph.tsx
```

## 4. 史料与数据红线

- 不得编造原文、卷次、链接或现代学术观点；
- 外部结构化数据只能提供候选线索；
- Wikidata 不能单独支撑 `confirmed` 关系；
- 正式关系必须至少引用一条非 `structured_dataset` 来源；
- `certainty` 与 `reviewStatus` 必须继续分离；
- 正式 JSON 中不得写入 candidate 或 derived；
- 直接记录、间接推定、编辑者推断和候选关系必须可区分；
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
```

## 5. 关键代码入口

```text
src/pages/HomePage.tsx
```

维护筛选、选择、候选加载、路径查询、节点显隐和详情面板状态。

```text
src/components/graph/RelationshipGraph.tsx
```

创建 Cytoscape 实例，处理节点、关系样式和点击事件。当前15人的桌面及窄屏
预设坐标仍然硬编码在这个文件中。

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

正式数据和候选快照的质量门禁。

```text
src/services/candidateAdapter.ts
src/services/candidateDataLoader.ts
```

将 Wikidata 的子到父母方向转换为项目的父母到子女方向，规范化夫妻关系，
并排除 sibling、通用 child、范围外和不支持的记录。

## 6. 扩大地图前必须处理的问题

### 6.1 不要继续堆硬编码坐标

当前 `personPositions` 和 `compactPersonPositions` 只适用于15人。扩大人物范围
时，应先提取可测试的布局服务，至少支持：

- 按家族或视觉阵营分组；
- 按代际排列父母与子女；
- 配偶靠近核心人物；
- 已展开分支和隐藏分支；
- 锁定节点后重新布局不移动；
- 候选边不干扰正式层初始布局；
- 节点不重叠，关系标签尽量减少遮挡。

不要把几十个人物一次性塞入首屏。1366×768 下应继续默认显示核心人物或当前
分支，用户通过展开、搜索和“查看完整关系网”进入更大范围。

### 6.2 先确认扩图范围

现有路线图建议 Milestone 2 从曹氏—夏侯氏开始。建议的第一批候选包括：

```text
曹仁、曹洪、曹休、曹真、曹爽、
夏侯惇、夏侯渊、夏侯尚、夏侯玄
```

这只是建议名单，不是已经核验的数据。新窗口应先与用户确认：

1. 本轮目标人数；
2. 是否仍然只做亲属、婚姻和收养；
3. 是否先完成曹氏—夏侯氏，还是同时加入刘备、孙权或司马懿家族；
4. 每位新增人物的视觉阵营；
5. 哪些关系有足够史料进入正式层。

默认不要加入战争、敌对、主从、官职或政治事件关系，除非用户明确扩大关系
模型和本轮范围。

### 6.3 先做证据矩阵再写 JSON

建议先建立审核表：

```text
人物本地ID
展示名／字／别名
视觉阵营
正式史料来源
候选基础关系
关系证据短引文
证据方式
certainty
reviewStatus
争议和待核验事项
```

只有证据完整的记录才能写入 `src/data`。候选线索继续通过适配器运行时加载，
不要把 processed 数据批量复制为正式人物或正式关系。

## 7. 下一阶段建议实施顺序

1. 检查仓库状态和本交接文档；
2. 与用户确认扩图人物名单、关系范围和视觉阵营；
3. 建立人物／关系／来源证据矩阵；
4. 将硬编码坐标重构为可测试的布局服务；
5. 分小批次加入已核验人物和关系；
6. 更新搜索、路径、图例、统计和档案；
7. 增加人物数量、引用完整性、布局和交互测试；
8. 验收 1366×768 桌面、390px 窄屏和 GitHub Pages 路径；
9. 重建并校验 `offline/index.html`；
10. 创建本地里程碑提交，不擅自推送。

## 8. 当前验证基线

最近一次完整验证结果：

```text
npm run lint                  通过
npm run test                  41/41 通过
npm run validate:data         15人 / 23关系 / 6史料，通过
npm run validate:processed    99人 / 738候选关系 / 4文件哈希一致
npm run build                 通过
npm run build:offline         通过
npm run validate:offline      通过
```

仓库当前没有配置 Git 远端。不要声称已经部署或推送。

## 9. 可直接粘贴到新窗口的任务提示

```text
你正在继续开发 E:\SanGuo 中的 SanguoGraph / 三国人物关系谱。

请先完整读取 AGENTS.md 和 docs/HANDOFF.md，再检查 Git 状态、当前正式数据、
候选数据和最近提交。不要重新实现已经完成的功能。

本轮目标是扩大人物地图范围、纳入更多人物。开始编码前先根据交接文档和现有
路线图提出一个明确的新增人物名单、关系范围、视觉阵营和史料核验方案，并向我
确认会显著影响结果的范围选择。

必须保留：
- 正式史料、文学材料、结构化候选和程序推导的分层；
- 人物与关系的实线／虚线核验规则；
- 魏蓝、蜀红、吴绿、其他灰，男性深、女性浅；
- 当前15人中只有曹腾、曹嵩归其他，其余13人归魏；
- 1366×768 默认核心视图无页面滚动；
- 候选默认关闭、按需加载；
- GitHub Pages base path、Hash 路由和离线单文件入口。

扩图前必须先重构当前15人专用的硬编码坐标，建立可测试、可扩展的家族／代际
布局机制。不要为了扩大数量而把 Wikidata 候选直接写入正式数据，也不要伪造
史料原文或引用。

实现后运行 lint、全部测试、正式数据校验、processed 校验、生产构建、离线
构建和离线校验；进行桌面与窄屏浏览器验收；最后创建本地提交，不要 git push。
```
