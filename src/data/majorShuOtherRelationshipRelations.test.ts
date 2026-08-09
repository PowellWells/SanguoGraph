import { describe, expect, it } from 'vitest';
import { majorShuOtherRelationshipRelations } from './majorShuOtherRelationshipRelations';
import { majorShuOtherRelationshipSources } from './majorShuOtherRelationshipSources';

describe('major Shu and other relationship batch three', () => {
  it('records eight relationships from six verified source records', () => {
    expect(majorShuOtherRelationshipRelations).toHaveLength(8);
    expect(majorShuOtherRelationshipSources).toHaveLength(6);
  });

  it('keeps the bounded Gongsun genealogy inference pending', () => {
    const inferred = majorShuOtherRelationshipRelations.filter(
      (relation) => relation.claim?.evidenceBasis === 'indirect_inference',
    );
    expect(inferred.map((relation) => relation.id)).toEqual([
      'relation:sg:major_shu_other_gongsun_du_clan_gongsun_yuan',
    ]);
    expect(inferred[0]?.reviewStatus).toBe('pending_review');
  });

  it('uses only supported family relation types', () => {
    expect(
      majorShuOtherRelationshipRelations.every((relation) =>
        ['father_of', 'adoptive_father_of', 'clan_relative_of'].includes(relation.type),
      ),
    ).toBe(true);
  });
});
