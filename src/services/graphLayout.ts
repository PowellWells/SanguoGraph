import type { Person, Relation } from '../domain';
import { getFactionColorKey } from './graphVisualEncoding';

export interface GraphPosition {
  x: number;
  y: number;
}

export interface GraphLayout {
  positions: Readonly<Record<string, GraphPosition>>;
  generations: Readonly<Record<string, number>>;
}

interface GraphLayoutOptions {
  compact: boolean;
  lockedPersonIds?: ReadonlySet<string>;
  previousPositions?: Readonly<Record<string, GraphPosition>>;
}

interface LayoutProfile {
  centerX: number;
  firstY: number;
  columnGap: number;
  rowGap: number;
  groupGap: number;
  maxColumns: number;
}

const corePersonId = 'person:sg:cao_cao';
const parentRelationTypes = new Set<Relation['type']>([
  'father_of',
  'mother_of',
  'adoptive_father_of',
  'adoptive_mother_of',
]);

const desktopProfile: LayoutProfile = {
  centerX: 535,
  firstY: 35,
  columnGap: 135,
  rowGap: 130,
  groupGap: 34,
  maxColumns: 8,
};

const compactProfile: LayoutProfile = {
  centerX: 260,
  firstY: 45,
  columnGap: 130,
  rowGap: 115,
  groupGap: 24,
  maxColumns: 4,
};

function isStructuralRelation(relation: Relation): boolean {
  return relation.origin !== 'candidate';
}

function createInputOrder(persons: Person[]): ReadonlyMap<string, number> {
  return new Map(persons.map((person, index) => [person.id, index]));
}

function createGenerations(
  persons: Person[],
  relations: Relation[],
): Map<string, number> {
  const generations = new Map(persons.map((person) => [person.id, 0]));
  const personIds = new Set(generations.keys());
  const structuralRelations = relations.filter(
    (relation) =>
      isStructuralRelation(relation) &&
      personIds.has(relation.sourcePersonId) &&
      personIds.has(relation.targetPersonId),
  );

  for (let pass = 0; pass < persons.length; pass += 1) {
    let changed = false;
    structuralRelations.forEach((relation) => {
      const sourceGeneration =
        generations.get(relation.sourcePersonId) ?? 0;
      const targetGeneration =
        generations.get(relation.targetPersonId) ?? 0;
      if (parentRelationTypes.has(relation.type)) {
        const nextTargetGeneration = Math.max(
          targetGeneration,
          sourceGeneration + 1,
        );
        if (nextTargetGeneration !== targetGeneration) {
          generations.set(relation.targetPersonId, nextTargetGeneration);
          changed = true;
        }
      } else if (relation.type === 'spouse_of') {
        const sharedGeneration = Math.max(
          sourceGeneration,
          targetGeneration,
        );
        if (sourceGeneration !== sharedGeneration) {
          generations.set(relation.sourcePersonId, sharedGeneration);
          changed = true;
        }
        if (targetGeneration !== sharedGeneration) {
          generations.set(relation.targetPersonId, sharedGeneration);
          changed = true;
        }
      }
    });
    if (!changed) {
      break;
    }
  }

  return generations;
}

function createLayoutGroups(
  persons: Person[],
  relations: Relation[],
): ReadonlyMap<string, number> {
  const inputOrder = createInputOrder(persons);
  const parents = new Map(persons.map((person) => [person.id, person.id]));

  const find = (personId: string): string => {
    const parent = parents.get(personId) ?? personId;
    if (parent === personId) {
      return personId;
    }
    const root = find(parent);
    parents.set(personId, root);
    return root;
  };
  const union = (firstId: string, secondId: string) => {
    const firstRoot = find(firstId);
    const secondRoot = find(secondId);
    if (firstRoot === secondRoot) {
      return;
    }
    const firstIndex = inputOrder.get(firstRoot) ?? Number.MAX_SAFE_INTEGER;
    const secondIndex = inputOrder.get(secondRoot) ?? Number.MAX_SAFE_INTEGER;
    if (firstIndex <= secondIndex) {
      parents.set(secondRoot, firstRoot);
    } else {
      parents.set(firstRoot, secondRoot);
    }
  };

  relations.filter(isStructuralRelation).forEach((relation) => {
    if (
      parents.has(relation.sourcePersonId) &&
      parents.has(relation.targetPersonId)
    ) {
      union(relation.sourcePersonId, relation.targetPersonId);
    }
  });

  const familyRepresentatives = new Map<string, string>();
  persons.forEach((person) => {
    const familyKey =
      person.clan?.trim() || `faction:${getFactionColorKey(person)}`;
    const representative = familyRepresentatives.get(familyKey);
    if (representative) {
      union(representative, person.id);
    } else {
      familyRepresentatives.set(familyKey, person.id);
    }
  });

  const roots = [...new Set(persons.map((person) => find(person.id)))].sort(
    (firstId, secondId) =>
      (inputOrder.get(firstId) ?? 0) - (inputOrder.get(secondId) ?? 0),
  );
  const groupOrder = new Map(
    roots.map((rootPersonId, index) => [rootPersonId, index]),
  );
  return new Map(
    persons.map((person) => [
      person.id,
      groupOrder.get(find(person.id)) ?? 0,
    ]),
  );
}

function createDegreeMap(
  persons: Person[],
  relations: Relation[],
): ReadonlyMap<string, number> {
  const degrees = new Map(persons.map((person) => [person.id, 0]));
  relations.filter(isStructuralRelation).forEach((relation) => {
    if (degrees.has(relation.sourcePersonId)) {
      degrees.set(
        relation.sourcePersonId,
        (degrees.get(relation.sourcePersonId) ?? 0) + 1,
      );
    }
    if (degrees.has(relation.targetPersonId)) {
      degrees.set(
        relation.targetPersonId,
        (degrees.get(relation.targetPersonId) ?? 0) + 1,
      );
    }
  });
  return degrees;
}

function createSpouseAdjacency(
  personIds: ReadonlySet<string>,
  relations: Relation[],
): ReadonlyMap<string, string[]> {
  const adjacency = new Map<string, string[]>();
  relations
    .filter(
      (relation) =>
        isStructuralRelation(relation) &&
        relation.type === 'spouse_of' &&
        personIds.has(relation.sourcePersonId) &&
        personIds.has(relation.targetPersonId),
    )
    .forEach((relation) => {
      adjacency.set(relation.sourcePersonId, [
        ...(adjacency.get(relation.sourcePersonId) ?? []),
        relation.targetPersonId,
      ]);
      adjacency.set(relation.targetPersonId, [
        ...(adjacency.get(relation.targetPersonId) ?? []),
        relation.sourcePersonId,
      ]);
    });
  return adjacency;
}

function getSpouseComponents(
  personIds: string[],
  spouseAdjacency: ReadonlyMap<string, string[]>,
): string[][] {
  const remaining = new Set(personIds);
  const components: string[][] = [];
  personIds.forEach((personId) => {
    if (!remaining.has(personId)) {
      return;
    }
    const component: string[] = [];
    const queue = [personId];
    remaining.delete(personId);
    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!currentId) {
        continue;
      }
      component.push(currentId);
      (spouseAdjacency.get(currentId) ?? []).forEach((neighborId) => {
        if (remaining.delete(neighborId)) {
          queue.push(neighborId);
        }
      });
    }
    components.push(component);
  });
  return components;
}

function getAnchor(
  personIds: string[],
  degrees: ReadonlyMap<string, number>,
  inputOrder: ReadonlyMap<string, number>,
): string {
  return [...personIds].sort((firstId, secondId) => {
    if (firstId === corePersonId) {
      return -1;
    }
    if (secondId === corePersonId) {
      return 1;
    }
    const degreeDifference =
      (degrees.get(secondId) ?? 0) - (degrees.get(firstId) ?? 0);
    return (
      degreeDifference ||
      (inputOrder.get(firstId) ?? 0) - (inputOrder.get(secondId) ?? 0)
    );
  })[0] ?? personIds[0];
}

function getFirstChildIndex(
  personId: string,
  relations: Relation[],
  inputOrder: ReadonlyMap<string, number>,
): number {
  return relations
    .filter(
      (relation) =>
        isStructuralRelation(relation) &&
        parentRelationTypes.has(relation.type) &&
        relation.sourcePersonId === personId,
    )
    .reduce(
      (firstIndex, relation) =>
        Math.min(
          firstIndex,
          inputOrder.get(relation.targetPersonId) ?? Number.MAX_SAFE_INTEGER,
        ),
      Number.MAX_SAFE_INTEGER,
    );
}

function orderGeneration(
  personIds: string[],
  relations: Relation[],
  inputOrder: ReadonlyMap<string, number>,
  layoutGroups: ReadonlyMap<string, number>,
  degrees: ReadonlyMap<string, number>,
  positionedOrder: ReadonlyMap<string, number>,
  compact: boolean,
): { primary: string[]; spouseSatellites: string[] } {
  const generationIds = new Set(personIds);
  const spouseAdjacency = createSpouseAdjacency(generationIds, relations);
  const components = getSpouseComponents(personIds, spouseAdjacency);
  const orderedComponents = components
    .map((component) => {
      const anchor = getAnchor(component, degrees, inputOrder);
      const partners = component
        .filter((personId) => personId !== anchor)
        .sort(
          (firstId, secondId) =>
            getFirstChildIndex(firstId, relations, inputOrder) -
              getFirstChildIndex(secondId, relations, inputOrder) ||
            (inputOrder.get(firstId) ?? 0) -
              (inputOrder.get(secondId) ?? 0),
        );
      const parentRanks = component.flatMap((personId) =>
        relations
          .filter(
            (relation) =>
              isStructuralRelation(relation) &&
              parentRelationTypes.has(relation.type) &&
              relation.targetPersonId === personId,
          )
          .map(
            (relation) =>
              positionedOrder.get(relation.sourcePersonId) ??
              Number.MAX_SAFE_INTEGER,
          ),
      );
      return {
        anchor,
        partners,
        group: layoutGroups.get(anchor) ?? 0,
        parentRank:
          parentRanks.length > 0
            ? Math.max(...parentRanks)
            : Number.MAX_SAFE_INTEGER,
        inputRank: Math.min(
          ...component.map(
            (personId) =>
              inputOrder.get(personId) ?? Number.MAX_SAFE_INTEGER,
          ),
        ),
      };
    })
    .sort(
      (first, second) =>
        first.group - second.group ||
        first.parentRank - second.parentRank ||
        first.inputRank - second.inputRank,
    );

  if (compact) {
    return {
      primary: orderedComponents.map((component) => component.anchor),
      spouseSatellites: orderedComponents.flatMap(
        (component) => component.partners,
      ),
    };
  }

  return {
    primary: orderedComponents.flatMap(({ anchor, partners }) => {
      const anchorIndex = Math.ceil(partners.length / 2);
      return [
        ...partners.slice(0, anchorIndex),
        anchor,
        ...partners.slice(anchorIndex),
      ];
    }),
    spouseSatellites: [],
  };
}

function splitRows(personIds: string[], maxColumns: number): string[][] {
  const rows: string[][] = [];
  for (let index = 0; index < personIds.length; index += maxColumns) {
    rows.push(personIds.slice(index, index + maxColumns));
  }
  return rows;
}

function positionRow(
  personIds: string[],
  y: number,
  profile: LayoutProfile,
  layoutGroups: ReadonlyMap<string, number>,
): Record<string, GraphPosition> {
  const gaps = personIds.slice(1).map((personId, index) => {
    const previousPersonId = personIds[index];
    return (
      profile.columnGap +
      ((layoutGroups.get(previousPersonId) ?? 0) ===
      (layoutGroups.get(personId) ?? 0)
        ? 0
        : profile.groupGap)
    );
  });
  const span = gaps.reduce((total, gap) => total + gap, 0);
  let x = profile.centerX - span / 2;
  const positions: Record<string, GraphPosition> = {};
  personIds.forEach((personId, index) => {
    if (index > 0) {
      x += gaps[index - 1] ?? profile.columnGap;
    }
    positions[personId] = { x, y };
  });
  return positions;
}

function applyLockedPositions(
  positions: Record<string, GraphPosition>,
  options: GraphLayoutOptions,
  profile: LayoutProfile,
): void {
  const lockedPersonIds = options.lockedPersonIds ?? new Set<string>();
  const lockedPositions = [...lockedPersonIds]
    .map((personId) => ({
      personId,
      position: options.previousPositions?.[personId],
    }))
    .filter(
      (
        entry,
      ): entry is { personId: string; position: GraphPosition } =>
        entry.position !== undefined,
    );
  lockedPositions.forEach(({ personId, position }) => {
    if (positions[personId]) {
      positions[personId] = { ...position };
    }
  });

  const minimumDistance = 78;
  Object.entries(positions).forEach(([personId, position]) => {
    if (lockedPersonIds.has(personId)) {
      return;
    }
    let adjustedX = position.x;
    let collision = true;
    while (collision) {
      collision = lockedPositions.some(({ position: lockedPosition }) => {
        const xDistance = adjustedX - lockedPosition.x;
        const yDistance = position.y - lockedPosition.y;
        return (
          xDistance * xDistance + yDistance * yDistance <
          minimumDistance * minimumDistance
        );
      });
      if (collision) {
        adjustedX += profile.columnGap;
      }
    }
    positions[personId] = { x: adjustedX, y: position.y };
  });
}

export function createGraphLayout(
  persons: Person[],
  relations: Relation[],
  options: GraphLayoutOptions,
): GraphLayout {
  const profile = options.compact ? compactProfile : desktopProfile;
  const generations = createGenerations(persons, relations);
  const inputOrder = createInputOrder(persons);
  const layoutGroups = createLayoutGroups(persons, relations);
  const degrees = createDegreeMap(persons, relations);
  const generationNumbers = [
    ...new Set(persons.map((person) => generations.get(person.id) ?? 0)),
  ].sort((first, second) => first - second);
  const positionedOrder = new Map<string, number>();
  const positions: Record<string, GraphPosition> = {};
  let rowIndex = 0;
  let orderIndex = 0;

  generationNumbers.forEach((generation) => {
    const generationPersonIds = persons
      .filter((person) => (generations.get(person.id) ?? 0) === generation)
      .map((person) => person.id);
    const ordered = orderGeneration(
      generationPersonIds,
      relations,
      inputOrder,
      layoutGroups,
      degrees,
      positionedOrder,
      options.compact,
    );
    const rows = [
      ...splitRows(ordered.primary, profile.maxColumns),
      ...splitRows(ordered.spouseSatellites, profile.maxColumns),
    ];
    rows.forEach((row) => {
      Object.assign(
        positions,
        positionRow(
          row,
          profile.firstY + rowIndex * profile.rowGap,
          profile,
          layoutGroups,
        ),
      );
      row.forEach((personId) => {
        positionedOrder.set(personId, orderIndex);
        orderIndex += 1;
      });
      rowIndex += 1;
    });
  });

  applyLockedPositions(positions, options, profile);
  return {
    positions,
    generations: Object.fromEntries(generations),
  };
}
