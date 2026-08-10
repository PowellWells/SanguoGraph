import type { HistoricalSource } from '../domain';

interface SourceSeed {
  id: string;
  section: string;
  quotation: string;
}

function source(seed: SourceSeed): HistoricalSource {
  return {
    id: seed.id,
    work: '三国志',
    section: `卷20·${seed.section}`,
    author: '陈寿',
    commentator: '裴松之',
    quotation: seed.quotation,
    reference: `《三国志》卷20《${seed.section}》`,
    url: 'https://zh.wikisource.org/wiki/三國志/卷20',
    sourceType: 'primary',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    note: '第六批列传名册关系补录第一批的正史正文来源。',
  };
}

export const sixthRosterRelationshipBatchOneSources: HistoricalSource[] = [
  source({
    id: 'source:sg:sixth_roster_batch_1_sgz_20_cao_cao_sons',
    section: '魏书二十·武文世王公传·武帝诸子',
    quotation:
      '武皇帝二十五男：卞皇后生文皇帝、任城威王彰、陈思王植、萧怀王熊；刘夫人生丰愍王昂、相殇王铄；环夫人生邓哀王冲、彭城王据、燕王宇；杜夫人生沛穆王林、中山恭王衮；秦夫人生济阳怀王玹、陈留恭王峻；尹夫人生范阳闵王矩；王昭仪生赵王干；孙姬生临邑殇公子上、楚王彪、刚殇公子勤；李姬生谷城殇公子乘、郿戴公子整、灵殇公子京；周姬生樊安公均；刘姬生广宗殇公子棘；宋姬生东平灵王徽；赵姬生乐陵王茂。',
  }),
  source({
    id: 'source:sg:sixth_roster_batch_1_sgz_20_cao_pi_sons',
    section: '魏书二十·武文世王公传·文帝诸子',
    quotation:
      '文皇帝九男：甄氏皇后生明帝，李贵人生赞哀王协，潘淑媛生北海悼王蕤，朱淑媛生东武阳怀王鉴，仇昭仪生东海定王霖，徐姬生元城哀王礼，苏姬生邯郸怀王邕，张姬生清河悼王贡，宋姬生广平哀王俨。',
  }),
];
