import type { HistoricalLayer, HistoricalSource } from '../domain';

interface SourceSeed {
  id: string;
  volume: number;
  section: string;
  quotation: string;
  historicalLayer?: HistoricalLayer;
  note?: string;
}

function source(seed: SourceSeed): HistoricalSource {
  const annotated = seed.historicalLayer === 'annotated_history';
  return {
    id: seed.id,
    work: '三国志',
    section: `卷${seed.volume}·${seed.section}`,
    author: '陈寿',
    commentator: '裴松之',
    quotation: seed.quotation,
    reference: `《三国志》卷${seed.volume}《${seed.section}》`,
    url: `https://zh.wikisource.org/wiki/三國志/卷${String(seed.volume).padStart(2, '0')}`,
    sourceType: 'primary',
    historicalLayer: seed.historicalLayer ?? 'official_history',
    reviewStatus: 'verified',
    note:
      seed.note ??
      (annotated
        ? '第一批魏系关系补录的裴注层史料；只支持引文明确记载的关系。'
        : '第一批魏系关系补录的正文层史料；只支持引文明确记载的关系。'),
  };
}

export const majorWeiRelationshipSources: HistoricalSource[] = [
  source({
    id: 'source:sg:major_wei_sgz_04_cao_mao_huan',
    volume: 4,
    section: '魏书四·三少帝纪·高贵乡公与陈留王',
    quotation:
      '高贵乡公讳髦，字彦士，文帝孙，东海定王霖子也。……陈留王讳奂，字景明，武帝孙，燕王宇子也。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_09_he_yan',
    volume: 9,
    section: '魏书九·曹真传附何晏事·裴注引魏略',
    quotation: '太祖为司空时，纳晏母并收养晏。',
    historicalLayer: 'annotated_history',
    note: '裴松之注引《魏略》直书“收养”；以较可信候选表达，不外推为宗法过继。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_10_xun_house',
    volume: 10,
    section: '魏书十·荀彧荀攸传',
    quotation:
      '子恽，嗣侯。……恽早卒，子甝、霬。……荀攸字公达，彧从子也。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_13_zhong_house',
    volume: 13,
    section: '魏书十三·钟繇传',
    quotation: '太和四年，繇薨。……子毓嗣。……毓弟会，自有传。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_13_wang_house',
    volume: 13,
    section: '魏书十三·王朗传',
    quotation: '太和二年薨，谥曰成侯。子肃嗣。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_14_cheng_house',
    volume: 14,
    section: '魏书十四·程昱传',
    quotation: '分封少子延及孙晓列侯。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_14_liu_house',
    volume: 14,
    section: '魏书十四·刘晔传',
    quotation: '子寓嗣。……少子陶，亦高才而薄行，官至平原太守。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_15_jia_house',
    volume: 15,
    section: '魏书十五·贾逵传',
    quotation: '薨，谥曰肃侯。……子充嗣。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_20_cao_lin',
    volume: 20,
    section: '魏书二十·武文世王公传·东海定王霖',
    quotation: '文皇帝九男：……仇昭仪生东海定王霖。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_22_chen_house',
    volume: 22,
    section: '魏书二十二·陈群传',
    quotation: '青龙四年薨，谥曰靖侯。子泰嗣。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_24_cui_house',
    volume: 24,
    section: '魏书二十四·崔林传',
    quotation: '崔林字德儒，清河东武城人也。少时晚成，宗族莫知，惟从兄琰异之。',
  }),
  source({
    id: 'source:sg:major_wei_sgz_28_zhong_hui',
    volume: 28,
    section: '魏书二十八·钟会传',
    quotation: '钟会字士季，颍川长社人，太傅繇小子也。',
  }),
];
