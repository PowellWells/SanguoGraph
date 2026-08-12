import type {
  HistoricalLayer,
  Relation,
  RelationClaim,
  RelationType,
} from '../domain';

interface RelationSeed {
  slug: string;
  sourcePersonId: string;
  targetPersonId: string;
  type: RelationType;
  sourceId: string;
  qualifier: string;
  interpretation: string;
  historicalLayer?: HistoricalLayer;
}

function relation(seed: RelationSeed): Relation {
  const historicalLayer = seed.historicalLayer ?? 'official_history';
  const pending = historicalLayer === 'annotated_history';
  const claim: RelationClaim = {
    periodLabel: '亲属或婚姻关系；具体起止年未详',
    relationshipQualifier: seed.qualifier,
    evidenceBasis: 'direct_record',
    modernInterpretation: seed.interpretation,
    disputeStatus: pending ? 'not_assessed' : 'none_recorded',
    decisionStatus: pending ? 'pending_review' : 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
  return {
    id: `relation:sg:volumes_31_50_${seed.slug}`,
    sourcePersonId: seed.sourcePersonId,
    targetPersonId: seed.targetPersonId,
    type: seed.type,
    certainty: pending ? 'probable' : 'confirmed',
    historicalLayer,
    reviewStatus: pending ? 'pending_review' : 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: seed.qualifier,
    claim,
  };
}

const seeds: readonly RelationSeed[] = [
  {
    slug: 'qiao_zhou_clan_qiao_xiu',
    sourcePersonId: 'person:sg:sgz_v42_10',
    targetPersonId: 'person:sg:sgz_v42_11',
    type: 'clan_relative_of',
    sourceId: 'source:sg:volumes_31_50_pei_42_qiao_zhou_qiao_xiu',
    qualifier: '谯秀为谯周长子谯熙之子，即谯周之孙',
    interpretation:
      '裴注先称谯熙为谯周长子，再称谯秀为谯熙之子，据此表达谯周与谯秀的祖孙关系。',
    historicalLayer: 'annotated_history',
  },
  {
    slug: 'liu_yao_father_liu_ji',
    sourcePersonId: 'person:sg:sgz_v49_01',
    targetPersonId: 'person:sg:sgz_v49_03',
    type: 'father_of',
    sourceId: 'source:sg:volumes_31_50_sgz_49_liu_ji',
    qualifier: '刘基为刘繇长子',
    interpretation: '刘基附传开篇直书“繇长子基”，据此建立父子关系。',
  },
  {
    slug: 'xie_lady_spouse_sun_quan',
    sourcePersonId: 'person:sg:sgz_v50_01',
    targetPersonId: 'person:sg:sun_quan',
    type: 'spouse_of',
    sourceId: 'source:sg:volumes_31_50_sgz_50_xie_lady',
    qualifier: '谢夫人为孙权之妃',
    interpretation: '正文以“吴主权谢夫人”起篇，并记孙权之母为孙权聘谢氏为妃。',
  },
  {
    slug: 'quan_lady_spouse_sun_liang',
    sourcePersonId: 'person:sg:sgz_v50_02',
    targetPersonId: 'person:sg:sun_liang',
    type: 'spouse_of',
    sourceId: 'source:sg:volumes_31_50_sgz_50_quan_lady',
    qualifier: '全夫人为孙亮之妻，后立皇后',
    interpretation: '正文记孙权为孙亮纳全氏，孙亮继位后立全氏为皇后。',
  },
  {
    slug: 'zhu_lady_spouse_sun_xiu',
    sourcePersonId: 'person:sg:sgz_v50_03',
    targetPersonId: 'person:sg:sun_xiu',
    type: 'spouse_of',
    sourceId: 'source:sg:volumes_31_50_sgz_50_zhu_lady',
    qualifier: '朱夫人为孙休之妻，后立皇后',
    interpretation: '正文以“孙休朱夫人”起篇，并记孙权为孙休纳朱氏为妃。',
  },
  {
    slug: 'he_lady_spouse_sun_he',
    sourcePersonId: 'person:sg:sgz_v50_04',
    targetPersonId: 'person:sg:sun_he',
    type: 'spouse_of',
    sourceId: 'source:sg:volumes_31_50_sgz_50_he_lady',
    qualifier: '何姬为孙和之姬',
    interpretation: '正文以“孙和何姬”起篇，并记孙权将何氏赐给孙和。',
  },
  {
    slug: 'he_lady_mother_sun_hao',
    sourcePersonId: 'person:sg:sgz_v50_04',
    targetPersonId: 'person:sg:sun_hao',
    type: 'mother_of',
    sourceId: 'source:sg:volumes_31_50_sgz_50_he_lady',
    qualifier: '何姬生孙皓',
    interpretation: '正文记何姬生男彭祖，并直接说明彭祖即孙皓。',
  },
  {
    slug: 'teng_lady_spouse_sun_hao',
    sourcePersonId: 'person:sg:sgz_v50_05',
    targetPersonId: 'person:sg:sun_hao',
    type: 'spouse_of',
    sourceId: 'source:sg:volumes_31_50_sgz_50_teng_lady',
    qualifier: '滕夫人为孙皓之妻，后立皇后',
    interpretation: '正文以“孙皓滕夫人”起篇，并记孙皓聘滕氏为妃、即位后立为皇后。',
  },
];

export const volumesThirtyOneToFiftyRelationshipRelations: Relation[] =
  seeds.map(relation);
