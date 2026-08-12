import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { volumesOneToThirtyRelationshipRelations } from './volumesOneToThirtyRelationshipRelations';
import { volumesOneToThirtyRelationshipSources } from './volumesOneToThirtyRelationshipSources';

describe('volumes 1-30 isolated-person relationship review', () => {
  it('adds nine relations without expanding the frozen roster', () => {
    expect(volumesOneToThirtyRelationshipRelations).toHaveLength(9);
    expect(volumesOneToThirtyRelationshipSources).toHaveLength(9);
    expect(graphData.persons).toHaveLength(577);

    const personIds = new Set(graphData.persons.map(({ id }) => id));
    volumesOneToThirtyRelationshipRelations.forEach((relation) => {
      expect(personIds.has(relation.sourcePersonId)).toBe(true);
      expect(personIds.has(relation.targetPersonId)).toBe(true);
    });
  });

  it('keeps main-text relations confirmed and annotation relations pending', () => {
    const official = volumesOneToThirtyRelationshipRelations.filter(
      ({ historicalLayer }) => historicalLayer === 'official_history',
    );
    expect(official).toHaveLength(7);
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

    const annotated = volumesOneToThirtyRelationshipRelations.filter(
      ({ historicalLayer }) => historicalLayer === 'annotated_history',
    );
    expect(annotated).toHaveLength(2);
    annotated.forEach((relation) => {
      expect(relation).toMatchObject({
        certainty: 'probable',
        reviewStatus: 'pending_review',
        claim: {
          evidenceBasis: 'direct_record',
          decisionStatus: 'pending_review',
        },
      });
    });
  });

  it('uses only verified source records owned by this review', () => {
    const sourceIds = new Set(
      volumesOneToThirtyRelationshipSources.map(({ id }) => id),
    );
    expect(
      volumesOneToThirtyRelationshipSources.every(
        ({ reviewStatus, quotation }) =>
          reviewStatus === 'verified' && Boolean(quotation),
      ),
    ).toBe(true);
    volumesOneToThirtyRelationshipRelations.forEach((relation) => {
      expect(relation.sourceIds).toHaveLength(1);
      expect(sourceIds.has(relation.sourceIds[0] ?? '')).toBe(true);
    });
  });
});
