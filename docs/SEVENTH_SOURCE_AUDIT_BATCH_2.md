# 第七批遗漏审计第二组：女性与婚姻关系

更新时间：2026-08-10

## 范围

本组继续以本地《三国志》65 卷史料索引为检索底本，补录名册中尚不存在、但正文或
裴松之注明确记载的 20 名女性。人物统一使用 `Person.importBatch = 7`，展示阵营仅作
前端聚类，`factions` 保持为空，不据婚姻或宗族关系反推正式政治归属。

新增人物按展示阵营计为：魏 10 人、蜀 2 人、吴 8 人。其中包括清河公主、安阳公主、
东乡公主、平原懿公主，张飞妻夏侯氏，曹叡虞妃，三位未载本名的孙氏，以及王贵人、
费氏、诸葛氏、潘氏、仲姬、张妃和袁夫人等。三位“孙氏”分别使用独立人物 ID、来源
和身份说明，不能合并。

## 关系与证据分层

- 新增 34 条亲属关系：12 条 `father_of`、4 条 `mother_of`、16 条 `spouse_of`、
  2 条 `clan_relative_of`；
- 其中 27 条来自《三国志》正文，标记为 `official_history`、`confirmed`、
  `verified`；
- 7 条来自裴注所引《魏略》《嵇氏谱》《吴录》，标记为 `annotated_history`、
  `probable`、`pending_review`；
- 袁夫人与孙权的关系依据“袁夫人”称谓和立后记载谨慎表达为
  `indirect_inference`，不提升为正文直接记载；
- 《魏略》只说夏侯氏“产息女，为刘禅皇后”，无法判定是先后两位张皇后中的哪一位，
  因此不添加任何猜测性的 `mother_of` 关系。
- 《嵇氏谱》“林子之女”结合上文“林薨，子纬嗣”按曹林之子的女儿处理；仅建立曹林与
  嵇康妻的 `clan_relative_of`，不压缩为无依据的父女关系。

## 结果

正式图谱由 557 人、284 条关系、138 条史料更新为 577 人、318 条关系、156 条史料。
有关系人物由 300 人增至 325 人，孤立人物由 257 人降至 252 人，覆盖率为 56.3%。
第七批累计 40 人，其中 39 人已接入关系图，董厥继续保持孤立。

主要实现文件：

```text
src/data/seventhSourceAuditBatchTwoPersons.ts
src/data/seventhSourceAuditBatchTwoRelations.ts
src/data/seventhSourceAuditBatchTwoSources.ts
src/data/seventhSourceAuditBatchTwo.test.ts
```
