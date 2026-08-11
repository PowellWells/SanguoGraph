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
    note: `主要人物二次复核关系级史料；本地史料索引 revision ${seed.revisionId} 已核对。${
      historicalLayer === 'annotated_history'
        ? '材料位于裴松之注，关系保持较可信、待复核。'
        : '材料位于《三国志》正文。'
    }`,
  };
}

export const majorRosterSecondPassSources: HistoricalSource[] = [
  source({
    id: 'source:sg:major_roster_second_pass_sgz_01_cao_daughters',
    volume: 1,
    revisionId: 2585429,
    section: '卷一·魏书一·武帝纪·曹操三女入宫',
    quotation: '秋七月，始建魏社稷宗庙。天子聘公三女为贵人，少者待年于国。',
  }),
  source({
    id: 'source:sg:major_roster_second_pass_sgz_08_zhang_xiu_daughter',
    volume: 8,
    revisionId: 2086403,
    section: '卷八·魏书八·张绣传·曹均娶张绣女',
    quotation: '绣至，太祖执其手，与欢宴，为子均取绣女，拜扬武将军。',
  }),
  source({
    id: 'source:sg:major_roster_second_pass_sgz_08_zhang_lu_daughter',
    volume: 8,
    revisionId: 2086403,
    section: '卷八·魏书八·张鲁传·曹宇娶张鲁女',
    quotation: '为子彭祖取鲁女。',
  }),
  source({
    id: 'source:sg:major_roster_second_pass_shiyu_26_guo_huai_wife',
    volume: 26,
    revisionId: 2085108,
    section: '裴松之注引《世语》·郭淮妻为王凌妹',
    quotation: '《世语》曰：淮妻，王凌之妹。',
    historicalLayer: 'annotated_history',
    work: '世语',
    author: null,
    reference: '裴松之注引《世语》，见《三国志》卷二十六《郭淮传》',
  }),
  source({
    id: 'source:sg:major_roster_second_pass_sgz_28_wang_ling_uncle',
    volume: 28,
    revisionId: 2386518,
    section: '卷二十八·魏书二十八·王凌传·叔父王允',
    quotation: '王凌字彦云，太原祁人也。叔父允，为汉司徒，诛董卓。',
  }),
  source({
    id: 'source:sg:major_roster_second_pass_pei_57_lu_ji_daughter',
    volume: 57,
    revisionId: 2638131,
    section: '裴松之注·陆绩女郁生嫁张温弟张白',
    quotation: '绩于郁林所生女，名曰郁生，适张温弟白。',
    historicalLayer: 'annotated_history',
    author: '裴松之',
    reference: '裴松之注，见《三国志》卷五十七《陆绩传》',
  }),
];
