import type { HistoricalLayer, HistoricalSource } from '../domain';

interface SourceSeed {
  id: string;
  volume: 42 | 49 | 50;
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
    note: `卷三十一至五十孤立人物关系复核；本地史料索引 revision ${seed.revisionId} 已核对。${
      historicalLayer === 'annotated_history'
        ? '材料位于裴松之注，关系保持较可信、待复核。'
        : '材料位于《三国志》正文。'
    }`,
  };
}

export const volumesThirtyOneToFiftyRelationshipSources: HistoricalSource[] = [
  source({
    id: 'source:sg:volumes_31_50_pei_42_qiao_zhou_qiao_xiu',
    volume: 42,
    revisionId: 2589674,
    section: '裴松之注·谯周之孙谯秀',
    quotation: '周长子熙。熙子秀，字元彦。',
    historicalLayer: 'annotated_history',
    work: '裴松之注',
    author: '裴松之',
    reference: '裴松之注，见《三国志》卷四十二《谯周传》',
  }),
  source({
    id: 'source:sg:volumes_31_50_sgz_49_liu_ji',
    volume: 49,
    revisionId: 2075209,
    section: '卷四十九·吴书四·刘繇传·子刘基',
    quotation: '繇长子基，字敬舆。',
  }),
  source({
    id: 'source:sg:volumes_31_50_sgz_50_xie_lady',
    volume: 50,
    revisionId: 2085144,
    section: '卷五十·吴书五·吴主权谢夫人传',
    quotation:
      '吴主权谢夫人，会稽山阴人也。……权母吴，为权聘以为妃，爱幸有宠。',
  }),
  source({
    id: 'source:sg:volumes_31_50_sgz_50_quan_lady',
    volume: 50,
    revisionId: 2085144,
    section: '卷五十·吴书五·孙亮全夫人传',
    quotation:
      '孙亮全夫人，全尚女也。……乃劝权为潘氏男亮纳夫人，亮遂为嗣。夫人立为皇后。',
  }),
  source({
    id: 'source:sg:volumes_31_50_sgz_50_zhu_lady',
    volume: 50,
    revisionId: 2085144,
    section: '卷五十·吴书五·孙休朱夫人传',
    quotation:
      '孙休朱夫人，朱据女，休姊公主所生也。……赤乌末，权为休纳以为妃。……永安五年，立夫人为皇后。',
  }),
  source({
    id: 'source:sg:volumes_31_50_sgz_50_he_lady',
    volume: 50,
    revisionId: 2085144,
    section: '卷五十·吴书五·孙和何姬传',
    quotation:
      '孙和何姬，丹杨句容人也。……命宦者召入，以赐子和。生男，权喜。名之曰彭祖，即皓也。',
  }),
  source({
    id: 'source:sg:volumes_31_50_sgz_50_teng_lady',
    volume: 50,
    revisionId: 2085144,
    section: '卷五十·吴书五·孙皓滕夫人传',
    quotation:
      '孙皓滕夫人，故太常胤之族女也。……皓既封乌程侯，聘牧女为妃。皓即位，立为皇后。',
  }),
];
