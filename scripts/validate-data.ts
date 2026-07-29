import { graphData } from '../src/data';
import { validateGraphData } from '../src/services/dataValidator';

const issues = validateGraphData(graphData);

if (issues.length > 0) {
  console.error(`数据校验失败，共发现 ${issues.length} 个问题：`);
  for (const issue of issues) {
    console.error(
      `- [${issue.code}] ${issue.collection}/${issue.entityId}: ${issue.message}`,
    );
  }
  process.exitCode = 1;
} else {
  console.log(
    `数据校验通过：${graphData.persons.length} 个人物，${graphData.relations.length} 条关系，${graphData.sources.length} 条史料。`,
  );
}

