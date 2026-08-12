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
      relationCount: 349,
      relatedPersonCount: 365,
      isolatedPersonCount: 212,
      coveragePercent: 63.3,
      connectedComponentCount: 56,
      largestConnectedComponentSizes: [236, 9, 3, 3, 3, 3, 3, 3, 3, 3],
      byImportBatch: {
        1: { totalPeople: 24, relatedPeople: 24, isolatedPeople: 0 },
        2: { totalPeople: 176, relatedPeople: 113, isolatedPeople: 63 },
        3: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        4: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        5: { totalPeople: 35, relatedPeople: 35, isolatedPeople: 0 },
        6: { totalPeople: 232, relatedPeople: 84, isolatedPeople: 148 },
        7: { totalPeople: 40, relatedPeople: 39, isolatedPeople: 1 },
      },
      byVisualFaction: {
        wei: { totalPeople: 283, relatedPeople: 171, isolatedPeople: 112 },
        shu: { totalPeople: 122, relatedPeople: 82, isolatedPeople: 40 },
        wu: { totalPeople: 133, relatedPeople: 91, isolatedPeople: 42 },
        other: { totalPeople: 39, relatedPeople: 21, isolatedPeople: 18 },
      },
      byRelationType: {
        father_of: 195,
        mother_of: 54,
        spouse_of: 50,
        adoptive_father_of: 6,
        adoptive_mother_of: 2,
        clan_relative_of: 42,
      },
    });
    expect(report.isolatedPersonIds).toHaveLength(212);
  });

  it('prioritizes unexpected family-batch gaps before roster research', () => {
    const queue = buildRelationResearchQueue(graphData);

    expect(queue.family_batch_gap).toHaveLength(0);
    expect(queue.major_roster).toHaveLength(63);
    expect(queue.complete_roster).toHaveLength(149);
    expect(queue.major_roster.map((person) => person.name)).toContain('郭嘉');
    expect(queue.complete_roster.map((person) => person.name)).toContain('韩浩');
    expect(queue.complete_roster.map((person) => person.name)).toContain('董厥');
  });
});
