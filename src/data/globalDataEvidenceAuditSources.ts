import type { HistoricalSource } from '../domain';

interface SourceSeed {
  id: string;
  volume: 9 | 15 | 21 | 48 | 50;
  revisionId: number;
  section: string;
  quotation: string;
}

function source(seed: SourceSeed): HistoricalSource {
  return {
    id: seed.id,
    work: '三国志',
    section: seed.section,
    author: '陈寿',
    commentator: '裴松之',
    quotation: seed.quotation,
    reference: `《三国志》卷${seed.volume}《${seed.section}》`,
    url: null,
    sourceType: 'primary',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    note: `Round 5 全局遗漏与证据审计；本地史料索引 revision ${seed.revisionId} 已核对，材料位于《三国志》正文。`,
  };
}

export const globalDataEvidenceAuditSources: HistoricalSource[] = [
  source({
    id: 'source:sg:round_05_sgz_09_he_jin_he_yan',
    volume: 9,
    revisionId: 2274283,
    section: '卷九·魏书九·曹真传附何晏事',
    quotation: '晏，何进孙也。',
  }),
  source({
    id: 'source:sg:round_05_sgz_15_zhang_ji_zhang_ji',
    volume: 15,
    revisionId: 2085075,
    section: '卷十五·魏书十五·张既传·子张缉',
    quotation: '黄初四年薨。……明帝即位，追谥曰肃侯。子缉嗣。',
  }),
  source({
    id: 'source:sg:round_05_sgz_21_ying_yang_ying_qu',
    volume: 21,
    revisionId: 2333888,
    section: '卷二十一·魏书二十一·王粲传附应璩',
    quotation: '玚弟璩，璩子贞，咸以文章显。',
  }),
  source({
    id: 'source:sg:round_05_sgz_48_sun_he_sun_hao',
    volume: 48,
    revisionId: 2085142,
    section: '卷四十八·吴书三·孙皓传',
    quotation: '孙皓字元宗，权孙，和子也，一名彭祖，字皓宗。',
  }),
  source({
    id: 'source:sg:round_05_sgz_50_lady_bu_bu_zhi',
    volume: 50,
    revisionId: 2085144,
    section: '卷五十·吴书五·步夫人传',
    quotation: '吴主权步夫人，临淮淮阴人也。与丞相骘同族。',
  }),
];
