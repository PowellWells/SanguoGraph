import type { Relation, RelationClaim } from '../domain';

interface MotherRelationSeed {
  slug: string;
  motherId: string;
  motherName: string;
  childId: string;
  childName: string;
  sourceId: string;
}

function motherRelation(seed: MotherRelationSeed): Relation {
  const qualifier = `《三国志》卷二十直书${seed.motherName}生${seed.childName}`;
  const claim: RelationClaim = {
    periodLabel: '曹氏宗室谱系；母子关系为终身亲属关系',
    relationshipQualifier: qualifier,
    evidenceBasis: 'direct_record',
    modernInterpretation: `按诸子总表“${seed.motherName}生${seed.childName}”建立有向母亲边。`,
    disputeStatus: 'none_recorded',
    decisionStatus: 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
  return {
    id: `relation:sg:seventh_audit_${seed.slug}`,
    sourcePersonId: seed.motherId,
    targetPersonId: seed.childId,
    type: 'mother_of',
    certainty: 'confirmed',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: qualifier,
    claim,
  };
}

const caoCaoSourceId =
  'source:sg:sixth_roster_batch_1_sgz_20_cao_cao_sons';
const caoPiSourceId =
  'source:sg:sixth_roster_batch_1_sgz_20_cao_pi_sons';

const motherSeeds: readonly MotherRelationSeed[] = [
  ['cao_cao_du_furen_mother_cao_lin', 'cao_cao_du_furen', '杜夫人', 'sgz_v20_02', '曹林', caoCaoSourceId],
  ['cao_cao_du_furen_mother_cao_gun', 'cao_cao_du_furen', '杜夫人', 'sgz_v20_03', '曹衮', caoCaoSourceId],
  ['cao_cao_qin_furen_mother_cao_xuan', 'cao_cao_qin_furen', '秦夫人', 'sgz_v20_04', '曹玹', caoCaoSourceId],
  ['cao_cao_qin_furen_mother_cao_jun', 'cao_cao_qin_furen', '秦夫人', 'sgz_v20_05', '曹峻', caoCaoSourceId],
  ['cao_cao_yin_furen_mother_cao_ju', 'cao_cao_yin_furen', '尹夫人', 'sgz_v20_06', '曹矩', caoCaoSourceId],
  ['cao_cao_wang_zhaoyi_mother_cao_gan', 'cao_cao_wang_zhaoyi', '王昭仪', 'sgz_v20_07', '曹干', caoCaoSourceId],
  ['cao_cao_sun_ji_mother_cao_shang', 'cao_cao_sun_ji', '孙姬', 'sgz_v20_08', '曹上', caoCaoSourceId],
  ['cao_cao_sun_ji_mother_cao_biao', 'cao_cao_sun_ji', '孙姬', 'sgz_v20_09', '曹彪', caoCaoSourceId],
  ['cao_cao_sun_ji_mother_cao_qin', 'cao_cao_sun_ji', '孙姬', 'sgz_v20_10', '曹勤', caoCaoSourceId],
  ['cao_cao_li_ji_mother_cao_cheng', 'cao_cao_li_ji', '李姬', 'sgz_v20_11', '曹乘', caoCaoSourceId],
  ['cao_cao_li_ji_mother_cao_zheng', 'cao_cao_li_ji', '李姬', 'sgz_v20_12', '曹整', caoCaoSourceId],
  ['cao_cao_li_ji_mother_cao_jing', 'cao_cao_li_ji', '李姬', 'sgz_v20_13', '曹京', caoCaoSourceId],
  ['cao_cao_zhou_ji_mother_cao_jun', 'cao_cao_zhou_ji', '周姬', 'sgz_v20_14', '曹均', caoCaoSourceId],
  ['cao_cao_liu_ji_mother_cao_ji', 'cao_cao_liu_ji', '刘姬', 'sgz_v20_15', '曹棘', caoCaoSourceId],
  ['cao_cao_song_ji_mother_cao_hui', 'cao_cao_song_ji', '宋姬', 'sgz_v20_16', '曹徽', caoCaoSourceId],
  ['cao_cao_zhao_ji_mother_cao_mao', 'cao_cao_zhao_ji', '赵姬', 'sgz_v20_17', '曹茂', caoCaoSourceId],
  ['cao_pi_li_guiren_mother_cao_xie', 'cao_pi_li_guiren', '李贵人', 'sgz_v20_18', '曹协', caoPiSourceId],
  ['cao_pi_pan_shuyuan_mother_cao_rui', 'cao_pi_pan_shuyuan', '潘淑媛', 'sgz_v20_19', '曹蕤', caoPiSourceId],
  ['cao_pi_zhu_shuyuan_mother_cao_jian', 'cao_pi_zhu_shuyuan', '朱淑媛', 'sgz_v20_20', '曹鉴', caoPiSourceId],
  ['cao_pi_qiu_zhaoyi_mother_cao_lin', 'cao_pi_qiu_zhaoyi', '仇昭仪', 'sgz_v20_21', '曹霖', caoPiSourceId],
  ['cao_pi_xu_ji_mother_cao_li', 'cao_pi_xu_ji', '徐姬', 'sgz_v20_22', '曹礼', caoPiSourceId],
  ['cao_pi_su_ji_mother_cao_yong', 'cao_pi_su_ji', '苏姬', 'sgz_v20_23', '曹邕', caoPiSourceId],
  ['cao_pi_zhang_ji_mother_cao_gong', 'cao_pi_zhang_ji', '张姬', 'sgz_v20_24', '曹贡', caoPiSourceId],
  ['cao_pi_song_ji_mother_cao_yan', 'cao_pi_song_ji', '宋姬', 'sgz_v20_25', '曹俨', caoPiSourceId],
].map(([slug, motherSlug, motherName, childSlug, childName, sourceId]) => ({
  slug,
  motherId: `person:sg:${motherSlug}`,
  motherName,
  childId: `person:sg:${childSlug}`,
  childName,
  sourceId,
}));

const sunLuClaim: RelationClaim = {
  periodLabel: '孙吴宗室谱系；父子关系为终身亲属关系',
  relationshipQualifier: '《吴主五子传》列孙虑为孙权五子之一',
  evidenceBasis: 'direct_record',
  modernInterpretation: '按列传篇目及孙虑独立传文建立孙权至孙虑的有向父亲边。',
  disputeStatus: 'none_recorded',
  decisionStatus: 'confirmed',
  opposingSourceIds: [],
  scholarlyViews: [],
};

export const seventhSourceAuditBatchOneRelations: Relation[] = [
  ...motherSeeds.map(motherRelation),
  {
    id: 'relation:sg:seventh_audit_sun_quan_father_sun_lu',
    sourcePersonId: 'person:sg:sun_quan',
    targetPersonId: 'person:sg:sun_lu',
    type: 'father_of',
    certainty: 'confirmed',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    origin: 'recorded',
    sourceIds: ['source:sg:seventh_audit_sgz_59_sun_lu'],
    note: '《三国志》卷五十九《吴主五子传》所载孙权父子关系。',
    claim: sunLuClaim,
  },
];
