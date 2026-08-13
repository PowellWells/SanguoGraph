import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { volumesThirtyOneToFiftyRelationshipRelations } from './volumesThirtyOneToFiftyRelationshipRelations';
import { volumesThirtyOneToFiftyRelationshipSources } from './volumesThirtyOneToFiftyRelationshipSources';

describe('volumes 31-50 isolated-person relationship review', () => {
  it('adds eight relations without expanding the frozen roster', () => {
    expect(volumesThirtyOneToFiftyRelationshipRelations).toHaveLength(8);
    expect(volumesThirtyOneToFiftyRelationshipSources).toHaveLength(7);
    expect(graphData.persons).toHaveLength(580);

    const personIds = new Set(graphData.persons.map(({ id }) => id));
    volumesThirtyOneToFiftyRelationshipRelations.forEach((relation) => {
      expect(personIds.has(relation.sourcePersonId)).toBe(true);
      expect(personIds.has(relation.targetPersonId)).toBe(true);
    });
  });

  it('keeps the main-text relations confirmed and the annotation relation pending', () => {
    const official = volumesThirtyOneToFiftyRelationshipRelations.filter(
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

    const annotated = volumesThirtyOneToFiftyRelationshipRelations.filter(
      ({ historicalLayer }) => historicalLayer === 'annotated_history',
    );
    expect(annotated).toHaveLength(1);
    expect(annotated[0]).toMatchObject({
      certainty: 'probable',
      reviewStatus: 'pending_review',
      claim: {
        evidenceBasis: 'direct_record',
        decisionStatus: 'pending_review',
      },
    });
  });

  it('uses only verified source records owned by this review', () => {
    const sourceIds = new Set(
      volumesThirtyOneToFiftyRelationshipSources.map(({ id }) => id),
    );
    expect(
      volumesThirtyOneToFiftyRelationshipSources.every(
        ({ reviewStatus, quotation }) =>
          reviewStatus === 'verified' && Boolean(quotation),
      ),
    ).toBe(true);
    volumesThirtyOneToFiftyRelationshipRelations.forEach((relation) => {
      expect(relation.sourceIds).toHaveLength(1);
      expect(sourceIds.has(relation.sourceIds[0] ?? '')).toBe(true);
    });
  });
});
