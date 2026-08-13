import type {
  EvidenceBasis,
  HistoricalLayer,
  Relation,
  RelationClaim,
} from '../domain';

interface RelationSeed {
  slug: string;
  sourcePersonId: string;
  targetPersonId: string;
  sourceId: string;
  qualifier: string;
  interpretation: string;
  historicalLayer?: HistoricalLayer;
  evidenceBasis?: EvidenceBasis;
}

function relation(seed: RelationSeed): Relation {
  const historicalLayer = seed.historicalLayer ?? 'official_history';
  const evidenceBasis = seed.evidenceBasis ?? 'direct_record';
  const pending =
    historicalLayer === 'annotated_history' ||
    evidenceBasis === 'indirect_inference';
  const claim: RelationClaim = {
    periodLabel: '姻亲或宗族身份关系；具体起止年未详',
    relationshipQualifier: seed.qualifier,
    evidenceBasis,
    modernInterpretation: seed.interpretation,
    disputeStatus: pending ? 'not_assessed' : 'none_recorded',
    decisionStatus: pending ? 'pending_review' : 'confirmed',
    opposingSourceIds: [],
    scholarlyViews: [],
  };
  return {
    id: `relation:sg:major_roster_second_pass_${seed.slug}`,
    sourcePersonId: seed.sourcePersonId,
    targetPersonId: seed.targetPersonId,
    type: 'clan_relative_of',
    certainty: pending ? 'probable' : 'confirmed',
    historicalLayer,
    reviewStatus: pending ? 'pending_review' : 'verified',
    origin: 'recorded',
    sourceIds: [seed.sourceId],
    note: seed.qualifier,
    claim,
  };
}

const seeds: readonly RelationSeed[] = [
  {
    slug: 'zhang_xiu_clan_cao_jun',
    sourcePersonId: 'person:sg:zhang_xiu',
    targetPersonId: 'person:sg:sgz_v20_14',
    sourceId: 'source:sg:major_roster_second_pass_sgz_08_zhang_xiu_daughter',
    qualifier: '曹均娶张绣之女，曹均为张绣女婿',
    interpretation:
      '正文直接记载曹操为子曹均娶张绣女；以姻亲边表达岳父与女婿，不补造未载名的女儿节点。',
  },
  {
    slug: 'zhang_lu_clan_cao_yu',
    sourcePersonId: 'person:sg:zhang_lu',
    targetPersonId: 'person:sg:cao_yu',
    sourceId: 'source:sg:major_roster_second_pass_sgz_08_zhang_lu_daughter',
    qualifier: '曹宇字彭祖，娶张鲁之女，曹宇为张鲁女婿',
    interpretation:
      '正文以曹宇字彭祖明确记载其娶张鲁女；以姻亲边表达岳父与女婿，不补造未载名的女儿节点。',
  },
  {
    slug: 'guo_huai_clan_wang_ling',
    sourcePersonId: 'person:sg:guo_huai',
    targetPersonId: 'person:sg:wang_ling',
    sourceId: 'source:sg:major_roster_second_pass_shiyu_26_guo_huai_wife',
    qualifier: '《世语》称郭淮妻为王凌之妹，郭淮与王凌形成姻亲',
    interpretation:
      '裴注引《世语》直接说明郭淮妻为王凌妹；以姻亲边连接妻兄与妹夫，不补造未载名的妻子节点。',
    historicalLayer: 'annotated_history',
  },
  {
    slug: 'wang_ling_clan_wang_yun',
    sourcePersonId: 'person:sg:wang_ling',
    targetPersonId: 'person:sg:wang_yun',
    sourceId: 'source:sg:major_roster_second_pass_sgz_28_wang_ling_uncle',
    qualifier: '王允为王凌叔父',
    interpretation:
      '《王凌传》开篇直书王允为王凌叔父，按正文建立叔侄宗族边。',
  },
  {
    slug: 'lu_ji_clan_zhang_wen',
    sourcePersonId: 'person:sg:lu_ji',
    targetPersonId: 'person:sg:sgz_v57_02',
    sourceId: 'source:sg:major_roster_second_pass_pei_57_lu_ji_daughter',
    qualifier: '裴注称陆绩女郁生嫁张温弟张白，陆绩与张温形成有界姻亲',
    interpretation:
      '由裴注中“陆绩女嫁张温弟”的明确婚姻链限定推出姻亲关系；不补造张白或重复新增郁生节点。',
    historicalLayer: 'annotated_history',
    evidenceBasis: 'indirect_inference',
  },
];

export const majorRosterSecondPassRelations: Relation[] = seeds.map(relation);
