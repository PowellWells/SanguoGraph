import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { sixthRosterRelationshipBatchOneRelations } from './sixthRosterRelationshipBatchOneRelations';
import { sixthRosterRelationshipBatchOneSources } from './sixthRosterRelationshipBatchOneSources';

describe('sixth-roster relationship batch one', () => {
  it('connects all 24 isolated volume-20 princes through direct records', () => {
    expect(sixthRosterRelationshipBatchOneRelations).toHaveLength(24);
    expect(sixthRosterRelationshipBatchOneSources).toHaveLength(2);
    expect(
      new Set(
        sixthRosterRelationshipBatchOneRelations.map(
          (relation) => relation.targetPersonId,
        ),
      ).size,
    ).toBe(24);

    for (const relation of sixthRosterRelationshipBatchOneRelations) {
      const child = graphData.persons.find(
        (person) => person.id === relation.targetPersonId,
      );
      expect(child?.importBatch).toBe(6);
      expect(relation).toMatchObject({
        type: 'father_of',
        certainty: 'confirmed',
        historicalLayer: 'official_history',
        reviewStatus: 'verified',
        origin: 'recorded',
        claim: {
          evidenceBasis: 'direct_record',
          decisionStatus: 'confirmed',
        },
      });
      expect(relation.sourceIds).toHaveLength(1);
    }
  });

  it('uses verified primary quotations from Sanguozhi volume 20', () => {
    for (const source of sixthRosterRelationshipBatchOneSources) {
      expect(source).toMatchObject({
        work: '三国志',
        sourceType: 'primary',
        historicalLayer: 'official_history',
        reviewStatus: 'verified',
      });
      expect(source.quotation?.length ?? 0).toBeGreaterThan(20);
      expect(source.url).toBeNull();
    }
  });
});
