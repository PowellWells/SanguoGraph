import type { Relation, RelationClaim } from '../domain';

interface FatherRelationSeed {
  slug: string;
  parentId: string;
  childId: string;
  parentName: string;
  childName: string;
  sourceId: string;
}

function fatherRelation(seed: FatherRelationSeed): Relation {
  const claim: RelationClaim = {
    periodLabel: '终身亲属关系',
    relationshipQualifier: `${seed.childName}为${seed.parentName}之子`,
    evidenceBasis: 'direct_record',
    modernInterpretation: '按正文诸子总表明确列出的父子关系建立有向父亲边。',
    disputeStatus: 'none_recorded',
    decisionStatus: 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
  return {
    id: `relation:sg:sixth_roster_batch_1_${seed.slug}`,
    sourcePersonId: seed.parentId,
    targetPersonId: seed.childId,
    type: 'father_of',
    certainty: 'confirmed',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: `《武文世王公传》诸子总表直书${seed.childName}为${seed.parentName}之子。`,
    claim,
  };
}

const caoCaoChildren = [
  ['cao_shuo', 'person:sg:sgz_v20_01', '曹铄'],
  ['cao_lin', 'person:sg:sgz_v20_02', '曹林'],
  ['cao_gun', 'person:sg:sgz_v20_03', '曹衮'],
  ['cao_xuan', 'person:sg:sgz_v20_04', '曹玹'],
  ['cao_jun', 'person:sg:sgz_v20_05', '曹峻'],
  ['cao_ju', 'person:sg:sgz_v20_06', '曹矩'],
  ['cao_gan', 'person:sg:sgz_v20_07', '曹干'],
  ['cao_shang', 'person:sg:sgz_v20_08', '曹上'],
  ['cao_biao', 'person:sg:sgz_v20_09', '曹彪'],
  ['cao_qin', 'person:sg:sgz_v20_10', '曹勤'],
  ['cao_cheng', 'person:sg:sgz_v20_11', '曹乘'],
  ['cao_zheng', 'person:sg:sgz_v20_12', '曹整'],
  ['cao_jing', 'person:sg:sgz_v20_13', '曹京'],
  ['cao_jun_2', 'person:sg:sgz_v20_14', '曹均'],
  ['cao_ji', 'person:sg:sgz_v20_15', '曹棘'],
  ['cao_hui', 'person:sg:sgz_v20_16', '曹徽'],
  ['cao_mao', 'person:sg:sgz_v20_17', '曹茂'],
] as const;

const caoPiChildren = [
  ['cao_xie', 'person:sg:sgz_v20_18', '曹协'],
  ['cao_rui', 'person:sg:sgz_v20_19', '曹蕤'],
  ['cao_jian', 'person:sg:sgz_v20_20', '曹鉴'],
  ['cao_li', 'person:sg:sgz_v20_22', '曹礼'],
  ['cao_yong', 'person:sg:sgz_v20_23', '曹邕'],
  ['cao_gong', 'person:sg:sgz_v20_24', '曹贡'],
  ['cao_yan', 'person:sg:sgz_v20_25', '曹俨'],
] as const;

export const sixthRosterRelationshipBatchOneRelations: Relation[] = [
  ...caoCaoChildren.map(([slug, childId, childName]) =>
    fatherRelation({
      slug: `cao_cao_father_${slug}`,
      parentId: 'person:sg:cao_cao',
      childId,
      parentName: '曹操',
      childName,
      sourceId: 'source:sg:sixth_roster_batch_1_sgz_20_cao_cao_sons',
    }),
  ),
  ...caoPiChildren.map(([slug, childId, childName]) =>
    fatherRelation({
      slug: `cao_pi_father_${slug}`,
      parentId: 'person:sg:cao_pi',
      childId,
      parentName: '曹丕',
      childName,
      sourceId: 'source:sg:sixth_roster_batch_1_sgz_20_cao_pi_sons',
    }),
  ),
];
