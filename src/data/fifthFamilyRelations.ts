import type {
  HistoricalLayer,
  Relation,
  RelationClaim,
  RelationType,
} from '../domain';

interface FifthFamilyRelationSeed {
  slug: string;
  source: string;
  target: string;
  type: RelationType;
  sourceId: string;
  note: string;
  certainty?: Relation['certainty'];
  historicalLayer?: HistoricalLayer;
  reviewStatus?: Relation['reviewStatus'];
  claim?: RelationClaim;
}

function relation(seed: FifthFamilyRelationSeed): Relation {
  return {
    id: `relation:sg:${seed.slug}`,
    sourcePersonId: `person:sg:${seed.source}`,
    targetPersonId: `person:sg:${seed.target}`,
    type: seed.type,
    certainty: seed.certainty ?? 'confirmed',
    historicalLayer: seed.historicalLayer ?? 'official_history',
    reviewStatus: seed.reviewStatus ?? 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: seed.note,
    ...(seed.claim ? { claim: seed.claim } : {}),
  };
}

const sourceIds = {
  volume34: 'source:sg:fifth_family_sgz_34_shu_house',
  volume34Annotation: 'source:sg:fifth_family_shushipu_liu_shan_sons',
  volume35: 'source:sg:fifth_family_sgz_35_zhuge_house',
  volume37: 'source:sg:fifth_family_sgz_37_pang_fa_houses',
  volume38: 'source:sg:fifth_family_sgz_38_xu_mi_houses',
  volume39: 'source:sg:fifth_family_sgz_39_ma_house',
  volume41: 'source:sg:fifth_family_sgz_41_huo_xiang_houses',
  volume43: 'source:sg:fifth_family_sgz_43_shu_generals',
  volume45: 'source:sg:fifth_family_sgz_45_deng_house',
} as const;

const fatherRelations = (
  source: string,
  targets: readonly string[],
  sourceId: string,
  note: string,
): FifthFamilyRelationSeed[] =>
  targets.map((target) => ({
    slug: `${source}_father_${target}`,
    source,
    target,
    type: 'father_of',
    sourceId,
    note,
  }));

const annotatedSonClaim = (name: string): RelationClaim => ({
  periodLabel: '蜀汉时期；父子身份为终身关系',
  relationshipQualifier: '裴松之注引《蜀世谱》所列父子',
  evidenceBasis: 'direct_record',
  modernInterpretation: `《蜀世谱》列${name}为刘璿之弟，即刘禅之子；因材料位于裴注而非《三国志》正文，保守采用较可信结论。`,
  disputeStatus: 'not_assessed',
  decisionStatus: 'pending_review',
  opposingSourceIds: [],
  scholarlyViews: [],
});

const seeds: readonly FifthFamilyRelationSeed[] = [
  ...fatherRelations(
    'zhang_fei',
    ['empress_zhang_jingai', 'empress_zhang_later'],
    sourceIds.volume34,
    '《三国志》卷三十四明确记两位后主张皇后为张飞之女。',
  ),
  ...fatherRelations(
    'liu_shan',
    ['liu_xuan'],
    sourceIds.volume34,
    '《三国志》卷三十四所载刘禅与太子刘璿父子关系。',
  ),
  ...[
    ['liu_yao_shu', '刘瑶'],
    ['liu_cong_shu', '刘琮'],
    ['liu_zan', '刘瓒'],
    ['liu_chen', '刘谌'],
    ['liu_xun', '刘恂'],
    ['liu_qu', '刘璩'],
  ].map(([target, name]) => ({
    slug: `liu_shan_father_${target}`,
    source: 'liu_shan',
    target,
    type: 'father_of' as const,
    sourceId: sourceIds.volume34Annotation,
    note: `裴松之注引《蜀世谱》列${name}为刘璿之弟。`,
    certainty: 'probable' as const,
    historicalLayer: 'annotated_history' as const,
    reviewStatus: 'pending_review' as const,
    claim: annotatedSonClaim(name),
  })),
  ...fatherRelations(
    'liu_li',
    ['liu_yin_li', 'liu_ji_li'],
    sourceIds.volume34,
    '《三国志》卷三十四所载安平王刘理诸子。',
  ),
  ...fatherRelations(
    'liu_yin_li',
    ['liu_cheng_li'],
    sourceIds.volume34,
    '《三国志》卷三十四所载刘胤与刘承父子关系。',
  ),
  {
    slug: 'zhuge_liang_adoptive_father_zhuge_qiao',
    source: 'zhuge_liang',
    target: 'zhuge_qiao',
    type: 'adoptive_father_of',
    sourceId: sourceIds.volume35,
    note: '《三国志》卷三十五明确记诸葛亮求诸葛乔为嗣，并以其为适子。',
  },
  ...fatherRelations(
    'zhuge_qiao',
    ['zhuge_pan'],
    sourceIds.volume35,
    '《三国志》卷三十五所载诸葛乔与诸葛攀父子关系。',
  ),
  ...fatherRelations(
    'zhuge_pan',
    ['zhuge_xian'],
    sourceIds.volume35,
    '《三国志》卷三十五记诸葛显为诸葛攀之子。',
  ),
  ...fatherRelations(
    'zhuge_liang',
    ['zhuge_zhan'],
    sourceIds.volume35,
    '《三国志》卷三十五所载诸葛亮与诸葛瞻父子关系。',
  ),
  ...fatherRelations(
    'zhuge_zhan',
    ['zhuge_shang', 'zhuge_jing'],
    sourceIds.volume35,
    '《三国志》卷三十五明确列诸葛尚、诸葛京为诸葛瞻之子。',
  ),
  ...fatherRelations(
    'pang_tong',
    ['pang_hong'],
    sourceIds.volume37,
    '《三国志》卷三十七所载庞统与庞宏父子关系。',
  ),
  ...fatherRelations(
    'fa_zheng',
    ['fa_miao'],
    sourceIds.volume37,
    '《三国志》卷三十七所载法正与法邈父子关系。',
  ),
  ...fatherRelations(
    'xu_jing',
    ['xu_qin'],
    sourceIds.volume38,
    '《三国志》卷三十八所载许靖与许钦父子关系。',
  ),
  ...fatherRelations(
    'xu_qin',
    ['xu_you_jing'],
    sourceIds.volume38,
    '《三国志》卷三十八所载许钦与许游父子关系。',
  ),
  ...fatherRelations(
    'mi_zhu',
    ['mi_wei'],
    sourceIds.volume38,
    '《三国志》卷三十八所载糜竺与糜威父子关系。',
  ),
  ...fatherRelations(
    'mi_wei',
    ['mi_zhao'],
    sourceIds.volume38,
    '《三国志》卷三十八所载糜威与糜照父子关系。',
  ),
  ...fatherRelations(
    'ma_liang',
    ['ma_bing'],
    sourceIds.volume39,
    '《三国志》卷三十九所载马良与马秉父子关系。',
  ),
  ...fatherRelations(
    'huo_jun',
    ['huo_yi'],
    sourceIds.volume41,
    '《三国志》卷四十一所载霍峻与霍弋父子关系。',
  ),
  {
    slug: 'xiang_lang_clan_xiang_chong',
    source: 'xiang_lang',
    target: 'xiang_chong',
    type: 'clan_relative_of',
    sourceId: sourceIds.volume41,
    note: '《三国志》卷四十一明确记向宠为向朗兄之子，即叔侄关系。',
  },
  {
    slug: 'xiang_chong_clan_xiang_chong_younger',
    source: 'xiang_chong',
    target: 'xiang_chong_younger',
    type: 'clan_relative_of',
    sourceId: sourceIds.volume41,
    note: '《三国志》卷四十一明确记向充为向宠之弟。',
  },
  ...fatherRelations(
    'huang_quan',
    ['huang_yong', 'huang_chong'],
    sourceIds.volume43,
    '《三国志》卷四十三所载黄权在魏、蜀两地的儿子。',
  ),
  ...fatherRelations(
    'wang_ping',
    ['wang_xun'],
    sourceIds.volume43,
    '《三国志》卷四十三所载王平与王训父子关系。',
  ),
  ...fatherRelations(
    'li_hui',
    ['li_yi_hui'],
    sourceIds.volume43,
    '《三国志》卷四十三所载李恢与李遗父子关系。',
  ),
  ...fatherRelations(
    'zhang_ni',
    ['zhang_ying_ni'],
    sourceIds.volume43,
    '《三国志》卷四十三所载张嶷与长子张瑛。',
  ),
  ...fatherRelations(
    'deng_zhi',
    ['deng_liang'],
    sourceIds.volume45,
    '《三国志》卷四十五所载邓芝与邓良父子关系。',
  ),
  ...fatherRelations(
    'ma_zhong',
    ['ma_xiu_zhong'],
    sourceIds.volume43,
    '《三国志》卷四十三所载马忠与马修父子关系。',
  ),
];

export const fifthFamilyRelations: Relation[] = seeds.map(relation);
