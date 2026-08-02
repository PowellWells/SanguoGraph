import type { HistoricalSource, Person, Relation } from '../domain';

export interface GraphData {
  persons: Person[];
  relations: Relation[];
  sources: HistoricalSource[];
}

export type ValidationCode =
  | 'DUPLICATE_ID'
  | 'INVALID_LOCAL_ID'
  | 'INVALID_IMPORT_BATCH'
  | 'UNKNOWN_PERSON'
  | 'SELF_RELATION'
  | 'UNKNOWN_SOURCE'
  | 'VERIFIED_PERSON_WITHOUT_HISTORICAL_SOURCE'
  | 'CONFIRMED_RELATION_NOT_VERIFIED'
  | 'CONFIRMED_RELATION_WITHOUT_HISTORICAL_SOURCE'
  | 'CANDIDATE_NOT_PENDING'
  | 'RAW_RELATION_NOT_RECORDED'
  | 'DUPLICATE_SPOUSE'
  | 'DUPLICATE_CLAN_RELATION'
  | 'PARENT_CYCLE'
  | 'UNKNOWN_OPPOSING_SOURCE'
  | 'CLAIM_DECISION_MISMATCH';

export interface ValidationIssue {
  code: ValidationCode;
  collection: keyof GraphData;
  entityId: string;
  message: string;
}

function findDuplicateIds(
  collection: keyof GraphData,
  entities: ReadonlyArray<{ id: string }>,
): ValidationIssue[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const entity of entities) {
    if (seen.has(entity.id)) {
      duplicates.add(entity.id);
    }
    seen.add(entity.id);
  }

  return [...duplicates].map((entityId) => ({
    code: 'DUPLICATE_ID',
    collection,
    entityId,
    message: `${collection} 中存在重复 ID：${entityId}`,
  }));
}

function isHistoricalEvidence(source: HistoricalSource | undefined): boolean {
  return source !== undefined && source.sourceType !== 'structured_dataset';
}

function findParentCycle(relations: Relation[]): string[] | null {
  const parentTypes = new Set([
    'father_of',
    'mother_of',
    'adoptive_father_of',
    'adoptive_mother_of',
  ]);
  const adjacency = new Map<string, string[]>();

  for (const relation of relations) {
    if (!parentTypes.has(relation.type)) {
      continue;
    }
    const children = adjacency.get(relation.sourcePersonId) ?? [];
    children.push(relation.targetPersonId);
    adjacency.set(relation.sourcePersonId, children);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string, trail: string[]): string[] | null => {
    if (visiting.has(id)) {
      return [...trail, id];
    }
    if (visited.has(id)) {
      return null;
    }

    visiting.add(id);
    for (const child of adjacency.get(id) ?? []) {
      const cycle = visit(child, [...trail, id]);
      if (cycle) {
        return cycle;
      }
    }
    visiting.delete(id);
    visited.add(id);
    return null;
  };

  for (const id of adjacency.keys()) {
    const cycle = visit(id, []);
    if (cycle) {
      return cycle;
    }
  }
  return null;
}

export function validateGraphData(data: GraphData): ValidationIssue[] {
  const issues: ValidationIssue[] = [
    ...findDuplicateIds('persons', data.persons),
    ...findDuplicateIds('relations', data.relations),
    ...findDuplicateIds('sources', data.sources),
  ];
  const personIds = new Set(data.persons.map((person) => person.id));
  const sourcesById = new Map(data.sources.map((source) => [source.id, source]));
  const spousePairs = new Map<string, string>();
  const clanPairs = new Map<string, string>();

  for (const person of data.persons) {
    if (!/^person:sg:[a-z0-9_]+$/.test(person.id)) {
      issues.push({
        code: 'INVALID_LOCAL_ID',
        collection: 'persons',
        entityId: person.id,
        message: `${person.id} 不是有效的项目本地人物 ID。`,
      });
    }

    const importBatch: unknown = person.importBatch;
    if (
      importBatch !== 1 &&
      importBatch !== 2 &&
      importBatch !== 3 &&
      importBatch !== 4 &&
      importBatch !== 5
    ) {
      issues.push({
        code: 'INVALID_IMPORT_BATCH',
        collection: 'persons',
        entityId: person.id,
        message: `${person.id} 的导入批次必须为 1、2、3、4 或 5。`,
      });
    }

    for (const sourceId of person.sourceIds) {
      if (!sourcesById.has(sourceId)) {
        issues.push({
          code: 'UNKNOWN_SOURCE',
          collection: 'persons',
          entityId: person.id,
          message: `${person.id} 引用了不存在的史料：${sourceId}`,
        });
      }
    }

    if (
      person.reviewStatus === 'verified' &&
      !person.sourceIds.some((sourceId) =>
        isHistoricalEvidence(sourcesById.get(sourceId)),
      )
    ) {
      issues.push({
        code: 'VERIFIED_PERSON_WITHOUT_HISTORICAL_SOURCE',
        collection: 'persons',
        entityId: person.id,
        message: `${person.id} 标记为 verified 时必须引用至少一条历史文献。`,
      });
    }
  }

  for (const relation of data.relations) {
    for (const [field, personId] of [
      ['起点', relation.sourcePersonId],
      ['终点', relation.targetPersonId],
    ] as const) {
      if (!personIds.has(personId)) {
        issues.push({
          code: 'UNKNOWN_PERSON',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 引用了不存在的${field}人物：${personId}`,
        });
      }
    }

    if (relation.sourcePersonId === relation.targetPersonId) {
      issues.push({
        code: 'SELF_RELATION',
        collection: 'relations',
        entityId: relation.id,
        message: `${relation.id} 不能指向同一人物。`,
      });
    }

    for (const sourceId of relation.sourceIds) {
      if (!sourcesById.has(sourceId)) {
        issues.push({
          code: 'UNKNOWN_SOURCE',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 引用了不存在的史料：${sourceId}`,
        });
      }
    }

    for (const sourceId of relation.claim?.opposingSourceIds ?? []) {
      if (!sourcesById.has(sourceId)) {
        issues.push({
          code: 'UNKNOWN_OPPOSING_SOURCE',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 引用了不存在的反对或质疑史料：${sourceId}`,
        });
      }
    }

    if (relation.origin !== 'recorded') {
      issues.push({
        code: 'RAW_RELATION_NOT_RECORDED',
        collection: 'relations',
        entityId: relation.id,
        message: `${relation.id} 位于正式原始数据中，origin 必须为 recorded。`,
      });
    }

    if (
      relation.origin === 'candidate' &&
      relation.reviewStatus !== 'pending_review'
    ) {
      issues.push({
        code: 'CANDIDATE_NOT_PENDING',
        collection: 'relations',
        entityId: relation.id,
        message: `${relation.id} 是候选关系，必须保持 pending_review。`,
      });
    }

    if (relation.certainty === 'confirmed') {
      if (relation.reviewStatus !== 'verified') {
        issues.push({
          code: 'CONFIRMED_RELATION_NOT_VERIFIED',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 标记为 confirmed 时必须已经人工核验。`,
        });
      }
      if (
        !relation.sourceIds.some((sourceId) =>
          isHistoricalEvidence(sourcesById.get(sourceId)),
        )
      ) {
        issues.push({
          code: 'CONFIRMED_RELATION_WITHOUT_HISTORICAL_SOURCE',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 标记为 confirmed 时必须引用非结构化数据集的历史文献。`,
        });
      }
      if (
        relation.claim &&
        relation.claim.decisionStatus !== 'confirmed'
      ) {
        issues.push({
          code: 'CLAIM_DECISION_MISMATCH',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 的 confirmed 可信度与关系结论状态不一致。`,
        });
      }
    }

    if (relation.type === 'spouse_of') {
      const pair = [relation.sourcePersonId, relation.targetPersonId]
        .sort()
        .join('|');
      const previous = spousePairs.get(pair);
      if (previous) {
        issues.push({
          code: 'DUPLICATE_SPOUSE',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 与 ${previous} 重复表达同一夫妻关系。`,
        });
      } else {
        spousePairs.set(pair, relation.id);
      }
    }

    if (relation.type === 'clan_relative_of') {
      const pair = [relation.sourcePersonId, relation.targetPersonId]
        .sort()
        .join('|');
      const previous = clanPairs.get(pair);
      if (previous) {
        issues.push({
          code: 'DUPLICATE_CLAN_RELATION',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 与 ${previous} 重复表达同一宗族关系。`,
        });
      } else {
        clanPairs.set(pair, relation.id);
      }
    }
  }

  const cycle = findParentCycle(data.relations);
  if (cycle) {
    issues.push({
      code: 'PARENT_CYCLE',
      collection: 'relations',
      entityId: cycle[0],
      message: `父母或收养关系形成有向环：${cycle.join(' → ')}`,
    });
  }

  return issues;
}
