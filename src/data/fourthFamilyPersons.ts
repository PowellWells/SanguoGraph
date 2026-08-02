import type { Person } from '../domain';

interface FourthFamilyPersonSeed {
  slug: string;
  name: string;
  sourceId: string;
  description: string;
  courtesyName?: string;
  otherNames?: readonly string[];
  factions?: readonly string[];
}

function person(seed: FourthFamilyPersonSeed): Person {
  return {
    id: `person:sg:${seed.slug}`,
    name: seed.name,
    courtesyName: seed.courtesyName ?? null,
    otherNames: [...(seed.otherNames ?? [])],
    gender: 'male',
    birthYear: null,
    deathYear: null,
    clan: null,
    factions: [...(seed.factions ?? ['曹魏'])],
    visualFaction: 'wei',
    importBatch: 4,
    description: seed.description,
    historicity: 'historical',
    reviewStatus: 'verified',
    sourceIds: [seed.sourceId],
    externalIds: {},
    note: '第四批魏系家庭扩展人物；身份按所引《三国志》核验，未核验的生卒年保持空值。',
  };
}

const volumeNineSourceId = 'source:sg:fourth_family_sgz_09_wei_houses';
const volumeSeventeenSourceId =
  'source:sg:fourth_family_sgz_17_wei_generals';
const volumeEighteenSourceId =
  'source:sg:fourth_family_sgz_18_wei_guard_generals';

const seeds: readonly FourthFamilyPersonSeed[] = [
  {
    slug: 'xiahou_chong',
    name: '夏侯充',
    sourceId: volumeNineSourceId,
    description: '夏侯惇之子，承袭其爵。',
  },
  {
    slug: 'xiahou_mao',
    name: '夏侯楙',
    courtesyName: '子林',
    sourceId: volumeNineSourceId,
    description: '夏侯惇之子，娶曹操之女清河公主。',
  },
  {
    slug: 'xiahou_heng',
    name: '夏侯衡',
    sourceId: volumeNineSourceId,
    description: '夏侯渊长子，承袭其爵。',
  },
  {
    slug: 'xiahou_ba',
    name: '夏侯霸',
    courtesyName: '仲权',
    sourceId: volumeNineSourceId,
    description: '夏侯渊之子，后由魏入蜀。',
    factions: ['曹魏', '蜀汉'],
  },
  {
    slug: 'xiahou_cheng',
    name: '夏侯称',
    courtesyName: '叔权',
    sourceId: volumeNineSourceId,
    description: '夏侯渊第三子，早年以勇烈闻名。',
  },
  {
    slug: 'xiahou_wei',
    name: '夏侯威',
    courtesyName: '季权',
    sourceId: volumeNineSourceId,
    description: '夏侯渊之子，官至兖州刺史。',
  },
  {
    slug: 'xiahou_rong',
    name: '夏侯荣',
    courtesyName: '幼权',
    sourceId: volumeNineSourceId,
    description: '夏侯渊第五子，汉中之战随父遇害。',
  },
  {
    slug: 'xiahou_hui',
    name: '夏侯惠',
    courtesyName: '稚权',
    sourceId: volumeNineSourceId,
    description: '夏侯渊之子，官至乐安太守。',
  },
  {
    slug: 'xiahou_he',
    name: '夏侯和',
    courtesyName: '义权',
    sourceId: volumeNineSourceId,
    description: '夏侯渊之子，官至河南尹。',
  },
  {
    slug: 'cao_chi',
    name: '曹炽',
    sourceId: volumeNineSourceId,
    description: '曹仁之父，曾任侍中、长水校尉。',
    factions: ['东汉'],
  },
  {
    slug: 'cao_tai',
    name: '曹泰',
    sourceId: volumeNineSourceId,
    description: '曹仁之子，承袭其爵。',
  },
  {
    slug: 'cao_kai',
    name: '曹楷',
    sourceId: volumeNineSourceId,
    description: '曹仁之子、曹泰之弟。',
  },
  {
    slug: 'cao_fan',
    name: '曹范',
    sourceId: volumeNineSourceId,
    description: '曹仁之子、曹泰之弟。',
  },
  {
    slug: 'cao_chun',
    name: '曹纯',
    courtesyName: '子和',
    sourceId: volumeNineSourceId,
    description: '曹仁之弟，曾统领虎豹骑。',
    factions: ['东汉', '曹操集团'],
  },
  {
    slug: 'cao_yan_chun',
    name: '曹演',
    sourceId: volumeNineSourceId,
    description: '曹纯之子，承袭其爵。',
  },
  {
    slug: 'cao_fu',
    name: '曹馥',
    sourceId: volumeNineSourceId,
    description: '曹洪之子，承袭其爵。',
  },
  {
    slug: 'cao_zhen_hong',
    name: '曹震',
    sourceId: volumeNineSourceId,
    description: '曹洪之子，受封列侯；与曹真并非同一人物。',
  },
  {
    slug: 'cao_zhao',
    name: '曹肇',
    courtesyName: '长思',
    sourceId: volumeNineSourceId,
    description: '曹休之子，承袭其爵。',
  },
  {
    slug: 'cao_xi',
    name: '曹羲',
    sourceId: volumeNineSourceId,
    description: '曹真之子、曹爽之弟。',
  },
  {
    slug: 'cao_xun',
    name: '曹训',
    sourceId: volumeNineSourceId,
    description: '曹真之子、曹爽之弟。',
  },
  {
    slug: 'cao_ze',
    name: '曹则',
    sourceId: volumeNineSourceId,
    description: '曹真之子，受封列侯。',
  },
  {
    slug: 'cao_yan_zhen',
    name: '曹彦',
    sourceId: volumeNineSourceId,
    description: '曹真之子，受封列侯。',
  },
  {
    slug: 'cao_ai',
    name: '曹皑',
    sourceId: volumeNineSourceId,
    description: '曹真之子，受封列侯。',
  },
  {
    slug: 'cao_bin',
    name: '曹彬',
    sourceId: volumeNineSourceId,
    description: '曹真之弟，受封列侯。',
  },
  {
    slug: 'cao_chu',
    name: '曹初',
    sourceId: volumeNineSourceId,
    description: '曹泰之子，承袭其爵。',
  },
  {
    slug: 'zhang_hu',
    name: '张虎',
    sourceId: volumeSeventeenSourceId,
    description: '张辽之子，承袭其爵。',
  },
  {
    slug: 'zhang_tong',
    name: '张统',
    sourceId: volumeSeventeenSourceId,
    description: '张虎之子，承袭其爵。',
  },
  {
    slug: 'yue_chen',
    name: '乐綝',
    sourceId: volumeSeventeenSourceId,
    description: '乐进之子，官至扬州刺史。',
  },
  {
    slug: 'yue_zhao',
    name: '乐肇',
    sourceId: volumeSeventeenSourceId,
    description: '乐綝之子，承袭其爵。',
  },
  {
    slug: 'yu_gui',
    name: '于圭',
    sourceId: volumeSeventeenSourceId,
    description: '于禁之子，承袭益寿亭侯。',
  },
  {
    slug: 'zhang_xiong',
    name: '张雄',
    sourceId: volumeSeventeenSourceId,
    description: '张郃之子，承袭其爵。',
  },
  {
    slug: 'xu_gai',
    name: '徐盖',
    sourceId: volumeSeventeenSourceId,
    description: '徐晃之子，承袭其爵。',
  },
  {
    slug: 'xu_yi',
    name: '许仪',
    sourceId: volumeEighteenSourceId,
    description: '许褚之子，承袭其爵。',
  },
  {
    slug: 'dian_man',
    name: '典满',
    sourceId: volumeEighteenSourceId,
    description: '典韦之子，曾任司马、都尉。',
  },
  {
    slug: 'pang_hui',
    name: '庞会',
    sourceId: volumeEighteenSourceId,
    description: '庞德之子，官至中尉将军。',
  },
];

export const fourthFamilyPersons: Person[] = seeds.map(person);
