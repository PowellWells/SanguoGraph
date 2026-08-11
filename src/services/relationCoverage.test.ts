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
      relationCount: 318,
      relatedPersonCount: 325,
      isolatedPersonCount: 252,
      coveragePercent: 56.3,
      connectedComponentCount: 45,
      largestConnectedComponentSizes: [220, 8, 3, 3, 3, 3, 3, 3, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 105, isolatedPeople: 71 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 52, isolatedPeople: 180 },
        7: { totalPeople: 40, relatedPeople: 39, isolatedPeople: 1 },
      },
      byVisualFaction: {
        wei: { totalPeople: 283, relatedPeople: 154, isolatedPeople: 129 },
        shu: { totalPeople: 122, relatedPeople: 80, isolatedPeople: 42 },
        wu: { totalPeople: 133, relatedPeople: 74, isolatedPeople: 59 },
        other: { totalPeople: 39, relatedPeople: 17, isolatedPeople: 22 },
      },
      byRelationType: {
        father_of: 187,
        mother_of: 53,
        spouse_of: 42,
        adoptive_father_of: 6,
        adoptive_mother_of: 2,
        clan_relative_of: 28,
      },
    });
    expect(report.isolatedPersonIds).toHaveLength(252);
  });

  it('prioritizes unexpected family-batch gaps before roster research', () => {
    const queue = buildRelationResearchQueue(graphData);

    expect(queue.family_batch_gap).toHaveLength(0);
    expect(queue.major_roster).toHaveLength(71);
    expect(queue.complete_roster).toHaveLength(181);
    expect(queue.major_roster.map((person) => person.name)).toContain('郭嘉');
    expect(queue.complete_roster.map((person) => person.name)).toContain('韩浩');
    expect(queue.complete_roster.map((person) => person.name)).toContain('董厥');
  });
});
