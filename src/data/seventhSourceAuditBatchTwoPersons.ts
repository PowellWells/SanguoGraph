import type { Person, VisualFaction } from '../domain';

interface PersonSeed {
  slug: string;
  name: string;
  sourceIds: readonly string[];
  visualFaction: VisualFaction;
  description: string;
  otherNames?: readonly string[];
}

function person(seed: PersonSeed): Person {
  return {
    id: `person:sg:${seed.slug}`,
    name: seed.name,
    courtesyName: null,
    otherNames: [...(seed.otherNames ?? [])],
    gender: 'female',
    birthYear: null,
    deathYear: null,
    clan: null,
    factions: [],
    visualFaction: seed.visualFaction,
    importBatch: 7,
    description: seed.description,
    historicity: 'historical',
    reviewStatus: 'verified',
    sourceIds: [...seed.sourceIds],
    externalIds: {},
    note: '第七批《三国志》65卷遗漏审计第二批；未见本名者以史籍称谓或亲属身份录入。',
  };
}

const sourceIds = {
  qinghe: 'source:sg:seventh_audit_batch_2_sgz_09_qinghe_princess',
  qingheMother: 'source:sg:seventh_audit_batch_2_weilue_qinghe_mother',
  xiahou: 'source:sg:seventh_audit_batch_2_weilue_xiahou_lady',
  anyang: 'source:sg:seventh_audit_batch_2_sgz_10_anyang_princess',
  caoLinGranddaughter:
    'source:sg:seventh_audit_batch_2_jishipu_cao_lin_granddaughter',
  zhenWomen: 'source:sg:seventh_audit_batch_2_sgz_05_zhen_women',
  yuLady: 'source:sg:seventh_audit_batch_2_sgz_05_yu_lady',
  bianEmpresses: 'source:sg:seventh_audit_batch_2_sgz_05_bian_empresses',
  wangGuiren: 'source:sg:seventh_audit_batch_2_sgz_34_wang_guiren',
  feiDaughter: 'source:sg:seventh_audit_batch_2_sgz_44_fei_daughter',
  zhangFamily: 'source:sg:seventh_audit_batch_2_sgz_52_zhang_family',
  guShao: 'source:sg:seventh_audit_batch_2_sgz_52_sun_ce_daughter_gu_shao',
  luoTong: 'source:sg:seventh_audit_batch_2_sgz_57_sun_fu_daughter',
  luXun: 'source:sg:seventh_audit_batch_2_sgz_58_sun_ce_daughter_lu_xun',
  panDaughter: 'source:sg:seventh_audit_batch_2_sgz_61_pan_jun_daughter',
  zhongJi: 'source:sg:seventh_audit_batch_2_sgz_59_zhong_ji',
  zhangConsort: 'source:sg:seventh_audit_batch_2_sgz_59_zhang_consort',
  yuanLady: 'source:sg:seventh_audit_batch_2_wulu_yuan_lady',
} as const;

const seeds: readonly PersonSeed[] = [
  {
    slug: 'qinghe_princess',
    name: '清河公主',
    otherNames: ['清河长公主'],
    sourceIds: [sourceIds.qinghe, sourceIds.qingheMother],
    visualFaction: 'wei',
    description: '曹操与刘夫人之女，嫁夏侯楙；史书未载本名。',
  },
  {
    slug: 'lady_xiahou_zhang_fei',
    name: '夏侯氏',
    otherNames: ['夏侯霸从妹', '张飞妻'],
    sourceIds: [sourceIds.xiahou],
    visualFaction: 'wei',
    description: '夏侯霸从妹，裴注引《魏略》载张飞以之为妻；本名不详。',
  },
  {
    slug: 'anyang_princess',
    name: '安阳公主',
    sourceIds: [sourceIds.anyang],
    visualFaction: 'wei',
    description: '曹操之女，嫁荀彧长子荀恽；史书未载本名。',
  },
  {
    slug: 'lady_cao_ji_kang',
    name: '曹氏',
    otherNames: ['曹林孙女', '嵇康妻'],
    sourceIds: [sourceIds.caoLinGranddaughter],
    visualFaction: 'wei',
    description: '曹林之子的女儿、嵇康之妻；本名及父名不详。',
  },
  {
    slug: 'dongxiang_princess',
    name: '东乡公主',
    sourceIds: [sourceIds.zhenWomen],
    visualFaction: 'wei',
    description: '曹丕与甄皇后之女；史书未载本名。',
  },
  {
    slug: 'pingyuan_yi_princess',
    name: '平原懿公主',
    otherNames: ['曹淑', '淑'],
    sourceIds: [sourceIds.zhenWomen],
    visualFaction: 'wei',
    description: '曹叡之女曹淑，早薨后追封平原懿公主。',
  },
  {
    slug: 'lady_yu_cao_rui',
    name: '虞氏',
    otherNames: ['河内虞氏', '曹叡虞妃'],
    sourceIds: [sourceIds.yuLady],
    visualFaction: 'wei',
    description: '曹叡为平原王时所纳之妃；本名不详。',
  },
  {
    slug: 'empress_bian_cao_mao',
    name: '高贵乡公皇后',
    otherNames: ['卞皇后', '卞氏', '卞隆女'],
    sourceIds: [sourceIds.bianEmpresses],
    visualFaction: 'wei',
    description: '卞隆之女、曹髦皇后；本名不详。',
  },
  {
    slug: 'empress_bian_cao_huan',
    name: '陈留王皇后',
    otherNames: ['卞皇后', '卞氏', '卞琳女'],
    sourceIds: [sourceIds.bianEmpresses],
    visualFaction: 'wei',
    description: '卞琳之女、曹奂皇后；本名不详。',
  },
  {
    slug: 'empress_zhen_cao_fang',
    name: '齐王皇后',
    otherNames: ['甄皇后', '甄氏', '甄俨孙女'],
    sourceIds: [sourceIds.zhenWomen],
    visualFaction: 'wei',
    description: '甄俨孙女、曹芳皇后；本名不详。',
  },
  {
    slug: 'lady_wang_liu_xuan',
    name: '王贵人',
    sourceIds: [sourceIds.wangGuiren],
    visualFaction: 'shu',
    description: '敬哀张皇后侍人、刘璿生母；本名不详。',
  },
  {
    slug: 'lady_fei_liu_xuan',
    name: '费氏',
    otherNames: ['费祎长女', '刘璿妃'],
    sourceIds: [sourceIds.feiDaughter],
    visualFaction: 'shu',
    description: '费祎长女，嫁后主太子刘璿；本名不详。',
  },
  {
    slug: 'lady_zhuge_zhang_cheng',
    name: '诸葛氏',
    otherNames: ['诸葛瑾女', '张承妻'],
    sourceIds: [sourceIds.zhangFamily],
    visualFaction: 'wu',
    description: '诸葛瑾之女、张承之妻；本名不详。',
  },
  {
    slug: 'lady_sun_gu_shao',
    name: '孙氏',
    otherNames: ['孙策女', '顾邵妻'],
    sourceIds: [sourceIds.guShao],
    visualFaction: 'wu',
    description: '孙策之女、顾邵之妻；本名不详。',
  },
  {
    slug: 'lady_sun_lu_xun',
    name: '孙氏',
    otherNames: ['孙策女', '陆逊妻'],
    sourceIds: [sourceIds.luXun],
    visualFaction: 'wu',
    description: '孙策之女、陆逊之妻；本名不详。',
  },
  {
    slug: 'lady_sun_luo_tong',
    name: '孙氏',
    otherNames: ['孙辅女', '骆统妻'],
    sourceIds: [sourceIds.luoTong],
    visualFaction: 'wu',
    description: '孙辅之女、骆统之妻；本名不详。',
  },
  {
    slug: 'lady_pan_sun_lu',
    name: '潘氏',
    otherNames: ['潘濬女', '孙虑妻'],
    sourceIds: [sourceIds.panDaughter],
    visualFaction: 'wu',
    description: '潘濬之女，嫁建昌侯孙虑；本名不详。',
  },
  {
    slug: 'zhong_ji',
    name: '仲姬',
    sourceIds: [sourceIds.zhongJi],
    visualFaction: 'wu',
    description: '孙权后宫女性、孙奋生母；本名不详。',
  },
  {
    slug: 'consort_zhang_sun_he',
    name: '张妃',
    otherNames: ['张氏', '孙和妃', '张承女'],
    sourceIds: [sourceIds.zhangFamily, sourceIds.zhangConsort],
    visualFaction: 'wu',
    description: '张承之女、孙和之妃；孙和被赐死时随之自杀。',
  },
  {
    slug: 'lady_yuan_sun_quan',
    name: '袁夫人',
    otherNames: ['袁氏', '袁术女'],
    sourceIds: [sourceIds.yuanLady],
    visualFaction: 'wu',
    description: '袁术之女，裴注引《吴录》载为孙权夫人；本名不详。',
  },
];

export const seventhSourceAuditBatchTwoPersons: Person[] = seeds.map(person);
