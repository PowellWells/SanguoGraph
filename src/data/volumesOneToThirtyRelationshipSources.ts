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
    note: `卷一至三十孤立人物关系复核；本地史料索引 revision ${seed.revisionId} 已核对。${
      historicalLayer === 'annotated_history'
        ? '材料位于裴松之注，关系保持较可信、待复核。'
        : '材料位于《三国志》正文。'
    }`,
  };
}

export const volumesOneToThirtyRelationshipSources: HistoricalSource[] = [
  source({
    id: 'source:sg:volumes_01_30_sgz_05_mao_empress',
    volume: 5,
    revisionId: 2086290,
    section: '卷五·魏书五·明悼毛皇后传',
    quotation:
      '明悼毛皇后，河内人也。黄初中，以选入东宫，明帝时为平原王，进御有宠。及即帝立，以为贵嫔。太和元年，立为皇后。',
  }),
  source({
    id: 'source:sg:volumes_01_30_sgz_05_guo_empress',
    volume: 5,
    revisionId: 2086290,
    section: '卷五·魏书五·明元郭皇后传',
    quotation:
      '明元郭皇后，西平人也。明帝即位，甚见爱幸，拜为夫人。帝疾困，遂立为皇后。',
  }),
  source({
    id: 'source:sg:volumes_01_30_sgz_12_he_zeng',
    volume: 12,
    revisionId: 2085067,
    section: '卷十二·魏书十二·何夔传·子何曾',
    quotation: '薨，谥曰靖侯。子曾嗣，咸熙中为司徒。',
  }),
  source({
    id: 'source:sg:volumes_01_30_sgz_12_sima_qi',
    volume: 12,
    revisionId: 2085067,
    section: '卷十二·魏书十二·司马芝传·子司马岐',
    quotation: '芝亡，子岐嗣，从河南丞转廷尉正，迁陈留相。',
  }),
  source({
    id: 'source:sg:volumes_01_30_sgz_15_liu_jing',
    volume: 15,
    revisionId: 2085075,
    section: '卷十五·魏书十五·刘馥传·子刘靖',
    quotation:
      '馥子靖，黄初中从黄门侍郎迁庐江太守，诏曰：“卿父昔为彼州，今卿复据此郡，可谓克负荷者也。”',
  }),
  source({
    id: 'source:sg:volumes_01_30_sima_biao_15_sima_brothers',
    volume: 15,
    revisionId: 2085075,
    section: '裴松之注引司马彪《序传》·司马朗兄弟',
    quotation: '有子八人，朗最长，次即晋宣皇帝也。',
    historicalLayer: 'annotated_history',
    work: '司马彪序传',
    author: '司马彪',
    reference: '裴松之注引司马彪《序传》，见《三国志》卷十五《司马朗传》',
  }),
  source({
    id: 'source:sg:volumes_01_30_sgz_16_du_shu',
    volume: 16,
    revisionId: 2610840,
    section: '卷十六·魏书十六·杜畿传·子杜恕',
    quotation: '追赠太仆，谥曰戴侯。子恕嗣。',
  }),
  source({
    id: 'source:sg:volumes_01_30_weilue_19_ding_brothers',
    volume: 19,
    revisionId: 2347417,
    section: '裴松之注引《魏略》·丁仪丁廙兄弟',
    quotation: '廙字敬礼，仪之弟也。',
    historicalLayer: 'annotated_history',
    work: '魏略',
    author: '鱼豢',
    reference: '裴松之注引《魏略》，见《三国志》卷十九《陈思王曹植传》',
  }),
  source({
    id: 'source:sg:volumes_01_30_sgz_21_ruan_ji',
    volume: 21,
    revisionId: 2333888,
    section: '卷二十一·魏书二十一·王卫二刘傅传·阮籍附传',
    quotation: '瑀子籍，才藻艳逸，而倜傥放荡，行己寡欲，以庄周为模则。',
  }),
];
