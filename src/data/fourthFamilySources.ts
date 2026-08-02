import type { HistoricalSource } from '../domain';

function source(
  id: string,
  section: string,
  quotation: string,
  reference: string,
  url: string,
): HistoricalSource {
  return {
    id,
    work: '三国志',
    section,
    author: '陈寿',
    commentator: '裴松之',
    quotation,
    reference,
    url,
    sourceType: 'primary',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    note: '第四批魏系家庭扩展的关系级史料；正文与裴注信息以具体关系说明区分，不外推其他亲属身份。',
  };
}

export const fourthFamilySources: HistoricalSource[] = [
  source(
    'source:sg:fourth_family_sgz_09_wei_houses',
    '卷九·魏书九·诸夏侯曹传',
    '子充嗣。……惇中子也。……淵妻，太祖内妹。長子衡……霸弟威……威弟惠……惠弟和。……子泰嗣。……仁弟純。……子馥，嗣侯。……子肇嗣。……真五子羲、训、則、彦、皑。',
    '《三国志》卷九《魏书九·诸夏侯曹传》',
    'https://zh.wikisource.org/wiki/三國志/卷09',
  ),
  source(
    'source:sg:fourth_family_sgz_17_wei_generals',
    '卷十七·魏书十七·张乐于张徐传',
    '子虎嗣。……虎爲偏將軍，薨。子統嗣。……子綝嗣。……子肇嗣。……子圭嗣。……子雄嗣。……子蓋嗣。',
    '《三国志》卷十七《魏书十七·张乐于张徐传》',
    'https://zh.wikisource.org/wiki/三國志/卷17',
  ),
  source(
    'source:sg:fourth_family_sgz_18_wei_guard_generals',
    '卷十八·魏书十八·二李臧文吕许典二庞阎传',
    '褚薨，謚曰壯侯。子儀嗣。……拜子滿爲郎中。……又賜子會等四人爵關内侯。',
    '《三国志》卷十八《魏书十八·二李臧文吕许典二庞阎传》',
    'https://zh.wikisource.org/wiki/三國志/卷18',
  ),
];
