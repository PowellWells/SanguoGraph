import type { EvidenceBasis, Relation, RelationClaim, RelationType } from '../domain';

interface RelationSeed {
  slug: string;
  source: string;
  target: string;
  type: RelationType;
  sourceId: string;
  qualifier: string;
  note: string;
  evidenceBasis?: EvidenceBasis;
}

function relation(seed: RelationSeed): Relation {
  const inferred = seed.evidenceBasis === 'indirect_inference';
  const claim: RelationClaim = {
    periodLabel: '终身亲属关系',
    relationshipQualifier: seed.qualifier,
    evidenceBasis: seed.evidenceBasis ?? 'direct_record',
    modernInterpretation: inferred
      ? '由同段明确父子谱系界定推出祖孙关系；未补造中间人物。'
      : '按正文明确亲属表述建立关系边。',
    disputeStatus: inferred ? 'not_assessed' : 'none_recorded',
    decisionStatus: inferred ? 'pending_review' : 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
  return {
    id: `relation:sg:major_shu_other_${seed.slug}`,
    sourcePersonId: seed.source,
    targetPersonId: seed.target,
    type: seed.type,
    certainty: inferred ? 'probable' : 'confirmed',
    historicalLayer: 'official_history',
    reviewStatus: inferred ? 'pending_review' : 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: seed.note,
    claim,
  };
}

const seeds: readonly RelationSeed[] = [
  { slug: 'ma_liang_clan_ma_su', source: 'person:sg:ma_liang', target: 'person:sg:ma_su', type: 'clan_relative_of', sourceId: 'source:sg:major_shu_other_sgz_39', qualifier: '马谡为马良弟', note: '正文直书“良弟谡”。' },
  { slug: 'dong_he_father_dong_yun', source: 'person:sg:dong_he', target: 'person:sg:dong_yun', type: 'father_of', sourceId: 'source:sg:major_shu_other_sgz_39', qualifier: '董允为董和之子', note: '正文直书董允为掌军中郎将董和之子。' },
  { slug: 'liu_bei_adoptive_father_liu_feng', source: 'person:sg:liu_bei', target: 'person:sg:liu_feng', type: 'adoptive_father_of', sourceId: 'source:sg:major_shu_other_sgz_40', qualifier: '刘备养刘封为子', note: '正文直书先主因未有继嗣，养封为子。' },
  { slug: 'ma_teng_father_ma_chao', source: 'person:sg:ma_teng', target: 'person:sg:ma_chao', type: 'father_of', sourceId: 'source:sg:major_shu_other_sgz_36', qualifier: '马超为马腾之子', note: '《马超传》开篇直书“父腾”。' },
  { slug: 'yuan_shao_clan_yuan_shu', source: 'person:sg:yuan_shao', target: 'person:sg:yuan_shu', type: 'clan_relative_of', sourceId: 'source:sg:major_shu_other_sgz_06', qualifier: '袁术为袁绍从弟', note: '《袁术传》直书“绍之从弟也”。' },
  { slug: 'liu_biao_father_liu_cong', source: 'person:sg:liu_biao', target: 'person:sg:liu_cong', type: 'father_of', sourceId: 'source:sg:major_shu_other_sgz_06', qualifier: '刘琮为刘表少子', note: '《刘表传》正文分列“少子琮”。' },
  { slug: 'liu_yan_father_liu_zhang', source: 'person:sg:liu_yan', target: 'person:sg:liu_zhang', type: 'father_of', sourceId: 'source:sg:major_shu_other_sgz_31', qualifier: '刘璋为刘焉之子', note: '正文直书刘焉诸子与“焉死，子璋代”。' },
  { slug: 'gongsun_du_clan_gongsun_yuan', source: 'person:sg:sgz_v08_02', target: 'person:sg:gongsun_yuan', type: 'clan_relative_of', sourceId: 'source:sg:major_shu_other_sgz_08', qualifier: '公孙渊为公孙度之孙', note: '由“度死，子康嗣”及“康死，子……渊”同段谱系推出。', evidenceBasis: 'indirect_inference' },
];

export const majorShuOtherRelationshipRelations: Relation[] = seeds.map(relation);
