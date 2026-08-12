import type { Relation, RelationClaim, RelationType } from '../domain';

interface RelationSeed {
  slug: string;
  sourcePersonId: string;
  targetPersonId: string;
  type: RelationType;
  sourceId: string;
  qualifier: string;
  interpretation: string;
}

function relation(seed: RelationSeed): Relation {
  const claim: RelationClaim = {
    periodLabel: '亲属关系；具体起止年未详',
    relationshipQualifier: seed.qualifier,
    evidenceBasis: 'direct_record',
    modernInterpretation: seed.interpretation,
    disputeStatus: 'none_recorded',
    decisionStatus: 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
  return {
    id: `relation:sg:round_05_${seed.slug}`,
    sourcePersonId: seed.sourcePersonId,
    targetPersonId: seed.targetPersonId,
    type: seed.type,
    certainty: 'confirmed',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: seed.qualifier,
    claim,
  };
}

const seeds: readonly RelationSeed[] = [
  {
    slug: 'he_jin_clan_he_yan',
    sourcePersonId: 'person:sg:he_jin',
    targetPersonId: 'person:sg:he_yan',
    type: 'clan_relative_of',
    sourceId: 'source:sg:round_05_sgz_09_he_jin_he_yan',
    qualifier: '何晏为何进之孙',
    interpretation: '正文直书“晏，何进孙也”，据此以宗族关系表达祖孙身份。',
  },
  {
    slug: 'zhang_ji_father_zhang_ji',
    sourcePersonId: 'person:sg:sgz_v15_06',
    targetPersonId: 'person:sg:sgz_v15_08',
    type: 'father_of',
    sourceId: 'source:sg:round_05_sgz_15_zhang_ji_zhang_ji',
    qualifier: '张缉为张既之子',
    interpretation: '《张既传》在张既身后直书“子缉嗣”，据此建立父子关系。',
  },
  {
    slug: 'ying_yang_clan_ying_qu',
    sourcePersonId: 'person:sg:sgz_v21_04',
    targetPersonId: 'person:sg:sgz_v21_12',
    type: 'clan_relative_of',
    sourceId: 'source:sg:round_05_sgz_21_ying_yang_ying_qu',
    qualifier: '应璩为应玚之弟',
    interpretation: '正文直书“玚弟璩”，据此建立兄弟关系。',
  },
  {
    slug: 'lady_bu_clan_bu_zhi',
    sourcePersonId: 'person:sg:lady_bu',
    targetPersonId: 'person:sg:bu_zhi',
    type: 'clan_relative_of',
    sourceId: 'source:sg:round_05_sgz_50_lady_bu_bu_zhi',
    qualifier: '步夫人与步骘同族',
    interpretation: '《步夫人传》直书其“与丞相骘同族”，据此建立宗族关系。',
  },
];

export const globalDataEvidenceAuditRelations: Relation[] = seeds.map(relation);
