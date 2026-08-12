import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { globalDataEvidenceAuditRelations } from './globalDataEvidenceAuditRelations';
import { globalDataEvidenceAuditSources } from './globalDataEvidenceAuditSources';

describe('Round 5 global omission and evidence audit', () => {
  it('adds four official-history relations without expanding the roster', () => {
    expect(graphData.persons).toHaveLength(577);
    expect(globalDataEvidenceAuditRelations).toHaveLength(4);
    expect(globalDataEvidenceAuditSources).toHaveLength(5);

    globalDataEvidenceAuditRelations.forEach((relation) => {
      expect(relation).toMatchObject({
        certainty: 'confirmed',
        historicalLayer: 'official_history',
        reviewStatus: 'verified',
        origin: 'recorded',
        claim: {
          evidenceBasis: 'direct_record',
          decisionStatus: 'confirmed',
        },
      });
    });
  });

  it('keeps every Round 5 source local and quoted', () => {
    expect(
      globalDataEvidenceAuditSources.every(
        ({ quotation, reviewStatus, url }) =>
          Boolean(quotation) && reviewStatus === 'verified' && url === null,
      ),
    ).toBe(true);
  });

  it('assigns the title 大懿皇后 only to the Lady Wang identity', () => {
    const titleOwners = graphData.persons.filter((person) =>
      person.otherNames.includes('大懿皇后'),
    );
    expect(titleOwners.map(({ id }) => id)).toEqual([
      'person:sg:lady_wang_langya',
    ]);
  });
});
