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
      personCount: 580,
      relationCount: 358,
      relatedPersonCount: 374,
      isolatedPersonCount: 206,
      coveragePercent: 64.5,
      connectedComponentCount: 58,
      largestConnectedComponentSizes: [241, 9, 3, 3, 3, 3, 3, 3, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 115, isolatedPeople: 61 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 88, isolatedPeople: 144 },
        7: { totalPeople: 43, relatedPeople: 42, isolatedPeople: 1 },
      },
      byVisualFaction: {
        wei: { totalPeople: 286, relatedPeople: 178, isolatedPeople: 108 },
        shu: { totalPeople: 122, relatedPeople: 82, isolatedPeople: 40 },
        wu: { totalPeople: 133, relatedPeople: 92, isolatedPeople: 41 },
        other: { totalPeople: 39, relatedPeople: 22, isolatedPeople: 17 },
      },
      byRelationType: {
        father_of: 199,
        mother_of: 54,
        spouse_of: 53,
        adoptive_father_of: 6,
        adoptive_mother_of: 2,
        clan_relative_of: 44,
      },
    });
    expect(report.isolatedPersonIds).toHaveLength(206);
  });

  it('prioritizes unexpected family-batch gaps before roster research', () => {
    const queue = buildRelationResearchQueue(graphData);

    expect(queue.family_batch_gap).toHaveLength(0);
    expect(queue.major_roster).toHaveLength(61);
    expect(queue.complete_roster).toHaveLength(145);
    expect(queue.major_roster.map((person) => person.name)).toContain('郭嘉');
    expect(queue.complete_roster.map((person) => person.name)).toContain('韩浩');
    expect(queue.complete_roster.map((person) => person.name)).toContain('董厥');
  });
});
