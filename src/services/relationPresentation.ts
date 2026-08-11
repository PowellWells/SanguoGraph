import type {
  Person,
  Relation,
  RelationClaim,
  RelationType,
} from '../domain';

export const relationTypeLabels: Readonly<Record<RelationType, string>> = {
  father_of: '父亲与子女',
  mother_of: '母亲与子女',
  spouse_of: '配偶',
  adoptive_father_of: '养父与子女',
  adoptive_mother_of: '养母与子女',
  clan_relative_of: '宗族／姻亲',
};

interface PerspectiveLabels {
  source: string;
  target: string;
}

const clanPerspectiveLabels: Readonly<Record<string, PerspectiveLabels>> = {
  'relation:sg:cao_cao_clan_cao_ren': {
    source: '从弟',
    target: '从兄',
  },
  'relation:sg:cao_cao_clan_cao_hong': {
    source: '从弟',
    target: '从兄',
  },
  'relation:sg:cao_cao_clan_cao_xiu': {
    source: '族子',
    target: '宗族长辈',
  },
  'relation:sg:cao_cao_clan_cao_zhen': {
    source: '族子',
    target: '宗族长辈',
  },
  'relation:sg:xiahou_dun_clan_xiahou_yuan': {
    source: '族弟',
    target: '族兄',
  },
  'relation:sg:xiahou_yuan_clan_xiahou_shang': {
    source: '从子',
    target: '宗族长辈',
  },
  'relation:sg:cao_shuang_clan_xiahou_xuan': {
    source: '姑表亲',
    target: '姑表亲',
  },
  'relation:sg:cao_ren_clan_cao_chun': {
    source: '弟弟',
    target: '哥哥',
  },
  'relation:sg:cao_zhen_clan_cao_bin': {
    source: '弟弟',
    target: '哥哥',
  },
  'relation:sg:xiang_lang_clan_xiang_chong': {
    source: '侄子',
    target: '叔父',
  },
  'relation:sg:xiang_chong_clan_xiang_chong_younger': {
    source: '弟弟',
    target: '哥哥',
  },
  'relation:sg:major_wei_xun_yu_clan_xun_you': {
    source: '从子',
    target: '从父',
  },
  'relation:sg:major_wei_cui_yan_clan_cui_lin': {
    source: '从弟',
    target: '从兄',
  },
  'relation:sg:major_wei_cheng_yu_clan_cheng_xiao': {
    source: '孙',
    target: '祖父',
  },
  'relation:sg:major_wu_sun_jing_clan_sun_jian': { source: '兄长', target: '弟弟' },
  'relation:sg:major_wu_sun_jing_clan_sun_jun': { source: '曾孙', target: '曾祖父' },
  'relation:sg:major_wu_sun_jing_clan_sun_chen': { source: '曾孙', target: '曾祖父' },
  'relation:sg:major_wu_sun_ben_clan_sun_fu': { source: '弟弟', target: '哥哥' },
  'relation:sg:major_wu_sun_ben_clan_sun_jian': { source: '叔父', target: '侄子' },
  'relation:sg:major_wu_sun_shao_clan_sun_huan': { source: '从兄弟', target: '从兄弟' },
  'relation:sg:major_wu_zhang_zhao_clan_zhang_fen': { source: '侄子', target: '伯父' },
  'relation:sg:major_wu_zhuge_jin_clan_zhuge_liang': { source: '弟弟', target: '哥哥' },
  'relation:sg:major_wu_lu_xun_clan_lu_kai': { source: '族子', target: '宗族长辈' },
  'relation:sg:major_shu_other_ma_liang_clan_ma_su': { source: '弟弟', target: '哥哥' },
  'relation:sg:major_shu_other_yuan_shao_clan_yuan_shu': { source: '从弟', target: '从兄' },
  'relation:sg:major_shu_other_gongsun_du_clan_gongsun_yuan': { source: '孙子', target: '祖父' },
  'relation:sg:major_roster_second_pass_liu_xie_clan_cao_cao': {
    source: '岳父',
    target: '女婿',
  },
  'relation:sg:major_roster_second_pass_zhang_xiu_clan_cao_jun': {
    source: '女婿',
    target: '岳父',
  },
  'relation:sg:major_roster_second_pass_zhang_lu_clan_cao_yu': {
    source: '女婿',
    target: '岳父',
  },
  'relation:sg:major_roster_second_pass_guo_huai_clan_wang_ling': {
    source: '妻兄',
    target: '妹夫',
  },
  'relation:sg:major_roster_second_pass_wang_ling_clan_wang_yun': {
    source: '叔父',
    target: '侄子',
  },
  'relation:sg:volumes_01_30_sima_lang_clan_sima_yi': {
    source: '弟弟',
    target: '兄长',
  },
  'relation:sg:volumes_01_30_ding_yi_clan_ding_yi_younger': {
    source: '弟弟',
    target: '兄长',
  },
  'relation:sg:volumes_31_50_qiao_zhou_clan_qiao_xiu': {
    source: '孙子',
    target: '祖父',
  },
};

function childLabel(person: Person | undefined, adoptive: boolean): string {
  if (person?.gender === 'male') {
    return adoptive ? '养子' : '儿子';
  }
  if (person?.gender === 'female') {
    return adoptive ? '养女' : '女儿';
  }
  return adoptive ? '养子女' : '子女';
}

/**
 * Returns the kinship term from one endpoint's point of view without changing
 * the canonical, source-to-target relation stored in the data layer.
 */
export function getPerspectiveRelationLabel(
  relation: Relation,
  perspectivePerson: Person,
  otherPerson: Person | undefined,
): string {
  const isSource = relation.sourcePersonId === perspectivePerson.id;
  const isTarget = relation.targetPersonId === perspectivePerson.id;

  if (!isSource && !isTarget) {
    return relationTypeLabels[relation.type];
  }

  switch (relation.type) {
    case 'father_of':
      return isSource ? childLabel(otherPerson, false) : '父亲';
    case 'mother_of':
      return isSource ? childLabel(otherPerson, false) : '母亲';
    case 'adoptive_father_of':
      return isSource ? childLabel(otherPerson, true) : '养父';
    case 'adoptive_mother_of':
      return isSource ? childLabel(otherPerson, true) : '养母';
    case 'spouse_of':
      if (otherPerson?.gender === 'male') {
        return '丈夫';
      }
      if (otherPerson?.gender === 'female') {
        return '妻子';
      }
      return '配偶';
    case 'clan_relative_of': {
      const labels = clanPerspectiveLabels[relation.id];
      return labels ? (isSource ? labels.source : labels.target) : '宗族／姻亲';
    }
  }
}

export const certaintyLabels = {
  confirmed: '已确认',
  probable: '较可信',
  disputed: '存疑',
  fictional: '文学关系',
} as const;

export const reviewStatusLabels = {
  pending_review: '待核验',
  verified: '已核验',
} as const;

export const relationOriginLabels = {
  recorded: '正式史料记录',
  candidate: '外部候选线索',
  derived: '程序派生关系',
} as const;

export const evidenceBasisLabels = {
  direct_record: '史料直接记载',
  indirect_inference: '依据史料间接推定',
  editor_inference: '编辑者推断',
  structured_candidate: '开放知识库候选',
} as const;

export const disputeStatusLabels = {
  none_recorded: '当前未登记反对材料',
  not_assessed: '尚未评估',
  disputed: '存在争议',
  conflicting: '史料互有冲突',
  rejected: '已否定',
} as const;

export const decisionStatusLabels = {
  candidate: '候选',
  pending_review: '待核验',
  confirmed: '已确认',
  disputed: '存疑',
  rejected: '已否定',
} as const;

const claimOverrides: Readonly<Record<string, Partial<RelationClaim>>> = {
  'relation:sg:cao_cao_spouse_lady_ding': {
    periodLabel: '建安初年以前；起始年份不详，后被废',
    relationshipQualifier: '早期正室',
    evidenceBasis: 'direct_record',
    modernInterpretation:
      '《后妃传》记“丁夫人废”，并以卞氏“继室”承接，可判断丁夫人为曹操此前的正式配偶。',
  },
  'relation:sg:cao_cao_spouse_empress_bian': {
    periodLabel: '建安初年起；终止时间不详',
    relationshipQualifier: '继室，后为武宣皇后',
    evidenceBasis: 'direct_record',
    modernInterpretation:
      '《后妃传》直接称卞氏在丁夫人被废后成为“继室”，并非仅由子女关系反推。',
  },
  'relation:sg:cao_cao_spouse_lady_liu': {
    periodLabel: '东汉末年；具体起止时间不详',
    relationshipQualifier: '夫人；具体位序未见当前史料明确说明',
    evidenceBasis: 'indirect_inference',
    modernInterpretation:
      '史书以“刘夫人”称之，并记其生曹昂。项目据这一母子记载及篇章语境表达其与曹操的配偶关系，不进一步判定为正妻、继室或妾室。',
  },
  'relation:sg:cao_cao_spouse_lady_huan': {
    periodLabel: '东汉末年；具体起止时间不详',
    relationshipQualifier: '夫人；具体位序未见当前史料明确说明',
    evidenceBasis: 'indirect_inference',
    modernInterpretation:
      '《武文世王公传》记“环夫人生”曹冲、曹据、曹宇。项目据母子记载及篇章语境表达其与曹操的配偶关系，不将“夫人”进一步等同为正妻、继室或妾室。',
  },
  'relation:sg:lady_ding_adoptive_mother_cao_ang': {
    periodLabel: '东汉末年；具体收养年份不详',
    relationshipQualifier: '养母子',
    evidenceBasis: 'direct_record',
    modernInterpretation:
      '裴松之注引《魏略》直接记“丁养子脩”；这是注引材料中的直接表述，与《三国志》正文分层展示。',
  },
};

function defaultPeriod(relation: Relation, target: Person | undefined): string {
  if (relation.origin === 'candidate') {
    return '未核验；时间不详';
  }

  if (
    relation.type === 'father_of' ||
    relation.type === 'mother_of'
  ) {
    return target?.birthYear
      ? `自${target.birthYear}年出生起；亲属身份为终身关系`
      : '东汉末年；子女出生年份不详';
  }

  if (
    relation.type === 'adoptive_father_of' ||
    relation.type === 'adoptive_mother_of'
  ) {
    return '东汉时期；收养发生年份不详';
  }

  return '东汉末年；具体起止时间不详';
}

function defaultQualifier(
  relation: Relation,
  target: Person | undefined,
): string {
  const childGenderSuffix =
    target?.gender === 'male'
      ? '子'
      : target?.gender === 'female'
        ? '女'
        : '子女';

  switch (relation.type) {
    case 'father_of':
      return `父${childGenderSuffix}`;
    case 'mother_of':
      return `母${childGenderSuffix}`;
    case 'spouse_of':
      return '配偶；具体身份层级未登记';
    case 'adoptive_father_of':
      return `养父${childGenderSuffix}`;
    case 'adoptive_mother_of':
      return `养母${childGenderSuffix}`;
    case 'clan_relative_of':
      return '宗族关系';
  }
}

function defaultInterpretation(
  relation: Relation,
  source: Person | undefined,
  target: Person | undefined,
): string {
  if (relation.origin === 'candidate') {
    return '此关系来自开放知识库，仅用于发现线索；尚未经过正史原文核验，不能作为历史结论。';
  }

  const from = source?.name ?? '起点人物';
  const to = target?.name ?? '终点人物';
  switch (relation.type) {
    case 'father_of':
      return `已录史料将${from}记为${to}之父。`;
    case 'mother_of':
      return `已录史料将${from}记为${to}之母。`;
    case 'spouse_of':
      return `已录史料支持${from}与${to}存在配偶关系；具体身份层级以限定说明为准。`;
    case 'adoptive_father_of':
      return `已录史料将${from}记为${to}的养父。`;
    case 'adoptive_mother_of':
      return `已录史料将${from}记为${to}的养母。`;
    case 'clan_relative_of':
      return `已录史料支持${from}与${to}存在宗族关系。`;
  }
}

export function getRelationClaim(
  relation: Relation,
  persons: Person[],
): RelationClaim {
  if (relation.claim) {
    return relation.claim;
  }

  const source = persons.find(
    (person) => person.id === relation.sourcePersonId,
  );
  const target = persons.find(
    (person) => person.id === relation.targetPersonId,
  );
  const override = claimOverrides[relation.id] ?? {};

  return {
    periodLabel: override.periodLabel ?? defaultPeriod(relation, target),
    relationshipQualifier:
      override.relationshipQualifier ?? defaultQualifier(relation, target),
    evidenceBasis:
      override.evidenceBasis ??
      (relation.origin === 'candidate'
        ? 'structured_candidate'
        : relation.origin === 'derived'
          ? 'editor_inference'
          : 'direct_record'),
    modernInterpretation:
      override.modernInterpretation ??
      defaultInterpretation(relation, source, target),
    disputeStatus:
      override.disputeStatus ??
      (relation.certainty === 'disputed' ? 'disputed' : relation.origin === 'candidate' ? 'not_assessed' : 'none_recorded'),
    decisionStatus:
      override.decisionStatus ??
      (relation.origin === 'candidate'
        ? 'candidate'
        : relation.reviewStatus === 'pending_review'
          ? 'pending_review'
          : relation.certainty === 'disputed'
            ? 'disputed'
            : 'confirmed'),
    opposingSourceIds: override.opposingSourceIds ?? [],
    scholarlyViews: override.scholarlyViews ?? [],
  };
}

export function relationDirectionLabel(relation: Relation): string {
  if (relation.type === 'spouse_of') {
    return '无方向；双方互为配偶';
  }
  if (relation.type === 'clan_relative_of') {
    return '无方向；双方存在宗族或姻亲关系';
  }
  return '有方向；箭头由关系主体指向关系对象';
}
