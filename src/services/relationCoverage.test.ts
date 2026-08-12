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
      relationCount: 353,
      relatedPersonCount: 371,
      isolatedPersonCount: 206,
      coveragePercent: 64.3,
      connectedComponentCount: 58,
      largestConnectedComponentSizes: [238, 9, 3, 3, 3, 3, 3, 3, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 115, isolatedPeople: 61 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 88, isolatedPeople: 144 },
        7: { totalPeople: 40, relatedPeople: 39, isolatedPeople: 1 },
      },
      byVisualFaction: {
        wei: { totalPeople: 283, relatedPeople: 175, isolatedPeople: 108 },
        shu: { totalPeople: 122, relatedPeople: 82, isolatedPeople: 40 },
        wu: { totalPeople: 133, relatedPeople: 92, isolatedPeople: 41 },
        other: { totalPeople: 39, relatedPeople: 22, isolatedPeople: 17 },
      },
      byRelationType: {
        father_of: 196,
        mother_of: 54,
        spouse_of: 50,
        adoptive_father_of: 6,
        adoptive_mother_of: 2,
        clan_relative_of: 45,
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
