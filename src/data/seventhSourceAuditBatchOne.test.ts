import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { seventhSourceAuditBatchOnePersons } from './seventhSourceAuditBatchOnePersons';
import { seventhSourceAuditBatchOneRelations } from './seventhSourceAuditBatchOneRelations';

describe('seventh source-audit batch one', () => {
  it('adds exactly twenty verified people found by the 65-volume audit', () => {
    expect(seventhSourceAuditBatchOnePersons).toHaveLength(20);
    expect(
      seventhSourceAuditBatchOnePersons.every(
        (person) =>
          person.importBatch === 7 &&
          person.reviewStatus === 'verified' &&
          person.sourceIds.length > 0,
      ),
    ).toBe(true);
    expect(seventhSourceAuditBatchOnePersons.map(({ name }) => name)).toEqual(
      expect.arrayContaining(['董厥', '孙虑', '杜夫人', '李贵人']),
    );
  });

  it('keeps the two Song Ji identities distinct', () => {
    const songJi = seventhSourceAuditBatchOnePersons.filter(
      ({ name }) => name === '宋姬',
    );
    expect(songJi).toHaveLength(2);
    expect(new Set(songJi.map(({ id }) => id))).toEqual(
      new Set(['person:sg:cao_cao_song_ji', 'person:sg:cao_pi_song_ji']),
    );
    songJi.forEach((person) => expect(person.description).toMatch(/曹操|曹丕/));
  });

  it('adds only the twenty-five directly supported parent-child relations', () => {
    expect(seventhSourceAuditBatchOneRelations).toHaveLength(25);
    expect(
      seventhSourceAuditBatchOneRelations.filter(
        ({ type }) => type === 'mother_of',
      ),
    ).toHaveLength(24);
    expect(
      seventhSourceAuditBatchOneRelations.filter(
        ({ type }) => type === 'father_of',
      ),
    ).toHaveLength(1);
    seventhSourceAuditBatchOneRelations.forEach((relation) => {
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
      expect(relation.sourceIds).toHaveLength(1);
    });
    const auditedPersonIds = new Set(
      seventhSourceAuditBatchOnePersons.map(({ id }) => id),
    );
    expect(
      graphData.relations.filter(
        (relation) =>
          relation.type === 'spouse_of' &&
          (auditedPersonIds.has(relation.sourcePersonId) ||
            auditedPersonIds.has(relation.targetPersonId)),
      ),
    ).toHaveLength(0);
  });

  it('leaves Dong Jue unconnected instead of inventing a non-family edge', () => {
    expect(
      graphData.relations.some(
        (relation) =>
          relation.sourcePersonId === 'person:sg:dong_jue' ||
          relation.targetPersonId === 'person:sg:dong_jue',
      ),
    ).toBe(false);
  });
});
