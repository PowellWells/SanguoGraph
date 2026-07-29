# SanguoGraph / 三国人物关系谱

[English](README.md)

SanguoGraph
是一个处于早期阶段的开源三国历史人物关系知识图谱。项目以可追溯史料为核心，
记录人物之间的亲属、婚姻、收养和宗族关系，并为每条关系保留材料层级、
可信度和人工核验状态。

## 当前进度

Milestone 0 仅提供项目基础：

- 响应式 React 与 Cytoscape.js 页面骨架；
- 人物、关系和史料的严格 TypeScript 数据类型；
- 三个待复核示例人物与两条待复核示例关系；
- 自动数据校验、测试和 GitHub Pages 工作流。

示例数据尚未作为正式关系图展示。史料核验和首个曹操核心家庭交互图谱属于
Milestone 1。

## 史料原则

- 正史关系与文学关系必须分层保存。
- Wikidata 和既有知识图谱只能作为候选线索，不能代替对史料原文的人工核验。
- 不接受没有有效出处的 `confirmed` 关系。
- 程序推导出的关系不能伪装成史料直接记载。

贡献数据前请阅读[史料政策](docs/SOURCE_POLICY.md)和
[数据模式](docs/DATA_SCHEMA.md)。

## 本地开发

环境要求：

- Node.js 18.18 或更高版本
- npm

```powershell
npm install
npm run dev
```

完整质量检查：

```powershell
npm run lint
npm run test
npm run validate:data
npm run build
```

生产构建的 Vite base path 为 `/sanguo-graph/`，用于项目型 GitHub Pages 地址。

## 参与贡献

提交代码或数据前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。
项目不接受无出处的确认关系。

## 许可证

源代码采用 [MIT License](LICENSE)。

当前项目数据由维护者整理。独立、长期的数据许可证仍在
[路线图](docs/ROADMAP.md)中评估；项目不会擅自把第三方数据声明为 CC0。

