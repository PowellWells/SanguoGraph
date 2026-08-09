import { describe, expect, it } from 'vitest';
import { majorWuRelationshipRelations } from './majorWuRelationshipRelations';
import { majorWuRelationshipSources } from './majorWuRelationshipSources';

describe('major Wu relationship batch two', () => {
  it('records 27 source-backed relationships from seven source records', () => {
    expect(majorWuRelationshipRelations).toHaveLength(27);
    expect(majorWuRelationshipSources).toHaveLength(7);
  });

  it('keeps four bounded genealogy inferences visibly pending', () => {
    const inferred = majorWuRelationshipRelations.filter(
      (relation) => relation.claim?.evidenceBasis === 'indirect_inference',
    );
    expect(inferred).toHaveLength(4);
    expect(inferred.every((relation) => relation.certainty === 'probable')).toBe(true);
    expect(inferred.every((relation) => relation.reviewStatus === 'pending_review')).toBe(true);
  });

  it('does not create relations outside the six supported family types', () => {
    expect(
      majorWuRelationshipRelations.every((relation) =>
        ['father_of', 'spouse_of', 'adoptive_father_of', 'clan_relative_of'].includes(relation.type),
      ),
    ).toBe(true);
  });
});
