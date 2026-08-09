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
  note: string;
  qualifier: string;
  interpretation: string;
  certainty?: Relation['certainty'];
  historicalLayer?: HistoricalLayer;
  reviewStatus?: Relation['reviewStatus'];
}

function claim(seed: RelationSeed): RelationClaim {
  const pending = seed.reviewStatus === 'pending_review';
  return {
    periodLabel: '终身亲属关系',
    relationshipQualifier: seed.qualifier,
    evidenceBasis: 'direct_record',
    modernInterpretation: seed.interpretation,
    disputeStatus: pending ? 'not_assessed' : 'none_recorded',
    decisionStatus: pending ? 'pending_review' : 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
}

function relation(seed: RelationSeed): Relation {
  return {
    id: `relation:sg:major_wei_${seed.slug}`,
    sourcePersonId: seed.sourcePersonId,
    targetPersonId: seed.targetPersonId,
    type: seed.type,
    certainty: seed.certainty ?? 'confirmed',
    historicalLayer: seed.historicalLayer ?? 'official_history',
    reviewStatus: seed.reviewStatus ?? 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: seed.note,
    claim: claim(seed),
  };
}

const fatherInterpretation = '按原文明确父子关系建立有向父亲边。';

const seeds: readonly RelationSeed[] = [
  {
    slug: 'cao_pi_father_cao_lin',
    sourcePersonId: 'person:sg:cao_pi',
    targetPersonId: 'person:sg:sgz_v20_21',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_20_cao_lin',
    note: '《武文世王公传》将曹霖列为魏文帝曹丕之子。',
    qualifier: '曹霖为曹丕之子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'cao_lin_father_cao_mao',
    sourcePersonId: 'person:sg:sgz_v20_21',
    targetPersonId: 'person:sg:cao_mao',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_04_cao_mao_huan',
    note: '《高贵乡公纪》直书曹髦为东海定王曹霖之子。',
    qualifier: '曹髦为曹霖之子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'cao_yu_father_cao_huan',
    sourcePersonId: 'person:sg:cao_yu',
    targetPersonId: 'person:sg:cao_huan',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_04_cao_mao_huan',
    note: '《陈留王纪》直书曹奂为燕王曹宇之子。',
    qualifier: '曹奂为曹宇之子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'xun_yu_father_xun_yun',
    sourcePersonId: 'person:sg:xun_yu',
    targetPersonId: 'person:sg:sgz_v10_01',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_10_xun_house',
    note: '《荀彧传》在荀彧传末直书“子恽”。',
    qualifier: '荀恽为荀彧之子',
    interpretation: fatherInterpretation,
  },
  ...[
    ['person:sg:sgz_v10_02', '荀甝'],
    ['person:sg:sgz_v10_03', '荀霬'],
  ].map(([targetPersonId, name]) => ({
    slug: `xun_yun_father_${targetPersonId.split(':').at(-1)}`,
    sourcePersonId: 'person:sg:sgz_v10_01',
    targetPersonId,
    type: 'father_of' as const,
    sourceId: 'source:sg:major_wei_sgz_10_xun_house',
    note: `《荀彧传》直书荀恽早卒并有子${name}。`,
    qualifier: `${name}为荀恽之子`,
    interpretation: fatherInterpretation,
  })),
  {
    slug: 'xun_yu_clan_xun_you',
    sourcePersonId: 'person:sg:xun_yu',
    targetPersonId: 'person:sg:xun_you',
    type: 'clan_relative_of',
    sourceId: 'source:sg:major_wei_sgz_10_xun_house',
    note: '《荀攸传》直书荀攸为荀彧“从子”。',
    qualifier: '荀攸为荀彧从子',
    interpretation: '以有界宗族关系表达，不补造未入名册的中间父系人物。',
  },
  {
    slug: 'zhong_yao_father_zhong_yu',
    sourcePersonId: 'person:sg:zhong_yao',
    targetPersonId: 'person:sg:sgz_v13_01',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_13_zhong_house',
    note: '《钟繇传》直书钟繇卒后“子毓嗣”。',
    qualifier: '钟毓为钟繇之子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'zhong_yao_father_zhong_hui',
    sourcePersonId: 'person:sg:zhong_yao',
    targetPersonId: 'person:sg:zhong_hui',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_28_zhong_hui',
    note: '《钟会传》直书钟会为太傅钟繇少子。',
    qualifier: '钟会为钟繇少子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'wang_lang_father_wang_su',
    sourcePersonId: 'person:sg:wang_lang',
    targetPersonId: 'person:sg:wang_su',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_13_wang_house',
    note: '《王朗传》直书王朗卒后“子肃嗣”。',
    qualifier: '王肃为王朗之子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'liu_ye_father_liu_tao',
    sourcePersonId: 'person:sg:liu_ye',
    targetPersonId: 'person:sg:sgz_v14_03',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_14_liu_house',
    note: '《刘晔传》在刘晔诸子段直书“少子陶”。',
    qualifier: '刘陶为刘晔少子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'jia_kui_father_jia_chong',
    sourcePersonId: 'person:sg:jia_kui',
    targetPersonId: 'person:sg:jia_chong',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_15_jia_house',
    note: '《贾逵传》直书贾逵卒后“子充嗣”。',
    qualifier: '贾充为贾逵之子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'chen_qun_father_chen_tai',
    sourcePersonId: 'person:sg:chen_qun',
    targetPersonId: 'person:sg:chen_tai',
    type: 'father_of',
    sourceId: 'source:sg:major_wei_sgz_22_chen_house',
    note: '《陈群传》直书陈群卒后“子泰嗣”。',
    qualifier: '陈泰为陈群之子',
    interpretation: fatherInterpretation,
  },
  {
    slug: 'cui_yan_clan_cui_lin',
    sourcePersonId: 'person:sg:cui_yan',
    targetPersonId: 'person:sg:sgz_v24_02',
    type: 'clan_relative_of',
    sourceId: 'source:sg:major_wei_sgz_24_cui_house',
    note: '《崔林传》直书崔琰为崔林从兄。',
    qualifier: '崔琰为崔林从兄',
    interpretation: '以有界宗族关系表达，不推导未记名的中间亲属。',
  },
  {
    slug: 'cheng_yu_clan_cheng_xiao',
    sourcePersonId: 'person:sg:cheng_yu',
    targetPersonId: 'person:sg:sgz_v14_01',
    type: 'clan_relative_of',
    sourceId: 'source:sg:major_wei_sgz_14_cheng_house',
    note: '《程昱传》直书程晓为程昱之孙。',
    qualifier: '程晓为程昱之孙',
    interpretation: '中间父辈未在名册，以有界宗族关系表达祖孙，不补造父子边。',
  },
  {
    slug: 'cao_cao_adoptive_father_he_yan',
    sourcePersonId: 'person:sg:cao_cao',
    targetPersonId: 'person:sg:he_yan',
    type: 'adoptive_father_of',
    sourceId: 'source:sg:major_wei_sgz_09_he_yan',
    note: '裴注引《魏略》称曹操“收养晏”；不等同于已证明宗法过继。',
    qualifier: '注引材料称曹操收养何晏',
    interpretation: '以养父关系候选展示，同时保留“宫中收养而非宗法过继”的限定。',
    certainty: 'probable',
    historicalLayer: 'annotated_history',
    reviewStatus: 'pending_review',
  },
];

export const majorWeiRelationshipRelations: Relation[] = seeds.map(relation);
