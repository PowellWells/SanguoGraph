import type { Relation, RelationType } from '../domain';

export type NeighborhoodDepth = 'all' | 1 | 2;

export function filterRelations(
  relations: Relation[],
  enabledTypes: ReadonlySet<RelationType>,
): Relation[] {
  return relations.filter((relation) => enabledTypes.has(relation.type));
}

export function selectNeighborhood(
  relations: Relation[],
  selectedPersonId: string | null,
  depth: NeighborhoodDepth,
): { personIds: Set<string>; relations: Relation[] } {
  const allPersonIds = new Set(
    relations.flatMap((relation) => [
      relation.sourcePersonId,
      relation.targetPersonId,
    ]),
  );
  if (!selectedPersonId || depth === 'all') {
    return { personIds: allPersonIds, relations };
  }

  const included = new Set([selectedPersonId]);
  let frontier = new Set([selectedPersonId]);

  for (let hop = 0; hop < depth; hop += 1) {
    const next = new Set<string>();
    for (const relation of relations) {
      if (frontier.has(relation.sourcePersonId)) {
        next.add(relation.targetPersonId);
      }
      if (frontier.has(relation.targetPersonId)) {
        next.add(relation.sourcePersonId);
      }
    }
    for (const id of next) {
      included.add(id);
    }
    frontier = next;
  }

  return {
    personIds: included,
    relations: relations.filter(
      (relation) =>
        included.has(relation.sourcePersonId) &&
        included.has(relation.targetPersonId),
    ),
  };
}
