import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import {
  getPerspectiveRelationLabel,
  getRelationClaim,
  relationDirectionLabel,
} from './relationPresentation';

function relation(id: string) {
  const result = graphData.relations.find((item) => item.id === id);
  if (!result) {
    throw new Error(`测试关系不存在：${id}`);
  }
  return result;
}

function person(id: string) {
  const result = graphData.persons.find((item) => item.id === id);
  if (!result) {
    throw new Error(`测试人物不存在：${id}`);
  }
  return result;
}

describe('relation presentation', () => {
  it('distinguishes a directly recorded successor wife', () => {
    const claim = getRelationClaim(
      relation('relation:sg:cao_cao_spouse_empress_bian'),
      graphData.persons,
    );

    expect(claim.relationshipQualifier).toContain('继室');
    expect(claim.evidenceBasis).toBe('direct_record');
  });

  it('does not overstate Lady Huan as a specific spouse rank', () => {
    const claim = getRelationClaim(
      relation('relation:sg:cao_cao_spouse_lady_huan'),
      graphData.persons,
    );

    expect(claim.evidenceBasis).toBe('indirect_inference');
    expect(claim.relationshipQualifier).toContain('具体位序未见');
    expect(claim.modernInterpretation).toContain('不将“夫人”进一步等同');
  });

  it('presents clan relationships as undirected and keeps precise wording', () => {
    const clanRelation = relation(
      'relation:sg:cao_shuang_clan_xiahou_xuan',
    );
    const claim = getRelationClaim(clanRelation, graphData.persons);

    expect(relationDirectionLabel(clanRelation)).toContain('无方向');
    expect(claim.relationshipQualifier).toContain('姑表亲');
    expect(claim.evidenceBasis).toBe('direct_record');
  });

  it('presents parent and child labels from the current person perspective', () => {
    const fatherRelation = relation('relation:sg:cao_zhen_father_cao_shuang');
    const caoZhen = person('person:sg:cao_zhen');
    const caoShuang = person('person:sg:cao_shuang');

    expect(
      getPerspectiveRelationLabel(fatherRelation, caoZhen, caoShuang),
    ).toBe('儿子');
    expect(
      getPerspectiveRelationLabel(fatherRelation, caoShuang, caoZhen),
    ).toBe('父亲');
  });

  it('uses the child gender for daughters and adoptive children', () => {
    const daughterRelation = relation('relation:sg:sun_quan_father_sun_luban');
    const adoptiveRelation = relation(
      'relation:sg:zhuge_liang_adoptive_father_zhuge_qiao',
    );
    const adoptiveMotherRelation = relation(
      'relation:sg:lady_ding_adoptive_mother_cao_ang',
    );

    expect(
      getPerspectiveRelationLabel(
        daughterRelation,
        person('person:sg:sun_quan'),
        person('person:sg:sun_luban'),
      ),
    ).toBe('女儿');
    expect(
      getRelationClaim(daughterRelation, graphData.persons)
        .relationshipQualifier,
    ).toBe('父女');
    expect(
      getPerspectiveRelationLabel(
        adoptiveRelation,
        person('person:sg:zhuge_liang'),
        person('person:sg:zhuge_qiao'),
      ),
    ).toBe('养子');
    expect(
      getPerspectiveRelationLabel(
        adoptiveRelation,
        person('person:sg:zhuge_qiao'),
        person('person:sg:zhuge_liang'),
      ),
    ).toBe('养父');
    expect(
      getPerspectiveRelationLabel(
        adoptiveMotherRelation,
        person('person:sg:lady_ding'),
        person('person:sg:cao_ang'),
      ),
    ).toBe('养子');
    expect(
      getPerspectiveRelationLabel(
        adoptiveMotherRelation,
        person('person:sg:cao_ang'),
        person('person:sg:lady_ding'),
      ),
    ).toBe('养母');
  });

  it('presents spouses, siblings and clan relations in both directions', () => {
    const spouseRelation = relation('relation:sg:cao_cao_spouse_lady_ding');
    const siblingRelation = relation('relation:sg:cao_zhen_clan_cao_bin');
    const seniorClanRelation = relation('relation:sg:cao_cao_clan_cao_zhen');

    expect(
      getPerspectiveRelationLabel(
        spouseRelation,
        person('person:sg:cao_cao'),
        person('person:sg:lady_ding'),
      ),
    ).toBe('妻子');
    expect(
      getPerspectiveRelationLabel(
        spouseRelation,
        person('person:sg:lady_ding'),
        person('person:sg:cao_cao'),
      ),
    ).toBe('丈夫');
    expect(
      getPerspectiveRelationLabel(
        siblingRelation,
        person('person:sg:cao_zhen'),
        person('person:sg:cao_bin'),
      ),
    ).toBe('弟弟');
    expect(
      getPerspectiveRelationLabel(
        siblingRelation,
        person('person:sg:cao_bin'),
        person('person:sg:cao_zhen'),
      ),
    ).toBe('哥哥');
    expect(
      getPerspectiveRelationLabel(
        seniorClanRelation,
        person('person:sg:cao_zhen'),
        person('person:sg:cao_cao'),
      ),
    ).toBe('宗族长辈');
  });

  it('keeps specific labels for mapped clan relations and a neutral annotation label', () => {
    const clanRelations = graphData.relations.filter(
      (item) => item.type === 'clan_relative_of',
    );
    const annotationRelationIds = new Set([
      'relation:sg:seventh_audit_batch_2_xiahou_lady_clan_xiahou_ba',
      'relation:sg:seventh_audit_batch_2_cao_lin_clan_cao_lady',
      'relation:sg:major_roster_second_pass_lu_ji_clan_zhang_wen',
    ]);
    const mappedClanRelations = clanRelations.filter(
      ({ id }) => !annotationRelationIds.has(id),
    );

    expect(clanRelations).toHaveLength(44);
    expect(mappedClanRelations).toHaveLength(41);
    for (const clanRelation of mappedClanRelations) {
      const source = person(clanRelation.sourcePersonId);
      const target = person(clanRelation.targetPersonId);

      expect(
        getPerspectiveRelationLabel(clanRelation, source, target),
      ).not.toBe('宗族／姻亲');
      expect(
        getPerspectiveRelationLabel(clanRelation, target, source),
      ).not.toBe('宗族／姻亲');
    }

    for (const annotationRelationId of annotationRelationIds) {
      const annotationRelation = clanRelations.find(
        ({ id }) => id === annotationRelationId,
      );
      expect(annotationRelation).toBeDefined();
      if (!annotationRelation) {
        continue;
      }
      const source = person(annotationRelation.sourcePersonId);
      const target = person(annotationRelation.targetPersonId);
      expect(
        getPerspectiveRelationLabel(annotationRelation, source, target),
      ).toBe('宗族／姻亲');
    }
  });
});
