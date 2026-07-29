import type { Relation } from '../domain';

export interface RelationshipPath {
  personIds: string[];
  relations: Relation[];
}

export function findShortestRelationshipPath(
  relations: Relation[],
  startPersonId: string,
  endPersonId: string,
): RelationshipPath | null {
  if (startPersonId === endPersonId) {
    return { personIds: [startPersonId], relations: [] };
  }

  const queue: string[] = [startPersonId];
  const visited = new Set([startPersonId]);
  const previous = new Map<
    string,
    { personId: string; relation: Relation }
  >();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }

    for (const relation of relations) {
      const next =
        relation.sourcePersonId === current
          ? relation.targetPersonId
          : relation.targetPersonId === current
            ? relation.sourcePersonId
            : null;
      if (!next || visited.has(next)) {
        continue;
      }

      visited.add(next);
      previous.set(next, { personId: current, relation });
      if (next === endPersonId) {
        const personIds = [endPersonId];
        const pathRelations: Relation[] = [];
        let cursor = endPersonId;
        while (cursor !== startPersonId) {
          const step = previous.get(cursor);
          if (!step) {
            return null;
          }
          pathRelations.unshift(step.relation);
          personIds.unshift(step.personId);
          cursor = step.personId;
        }
        return { personIds, relations: pathRelations };
      }
      queue.push(next);
    }
  }

  return null;
}
