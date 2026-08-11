import { describe, expect, it } from 'vitest';
import { seventhSourceAuditBatchTwoPersons } from './seventhSourceAuditBatchTwoPersons';
import { seventhSourceAuditBatchTwoRelations } from './seventhSourceAuditBatchTwoRelations';
import { seventhSourceAuditBatchTwoSources } from './seventhSourceAuditBatchTwoSources';

describe('seventh source-audit batch two', () => {
  it('adds twenty separately sourced women from the 65-volume audit', () => {
    expect(seventhSourceAuditBatchTwoPersons).toHaveLength(20);
    expect(seventhSourceAuditBatchTwoSources).toHaveLength(18);
    expect(
      seventhSourceAuditBatchTwoPersons.every(
        (person) =>
          person.importBatch === 7 &&
          person.gender === 'female' &&
          person.factions.length === 0 &&
          person.sourceIds.length > 0,
      ),
    ).toBe(true);

    const sameNameSunWomen = seventhSourceAuditBatchTwoPersons.filter(
      ({ name }) => name === '孙氏',
    );
    expect(sameNameSunWomen).toHaveLength(3);
    expect(new Set(sameNameSunWomen.map(({ id }) => id)).size).toBe(3);
    expect(
      sameNameSunWomen.every(({ description }) => description.length > 0),
    ).toBe(true);

    const xiahouLady = seventhSourceAuditBatchTwoPersons.find(
      ({ id }) => id === 'person:sg:lady_xiahou_zhang_fei',
    );
    expect(xiahouLady?.visualFaction).toBe('wei');

    const jiKangWife = seventhSourceAuditBatchTwoPersons.find(
      ({ id }) => id === 'person:sg:lady_cao_ji_kang',
    );
    expect(jiKangWife?.otherNames).toContain('曹林孙女');
    expect(jiKangWife?.otherNames).not.toContain('曹林女');
  });

  it('keeps official-history and annotation claims in separate review states', () => {
    expect(seventhSourceAuditBatchTwoRelations).toHaveLength(34);

    const official = seventhSourceAuditBatchTwoRelations.filter(
      ({ historicalLayer }) => historicalLayer === 'official_history',
    );
    expect(official).toHaveLength(27);
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

    const annotated = seventhSourceAuditBatchTwoRelations.filter(
      ({ historicalLayer }) => historicalLayer === 'annotated_history',
    );
    expect(annotated).toHaveLength(7);
    annotated.forEach((relation) => {
      expect(relation).toMatchObject({
        certainty: 'probable',
        reviewStatus: 'pending_review',
        claim: {
          decisionStatus: 'pending_review',
          disputeStatus: 'not_assessed',
        },
      });
    });
  });

  it('does not guess which Zhang empress was Xiahou lady\'s daughter', () => {
    const xiahouLadyId = 'person:sg:lady_xiahou_zhang_fei';
    expect(
      seventhSourceAuditBatchTwoRelations.some(
        (relation) =>
          relation.sourcePersonId === xiahouLadyId &&
          relation.type === 'mother_of',
      ),
    ).toBe(false);
  });

  it('does not compress Cao Lin\'s granddaughter into a father-daughter claim', () => {
    const relation = seventhSourceAuditBatchTwoRelations.find(
      ({ id }) =>
        id ===
        'relation:sg:seventh_audit_batch_2_cao_lin_clan_cao_lady',
    );
    expect(relation).toMatchObject({
      sourcePersonId: 'person:sg:sgz_v20_02',
      targetPersonId: 'person:sg:lady_cao_ji_kang',
      type: 'clan_relative_of',
      historicalLayer: 'annotated_history',
      certainty: 'probable',
      reviewStatus: 'pending_review',
      claim: { decisionStatus: 'pending_review' },
    });
    expect(
      seventhSourceAuditBatchTwoRelations.some(
        ({ sourcePersonId, targetPersonId, type }) =>
          sourcePersonId === 'person:sg:sgz_v20_02' &&
          targetPersonId === 'person:sg:lady_cao_ji_kang' &&
          type === 'father_of',
      ),
    ).toBe(false);
  });

  it('cites only sources carried by this batch', () => {
    const sourceIds = new Set(
      seventhSourceAuditBatchTwoSources.map(({ id }) => id),
    );
    seventhSourceAuditBatchTwoRelations.forEach((relation) => {
      expect(relation.sourceIds).toHaveLength(1);
      expect(sourceIds.has(relation.sourceIds[0] ?? '')).toBe(true);
    });
  });
});
