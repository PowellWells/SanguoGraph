# SanguoGraph 第五批蜀系家庭扩展交接文档

更新时间：2026-08-02
当前分支：`main`

## 1. 当前状态

SanguoGraph 是一个来源可追溯的三国人物关系知识图谱。当前没有后端、数据库、
登录或 AI API；网页、离线单文件和数据校验均由 React、严格 TypeScript、Vite
与 Cytoscape.js 构建。

当前正式数据：

- 305 个人物；
- 180 条家庭关系；
- 91 条史料；
- 首次进入前端即加载全部 305 人、180 条关系和 91 条相关史料；
- 展示阵营计数：魏 110、蜀 93、吴 68、其他 34；
- 99 个 Wikidata 候选人物和 738 条候选关系仍默认隐藏、按需加载；
- 离线入口：`E:\SanGuo\offline\index.html`。

人物批次：

- 第一批：原 24 人；
- 第二批：176 位主要历史人物；
- 第三批：35 位已有人物的家庭成员。
- 第四批：35 位魏系宗室与主要将领家庭成员。
- 第五批：35 位蜀系宗室、诸葛氏与主要文武家庭成员。

`Person.importBatch` 只允许 `1 | 2 | 3 | 4 | 5`，人物档案分别显示第一至第五批
导入；校验器拒绝其他编号。

## 2. 第五批范围

第五批完整名单、证据边界与类型计数见：

```text
docs/FIFTH_FAMILY_BATCH.md
```

实现文件：

```text
src/data/fifthFamilyPersons.ts
src/data/fifthFamilyRelations.ts
src/data/fifthFamilySources.ts
```

本批新增 35 人、35 条家庭关系和 9 条关系级史料。关系仅限既有六类：

```text
father_of
mother_of
spouse_of
adoptive_father_of
adoptive_mother_of
clan_relative_of
```

不增加战争、敌对、主从、官职、联盟、事件或阵营连线。第五批每位新增人物只以
一条必要家庭关系接入；扩展授权只覆盖家庭关系，不得据此扩展其他类型。

## 3. 史料与虚线语义

正式史料关系：

- `origin: recorded`；
- 正史或《晋书》直接支持时使用 `confirmed + verified`；
- confirmed 关系必须引用至少一条非 `structured_dataset` 来源；
- `certainty` 与 `reviewStatus` 继续分离。

非正式承认或后出叙事：

- 裴注、地方旧闻或制度含义需保守解释时使用 `probable`；
- 文学叙事使用 `fictional + literature`；
- 待进一步核验的关系使用 `pending_review`；
- 所有非 `recorded + confirmed + verified` 关系均以前端虚线展示。

当前明确示例：

- 徐夫人抚养孙登：`probable`，避免把古代“母养”直接等同现代法律收养；
- 马超—马秋：裴注层 `probable + annotated_history`；
- 诸葛亮—黄氏：《襄阳记》层 `probable + later_tradition`，不采用“黄月英”为史实名；
- 吕布—貂蝉：《三国演义》层 `fictional + literature + pending_review`。

文学层默认可见，用户可通过“文学作品”来源开关关闭。虚线表示史料层级与可信度，
不表示已经得到正史承认。

## 4. 视觉阵营

“魏、蜀、吴、其他”是前端展示分类，不等同于人物生前正式政治归属。
`Person.visualFaction` 与 `Person.factions` 必须分开维护。

- 魏蓝、蜀红、吴绿、其他灰；
- 男性深色、女性浅色；
- 历史人物且已核验并有来源时使用实线节点框；
- 待核验或虚构人物使用虚线节点框；
- 曹腾、曹嵩继续显示为其他，原曹操核心家庭其余 13 人继续显示为魏。

## 5. 布局与交互

人物地图使用确定性的家庭分支放射布局和 Cytoscape `preset`：

- 曹操是默认稳定锚点，搜索只移动视口，不重新换根；
- 展示方位固定为魏在上方、蜀在左下、吴在右下；这只是前端空间编码，不是正式政治归属；
- “其他”人物沿正式亲属关系寻找最近的魏、蜀、吴人物并跟随其区域；候选关系不参与归区，无可达关系时进入下方外围中立区；
- 各阵营先独立打包家庭分量，再整体平移到固定区域；跨阵营婚姻保留跨区连线，不改变人物展示阵营；
- 节点可向四周无限扩展，大图通过平移与缩放浏览；
- 桌面最小中心距 112px，紧凑视图 104px，核心节点额外 12px；
- 二维空间哈希处理节点碰撞并保留锁定坐标；
- 家庭主干优先直线，跨家庭、收养、宗族及并行边使用曲线；
- 曲线按 36px 逐级尝试两侧和多个控制点权重；跨区长边会按边长扩展尝试范围，首个无节点碰撞级别即停止；
- 所有正式边的采样路线均避开无关人物外扩碰撞圆；
- 首次加载保持可读缩放，适应画布可查看全图；
- “适应画布”会先计算当前全部人物的真实适配缩放，并将它设为本图最小缩放；缩到极限时恰好包含全部人物，不会被固定下限裁掉，也不能继续缩成更小的一团；
- 极低缩放自动切换为全图总览样式：隐藏已经无法阅读的姓名文字，以更大的阵营色点和加粗关系骨架显示全部人物；放大到 `0.12` 后恢复完整节点与姓名；
- 关系标签低缩放时智能收起，也可强制全部显示。

第三批加入孙氏、刘氏、司马氏等跨家庭姻亲后，单一 0.5 控制点权重不足以绕开
端点附近的亲属节点。`graphLayout.ts` 现同时尝试 `0.2 / 0.35 / 0.5 / 0.65 /
0.8`，并在找到无穿节点路线后提前停止。第四批使跨区长边进一步增长，按边长
扩展的控制距离搜索上限已同步提高；第五批 305 人图继续通过节点碰撞与正式边
避让测试。

## 6. 数据红线

- 不伪造引文、卷次、链接或现代学术观点；
- 外部结构化数据只作为候选线索；
- Wikidata 不得单独支撑 confirmed 关系；
- 正文、裴注、地方旧闻、文学叙事和结构化候选必须分层；
- 无法核验的生卒年保持空值；
- 不为追求连通性补造关系或史书未载姓名；
- `clan_relative_of` 为无向关系，不得重复录入反向边；
- `data/processed` 是生成的只读候选层，不手工编辑。

关键规范：

```text
AGENTS.md
docs/DATA_SCHEMA.md
docs/SOURCE_POLICY.md
docs/CANDIDATE_PIPELINE.md
docs/MAJOR_PERSON_SCOPE.md
docs/THIRD_FAMILY_BATCH.md
docs/FOURTH_FAMILY_BATCH.md
docs/FIFTH_FAMILY_BATCH.md
```

## 7. 关键代码入口

```text
src/pages/HomePage.tsx
src/components/graph/RelationshipGraph.tsx
src/services/graphLayout.ts
src/services/graphViewport.ts
src/services/graphSelectors.ts
src/services/sourceLayers.ts
src/services/dataValidator.ts
```

## 8. 交付检查

交付前必须运行：

```powershell
npm run lint
npm run test
npm run validate:data
npm run validate:processed
npm run build
npm run build:offline
npm run validate:offline
```

还需浏览器验收桌面与 390×844 窄屏：

- 默认摘要为 305／180／91；
- 搜索刘谌并确认档案显示“第五批导入”；
- 文学作品开关默认开启；
- 吕布—貂蝉关系为虚线且档案明确标记文学关系、待核验；
- 全图与阵营图无节点重叠、无横向页面溢出；
- 控制台无 warning/error。

仓库当前未配置远端。完成后只建立本地提交，不要 `git push`。

本次交付实测：lint 通过，73／73 测试通过，正式数据为 305／180／91，候选
数据仍为 99／738 且四个哈希一致，依赖审计为 0 个漏洞；生产构建、离线构建
和离线校验均通过。1366×768 桌面浏览器确认第五批人物可搜索，刘谌档案显示
“第五批导入”且与刘禅的父子关系可见；390×844 窄屏地图宽度约 345px。
“适应画布”在两种尺寸下均完整显示 305 人总览；两种尺寸均无横向页面溢出，
控制台无 warning/error。
