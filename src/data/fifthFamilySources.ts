import type { HistoricalLayer, HistoricalSource } from '../domain';

function source(
  id: string,
  section: string,
  quotation: string,
  reference: string,
  url: string,
  historicalLayer: HistoricalLayer = 'official_history',
): HistoricalSource {
  return {
    id,
    work: historicalLayer === 'annotated_history' ? '蜀世谱' : '三国志',
    section,
    author: historicalLayer === 'annotated_history' ? null : '陈寿',
    commentator: '裴松之',
    quotation,
    reference,
    url,
    sourceType: 'primary',
    historicalLayer,
    reviewStatus: 'verified',
    note:
      historicalLayer === 'annotated_history'
        ? '第五批蜀系家庭扩展的裴注层史料；只作较可信关系依据，并以前端虚线表达。'
        : '第五批蜀系家庭扩展的正文层关系级史料；只支持本条明确记载的家庭身份。',
  };
}

export const fifthFamilySources: HistoricalSource[] = [
  source(
    'source:sg:fifth_family_sgz_34_shu_house',
    '卷三十四·蜀书四·二主妃子传',
    '後主敬哀皇后，車騎將軍張飛長女也。……後主張皇后，前后敬哀之妹也。……後主太子璿，字文衡。……子哀王胤嗣……其以武邑侯輯襲王位。',
    '《三国志》卷三十四《蜀书四·二主妃子传》',
    'https://zh.wikisource.org/wiki/三國志/卷34',
  ),
  source(
    'source:sg:fifth_family_shushipu_liu_shan_sons',
    '裴松之注引《蜀世谱》·刘禅诸子',
    '璿弟，瑤、琮、瓚、諶、恂、璩六人。',
    '裴松之注引《蜀世谱》，见《三国志》卷三十四',
    'https://zh.wikisource.org/wiki/三國志/卷34',
    'annotated_history',
  ),
  source(
    'source:sg:fifth_family_sgz_35_zhuge_house',
    '卷三十五·蜀书五·诸葛亮传',
    '初，亮未有子，求喬為嗣……子攀……攀子顯等。……瞻長子尚……次子京。',
    '《三国志》卷三十五《蜀书五·诸葛亮传》',
    'https://zh.wikisource.org/wiki/三國志/卷35',
  ),
  source(
    'source:sg:fifth_family_sgz_37_pang_fa_houses',
    '卷三十七·蜀书七·庞统法正传',
    '統子宏，字巨師。……賜子邈爵關内侯。',
    '《三国志》卷三十七《蜀书七·庞统法正传》',
    'https://zh.wikisource.org/wiki/三國志/卷37',
  ),
  source(
    'source:sg:fifth_family_sgz_38_xu_mi_houses',
    '卷三十八·蜀书八·许糜孙简伊秦传',
    '子欽，先靖夭沒。欽子游……子威，官至虎賁中郎將。威子照，虎騎監。',
    '《三国志》卷三十八《蜀书八·许糜孙简伊秦传》',
    'https://zh.wikisource.org/wiki/三國志/卷38',
  ),
  source(
    'source:sg:fifth_family_sgz_39_ma_house',
    '卷三十九·蜀书九·董刘马陈董吕传',
    '先主拜良子秉為騎都尉。',
    '《三国志》卷三十九《蜀书九·董刘马陈董吕传》',
    'https://zh.wikisource.org/wiki/三國志/卷39',
  ),
  source(
    'source:sg:fifth_family_sgz_41_huo_xiang_houses',
    '卷四十一·蜀书十一·霍王向张杨费传',
    '子弋，字紹先。……朗兄子寵……寵弟充。',
    '《三国志》卷四十一《蜀书十一·霍王向张杨费传》',
    'https://zh.wikisource.org/wiki/三國志/卷41',
  ),
  source(
    'source:sg:fifth_family_sgz_43_shu_generals',
    '卷四十三·蜀书十三·黄李吕马王张传',
    '子邕嗣。……權留蜀子崇……子遺嗣。……子脩嗣。……子訓嗣。……封長子瑛西鄉侯。',
    '《三国志》卷四十三《蜀书十三·黄李吕马王张传》',
    'https://zh.wikisource.org/wiki/三國志/卷43',
  ),
  source(
    'source:sg:fifth_family_sgz_45_deng_house',
    '卷四十五·蜀书十五·邓张宗杨传',
    '子良，襲爵，景耀中為尚書左選郎，晉朝廣漢太守。',
    '《三国志》卷四十五《蜀书十五·邓张宗杨传》',
    'https://zh.wikisource.org/wiki/三國志/卷45',
  ),
];
