import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { dataFreezeOmissionPersons } from './dataFreezeOmissionPersons';
import { dataFreezeOmissionRelations } from './dataFreezeOmissionRelations';
import { dataFreezeOmissionSources } from './dataFreezeOmissionSources';

describe('Round 6 pre-freeze named-person omission audit', () => {
  it('adds Cao Cao\'s three named daughters with direct official-history evidence', () => {
    expect(dataFreezeOmissionPersons.map(({ name }) => name)).toEqual([
      '曹宪',
      '曹节',
      '曹华',
    ]);
    expect(dataFreezeOmissionRelations).toHaveLength(6);
    expect(dataFreezeOmissionSources).toHaveLength(1);
    expect(dataFreezeOmissionRelations.every((relation) =>
      relation.certainty === 'confirmed' &&
      relation.reviewStatus === 'verified' &&
      relation.claim?.evidenceBasis === 'direct_record'
    )).toBe(true);
  });

  it('replaces the former aggregate in-law edge with concrete daughter nodes', () => {
    expect(
      graphData.relations.some(
        ({ id }) =>
          id === 'relation:sg:major_roster_second_pass_liu_xie_clan_cao_cao',
      ),
    ).toBe(false);
    dataFreezeOmissionPersons.forEach((person) => {
      expect(
        graphData.relations.filter(
          ({ sourcePersonId, targetPersonId }) =>
            sourcePersonId === person.id || targetPersonId === person.id,
        ),
      ).toHaveLength(2);
    });
  });

  it('records Cao Jie as dying in 260 without importing external links', () => {
    const caoJie = graphData.persons.find(
      ({ id }) => id === 'person:sg:cao_jie_empress',
    );
    expect(caoJie).toMatchObject({
      name: '曹节',
      deathYear: 260,
      visualFaction: 'wei',
      importBatch: 7,
      externalIds: {},
    });
    expect(dataFreezeOmissionSources[0].url).toBeNull();
  });
});
