import type { Person } from '../domain';

const hhsSourceId = 'source:sg:round_06_hhs_10b_cao_daughters';
const sgzSourceId =
  'source:sg:major_roster_second_pass_sgz_01_cao_daughters';

interface PersonSeed {
  slug: string;
  name: string;
  otherNames: readonly string[];
  deathYear: number | null;
  description: string;
}

function person(seed: PersonSeed): Person {
  return {
    id: `person:sg:${seed.slug}`,
    name: seed.name,
    courtesyName: null,
    otherNames: [...seed.otherNames],
    gender: 'female',
    birthYear: null,
    deathYear: seed.deathYear,
    clan: '沛国谯县曹氏',
    factions: [],
    visualFaction: 'wei',
    importBatch: 7,
    description: seed.description,
    historicity: 'historical',
    reviewStatus: 'verified',
    sourceIds: [hhsSourceId, sgzSourceId],
    externalIds: {},
    note: 'Round 6 数据冻结前具名遗漏审计；展示阵营为图谱颜色分类，不据此反推正式政治归属。',
  };
}

export const dataFreezeOmissionPersons: Person[] = [
  person({
    slug: 'cao_xian',
    name: '曹宪',
    otherNames: ['曹憲'],
    deathYear: null,
    description: '曹操之女，建安十八年入汉献帝后宫为夫人，次年拜贵人。',
  }),
  person({
    slug: 'cao_jie_empress',
    name: '曹节',
    otherNames: ['曹節', '献穆皇后', '曹皇后', '山阳公夫人'],
    deathYear: 260,
    description: '曹操之女、汉献帝皇后；魏受禅后为山阳公夫人，景元元年薨。',
  }),
  person({
    slug: 'cao_hua',
    name: '曹华',
    otherNames: ['曹華'],
    deathYear: null,
    description: '曹操之女，建安十八年入汉献帝后宫为夫人，次年拜贵人。',
  }),
];
