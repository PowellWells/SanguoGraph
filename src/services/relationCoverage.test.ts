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
      personCount: 557,
      relationCount: 284,
      relatedPersonCount: 300,
      isolatedPersonCount: 257,
      coveragePercent: 53.9,
      connectedComponentCount: 51,
      largestConnectedComponentSizes: [103, 61, 11, 8, 6, 5, 4, 4, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 102, isolatedPeople: 74 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 50, isolatedPeople: 182 },
        7: { totalPeople: 20, relatedPeople: 19, isolatedPeople: 1 },
      },
      byVisualFaction: {
        wei: { totalPeople: 273, relatedPeople: 142, isolatedPeople: 131 },
        shu: { totalPeople: 120, relatedPeople: 77, isolatedPeople: 43 },
        wu: { totalPeople: 125, relatedPeople: 64, isolatedPeople: 61 },
        other: { totalPeople: 39, relatedPeople: 17, isolatedPeople: 22 },
      },
      byRelationType: {
        father_of: 175,
        mother_of: 49,
        spouse_of: 26,
        adoptive_father_of: 6,
        adoptive_mother_of: 2,
        clan_relative_of: 26,
      },
    });
    expect(report.isolatedPersonIds).toHaveLength(257);
  });

  it('prioritizes unexpected family-batch gaps before roster research', () => {
    const queue = buildRelationResearchQueue(graphData);

    expect(queue.family_batch_gap).toHaveLength(0);
    expect(queue.major_roster).toHaveLength(74);
    expect(queue.complete_roster).toHaveLength(183);
    expect(queue.major_roster.map((person) => person.name)).toContain('郭嘉');
    expect(queue.complete_roster.map((person) => person.name)).toContain('韩浩');
    expect(queue.complete_roster.map((person) => person.name)).toContain('董厥');
  });
});
