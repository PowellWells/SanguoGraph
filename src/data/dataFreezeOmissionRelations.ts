import type { Relation, RelationClaim, RelationType } from '../domain';

const sourceId = 'source:sg:round_06_hhs_10b_cao_daughters';

interface RelationSeed {
  slug: string;
  sourcePersonId: string;
  targetPersonId: string;
  type: RelationType;
  qualifier: string;
  periodLabel: string;
  interpretation: string;
}

function relation(seed: RelationSeed): Relation {
  const claim: RelationClaim = {
    periodLabel: seed.periodLabel,
    relationshipQualifier: seed.qualifier,
    evidenceBasis: 'direct_record',
    modernInterpretation: seed.interpretation,
    disputeStatus: 'none_recorded',
    decisionStatus: 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
  return {
    id: `relation:sg:round_06_${seed.slug}`,
    sourcePersonId: seed.sourcePersonId,
    targetPersonId: seed.targetPersonId,
    type: seed.type,
    certainty: 'confirmed',
    historicalLayer: 'official_history',
    reviewStatus: 'verified',
    origin: 'recorded',
    sourceIds: [sourceId],
    note: seed.qualifier,
    claim,
  };
}

const daughterSeeds = [
  ['cao_xian', '曹宪'],
  ['cao_jie_empress', '曹节'],
  ['cao_hua', '曹华'],
] as const;

export const dataFreezeOmissionRelations: Relation[] = daughterSeeds.flatMap(
  ([slug, name]) => [
    relation({
      slug: `cao_cao_father_${slug}`,
      sourcePersonId: 'person:sg:cao_cao',
      targetPersonId: `person:sg:${slug}`,
      type: 'father_of',
      qualifier: `${name}为曹操之女`,
      periodLabel: '父女关系；生年及具体起始年未详',
      interpretation: `《献穆曹皇后纪》直书曹操三女宪、节、华，据此建立曹操与${name}的父女关系。`,
    }),
    relation({
      slug: `${slug}_spouse_liu_xie`,
      sourcePersonId: `person:sg:${slug}`,
      targetPersonId: 'person:sg:liu_xie',
      type: 'spouse_of',
      qualifier: `${name}为汉献帝刘协夫人，后拜贵人${slug === 'cao_jie_empress' ? '并立为皇后' : ''}`,
      periodLabel: '建安十八年（213年）起；终止年未详',
      interpretation: `正文明确记${name}作为曹操三女之一入汉献帝后宫为夫人，次年拜贵人，据此建立配偶关系。`,
    }),
  ],
);
