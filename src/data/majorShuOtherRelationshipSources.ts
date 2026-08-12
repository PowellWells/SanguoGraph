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
    note: '第三批蜀系与其他主要人物关系补录的正史正文来源。',
  };
}

export const majorShuOtherRelationshipSources: HistoricalSource[] = [
  source({ id: 'source:sg:major_shu_other_sgz_06', volume: 6, section: '魏书·董二袁刘传', quotation: '袁术字公路，司空逢子，绍之从弟也……表及妻爱少子琮，欲以为后。' }),
  source({ id: 'source:sg:major_shu_other_sgz_08', volume: 8, section: '魏书·二公孙陶四张传', quotation: '度死，子康嗣位……康死，子晃、渊等皆小。' }),
  source({ id: 'source:sg:major_shu_other_sgz_31', volume: 31, section: '蜀书·刘二牧传', quotation: '时焉子范……璋为奉车都尉……焉死，子璋代为刺史。' }),
  source({ id: 'source:sg:major_shu_other_sgz_36', volume: 36, section: '蜀书·关张马黄赵传', quotation: '马超字孟起……父腾。' }),
  source({ id: 'source:sg:major_shu_other_sgz_39', volume: 39, section: '蜀书·董刘马陈董吕传', quotation: '良弟谡，字幼常……董允字休昭，掌军中郎将和之子也。' }),
  source({ id: 'source:sg:major_shu_other_sgz_40', volume: 40, section: '蜀书·刘彭廖李刘魏杨传', quotation: '刘封者，本罗侯寇氏之子……先主以未有继嗣，养封为子。' }),
];
