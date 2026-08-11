import coverageConfig from '../config/relation_coverage.json';
import { graphData } from '../src/data';
import type { VisualFaction } from '../src/domain';
import {
  analyzeRelationCoverage,
  buildRelationResearchQueue,
  VISUAL_FACTIONS,
  type RelationResearchCohort,
} from '../src/services/relationCoverage';
import { getFactionColorKey } from '../src/services/graphVisualEncoding';

const cohortLabels: Record<RelationResearchCohort, string> = {
  family_batch_gap: '既有家庭扩展批次异常缺口',
  major_roster: '第二批主要人物优先核验',
  complete_roster: '第六批完整列传名册核验',
};

const factionLabels: Record<VisualFaction, string> = {
  wei: '魏',
  shu: '蜀',
  wu: '吴',
  other: '其他',
};

const flags = new Set(process.argv.slice(2));
const report = analyzeRelationCoverage(graphData);
const queue = buildRelationResearchQueue(graphData, report);

function printSummary(): void {
  console.log(
    `关系覆盖：${report.relatedPersonCount}/${report.personCount} 人（${report.coveragePercent}%），` +
      `${report.isolatedPersonCount} 人完全孤立，${report.relationCount} 条正式关系。`,
  );
  console.log(
    `连通分量：${report.connectedComponentCount} 个；最大分量：${report.largestConnectedComponentSizes.join(', ')}。`,
  );
  console.log('按导入批次：');
  for (const [batch, group] of Object.entries(report.byImportBatch)) {
    console.log(
      `- 第${batch}批：${group.relatedPeople}/${group.totalPeople} 人有关系，` +
        `${group.isolatedPeople} 人孤立（${group.coveragePercent}%）`,
    );
  }
  console.log('按展示阵营：');
  for (const faction of VISUAL_FACTIONS) {
    const group = report.byVisualFaction[faction];
    console.log(
      `- ${factionLabels[faction]}：${group.relatedPeople}/${group.totalPeople} 人有关系，` +
        `${group.isolatedPeople} 人孤立（${group.coveragePercent}%）`,
    );
  }
  console.log('研究队列：');
  for (const [cohort, people] of Object.entries(queue) as Array<
    [RelationResearchCohort, (typeof graphData.persons)[number][]]
  >) {
    console.log(`- ${cohortLabels[cohort]}：${people.length} 人`);
  }
}

function printIsolatedPeople(): void {
  for (const [cohort, people] of Object.entries(queue) as Array<
    [RelationResearchCohort, (typeof graphData.persons)[number][]]
  >) {
    console.log(`\n## ${cohortLabels[cohort]}（${people.length} 人）`);
    for (const faction of VISUAL_FACTIONS) {
      const names = people
        .filter((person) => getFactionColorKey(person) === faction)
        .map((person) => person.name);
      console.log(
        `- ${factionLabels[faction]}（${names.length}）：${names.join('、') || '无'}`,
      );
    }
  }
}

function validateBaseline(): void {
  const { baseline } = coverageConfig;
  const issues: string[] = [];
  if (report.personCount < baseline.personCount) {
    issues.push(
      `人物总数从 ${baseline.personCount} 降至 ${report.personCount}，不得通过删除人物改善覆盖率。`,
    );
  }
  if (report.relationCount < baseline.relationCount) {
    issues.push(
      `正式关系从 ${baseline.relationCount} 降至 ${report.relationCount}。`,
    );
  }
  if (report.relatedPersonCount < baseline.relatedPersonCount) {
    issues.push(
      `有关系人物从 ${baseline.relatedPersonCount} 降至 ${report.relatedPersonCount}。`,
    );
  }
  if (report.isolatedPersonCount > baseline.maxIsolatedPersonCount) {
    issues.push(
      `孤立人物从最多 ${baseline.maxIsolatedPersonCount} 增至 ${report.isolatedPersonCount}。`,
    );
  }
  if (report.coveragePercent < baseline.minCoveragePercent) {
    issues.push(
      `关系覆盖率从至少 ${baseline.minCoveragePercent}% 降至 ${report.coveragePercent}%。`,
    );
  }

  if (issues.length > 0) {
    console.error('关系覆盖回归校验失败：');
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(
    `关系覆盖回归校验通过：${report.relatedPersonCount} 人有关系，` +
      `${report.isolatedPersonCount} 人孤立，覆盖率 ${report.coveragePercent}%。`,
  );
}

if (flags.has('--json')) {
  console.log(JSON.stringify({ report, queue }, null, 2));
} else {
  printSummary();
  if (flags.has('--list')) {
    printIsolatedPeople();
  }
}

if (flags.has('--check')) {
  validateBaseline();
}
