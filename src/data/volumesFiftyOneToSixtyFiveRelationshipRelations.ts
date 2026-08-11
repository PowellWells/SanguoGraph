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
    id: `relation:sg:volumes_51_65_${seed.slug}`,
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
    slug: 'xue_zong_father_xue_ying',
    sourcePersonId: 'person:sg:sgz_v53_07',
    targetPersonId: 'person:sg:sgz_v53_08',
    type: 'father_of',
    sourceId: 'source:sg:volumes_51_65_sgz_53_xue_zong_xue_ying',
    qualifier: '薛莹为薛综之子',
    interpretation: '正文称薛莹为薛珝之弟，并直书“莹父综”，据此建立父子关系。',
  },
  {
    slug: 'lu_mao_clan_lu_xun',
    sourcePersonId: 'person:sg:sgz_v57_04',
    targetPersonId: 'person:sg:lu_xun',
    type: 'clan_relative_of',
    sourceId: 'source:sg:volumes_51_65_sgz_57_lu_mao_family',
    qualifier: '陆瑁为陆逊之弟',
    interpretation: '正文开篇直书陆瑁为丞相陆逊之弟。',
  },
  {
    slug: 'lu_mao_clan_lu_ji',
    sourcePersonId: 'person:sg:sgz_v57_04',
    targetPersonId: 'person:sg:lu_ji',
    type: 'clan_relative_of',
    sourceId: 'source:sg:volumes_51_65_sgz_57_lu_mao_family',
    qualifier: '陆绩为陆瑁从父',
    interpretation: '正文直书“瑁从父绩”，据此保留从父与从子的宗族关系。',
  },
  {
    slug: 'zhu_ju_spouse_sun_luyu',
    sourcePersonId: 'person:sg:sgz_v57_06',
    targetPersonId: 'person:sg:sun_luyu',
    type: 'spouse_of',
    sourceId: 'source:sg:volumes_51_65_sgz_50_sun_luyu_zhu_ju',
    qualifier: '孙鲁育前配朱据',
    interpretation: '《步夫人传》直书孙鲁育前配朱据，据此建立婚姻关系。',
  },
  {
    slug: 'zhu_ju_father_zhu_lady',
    sourcePersonId: 'person:sg:sgz_v57_06',
    targetPersonId: 'person:sg:sgz_v50_03',
    type: 'father_of',
    sourceId: 'source:sg:volumes_31_50_sgz_50_zhu_lady',
    qualifier: '朱夫人为朱据之女',
    interpretation: '《朱夫人传》开篇直书“朱据女”，据此建立父女关系。',
  },
  {
    slug: 'lu_yin_clan_lu_kai',
    sourcePersonId: 'person:sg:sgz_v61_01',
    targetPersonId: 'person:sg:lu_kai',
    type: 'clan_relative_of',
    sourceId: 'source:sg:volumes_51_65_sgz_61_lu_yin_lu_kai',
    qualifier: '陆胤为陆凯之弟',
    interpretation: '陆胤附传开篇直书“凯弟也”，据此建立兄弟关系。',
  },
  {
    slug: 'teng_yin_clan_teng_lady',
    sourcePersonId: 'person:sg:sgz_v64_02',
    targetPersonId: 'person:sg:sgz_v50_05',
    type: 'clan_relative_of',
    sourceId: 'source:sg:volumes_31_50_sgz_50_teng_lady',
    qualifier: '滕夫人为滕胤族女',
    interpretation: '《滕夫人传》开篇直书滕夫人为故太常滕胤之族女。',
  },
  {
    slug: 'he_qi_clan_he_shao',
    sourcePersonId: 'person:sg:he_qi',
    targetPersonId: 'person:sg:sgz_v65_03',
    type: 'clan_relative_of',
    sourceId: 'source:sg:volumes_51_65_pei_65_he_shao_he_qi',
    qualifier: '贺邵为贺齐之孙',
    interpretation: '裴注所引《吴书》直书贺邵为贺齐之孙，据此表达祖孙关系。',
    historicalLayer: 'annotated_history',
  },
];

export const volumesFiftyOneToSixtyFiveRelationshipRelations: Relation[] =
  seeds.map(relation);
