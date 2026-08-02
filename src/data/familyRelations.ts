import type {
  HistoricalLayer,
  Relation,
  RelationClaim,
  RelationType,
} from '../domain';

interface RelationSeed {
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

function relation(seed: RelationSeed): Relation {
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

const pendingClaim = (
  periodLabel: string,
  qualifier: string,
  interpretation: string,
): RelationClaim => ({
  periodLabel,
  relationshipQualifier: qualifier,
  evidenceBasis: 'direct_record',
  modernInterpretation: interpretation,
  disputeStatus: 'not_assessed',
  decisionStatus: 'pending_review',
  opposingSourceIds: [],
  scholarlyViews: [],
});

const seeds: readonly RelationSeed[] = [
  {
    slug: 'liu_hong_father_liu_bei',
    source: 'liu_hong',
    target: 'liu_bei',
    type: 'father_of',
    sourceId: 'source:sg:family_sgz_32_liubei_lineage',
    note: '《先主传》直书刘备“父弘”。',
  },
  ...[
    ['empress_gan', '甘皇后'],
    ['empress_wu_shu', '吴皇后'],
    ['lady_sun_shu', '孙夫人'],
    ['lady_mi', '糜夫人'],
  ].map(([target, name]) => ({
    slug: `liu_bei_spouse_${target}`,
    source: 'liu_bei',
    target,
    type: 'spouse_of' as const,
    sourceId:
      target === 'lady_mi'
        ? 'source:sg:family_sgz_38_mi_house'
        : target === 'lady_sun_shu'
          ? 'source:sg:family_sgz_32_liubei_lineage'
          : 'source:sg:family_sgz_34_liubei_house',
    note: `史籍明确记${name}为刘备配偶。`,
  })),
  ...['liu_shan', 'liu_yong', 'liu_li'].map((target) => ({
    slug: `liu_bei_father_${target}`,
    source: 'liu_bei',
    target,
    type: 'father_of' as const,
    sourceId: 'source:sg:family_sgz_34_liubei_house',
    note: '《二主妃子传》所载刘备父子关系。',
  })),
  {
    slug: 'empress_gan_mother_liu_shan',
    source: 'empress_gan',
    target: 'liu_shan',
    type: 'mother_of',
    sourceId: 'source:sg:family_sgz_34_liubei_house',
    note: '《甘皇后传》明确记甘皇后生后主刘禅。',
  },
  {
    slug: 'sun_jian_spouse_lady_wu',
    source: 'sun_jian',
    target: 'lady_wu',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_46_sun_house',
    note: '史籍明确记孙坚聘吴氏为妻。',
  },
  ...['sun_ce', 'sun_quan', 'sun_yi', 'sun_kuang', 'lady_sun_shu'].flatMap(
    (target) => [
      {
        slug: `sun_jian_father_${target}`,
        source: 'sun_jian',
        target,
        type: 'father_of' as const,
        sourceId: 'source:sg:family_sgz_46_sun_house',
        note: '《妃嫔传》与《孙破虏传》所载孙坚家庭。',
      },
      {
        slug: `lady_wu_mother_${target}`,
        source: 'lady_wu',
        target,
        type: 'mother_of' as const,
        sourceId: 'source:sg:family_sgz_50_sun_consorts',
        note: '《吴夫人传》所载吴夫人子女。',
      },
    ],
  ),
  {
    slug: 'sun_quan_spouse_lady_bu',
    source: 'sun_quan',
    target: 'lady_bu',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_50_sun_consorts',
    note: '《步夫人传》所载孙权与步夫人关系。',
  },
  ...['sun_luban', 'sun_luyu'].flatMap((target) => [
    {
      slug: `sun_quan_father_${target}`,
      source: 'sun_quan',
      target,
      type: 'father_of' as const,
      sourceId: 'source:sg:family_sgz_50_sun_consorts',
      note: '《步夫人传》所载孙权之女。',
    },
    {
      slug: `lady_bu_mother_${target}`,
      source: 'lady_bu',
      target,
      type: 'mother_of' as const,
      sourceId: 'source:sg:family_sgz_50_sun_consorts',
      note: '《步夫人传》明确记步夫人生鲁班、鲁育。',
    },
  ]),
  {
    slug: 'sun_quan_spouse_lady_pan',
    source: 'sun_quan',
    target: 'lady_pan',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_50_sun_consorts',
    note: '《潘夫人传》所载孙权与潘夫人关系。',
  },
  {
    slug: 'sun_quan_father_sun_liang',
    source: 'sun_quan',
    target: 'sun_liang',
    type: 'father_of',
    sourceId: 'source:sg:family_sgz_50_sun_consorts',
    note: '《潘夫人传》明确记孙亮为孙权之子。',
  },
  {
    slug: 'lady_pan_mother_sun_liang',
    source: 'lady_pan',
    target: 'sun_liang',
    type: 'mother_of',
    sourceId: 'source:sg:family_sgz_50_sun_consorts',
    note: '《潘夫人传》明确记潘夫人生孙亮。',
  },
  {
    slug: 'sun_quan_spouse_lady_xu',
    source: 'sun_quan',
    target: 'lady_xu_wu',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_50_sun_consorts',
    note: '《徐夫人传》明确记孙权聘徐氏为妃。',
  },
  {
    slug: 'lady_xu_adoptive_mother_sun_deng',
    source: 'lady_xu_wu',
    target: 'sun_deng',
    type: 'adoptive_mother_of',
    sourceId: 'source:sg:family_sgz_50_sun_consorts',
    note: '原文记孙权“使母养子登”，表达抚养身份，不补写生母。',
    certainty: 'probable',
    claim: pendingClaim(
      '孙权在位时期；具体起始年份不详',
      '奉命以母亲身份抚养孙登',
      '原文明确记徐夫人奉命“母养”孙登，但与现代法律收养并非同一制度，故保守标为较可信。',
    ),
  },
  ...[
    ['lady_wang_langya', 'sun_he', '琅邪王夫人'],
    ['lady_wang_nanyang', 'sun_xiu', '南阳王夫人'],
  ].flatMap(([lady, child, name]) => [
    {
      slug: `sun_quan_spouse_${lady}`,
      source: 'sun_quan',
      target: lady,
      type: 'spouse_of' as const,
      sourceId: 'source:sg:family_sgz_50_sun_consorts',
      note: `《妃嫔传》所载孙权与${name}关系。`,
    },
    {
      slug: `sun_quan_father_${child}`,
      source: 'sun_quan',
      target: child,
      type: 'father_of' as const,
      sourceId: 'source:sg:family_sgz_50_sun_consorts',
      note: `《${name}传》所载孙权之子。`,
    },
    {
      slug: `${lady}_mother_${child}`,
      source: lady,
      target: child,
      type: 'mother_of' as const,
      sourceId: 'source:sg:family_sgz_50_sun_consorts',
      note: `《${name}传》明确记其生${child === 'sun_he' ? '孙和' : '孙休'}。`,
    },
  ]),
  ...['sun_deng', 'sun_ba', 'sun_fen'].map((target) => ({
    slug: `sun_quan_father_${target}`,
    source: 'sun_quan',
    target,
    type: 'father_of' as const,
    sourceId: 'source:sg:family_sgz_59_sun_sons',
    note: '《吴主五子传》所载孙权父子关系。',
  })),
  {
    slug: 'sun_he_father_sun_hao',
    source: 'sun_he',
    target: 'sun_hao',
    type: 'father_of',
    sourceId: 'source:sg:sgz_volume_48',
    note: '《三嗣主传》明确记孙皓为孙和之子。',
  },
  {
    slug: 'sima_yi_spouse_zhang_chunhua',
    source: 'sima_yi',
    target: 'zhang_chunhua',
    type: 'spouse_of',
    sourceId: 'source:sg:family_jinshu_31_sima_house',
    note: '《晋书·宣穆张皇后传》所载婚配。',
  },
  ...['sima_shi', 'sima_zhao', 'sima_gan'].flatMap((target) => [
    {
      slug: `sima_yi_father_${target}`,
      source: 'sima_yi',
      target,
      type: 'father_of' as const,
      sourceId: 'source:sg:family_jinshu_31_sima_house',
      note: '《宣穆张皇后传》所载司马懿子女。',
    },
    {
      slug: `zhang_chunhua_mother_${target}`,
      source: 'zhang_chunhua',
      target,
      type: 'mother_of' as const,
      sourceId: 'source:sg:family_jinshu_31_sima_house',
      note: '《宣穆张皇后传》明确记张春华所生诸子。',
    },
  ]),
  {
    slug: 'sima_zhao_spouse_wang_yuanji',
    source: 'sima_zhao',
    target: 'wang_yuanji',
    type: 'spouse_of',
    sourceId: 'source:sg:family_jinshu_31_sima_house',
    note: '《晋书·文明王皇后传》所载婚配。',
  },
  ...['sima_yan', 'sima_you'].flatMap((target) => [
    {
      slug: `sima_zhao_father_${target}`,
      source: 'sima_zhao',
      target,
      type: 'father_of' as const,
      sourceId: 'source:sg:family_jinshu_31_sima_house',
      note: '《文明王皇后传》所载司马昭子女。',
    },
    {
      slug: `wang_yuanji_mother_${target}`,
      source: 'wang_yuanji',
      target,
      type: 'mother_of' as const,
      sourceId: 'source:sg:family_jinshu_31_sima_house',
      note: '《文明王皇后传》明确记王元姬所生诸子。',
    },
  ]),
  ...[
    ['guan_yu', 'guan_ping'],
    ['guan_yu', 'guan_xing'],
    ['zhang_fei', 'zhang_bao'],
    ['zhang_fei', 'zhang_shao'],
    ['zhang_bao', 'zhang_zun'],
    ['ma_chao', 'ma_cheng'],
    ['ma_chao', 'lady_ma'],
    ['huang_zhong', 'huang_xu'],
    ['zhao_yun', 'zhao_tong'],
    ['zhao_yun', 'zhao_guang'],
  ].map(([source, target]) => ({
    slug: `${source}_father_${target}`,
    source,
    target,
    type: 'father_of' as const,
    sourceId: 'source:sg:family_sgz_36_shu_heirs',
    note: '《关张马黄赵传》所载父子或父女关系。',
  })),
  {
    slug: 'ma_chao_father_ma_qiu',
    source: 'ma_chao',
    target: 'ma_qiu',
    type: 'father_of',
    sourceId: 'source:sg:family_sgz_36_shu_heirs',
    note: '裴松之注引材料记马秋为马超之子，区别于正文层。',
    certainty: 'probable',
    historicalLayer: 'annotated_history',
    claim: pendingClaim(
      '东汉末年；父子身份为终身关系',
      '注引材料所载父子',
      '关系来自裴松之注引材料而非《三国志》正文，因此以较可信虚线表达。',
    ),
  },
  {
    slug: 'lady_ma_spouse_liu_li',
    source: 'lady_ma',
    target: 'liu_li',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_36_shu_heirs',
    note: '《马超传》正文记马超之女配安平王刘理。',
  },
  {
    slug: 'zhuge_liang_spouse_lady_huang',
    source: 'zhuge_liang',
    target: 'lady_huang',
    type: 'spouse_of',
    sourceId: 'source:sg:family_xiangyangji_huang_lady',
    note: '《襄阳记》所载诸葛亮与黄承彦之女婚配，属于后出地方旧闻。',
    certainty: 'probable',
    historicalLayer: 'later_tradition',
    claim: pendingClaim(
      '东汉末年；具体婚年不详',
      '后出地方记载中的婚配',
      '《襄阳记》保存这一婚配叙述，但正史本传未具载，故以较可信虚线表达；不采用“黄月英”这一后世姓名。',
    ),
  },
  {
    slug: 'sun_ce_spouse_lady_qiao_elder',
    source: 'sun_ce',
    target: 'lady_qiao_elder',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_54_zhou_house',
    note: '《周瑜传》记孙策自纳大桥。',
  },
  {
    slug: 'zhou_yu_spouse_lady_qiao_younger',
    source: 'zhou_yu',
    target: 'lady_qiao_younger',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_54_zhou_house',
    note: '《周瑜传》记周瑜纳小桥。',
  },
  ...['zhou_xun', 'zhou_yin', 'lady_zhou'].map((target) => ({
    slug: `zhou_yu_father_${target}`,
    source: 'zhou_yu',
    target,
    type: 'father_of' as const,
    sourceId: 'source:sg:family_sgz_54_zhou_house',
    note: '《周瑜传》明确记周瑜两子一女。',
  })),
  {
    slug: 'lady_zhou_spouse_sun_deng',
    source: 'lady_zhou',
    target: 'sun_deng',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_54_zhou_house',
    note: '《周瑜传》记周瑜之女配太子孙登。',
  },
  {
    slug: 'cao_pi_spouse_empress_zhen',
    source: 'cao_pi',
    target: 'empress_zhen',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_05_cao_house',
    note: '《文昭甄皇后传》所载曹丕与甄氏婚配。',
  },
  {
    slug: 'cao_pi_spouse_empress_guo',
    source: 'cao_pi',
    target: 'empress_guo',
    type: 'spouse_of',
    sourceId: 'source:sg:family_sgz_05_cao_house',
    note: '《文德郭皇后传》所载曹丕与郭氏婚配。',
  },
  {
    slug: 'cao_pi_father_cao_rui',
    source: 'cao_pi',
    target: 'cao_rui',
    type: 'father_of',
    sourceId: 'source:sg:family_sgz_05_cao_house',
    note: '《文昭甄皇后传》所载曹丕与曹叡父子关系。',
  },
  {
    slug: 'empress_zhen_mother_cao_rui',
    source: 'empress_zhen',
    target: 'cao_rui',
    type: 'mother_of',
    sourceId: 'source:sg:family_sgz_05_cao_house',
    note: '《文昭甄皇后传》所载甄氏与曹叡母子关系。',
  },
  {
    slug: 'lu_xun_father_lu_kang',
    source: 'lu_xun',
    target: 'lu_kang',
    type: 'father_of',
    sourceId: 'source:sg:family_sgz_58_lu_house',
    note: '《陆逊传》记陆抗为陆逊次子。',
  },
  {
    slug: 'lv_bu_spouse_diaochan_literature',
    source: 'lv_bu',
    target: 'diaochan',
    type: 'spouse_of',
    sourceId: 'source:sg:family_romance_16_diaochan',
    note: '只存在于《三国演义》叙事，不视为正史婚姻。',
    certainty: 'fictional',
    historicalLayer: 'literature',
    reviewStatus: 'pending_review',
    claim: pendingClaim(
      '文学叙事时间；非可核验历史年代',
      '小说中的妻妾关系',
      '《三国演义》明确叙述吕布纳貂蝉为妾，但正史不承认貂蝉这一人物身份；前端以虚线展示。',
    ),
  },
];

export const familyRelations: Relation[] = seeds.map(relation);
