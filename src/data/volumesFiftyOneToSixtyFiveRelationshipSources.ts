import type { HistoricalLayer, HistoricalSource } from '../domain';

interface SourceSeed {
  id: string;
  volume: 50 | 53 | 57 | 61 | 65;
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
    url: `https://zh.wikisource.org/wiki/三國志/卷${seed.volume}`,
    sourceType: 'primary',
    historicalLayer,
    reviewStatus: 'verified',
    note: `卷五十一至六十五孤立人物关系复核；本地史料索引 revision ${seed.revisionId} 已核对。${
      historicalLayer === 'annotated_history'
        ? '材料位于裴松之注所引《吴书》，关系保持较可信、待复核。'
        : '材料位于《三国志》正文。'
    }`,
  };
}

export const volumesFiftyOneToSixtyFiveRelationshipSources: HistoricalSource[] =
  [
    source({
      id: 'source:sg:volumes_51_65_sgz_53_xue_zong_xue_ying',
      volume: 53,
      revisionId: 2086397,
      section: '卷五十三·吴书八·薛综传·子薛莹',
      quotation:
        '珝弟莹，字道言。……建衡三年，皓追叹莹父综遗文，且命莹继作。',
    }),
    source({
      id: 'source:sg:volumes_51_65_sgz_57_lu_mao_family',
      volume: 57,
      revisionId: 2638131,
      section: '卷五十七·吴书十二·陆瑁传',
      quotation:
        '陆瑁字子璋，丞相逊弟也。……又瑁从父绩早亡，二男一女，皆数岁以还，瑁迎摄养。',
    }),
    source({
      id: 'source:sg:volumes_51_65_sgz_50_sun_luyu_zhu_ju',
      volume: 50,
      revisionId: 2085144,
      section: '卷五十·吴书五·步夫人传',
      quotation:
        '生二女，长曰鲁班……少曰鲁育，字小虎，前配朱据，后配刘纂。',
    }),
    source({
      id: 'source:sg:volumes_51_65_sgz_61_lu_yin_lu_kai',
      volume: 61,
      revisionId: 2085162,
      section: '卷六十一·吴书十六·陆凯传·弟陆胤',
      quotation: '胤字敬宗，凯弟也。',
    }),
    source({
      id: 'source:sg:volumes_51_65_pei_65_he_shao_he_qi',
      volume: 65,
      revisionId: 2589669,
      section: '裴松之注·贺邵世系',
      quotation: '《吴书》曰：邵，贺齐之孙，景之子。',
      historicalLayer: 'annotated_history',
      work: '裴松之注所引《吴书》',
      author: null,
      reference: '裴松之注所引《吴书》，见《三国志》卷六十五《贺邵传》',
    }),
  ];
