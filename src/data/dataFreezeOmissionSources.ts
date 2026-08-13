import type { HistoricalSource } from '../domain';

export const dataFreezeOmissionSources: HistoricalSource[] = [
  {
    id: 'source:sg:round_06_hhs_10b_cao_daughters',
    work: '后汉书',
    section: '卷十下·皇后纪第十下·献穆曹皇后纪',
    author: '范晔',
    commentator: null,
    quotation:
      '献穆曹皇后讳节，魏公曹操之中女也。建安十八年，操进三女宪、节、华为夫人，聘以束帛玄纁五万匹，小者待年于国。十九年，并拜为贵人。及伏皇后被弑，明年，立节为皇后。……自后四十一年，魏景元元年薨，合葬禅陵，车服礼仪皆依汉制。',
    reference: '《后汉书》卷十下《皇后纪第十下·献穆曹皇后纪》',
    url: null,
    sourceType: 'primary',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    note: 'Round 6 数据冻结前具名遗漏审计；依据中华书局点校本卷十下正文核对曹宪、曹节、曹华姓名、父女身份、婚配与曹节卒年。',
  },
];
