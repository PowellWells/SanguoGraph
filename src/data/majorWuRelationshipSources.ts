import type { HistoricalSource } from '../domain';

interface SourceSeed {
  id: string;
  volume: number;
  section: string;
  quotation: string;
}

function source(seed: SourceSeed): HistoricalSource {
  return {
    id: seed.id,
    work: '三国志',
    section: `卷${seed.volume}·${seed.section}`,
    author: '陈寿',
    commentator: '裴松之',
    quotation: seed.quotation,
    reference: `《三国志》卷${seed.volume}《${seed.section}》`,
    url: null,
    sourceType: 'primary',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    note: '第二批吴系关系补录的正史正文来源；只支持引文直接记载或同段谱系可界定推出的关系。',
  };
}

export const majorWuRelationshipSources: HistoricalSource[] = [
  source({ id: 'source:sg:major_wu_sgz_50', volume: 50, section: '吴书·妃嫔传·步夫人', quotation: '生二女，长曰鲁班……前配周瑜子循，后配全琮。' }),
  source({ id: 'source:sg:major_wu_sgz_51', volume: 51, section: '吴书·宗室传', quotation: '孙静字幼台，坚季弟也……有五子，暠、瑜、皎、奂、谦。暠三子：绰、超、恭。恭生峻，绰生綝。' }),
  source({ id: 'source:sg:major_wu_sgz_52', volume: 52, section: '吴书·张顾诸葛步传', quotation: '长子承已自封侯，少子休袭爵……昭弟子奋……雍长子邵……邵子谭、承……瑾子恪……弟融袭爵。' }),
  source({ id: 'source:sg:major_wu_sgz_55', volume: 55, section: '吴书·程黄韩蒋周陈董甘凌徐潘丁传', quotation: '陈表，武庶子也。' }),
  source({ id: 'source:sg:major_wu_sgz_56', volume: 56, section: '吴书·朱治朱然吕范朱桓传', quotation: '朱然，治姊子也，本姓施氏……治未有子，启策乞以为嗣……然卒，子绩嗣……范次子据嗣……桓卒，子异嗣。' }),
  source({ id: 'source:sg:major_wu_sgz_57', volume: 57, section: '吴书·虞陆张骆陆吾朱传', quotation: '翻有十一子。第四子汜最知名。' }),
  source({ id: 'source:sg:major_wu_sgz_61', volume: 61, section: '吴书·潘濬陆凯传', quotation: '陆凯字敬风，吴郡吴人，丞相逊族子也。' }),
];
