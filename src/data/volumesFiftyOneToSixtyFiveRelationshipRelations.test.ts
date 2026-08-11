import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { volumesFiftyOneToSixtyFiveRelationshipRelations } from './volumesFiftyOneToSixtyFiveRelationshipRelations';
import { volumesFiftyOneToSixtyFiveRelationshipSources } from './volumesFiftyOneToSixtyFiveRelationshipSources';

describe('volumes 51-65 isolated-person relationship review', () => {
  it('adds eight relations without expanding the frozen roster', () => {
    expect(volumesFiftyOneToSixtyFiveRelationshipRelations).toHaveLength(8);
    expect(volumesFiftyOneToSixtyFiveRelationshipSources).toHaveLength(5);
    expect(graphData.persons).toHaveLength(577);

    const personIds = new Set(graphData.persons.map(({ id }) => id));
    volumesFiftyOneToSixtyFiveRelationshipRelations.forEach((relation) => {
      expect(personIds.has(relation.sourcePersonId)).toBe(true);
      expect(personIds.has(relation.targetPersonId)).toBe(true);
    });
  });

  it('keeps seven main-text relations confirmed and the annotation relation pending', () => {
    const official = volumesFiftyOneToSixtyFiveRelationshipRelations.filter(
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

    const annotated = volumesFiftyOneToSixtyFiveRelationshipRelations.filter(
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

  it('resolves reused and newly owned source records', () => {
    expect(
      volumesFiftyOneToSixtyFiveRelationshipSources.every(
        ({ reviewStatus, quotation }) =>
          reviewStatus === 'verified' && Boolean(quotation),
      ),
    ).toBe(true);

    const graphSourceIds = new Set(graphData.sources.map(({ id }) => id));
    volumesFiftyOneToSixtyFiveRelationshipRelations.forEach((relation) => {
      expect(relation.sourceIds).toHaveLength(1);
      expect(graphSourceIds.has(relation.sourceIds[0] ?? '')).toBe(true);
    });
  });
});
