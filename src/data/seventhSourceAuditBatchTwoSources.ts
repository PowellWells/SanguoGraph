import type { HistoricalLayer, HistoricalSource } from '../domain';

interface SourceSeed {
  id: string;
  volume: number;
  revisionId: number;
  section: string;
  quotation: string;
  historicalLayer?: HistoricalLayer;
  work?: string;
  author?: string | null;
  reference?: string;
}

function source(seed: SourceSeed): HistoricalSource {
  const historicalLayer = seed.historicalLayer ?? 'official_history';
  return {
    id: seed.id,
    work: seed.work ?? '三国志',
    section: seed.section,
    author: seed.author === undefined ? '陈寿' : seed.author,
    commentator: '裴松之',
    quotation: seed.quotation,
    reference:
      seed.reference ?? `《三国志》卷${seed.volume}《${seed.section}》`,
    url: null,
    sourceType: 'primary',
    historicalLayer,
    reviewStatus: 'verified',
    note: `第七批遗漏审计第二批关系级史料；本地史料索引 revision ${seed.revisionId} 已核对。${
      historicalLayer === 'annotated_history'
        ? '材料位于裴松之注，关系保持较可信、待复核。'
        : '材料位于《三国志》正文。'
    }`,
  };
}

export const seventhSourceAuditBatchTwoSources: HistoricalSource[] = [
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_09_qinghe_princess',
    volume: 9,
    revisionId: 2274283,
    section: '卷九·魏书九·夏侯惇传·清河公主',
    quotation: '初，太祖以女妻楙，即清河公主也。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_weilue_qinghe_mother',
    volume: 5,
    revisionId: 2086290,
    section: '裴松之注引《魏略》·丁夫人、刘夫人',
    quotation:
      '《魏略》曰：太祖始有丁夫人，又刘夫人生子修及清河长公主。',
    historicalLayer: 'annotated_history',
    work: '魏略',
    author: '鱼豢',
    reference: '裴松之注引《魏略》，见《三国志》卷五《武宣卞皇后传》',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_weilue_xiahou_lady',
    volume: 9,
    revisionId: 2274283,
    section: '裴松之注引《魏略》·夏侯霸从妹',
    quotation:
      '初，建安五年，时霸从妹年十三四，在本郡，出行樵采，为张飞所得。飞知其良家女，遂以为妻，产息女，为刘禅皇后。',
    historicalLayer: 'annotated_history',
    work: '魏略',
    author: '鱼豢',
    reference: '裴松之注引《魏略》，见《三国志》卷九《夏侯渊传》',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_10_anyang_princess',
    volume: 10,
    revisionId: 2274279,
    section: '卷十·魏书十·荀彧传·安阳公主',
    quotation: '太祖以女妻彧长子恽，后称安阳公主。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_jishipu_cao_lin_granddaughter',
    volume: 20,
    revisionId: 2393407,
    section: '裴松之注引《嵇氏谱》·曹林孙女',
    quotation: '案《嵇氏谱》：嵇康妻，林子之女也。',
    historicalLayer: 'annotated_history',
    work: '嵇氏谱',
    author: null,
    reference: '裴松之注引《嵇氏谱》，见《三国志》卷二十《沛穆王林传》',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_05_zhen_women',
    volume: 5,
    revisionId: 2086290,
    section: '卷五·魏书五·文昭甄皇后传·宗室女性',
    quotation:
      '及冀州平，文帝纳后于邺，有宠，生明帝及东乡公主。……太和六年，明帝爱女淑薨，追封谥淑为平原懿公主。……后兄俨孙女为齐王皇后。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_05_yu_lady',
    volume: 5,
    revisionId: 2086290,
    section: '卷五·魏书五·明悼毛皇后传·虞氏',
    quotation:
      '初，明帝为王，始纳河内虞氏为妃，帝即位，虞氏不得立为后。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_05_bian_empresses',
    volume: 5,
    revisionId: 2086290,
    section: '卷五·魏书五·武宣卞皇后传·卞氏二后',
    quotation:
      '兰子隆女为高贵乡公皇后……琳女又为陈留王皇后。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_34_wang_guiren',
    volume: 34,
    revisionId: 2085118,
    section: '卷三十四·蜀书四·后主太子璿·王贵人',
    quotation: '后主太子璿，字文衡。母王贵人，本敬哀张皇后侍人也。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_44_fei_daughter',
    volume: 44,
    revisionId: 2583397,
    section: '卷四十四·蜀书十四·费祎传·费祎长女',
    quotation: '祎长女配太子璿为妃。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_52_zhang_family',
    volume: 52,
    revisionId: 2085149,
    section: '卷五十二·吴书七·张昭传·张承家',
    quotation:
      '初，承丧妻，昭欲为索诸葛瑾女，承以相与有好，难之，权闻而劝焉，遂为婿。……生女，权为子和纳之。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_52_sun_ce_daughter_gu_shao',
    volume: 52,
    revisionId: 2085149,
    section: '卷五十二·吴书七·顾雍传·顾邵',
    quotation: '权妻以策女。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_57_sun_fu_daughter',
    volume: 57,
    revisionId: 2638131,
    section: '卷五十七·吴书十二·骆统传·孙辅女',
    quotation: '权嘉之，召为功曹，行骑都尉，妻以从兄辅女。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_58_sun_ce_daughter_lu_xun',
    volume: 58,
    revisionId: 2131313,
    section: '卷五十八·吴书十三·陆逊传·孙策女',
    quotation: '权以兄策女配逊，数访世务。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_61_pan_jun_daughter',
    volume: 61,
    revisionId: 2085162,
    section: '卷六十一·吴书十六·潘濬传·潘濬女',
    quotation: '赤乌二年，濬卒，子翥嗣。濬女配建昌侯孙虑。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_59_zhong_ji',
    volume: 59,
    revisionId: 2085159,
    section: '卷五十九·吴书十四·孙奋传·仲姬',
    quotation: '孙奋字子扬，霸弟也，母曰仲姬。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_sgz_59_zhang_consort',
    volume: 59,
    revisionId: 2085159,
    section: '卷五十九·吴书十四·孙和传·张妃',
    quotation:
      '及恪被诛，孙峻因此夺和玺绶，徙新都，又遣使者赐死。和与妃张辞别，张曰：“吉凶当相随，终不独生活也。”亦自杀。',
  }),
  source({
    id: 'source:sg:seventh_audit_batch_2_wulu_yuan_lady',
    volume: 50,
    revisionId: 2085144,
    section: '裴松之注引《吴录》·袁夫人',
    quotation:
      '《吴录》曰：袁夫人者，袁术女也，有节行而无子。权数以诸姬子与养之，辄不育。及步夫人薨，权欲立之。夫人自以无子，固辞不受。',
    historicalLayer: 'annotated_history',
    work: '吴录',
    author: null,
    reference: '裴松之注引《吴录》，见《三国志》卷五十《潘夫人传》',
  }),
];
