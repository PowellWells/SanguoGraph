# SanguoGraph 第六批列传级全量人物交接文档

更新时间：2026-08-03
当前分支：`main`

## 1. 当前状态

SanguoGraph 是来源可追溯的三国人物关系知识图谱。项目仍为 React、严格
TypeScript、Vite 和 Cytoscape.js 构建的纯前端应用，没有后端、数据库、登录或
AI API。

当前正式数据：

- 537 个人物；
- 180 条家庭关系；
- 107 条史料；
- 展示阵营：魏 255、蜀 119、吴 124、其他 39；
- 首次进入前端即加载全部 537 人和 180 条关系；
- 99 个 Wikidata 候选人物和 738 条候选关系仍默认隐藏；
- 离线入口：`E:\SanGuo\offline\index.html`。

人物批次：

- 第一批：24 人；
- 第二批：176 人；
- 第三批：35 人；
- 第四批：35 人；
- 第五批：35 人；
- 第六批：232 位列传级全量人物。

`Person.importBatch` 允许 `1 | 2 | 3 | 4 | 5 | 6`，第六批档案显示
“第六批全量导入”。

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

## 3. 关系红线

正式关系严格保持 180 条，本批未增加任何连线。关系 JSON 序列化后的
SHA-256 为：

```text
0fca2053baa6bab4afb3a31d52a960b29ae0274885048f1ecb1149c611703cbb
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
- “适应画布”继续显示全部 537 人，极低缩放使用阵营色点总览；
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
src/data/completeRosterManifest.ts
src/data/sixthRoster/manifest.ts
src/services/graphLayout.ts
src/services/graphViewport.ts
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
npm audit --omit=dev
```

浏览器验收尺寸为 1366×768 和 390×844，需确认：

- 默认地图加载 537 人、180 条关系；
- 搜索王蕃并显示“第六批全量导入”；
- 四阵营计数为 255、119、124、39；
- “适应画布”显示全部人物，放大后姓名可读；
- 没有节点重叠、连线穿过无关人物或横向页面溢出；
- 控制台没有 warning/error。

仓库未配置远程。完成后只建立本地里程碑提交，不执行 `git push`。

本次交付实测：lint 通过，80／80 测试通过，正式数据为 537／180／107，
候选数据仍为 99／738 且四个哈希一致，依赖审计为 0 个漏洞；生产构建、离线构建和
离线校验均通过。1366×768 与 390×844 浏览器验收均显示 537 人、180 关系，
四阵营计数正确，王蕃搜索和第六批档案正确，“适应画布”可用，无横向溢出或
控制台 warning/error。
