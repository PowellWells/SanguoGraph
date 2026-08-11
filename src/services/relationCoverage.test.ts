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
      personCount: 577,
      relationCount: 341,
      relatedPersonCount: 357,
      isolatedPersonCount: 220,
      coveragePercent: 61.9,
      connectedComponentCount: 55,
      largestConnectedComponentSizes: [230, 9, 3, 3, 3, 3, 3, 3, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 112, isolatedPeople: 64 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 77, isolatedPeople: 155 },
        7: { totalPeople: 40, relatedPeople: 39, isolatedPeople: 1 },
      },
      byVisualFaction: {
        wei: { totalPeople: 283, relatedPeople: 171, isolatedPeople: 112 },
        shu: { totalPeople: 122, relatedPeople: 82, isolatedPeople: 40 },
        wu: { totalPeople: 133, relatedPeople: 83, isolatedPeople: 50 },
        other: { totalPeople: 39, relatedPeople: 21, isolatedPeople: 18 },
      },
      byRelationType: {
        father_of: 193,
        mother_of: 54,
        spouse_of: 49,
        adoptive_father_of: 6,
        adoptive_mother_of: 2,
        clan_relative_of: 37,
      },
    });
    expect(report.isolatedPersonIds).toHaveLength(220);
  });

  it('prioritizes unexpected family-batch gaps before roster research', () => {
    const queue = buildRelationResearchQueue(graphData);

    expect(queue.family_batch_gap).toHaveLength(0);
    expect(queue.major_roster).toHaveLength(64);
    expect(queue.complete_roster).toHaveLength(156);
    expect(queue.major_roster.map((person) => person.name)).toContain('郭嘉');
    expect(queue.complete_roster.map((person) => person.name)).toContain('韩浩');
    expect(queue.complete_roster.map((person) => person.name)).toContain('董厥');
  });
});
