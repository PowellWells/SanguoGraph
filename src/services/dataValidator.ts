import type { HistoricalSource, Person, Relation } from '../domain';

export interface GraphData {
  persons: Person[];
  relations: Relation[];
  sources: HistoricalSource[];
}

export type ValidationCode =
  | 'DUPLICATE_ID'
  | 'UNKNOWN_PERSON'
  | 'SELF_RELATION'
  | 'UNKNOWN_SOURCE'
  | 'CONFIRMED_RELATION_NOT_VERIFIED'
  | 'CONFIRMED_RELATION_WITHOUT_SOURCE';

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
  const duplicateIds = new Set<string>();

  for (const entity of entities) {
    if (seen.has(entity.id)) {
      duplicateIds.add(entity.id);
    }
    seen.add(entity.id);
  }

  return Array.from(duplicateIds).map((entityId) => ({
    code: 'DUPLICATE_ID',
    collection,
    entityId,
    message: `${collection} 中存在重复 ID：${entityId}`,
  }));
}

export function validateGraphData(data: GraphData): ValidationIssue[] {
  const issues: ValidationIssue[] = [
    ...findDuplicateIds('persons', data.persons),
    ...findDuplicateIds('relations', data.relations),
    ...findDuplicateIds('sources', data.sources),
  ];
  const personIds = new Set(data.persons.map((person) => person.id));
  const sourceIds = new Set(data.sources.map((source) => source.id));

  for (const relation of data.relations) {
    if (!personIds.has(relation.sourcePersonId)) {
      issues.push({
        code: 'UNKNOWN_PERSON',
        collection: 'relations',
        entityId: relation.id,
        message: `${relation.id} 引用了不存在的起点人物：${relation.sourcePersonId}`,
      });
    }

    if (!personIds.has(relation.targetPersonId)) {
      issues.push({
        code: 'UNKNOWN_PERSON',
        collection: 'relations',
        entityId: relation.id,
        message: `${relation.id} 引用了不存在的终点人物：${relation.targetPersonId}`,
      });
    }

    if (relation.sourcePersonId === relation.targetPersonId) {
      issues.push({
        code: 'SELF_RELATION',
        collection: 'relations',
        entityId: relation.id,
        message: `${relation.id} 不能指向同一人物。`,
      });
    }

    const validSourceCount = relation.sourceIds.filter((sourceId) =>
      sourceIds.has(sourceId),
    ).length;

    for (const sourceId of relation.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        issues.push({
          code: 'UNKNOWN_SOURCE',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 引用了不存在的史料：${sourceId}`,
        });
      }
    }

    if (relation.certainty === 'confirmed') {
      if (relation.reviewStatus !== 'verified') {
        issues.push({
          code: 'CONFIRMED_RELATION_NOT_VERIFIED',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 标记为 confirmed 时必须已通过人工核验。`,
        });
      }

      if (validSourceCount === 0) {
        issues.push({
          code: 'CONFIRMED_RELATION_WITHOUT_SOURCE',
          collection: 'relations',
          entityId: relation.id,
          message: `${relation.id} 标记为 confirmed 时必须至少引用一条有效史料。`,
        });
      }
    }
  }

  return issues;
}

