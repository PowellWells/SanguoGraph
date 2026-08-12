import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { majorRosterSecondPassRelations } from './majorRosterSecondPassRelations';
import { majorRosterSecondPassSources } from './majorRosterSecondPassSources';

describe('major-roster second pass', () => {
  it('connects existing people without expanding the frozen roster', () => {
    expect(majorRosterSecondPassRelations).toHaveLength(6);
    expect(majorRosterSecondPassSources).toHaveLength(6);
    expect(graphData.persons).toHaveLength(577);

    const personIds = new Set(graphData.persons.map(({ id }) => id));
    majorRosterSecondPassRelations.forEach((relation) => {
      expect(relation.type).toBe('clan_relative_of');
      expect(personIds.has(relation.sourcePersonId)).toBe(true);
      expect(personIds.has(relation.targetPersonId)).toBe(true);
    });
  });

  it('keeps main-text and annotation relations in separate review states', () => {
    const official = majorRosterSecondPassRelations.filter(
      ({ historicalLayer }) => historicalLayer === 'official_history',
    );
    expect(official).toHaveLength(4);
    official.forEach((relation) => {
      expect(relation).toMatchObject({
        certainty: 'confirmed',
        reviewStatus: 'verified',
        claim: {
          evidenceBasis: 'direct_record',
          decisionStatus: 'confirmed',
        },
      });
    });

    const annotated = majorRosterSecondPassRelations.filter(
      ({ historicalLayer }) => historicalLayer === 'annotated_history',
    );
    expect(annotated).toHaveLength(2);
    annotated.forEach((relation) => {
      expect(relation).toMatchObject({
        certainty: 'probable',
        reviewStatus: 'pending_review',
        claim: { decisionStatus: 'pending_review' },
      });
    });
  });

  it('marks only the Lu Ji and Zhang Wen link as a bounded inference', () => {
    const inferred = majorRosterSecondPassRelations.filter(
      ({ claim }) => claim?.evidenceBasis === 'indirect_inference',
    );
    expect(inferred).toHaveLength(1);
    expect(inferred[0]?.id).toBe(
      'relation:sg:major_roster_second_pass_lu_ji_clan_zhang_wen',
    );
  });

  it('cites only verified sources carried by this pass', () => {
    const sourceIds = new Set(
      majorRosterSecondPassSources.map(({ id }) => id),
    );
    expect(
      majorRosterSecondPassSources.every(
        ({ reviewStatus, quotation }) =>
          reviewStatus === 'verified' && Boolean(quotation),
      ),
    ).toBe(true);
    majorRosterSecondPassRelations.forEach((relation) => {
      expect(relation.sourceIds).toHaveLength(1);
      expect(sourceIds.has(relation.sourceIds[0] ?? '')).toBe(true);
    });
  });
});
