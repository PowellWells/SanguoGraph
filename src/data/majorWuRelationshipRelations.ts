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
      ? '由同段明确谱系在已知范围内推出；不补造未入名册的中间人物。'
      : '按正文明确亲属表述建立关系边。',
    disputeStatus: inferred ? 'not_assessed' : 'none_recorded',
    decisionStatus: inferred ? 'pending_review' : 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
  return {
    id: `relation:sg:major_wu_${seed.slug}`,
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

const v50 = 'source:sg:major_wu_sgz_50';
const v51 = 'source:sg:major_wu_sgz_51';
const v52 = 'source:sg:major_wu_sgz_52';
const v55 = 'source:sg:major_wu_sgz_55';
const v56 = 'source:sg:major_wu_sgz_56';
const bounded: EvidenceBasis = 'indirect_inference';

const seeds: readonly RelationSeed[] = [
  { slug: 'sun_jing_clan_sun_jian', source: 'person:sg:sun_jing', target: 'person:sg:sun_jian', type: 'clan_relative_of', sourceId: v51, qualifier: '孙静为孙坚季弟', note: '正文直书“坚季弟”。' },
  ...[
    ['person:sg:sun_yu', '孙瑜'],
    ['person:sg:sgz_v51_01', '孙皎'],
    ['person:sg:sgz_v51_02', '孙奂'],
  ].map(([target, name]) => ({ slug: `sun_jing_father_${target.split(':').at(-1)}`, source: 'person:sg:sun_jing', target, type: 'father_of' as const, sourceId: v51, qualifier: `${name}为孙静之子`, note: '正文列于孙静五子。' })),
  { slug: 'sun_jing_clan_sun_jun', source: 'person:sg:sun_jing', target: 'person:sg:sun_jun', type: 'clan_relative_of', sourceId: v51, qualifier: '孙峻为孙静曾孙', note: '由“静子暠—暠子恭—恭生峻”谱系推出。', evidenceBasis: bounded },
  { slug: 'sun_jing_clan_sun_chen', source: 'person:sg:sun_jing', target: 'person:sg:sun_chen', type: 'clan_relative_of', sourceId: v51, qualifier: '孙綝为孙静曾孙', note: '由“静子暠—暠子绰—绰生綝”谱系推出。', evidenceBasis: bounded },
  { slug: 'sun_ben_clan_sun_fu', source: 'person:sg:sun_ben', target: 'person:sg:sgz_v51_03', type: 'clan_relative_of', sourceId: v51, qualifier: '孙辅为孙贲弟', note: '正文直书孙辅为孙贲弟。' },
  { slug: 'sun_ben_clan_sun_jian', source: 'person:sg:sun_ben', target: 'person:sg:sun_jian', type: 'clan_relative_of', sourceId: v51, qualifier: '孙贲为孙坚兄孙羌之子', note: '由正文父系与兄弟关系推出叔侄。', evidenceBasis: bounded },
  { slug: 'sun_shao_clan_sun_huan', source: 'person:sg:sun_shao', target: 'person:sg:sun_huan', type: 'clan_relative_of', sourceId: v51, qualifier: '孙桓为孙韶伯父孙河之子', note: '由孙韶称孙河伯父、孙桓为河子推出从兄弟关系。', evidenceBasis: bounded },
  ...[
    ['person:sg:sgz_v52_02', '张承'],
    ['person:sg:sgz_v52_03', '张休'],
  ].map(([target, name]) => ({ slug: `zhang_zhao_father_${target.split(':').at(-1)}`, source: 'person:sg:zhang_zhao', target, type: 'father_of' as const, sourceId: v52, qualifier: `${name}为张昭之子`, note: '正文分列张昭长子与少子。' })),
  { slug: 'zhang_zhao_clan_zhang_fen', source: 'person:sg:zhang_zhao', target: 'person:sg:sgz_v52_01', type: 'clan_relative_of', sourceId: v52, qualifier: '张奋为张昭弟之子', note: '正文直书“昭弟子奋”。' },
  { slug: 'gu_yong_father_gu_shao', source: 'person:sg:gu_yong', target: 'person:sg:sgz_v52_04', type: 'father_of', sourceId: v52, qualifier: '顾邵为顾雍长子', note: '正文直书顾雍长子邵。' },
  ...[
    ['person:sg:sgz_v52_05', '顾谭'],
    ['person:sg:sgz_v52_06', '顾承'],
  ].map(([target, name]) => ({ slug: `gu_shao_father_${target.split(':').at(-1)}`, source: 'person:sg:sgz_v52_04', target, type: 'father_of' as const, sourceId: v52, qualifier: `${name}为顾邵之子`, note: '正文直书顾邵有子谭、承。' })),
  { slug: 'zhuge_jin_clan_zhuge_liang', source: 'person:sg:zhuge_jin', target: 'person:sg:zhuge_liang', type: 'clan_relative_of', sourceId: v52, qualifier: '诸葛亮为诸葛瑾弟', note: '正文直书“与其弟亮”。' },
  ...[
    ['person:sg:zhuge_ke', '诸葛恪'],
    ['person:sg:zhuge_qiao', '诸葛乔'],
    ['person:sg:sgz_v52_07', '诸葛融'],
  ].map(([target, name]) => ({ slug: `zhuge_jin_father_${target.split(':').at(-1)}`, source: 'person:sg:zhuge_jin', target, type: 'father_of' as const, sourceId: v52, qualifier: `${name}为诸葛瑾之子`, note: '正文及本传附文明确诸葛瑾诸子。' })),
  { slug: 'yu_fan_father_yu_si', source: 'person:sg:yu_fan', target: 'person:sg:sgz_v57_01', type: 'father_of', sourceId: 'source:sg:major_wu_sgz_57', qualifier: '虞汜为虞翻第四子', note: '正文直书虞翻十一子及第四子汜。' },
  { slug: 'chen_wu_father_chen_biao', source: 'person:sg:chen_wu', target: 'person:sg:sgz_v55_01', type: 'father_of', sourceId: v55, qualifier: '陈表为陈武庶子', note: '正文直书陈表为陈武庶子。' },
  { slug: 'zhu_zhi_adoptive_father_zhu_ran', source: 'person:sg:zhu_zhi', target: 'person:sg:zhu_ran', type: 'adoptive_father_of', sourceId: v56, qualifier: '朱治请以外甥朱然为嗣', note: '正文明确朱然本姓施，朱治请为嗣。' },
  { slug: 'zhu_ran_father_shi_ji', source: 'person:sg:zhu_ran', target: 'person:sg:sgz_v56_01', type: 'father_of', sourceId: v56, qualifier: '施绩为朱然之子', note: '正文直书朱然卒、子绩嗣。' },
  { slug: 'lv_fan_father_lv_ju', source: 'person:sg:lv_fan', target: 'person:sg:sgz_v56_02', type: 'father_of', sourceId: v56, qualifier: '吕据为吕范次子', note: '正文直书吕范次子据嗣。' },
  { slug: 'zhu_huan_father_zhu_yi', source: 'person:sg:zhu_huan', target: 'person:sg:sgz_v56_03', type: 'father_of', sourceId: v56, qualifier: '朱异为朱桓之子', note: '正文直书朱桓卒、子异嗣。' },
  { slug: 'quan_cong_spouse_sun_luban', source: 'person:sg:quan_cong', target: 'person:sg:sun_luban', type: 'spouse_of', sourceId: v50, qualifier: '孙鲁班后配全琮', note: '《步夫人传》直书鲁班后配全琮。' },
  { slug: 'lu_xun_clan_lu_kai', source: 'person:sg:lu_xun', target: 'person:sg:lu_kai', type: 'clan_relative_of', sourceId: 'source:sg:major_wu_sgz_61', qualifier: '陆凯为陆逊族子', note: '正文直书陆凯为丞相陆逊族子。' },
];

export const majorWuRelationshipRelations: Relation[] = seeds.map(relation);
