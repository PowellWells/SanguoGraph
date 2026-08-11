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
    id: `relation:sg:volumes_01_30_${seed.slug}`,
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
    slug: 'mao_empress_spouse_cao_rui',
    sourcePersonId: 'person:sg:sgz_v05_01',
    targetPersonId: 'person:sg:cao_rui',
    type: 'spouse_of',
    sourceId: 'source:sg:volumes_01_30_sgz_05_mao_empress',
    qualifier: '曹叡为平原王时纳毛氏，称帝后立为明悼毛皇后',
    interpretation:
      '正文连续记载毛氏在曹叡为平原王时入东宫、曹叡即位后进贵嫔并立皇后，直接表达二人的婚姻关系。',
  },
  {
    slug: 'guo_empress_spouse_cao_rui',
    sourcePersonId: 'person:sg:sgz_v05_02',
    targetPersonId: 'person:sg:cao_rui',
    type: 'spouse_of',
    sourceId: 'source:sg:volumes_01_30_sgz_05_guo_empress',
    qualifier: '明元郭皇后受曹叡宠爱，先拜夫人，后立皇后',
    interpretation:
      '正文以明帝即位、拜郭氏为夫人及立为皇后的连续记载直接表达二人的婚姻关系。',
  },
  {
    slug: 'he_kui_father_he_zeng',
    sourcePersonId: 'person:sg:sgz_v12_04',
    targetPersonId: 'person:sg:sgz_v12_05',
    type: 'father_of',
    sourceId: 'source:sg:volumes_01_30_sgz_12_he_zeng',
    qualifier: '何曾为何夔之子',
    interpretation: '《何夔传》在何夔身后直书“子曾嗣”，据此建立父子关系。',
  },
  {
    slug: 'sima_zhi_father_sima_qi',
    sourcePersonId: 'person:sg:sgz_v12_08',
    targetPersonId: 'person:sg:sgz_v12_09',
    type: 'father_of',
    sourceId: 'source:sg:volumes_01_30_sgz_12_sima_qi',
    qualifier: '司马岐为司马芝之子',
    interpretation: '《司马芝传》直书“芝亡，子岐嗣”，据此建立父子关系。',
  },
  {
    slug: 'liu_fu_father_liu_jing',
    sourcePersonId: 'person:sg:sgz_v15_01',
    targetPersonId: 'person:sg:sgz_v15_02',
    type: 'father_of',
    sourceId: 'source:sg:volumes_01_30_sgz_15_liu_jing',
    qualifier: '刘靖为刘馥之子',
    interpretation: '《刘馥传》直书“馥子靖”，并以诏书再次称刘馥为刘靖之父。',
  },
  {
    slug: 'sima_lang_clan_sima_yi',
    sourcePersonId: 'person:sg:sgz_v15_03',
    targetPersonId: 'person:sg:sima_yi',
    type: 'clan_relative_of',
    sourceId: 'source:sg:volumes_01_30_sima_biao_15_sima_brothers',
    qualifier: '司马朗为司马懿之兄',
    interpretation:
      '裴注引司马彪《序传》称司马防八子中司马朗最长、其次为晋宣帝；现有人物别名将晋宣帝定位为司马懿。',
    historicalLayer: 'annotated_history',
  },
  {
    slug: 'du_ji_father_du_shu',
    sourcePersonId: 'person:sg:sgz_v16_03',
    targetPersonId: 'person:sg:sgz_v16_04',
    type: 'father_of',
    sourceId: 'source:sg:volumes_01_30_sgz_16_du_shu',
    qualifier: '杜恕为杜畿之子',
    interpretation: '《杜畿传》在追赠与谥号后直书“子恕嗣”，据此建立父子关系。',
  },
  {
    slug: 'ding_yi_clan_ding_yi_younger',
    sourcePersonId: 'person:sg:sgz_v21_09',
    targetPersonId: 'person:sg:sgz_v21_10',
    type: 'clan_relative_of',
    sourceId: 'source:sg:volumes_01_30_weilue_19_ding_brothers',
    qualifier: '丁廙为丁仪之弟',
    interpretation: '裴注引《魏略》直书“廙字敬礼，仪之弟也”，据此建立兄弟关系。',
    historicalLayer: 'annotated_history',
  },
  {
    slug: 'ruan_yu_father_ruan_ji',
    sourcePersonId: 'person:sg:sgz_v21_03',
    targetPersonId: 'person:sg:sgz_v21_13',
    type: 'father_of',
    sourceId: 'source:sg:volumes_01_30_sgz_21_ruan_ji',
    qualifier: '阮籍为阮瑀之子',
    interpretation: '阮籍附传开篇直书“瑀子籍”，据此建立父子关系。',
  },
];

export const volumesOneToThirtyRelationshipRelations: Relation[] =
  seeds.map(relation);
