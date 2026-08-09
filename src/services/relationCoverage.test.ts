import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import {
  analyzeRelationCoverage,
  buildRelationResearchQueue,
} from './relationCoverage';

describe('relation coverage audit', () => {
  it('freezes the current formal relation coverage baseline', () => {
    const report = analyzeRelationCoverage(graphData);

    expect(report).toMatchObject({
      personCount: 537,
      relationCount: 200,
      relatedPersonCount: 211,
      isolatedPersonCount: 326,
      coveragePercent: 39.3,
      connectedComponentCount: 39,
      largestConnectedComponentSizes: [60, 49, 8, 8, 6, 5, 3, 3, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 72, isolatedPeople: 104 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 10, isolatedPeople: 222 },
      },
      byVisualFaction: {
        wei: { totalPeople: 255, relatedPeople: 100, isolatedPeople: 155 },
        shu: { totalPeople: 119, relatedPeople: 73, isolatedPeople: 46 },
        wu: { totalPeople: 124, relatedPeople: 29, isolatedPeople: 95 },
        other: { totalPeople: 39, relatedPeople: 9, isolatedPeople: 30 },
      },
      byRelationType: {
        father_of: 130,
        mother_of: 25,
        spouse_of: 25,
        adoptive_father_of: 4,
        adoptive_mother_of: 2,
        clan_relative_of: 14,
      },
    });
    expect(report.isolatedPersonIds).toHaveLength(326);
  });

  it('prioritizes unexpected family-batch gaps before roster research', () => {
    const queue = buildRelationResearchQueue(graphData);

    expect(queue.family_batch_gap).toHaveLength(0);
    expect(queue.major_roster).toHaveLength(104);
    expect(queue.complete_roster).toHaveLength(222);
    expect(queue.major_roster.map((person) => person.name)).toContain('郭嘉');
    expect(queue.complete_roster.map((person) => person.name)).toContain('韩浩');
  });
});
