import type { HistoricalLayer, Relation, RelationType } from '../domain';

interface FourthFamilyRelationSeed {
  slug: string;
  source: string;
  target: string;
  type: RelationType;
  sourceId: string;
  note: string;
  historicalLayer?: HistoricalLayer;
}

function relation(seed: FourthFamilyRelationSeed): Relation {
  return {
    id: `relation:sg:${seed.slug}`,
    sourcePersonId: `person:sg:${seed.source}`,
    targetPersonId: `person:sg:${seed.target}`,
    type: seed.type,
    certainty: 'confirmed',
    historicalLayer: seed.historicalLayer ?? 'official_history',
    reviewStatus: 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: seed.note,
  };
}

const volumeNineSourceId = 'source:sg:fourth_family_sgz_09_wei_houses';
const volumeSeventeenSourceId =
  'source:sg:fourth_family_sgz_17_wei_generals';
const volumeEighteenSourceId =
  'source:sg:fourth_family_sgz_18_wei_guard_generals';

const fatherRelations = (
  source: string,
  targets: readonly string[],
  sourceId: string,
  note: string,
): FourthFamilyRelationSeed[] =>
  targets.map((target) => ({
    slug: `${source}_father_${target}`,
    source,
    target,
    type: 'father_of',
    sourceId,
    note,
  }));

const seeds: readonly FourthFamilyRelationSeed[] = [
  ...fatherRelations(
    'xiahou_dun',
    ['xiahou_chong', 'xiahou_mao'],
    volumeNineSourceId,
    '《三国志》卷九所载夏侯惇父子关系。',
  ),
  ...fatherRelations(
    'xiahou_yuan',
    [
      'xiahou_heng',
      'xiahou_ba',
      'xiahou_wei',
      'xiahou_hui',
      'xiahou_he',
    ],
    volumeNineSourceId,
    '《三国志》卷九“子霸等”所载夏侯渊诸子。',
  ),
  ...['xiahou_cheng', 'xiahou_rong'].map((target) => ({
    slug: `xiahou_yuan_father_${target}`,
    source: 'xiahou_yuan',
    target,
    type: 'father_of' as const,
    sourceId: volumeNineSourceId,
    note: '裴松之注引材料所载夏侯渊父子关系。',
    historicalLayer: 'annotated_history' as const,
  })),
  {
    slug: 'cao_chi_father_cao_ren',
    source: 'cao_chi',
    target: 'cao_ren',
    type: 'father_of',
    sourceId: volumeNineSourceId,
    note: '《三国志》卷九注引《魏书》明确记曹炽为曹仁之父。',
    historicalLayer: 'annotated_history',
  },
  ...fatherRelations(
    'cao_ren',
    ['cao_tai', 'cao_kai', 'cao_fan'],
    volumeNineSourceId,
    '《三国志》卷九所载曹仁诸子。',
  ),
  {
    slug: 'cao_ren_clan_cao_chun',
    source: 'cao_ren',
    target: 'cao_chun',
    type: 'clan_relative_of',
    sourceId: volumeNineSourceId,
    note: '《三国志》卷九明确记曹纯为曹仁之弟。',
  },
  ...fatherRelations(
    'cao_chun',
    ['cao_yan_chun'],
    volumeNineSourceId,
    '《三国志》卷九所载曹纯父子关系。',
  ),
  ...fatherRelations(
    'cao_hong',
    ['cao_fu', 'cao_zhen_hong'],
    volumeNineSourceId,
    '《三国志》卷九所载曹洪诸子。',
  ),
  ...fatherRelations(
    'cao_xiu',
    ['cao_zhao'],
    volumeNineSourceId,
    '《三国志》卷九所载曹休父子关系。',
  ),
  ...fatherRelations(
    'cao_zhen',
    ['cao_xi', 'cao_xun', 'cao_ze', 'cao_yan_zhen', 'cao_ai'],
    volumeNineSourceId,
    '《三国志》卷九明确列出曹真诸子。',
  ),
  {
    slug: 'cao_zhen_clan_cao_bin',
    source: 'cao_zhen',
    target: 'cao_bin',
    type: 'clan_relative_of',
    sourceId: volumeNineSourceId,
    note: '《三国志》卷九明确记曹彬为曹真之弟。',
  },
  ...fatherRelations(
    'cao_tai',
    ['cao_chu'],
    volumeNineSourceId,
    '《三国志》卷九所载曹泰父子关系。',
  ),
  ...fatherRelations(
    'zhang_liao',
    ['zhang_hu'],
    volumeSeventeenSourceId,
    '《三国志》卷十七所载张辽父子关系。',
  ),
  ...fatherRelations(
    'zhang_hu',
    ['zhang_tong'],
    volumeSeventeenSourceId,
    '《三国志》卷十七所载张虎父子关系。',
  ),
  ...fatherRelations(
    'yue_jin',
    ['yue_chen'],
    volumeSeventeenSourceId,
    '《三国志》卷十七所载乐进父子关系。',
  ),
  ...fatherRelations(
    'yue_chen',
    ['yue_zhao'],
    volumeSeventeenSourceId,
    '《三国志》卷十七所载乐綝父子关系。',
  ),
  ...fatherRelations(
    'yu_jin',
    ['yu_gui'],
    volumeSeventeenSourceId,
    '《三国志》卷十七所载于禁父子关系。',
  ),
  ...fatherRelations(
    'zhang_he',
    ['zhang_xiong'],
    volumeSeventeenSourceId,
    '《三国志》卷十七所载张郃与嗣子张雄。',
  ),
  ...fatherRelations(
    'xu_huang',
    ['xu_gai'],
    volumeSeventeenSourceId,
    '《三国志》卷十七所载徐晃父子关系。',
  ),
  ...fatherRelations(
    'xu_chu',
    ['xu_yi'],
    volumeEighteenSourceId,
    '《三国志》卷十八所载许褚父子关系。',
  ),
  ...fatherRelations(
    'dian_wei',
    ['dian_man'],
    volumeEighteenSourceId,
    '《三国志》卷十八明确记典满为典韦之子。',
  ),
  ...fatherRelations(
    'pang_de',
    ['pang_hui'],
    volumeEighteenSourceId,
    '《三国志》卷十八所载庞德父子关系。',
  ),
];

export const fourthFamilyRelations: Relation[] = seeds.map(relation);
