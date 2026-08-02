import type {
  Gender,
  HistoricalLayer,
  Person,
} from '../domain';

interface FifthFamilyPersonSeed {
  slug: string;
  name: string;
  sourceId: string;
  description: string;
  courtesyName?: string;
  otherNames?: readonly string[];
  factions?: readonly string[];
  gender?: Gender;
  sourceLayer?: HistoricalLayer;
}

function person(seed: FifthFamilyPersonSeed): Person {
  return {
    id: `person:sg:${seed.slug}`,
    name: seed.name,
    courtesyName: seed.courtesyName ?? null,
    otherNames: [...(seed.otherNames ?? [])],
    gender: seed.gender ?? 'male',
    birthYear: null,
    deathYear: null,
    clan: null,
    factions: [...(seed.factions ?? ['蜀汉'])],
    visualFaction: 'shu',
    importBatch: 5,
    description: seed.description,
    historicity: 'historical',
    reviewStatus: 'verified',
    sourceIds: [seed.sourceId],
    externalIds: {},
    note:
      seed.sourceLayer === 'annotated_history'
        ? '第五批蜀系家庭扩展人物；身份见裴松之注所引材料，关系与正文层分开表达。'
        : '第五批蜀系家庭扩展人物；身份按所引《三国志》核验，未核验的生卒年保持空值。',
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

const seeds: readonly FifthFamilyPersonSeed[] = [
  {
    slug: 'empress_zhang_jingai',
    name: '敬哀皇后',
    otherNames: ['张氏', '后主敬哀皇后'],
    gender: 'female',
    sourceId: sourceIds.volume34,
    description: '张飞长女，刘禅第一任皇后；正史未载本名。',
  },
  {
    slug: 'empress_zhang_later',
    name: '张皇后',
    otherNames: ['后主张皇后', '张氏'],
    gender: 'female',
    sourceId: sourceIds.volume34,
    description: '张飞次女、敬哀皇后之妹，刘禅第二任皇后；正史未载本名。',
  },
  {
    slug: 'liu_xuan',
    name: '刘璿',
    courtesyName: '文衡',
    sourceId: sourceIds.volume34,
    description: '刘禅长子，蜀汉皇太子。',
  },
  ...[
    ['liu_yao_shu', '刘瑶'],
    ['liu_cong_shu', '刘琮'],
    ['liu_zan', '刘瓒'],
    ['liu_chen', '刘谌'],
    ['liu_xun', '刘恂'],
    ['liu_qu', '刘璩'],
  ].map(([slug, name]) => ({
    slug,
    name,
    sourceId: sourceIds.volume34Annotation,
    sourceLayer: 'annotated_history' as const,
    description: `裴松之注引《蜀世谱》所列刘禅之子${name}。`,
  })),
  {
    slug: 'liu_yin_li',
    name: '刘胤',
    sourceId: sourceIds.volume34,
    description: '刘理之子，承袭安平王。',
  },
  {
    slug: 'liu_cheng_li',
    name: '刘承',
    sourceId: sourceIds.volume34,
    description: '刘胤之子，承袭安平王。',
  },
  {
    slug: 'liu_ji_li',
    name: '刘辑',
    sourceId: sourceIds.volume34,
    description: '刘理之子，后承袭安平王。',
  },
  {
    slug: 'zhuge_qiao',
    name: '诸葛乔',
    courtesyName: '伯松',
    otherNames: ['诸葛仲慎'],
    sourceId: sourceIds.volume35,
    factions: ['孙吴', '蜀汉'],
    description: '诸葛瑾次子，后成为诸葛亮嗣子。',
  },
  {
    slug: 'zhuge_pan',
    name: '诸葛攀',
    sourceId: sourceIds.volume35,
    description: '诸葛乔之子，后复为诸葛瑾之后。',
  },
  {
    slug: 'zhuge_xian',
    name: '诸葛显',
    sourceId: sourceIds.volume35,
    factions: ['蜀汉', '西晋'],
    description: '诸葛攀之子，蜀亡后内迁河东。',
  },
  {
    slug: 'zhuge_zhan',
    name: '诸葛瞻',
    courtesyName: '思远',
    sourceId: sourceIds.volume35,
    description: '诸葛亮之子，绵竹之战阵亡。',
  },
  {
    slug: 'zhuge_shang',
    name: '诸葛尚',
    sourceId: sourceIds.volume35,
    description: '诸葛瞻长子，与父同殁于绵竹。',
  },
  {
    slug: 'zhuge_jing',
    name: '诸葛京',
    courtesyName: '行宗',
    sourceId: sourceIds.volume35,
    factions: ['蜀汉', '西晋'],
    description: '诸葛瞻次子，蜀亡后内迁河东。',
  },
  {
    slug: 'pang_hong',
    name: '庞宏',
    courtesyName: '巨师',
    sourceId: sourceIds.volume37,
    description: '庞统之子，官至涪陵太守。',
  },
  {
    slug: 'fa_miao',
    name: '法邈',
    sourceId: sourceIds.volume37,
    description: '法正之子，官至汉阳太守。',
  },
  {
    slug: 'xu_qin',
    name: '许钦',
    sourceId: sourceIds.volume38,
    factions: ['东汉'],
    description: '许靖之子，早于许靖去世。',
  },
  {
    slug: 'xu_you_jing',
    name: '许游',
    sourceId: sourceIds.volume38,
    description: '许钦之子，蜀汉官至尚书。',
  },
  {
    slug: 'mi_wei',
    name: '糜威',
    sourceId: sourceIds.volume38,
    description: '糜竺之子，官至虎贲中郎将。',
  },
  {
    slug: 'mi_zhao',
    name: '糜照',
    sourceId: sourceIds.volume38,
    description: '糜威之子，官至虎骑监。',
  },
  {
    slug: 'ma_bing',
    name: '马秉',
    sourceId: sourceIds.volume39,
    description: '马良之子，官至骑都尉。',
  },
  {
    slug: 'huo_yi',
    name: '霍弋',
    courtesyName: '绍先',
    sourceId: sourceIds.volume41,
    factions: ['蜀汉', '西晋'],
    description: '霍峻之子，蜀汉后期镇守南中。',
  },
  {
    slug: 'xiang_lang',
    name: '向朗',
    courtesyName: '巨达',
    sourceId: sourceIds.volume41,
    factions: ['东汉', '蜀汉'],
    description: '向宠之叔，蜀汉官员。',
  },
  {
    slug: 'xiang_chong_younger',
    name: '向充',
    sourceId: sourceIds.volume41,
    factions: ['蜀汉', '西晋'],
    description: '向宠之弟，后官至梓潼太守。',
  },
  {
    slug: 'huang_yong',
    name: '黄邕',
    sourceId: sourceIds.volume43,
    factions: ['曹魏'],
    description: '黄权之子，在曹魏承袭其爵。',
  },
  {
    slug: 'huang_chong',
    name: '黄崇',
    sourceId: sourceIds.volume43,
    description: '黄权留在蜀汉的儿子，绵竹之战阵亡。',
  },
  {
    slug: 'wang_xun',
    name: '王训',
    sourceId: sourceIds.volume43,
    description: '王平之子，承袭其爵。',
  },
  {
    slug: 'li_yi_hui',
    name: '李遗',
    sourceId: sourceIds.volume43,
    description: '李恢之子，承袭其爵。',
  },
  {
    slug: 'zhang_ying_ni',
    name: '张瑛',
    sourceId: sourceIds.volume43,
    description: '张嶷长子，受封西乡侯。',
  },
  {
    slug: 'deng_liang',
    name: '邓良',
    sourceId: sourceIds.volume45,
    factions: ['蜀汉', '西晋'],
    description: '邓芝之子，后官至广汉太守。',
  },
  {
    slug: 'ma_xiu_zhong',
    name: '马修',
    sourceId: sourceIds.volume43,
    description: '马忠之子，承袭其爵。',
  },
];

export const fifthFamilyPersons: Person[] = seeds.map(person);
