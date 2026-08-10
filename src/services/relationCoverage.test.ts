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
      relationCount: 259,
      relatedPersonCount: 281,
      isolatedPersonCount: 256,
      coveragePercent: 52.3,
      connectedComponentCount: 51,
      largestConnectedComponentSizes: [85, 60, 11, 8, 6, 5, 4, 4, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 102, isolatedPeople: 74 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 50, isolatedPeople: 182 },
      },
      byVisualFaction: {
        wei: { totalPeople: 255, relatedPeople: 124, isolatedPeople: 131 },
        shu: { totalPeople: 119, relatedPeople: 77, isolatedPeople: 42 },
        wu: { totalPeople: 124, relatedPeople: 63, isolatedPeople: 61 },
        other: { totalPeople: 39, relatedPeople: 17, isolatedPeople: 22 },
      },
      byRelationType: {
        father_of: 174,
        mother_of: 25,
        spouse_of: 26,
        adoptive_father_of: 6,
        adoptive_mother_of: 2,
        clan_relative_of: 26,
      },
    });
    expect(report.isolatedPersonIds).toHaveLength(256);
  });

  it('prioritizes unexpected family-batch gaps before roster research', () => {
    const queue = buildRelationResearchQueue(graphData);

    expect(queue.family_batch_gap).toHaveLength(0);
    expect(queue.major_roster).toHaveLength(74);
    expect(queue.complete_roster).toHaveLength(182);
    expect(queue.major_roster.map((person) => person.name)).toContain('郭嘉');
    expect(queue.complete_roster.map((person) => person.name)).toContain('韩浩');
  });
});
