import type { Gender, Person, VisualFaction } from '../domain';

interface AuditPersonSeed {
  slug: string;
  name: string;
  sourceId: string;
  description: string;
  visualFaction: VisualFaction;
  gender?: Gender;
  courtesyName?: string;
  otherNames?: readonly string[];
  factions?: readonly string[];
  deathYear?: number;
}

function person(seed: AuditPersonSeed): Person {
  return {
    id: `person:sg:${seed.slug}`,
    name: seed.name,
    courtesyName: seed.courtesyName ?? null,
    otherNames: [...(seed.otherNames ?? [])],
    gender: seed.gender ?? 'male',
    birthYear: null,
    deathYear: seed.deathYear ?? null,
    clan: null,
    factions: [...(seed.factions ?? [])],
    visualFaction: seed.visualFaction,
    importBatch: 7,
    description: seed.description,
    historicity: 'historical',
    reviewStatus: 'verified',
    sourceIds: [seed.sourceId],
    externalIds: {},
    note: '第七批《三国志》65卷遗漏审计补录；身份和表述按本地史料索引核验。',
  };
}

const caoCaoSourceId =
  'source:sg:sixth_roster_batch_1_sgz_20_cao_cao_sons';
const caoPiSourceId =
  'source:sg:sixth_roster_batch_1_sgz_20_cao_pi_sons';

const seeds: readonly AuditPersonSeed[] = [
  {
    slug: 'cao_cao_du_furen',
    name: '杜夫人',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹林、曹衮；本名不详。',
  },
  {
    slug: 'cao_cao_qin_furen',
    name: '秦夫人',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹玹、曹峻；本名不详。',
  },
  {
    slug: 'cao_cao_yin_furen',
    name: '尹夫人',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹矩；本名不详。',
  },
  {
    slug: 'cao_cao_wang_zhaoyi',
    name: '王昭仪',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹干；本名不详。',
  },
  {
    slug: 'cao_cao_sun_ji',
    name: '孙姬',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹上、曹彪、曹勤；本名不详。',
  },
  {
    slug: 'cao_cao_li_ji',
    name: '李姬',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹乘、曹整、曹京；本名不详。',
  },
  {
    slug: 'cao_cao_zhou_ji',
    name: '周姬',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹均；本名不详。',
  },
  {
    slug: 'cao_cao_liu_ji',
    name: '刘姬',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹棘；本名不详。',
  },
  {
    slug: 'cao_cao_song_ji',
    name: '宋姬',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '曹操诸子母之一，《三国志》卷二十载其生曹徽；本名不详。',
  },
  {
    slug: 'cao_cao_zhao_ji',
    name: '赵姬',
    gender: 'female',
    sourceId: caoCaoSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹茂；本名不详。',
  },
  {
    slug: 'cao_pi_li_guiren',
    name: '李贵人',
    gender: 'female',
    sourceId: caoPiSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹协；本名不详。',
  },
  {
    slug: 'cao_pi_pan_shuyuan',
    name: '潘淑媛',
    gender: 'female',
    sourceId: caoPiSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹蕤；本名不详。',
  },
  {
    slug: 'cao_pi_zhu_shuyuan',
    name: '朱淑媛',
    gender: 'female',
    sourceId: caoPiSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹鉴；本名不详。',
  },
  {
    slug: 'cao_pi_qiu_zhaoyi',
    name: '仇昭仪',
    gender: 'female',
    sourceId: caoPiSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹霖；本名不详。',
  },
  {
    slug: 'cao_pi_xu_ji',
    name: '徐姬',
    gender: 'female',
    sourceId: caoPiSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹礼；本名不详。',
  },
  {
    slug: 'cao_pi_su_ji',
    name: '苏姬',
    gender: 'female',
    sourceId: caoPiSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹邕；本名不详。',
  },
  {
    slug: 'cao_pi_zhang_ji',
    name: '张姬',
    gender: 'female',
    sourceId: caoPiSourceId,
    visualFaction: 'wei',
    description: '《三国志》卷二十载其生曹贡；本名不详。',
  },
  {
    slug: 'cao_pi_song_ji',
    name: '宋姬',
    gender: 'female',
    sourceId: caoPiSourceId,
    visualFaction: 'wei',
    description: '曹丕诸子母之一，《三国志》卷二十载其生曹俨；本名不详。',
  },
  {
    slug: 'dong_jue',
    name: '董厥',
    sourceId: 'source:sg:seventh_audit_sgz_35_dong_jue',
    visualFaction: 'shu',
    factions: ['蜀汉'],
    description: '蜀汉官员，《三国志》卷三十五设有具名附传。',
  },
  {
    slug: 'sun_lu',
    name: '孙虑',
    courtesyName: '子智',
    sourceId: 'source:sg:seventh_audit_sgz_59_sun_lu',
    visualFaction: 'wu',
    factions: ['孙吴'],
    deathYear: 232,
    description: '孙权之子、孙登之弟，封建昌侯，嘉禾元年卒。',
  },
];

export const seventhSourceAuditBatchOnePersons: Person[] = seeds.map(person);
