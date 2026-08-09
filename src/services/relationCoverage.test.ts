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
      relationCount: 184,
      relatedPersonCount: 187,
      isolatedPersonCount: 350,
      coveragePercent: 34.8,
      connectedComponentCount: 31,
      largestConnectedComponentSizes: [56, 49, 8, 8, 6, 3, 3, 3, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 56, isolatedPeople: 120 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 2, isolatedPeople: 230 },
      },
      byVisualFaction: {
        wei: { totalPeople: 255, relatedPeople: 76, isolatedPeople: 179 },
        shu: { totalPeople: 119, relatedPeople: 73, isolatedPeople: 46 },
        wu: { totalPeople: 124, relatedPeople: 29, isolatedPeople: 95 },
        other: { totalPeople: 39, relatedPeople: 9, isolatedPeople: 30 },
      },
      byRelationType: {
        father_of: 118,
        mother_of: 25,
        spouse_of: 25,
        adoptive_father_of: 3,
        adoptive_mother_of: 2,
        clan_relative_of: 11,
      },
    });
    expect(report.isolatedPersonIds).toHaveLength(350);
  });

  it('prioritizes unexpected family-batch gaps before roster research', () => {
    const queue = buildRelationResearchQueue(graphData);

    expect(queue.family_batch_gap).toHaveLength(0);
    expect(queue.major_roster).toHaveLength(120);
    expect(queue.complete_roster).toHaveLength(230);
    expect(queue.major_roster.map((person) => person.name)).toContain('荀彧');
    expect(queue.complete_roster.map((person) => person.name)).toContain(
      '荀恽',
    );
  });
});
