import type { Person, Relation } from '../domain';
import { getFactionColorKey } from './graphVisualEncoding';

export interface GraphPosition {
  x: number;
  y: number;
}

export interface GraphBounds {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export type GraphEdgeRouteKind = 'primary' | 'secondary' | 'parallel';
export type GraphEdgeCurveStyle = 'straight' | 'unbundled-bezier';
export type LayoutSector = 'wei' | 'shu' | 'wu' | 'neutral';

export interface GraphEdgeRoute {
  kind: GraphEdgeRouteKind;
  curveStyle: GraphEdgeCurveStyle;
  controlPointDistance: number;
  controlPointWeight: number;
}

export interface GraphLayout {
  positions: Readonly<Record<string, GraphPosition>>;
  generations: Readonly<Record<string, number>>;
  sectors: Readonly<Record<string, LayoutSector>>;
  bounds: GraphBounds;
  edgeRoutes: Readonly<Record<string, GraphEdgeRoute>>;
}

export interface GraphLayoutOptions {
  compact: boolean;
  anchorPersonId?: string;
  lockedPersonIds?: ReadonlySet<string>;
  previousPositions?: Readonly<Record<string, GraphPosition>>;
}

interface LayoutProfile {
  minimumDistance: number;
  coreExtraDistance: number;
  radialGap: number;
  componentGap: number;
}

interface ComponentLayout {
  anchorPersonId: string;
  personIds: string[];
  positions: Record<string, GraphPosition>;
}

interface RoutedPolyline {
  relation: Relation;
  points: GraphPosition[];
}

const defaultAnchorPersonId = 'person:sg:cao_cao';
const biologicalParentTypes = new Set<Relation['type']>([
  'father_of',
  'mother_of',
]);
const parentRelationTypes = new Set<Relation['type']>([
  ...biologicalParentTypes,
  'adoptive_father_of',
  'adoptive_mother_of',
]);

const desktopProfile: LayoutProfile = {
  minimumDistance: 112,
  coreExtraDistance: 12,
  radialGap: 150,
  componentGap: 180,
};

const compactProfile: LayoutProfile = {
  minimumDistance: 104,
  coreExtraDistance: 12,
  radialGap: 132,
  componentGap: 180,
};

function isStructuralRelation(relation: Relation): boolean {
  return relation.origin !== 'candidate';
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function polarPosition(
  radius: number,
  angleDegrees: number,
): GraphPosition {
  const angle = toRadians(angleDegrees);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function distance(
  first: GraphPosition,
  second: GraphPosition,
): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function createInputOrder(persons: Person[]): ReadonlyMap<string, number> {
  return new Map(persons.map((person, index) => [person.id, index]));
}

function createGenerations(
  persons: Person[],
  relations: Relation[],
): Map<string, number> {
  const generations = new Map<string, number>();
  const personIds = new Set(persons.map((person) => person.id));
  const adjacency = new Map<
    string,
    Array<{ personId: string; offset: number }>
  >();
  const generationOffset = (relation: Relation): number => {
    if (parentRelationTypes.has(relation.type)) {
      return 1;
    }
    if (relation.type !== 'clan_relative_of') {
      return 0;
    }
    const qualifier = relation.claim?.relationshipQualifier ?? '';
    return qualifier.includes('族子') || qualifier.includes('从子') ? 1 : 0;
  };

  relations
    .filter(
      (relation) =>
        isStructuralRelation(relation) &&
        personIds.has(relation.sourcePersonId) &&
        personIds.has(relation.targetPersonId),
    )
    .forEach((relation) => {
      const offset = generationOffset(relation);
      adjacency.set(relation.sourcePersonId, [
        ...(adjacency.get(relation.sourcePersonId) ?? []),
        { personId: relation.targetPersonId, offset },
      ]);
      adjacency.set(relation.targetPersonId, [
        ...(adjacency.get(relation.targetPersonId) ?? []),
        { personId: relation.sourcePersonId, offset: -offset },
      ]);
    });

  persons.forEach((person) => {
    if (generations.has(person.id)) {
      return;
    }
    const componentPersonIds: string[] = [];
    const queue = [person.id];
    generations.set(person.id, 0);
    while (queue.length > 0) {
      const currentPersonId = queue.shift();
      if (!currentPersonId) {
        continue;
      }
      componentPersonIds.push(currentPersonId);
      const currentGeneration = generations.get(currentPersonId) ?? 0;
      (adjacency.get(currentPersonId) ?? []).forEach((neighbor) => {
        if (!generations.has(neighbor.personId)) {
          generations.set(
            neighbor.personId,
            currentGeneration + neighbor.offset,
          );
          queue.push(neighbor.personId);
        }
      });
    }
    const minimumGeneration = Math.min(
      ...componentPersonIds.map(
        (personId) => generations.get(personId) ?? 0,
      ),
    );
    componentPersonIds.forEach((personId) => {
      generations.set(
        personId,
        (generations.get(personId) ?? 0) - minimumGeneration,
      );
    });
  });

  return generations;
}

function createRelationAdjacency(
  personIds: ReadonlySet<string>,
  relations: Relation[],
): ReadonlyMap<string, Relation[]> {
  const adjacency = new Map<string, Relation[]>();
  relations
    .filter(
      (relation) =>
        isStructuralRelation(relation) &&
        personIds.has(relation.sourcePersonId) &&
        personIds.has(relation.targetPersonId),
    )
    .forEach((relation) => {
      adjacency.set(relation.sourcePersonId, [
        ...(adjacency.get(relation.sourcePersonId) ?? []),
        relation,
      ]);
      adjacency.set(relation.targetPersonId, [
        ...(adjacency.get(relation.targetPersonId) ?? []),
        relation,
      ]);
    });
  return adjacency;
}

function otherPersonId(relation: Relation, personId: string): string {
  return relation.sourcePersonId === personId
    ? relation.targetPersonId
    : relation.sourcePersonId;
}

function createConnectedComponents(
  persons: Person[],
  relations: Relation[],
): string[][] {
  const personIds = new Set(persons.map((person) => person.id));
  const adjacency = createRelationAdjacency(personIds, relations);
  const remaining = new Set(persons.map((person) => person.id));
  const components: string[][] = [];

  persons.forEach((person) => {
    if (!remaining.delete(person.id)) {
      return;
    }
    const component: string[] = [];
    const queue = [person.id];
    while (queue.length > 0) {
      const currentPersonId = queue.shift();
      if (!currentPersonId) {
        continue;
      }
      component.push(currentPersonId);
      (adjacency.get(currentPersonId) ?? []).forEach((relation) => {
        const neighborId = otherPersonId(relation, currentPersonId);
        if (remaining.delete(neighborId)) {
          queue.push(neighborId);
        }
      });
    }
    components.push(component);
  });

  return components;
}

const majorLayoutSectors: ReadonlyArray<Exclude<LayoutSector, 'neutral'>> = [
  'wei',
  'shu',
  'wu',
];

function createLayoutSectors(
  persons: Person[],
  relations: Relation[],
): Record<string, LayoutSector> {
  const personById = new Map(persons.map((person) => [person.id, person]));
  const personIds = new Set(personById.keys());
  const adjacency = createRelationAdjacency(personIds, relations);
  const sectors: Record<string, LayoutSector> = {};

  persons.forEach((person) => {
    const visualFaction = getFactionColorKey(person);
    if (visualFaction !== 'other') {
      sectors[person.id] = visualFaction;
      return;
    }

    const visited = new Set([person.id]);
    let frontier = [person.id];
    const nearestSectors: LayoutSector[] = [];
    while (frontier.length > 0 && nearestSectors.length === 0) {
      const nextFrontier: string[] = [];
      frontier.forEach((currentPersonId) => {
        (adjacency.get(currentPersonId) ?? []).forEach((relation) => {
          const neighborId = otherPersonId(relation, currentPersonId);
          if (visited.has(neighborId)) {
            return;
          }
          visited.add(neighborId);
          const neighbor = personById.get(neighborId);
          if (!neighbor) {
            return;
          }
          const neighborFaction = getFactionColorKey(neighbor);
          if (neighborFaction === 'other') {
            nextFrontier.push(neighborId);
          } else {
            nearestSectors.push(neighborFaction);
          }
        });
      });
      frontier = nextFrontier;
    }

    const sectorCounts = new Map<LayoutSector, number>();
    nearestSectors.forEach((sector) => {
      sectorCounts.set(sector, (sectorCounts.get(sector) ?? 0) + 1);
    });
    sectors[person.id] = [...majorLayoutSectors].sort(
      (first, second) =>
        (sectorCounts.get(second) ?? 0) -
        (sectorCounts.get(first) ?? 0),
    )[0] ?? 'neutral';
    if (nearestSectors.length === 0) {
      sectors[person.id] = 'neutral';
    }
  });

  return sectors;
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

function chooseComponentAnchor(
  personIds: string[],
  requestedAnchorId: string,
  degrees: ReadonlyMap<string, number>,
  inputOrder: ReadonlyMap<string, number>,
): string {
  if (personIds.includes(requestedAnchorId)) {
    return requestedAnchorId;
  }
  if (personIds.includes(defaultAnchorPersonId)) {
    return defaultAnchorPersonId;
  }
  return [...personIds].sort(
    (firstId, secondId) =>
      (degrees.get(secondId) ?? 0) - (degrees.get(firstId) ?? 0) ||
      (inputOrder.get(firstId) ?? 0) -
        (inputOrder.get(secondId) ?? 0),
  )[0] ?? personIds[0];
}

function evenlySpacedAngles(
  count: number,
  startAngle: number,
  endAngle: number,
): number[] {
  if (count <= 0) {
    return [];
  }
  if (count === 1) {
    return [(startAngle + endAngle) / 2];
  }
  const step = (endAngle - startAngle) / (count - 1);
  return Array.from(
    { length: count },
    (_, index) => startAngle + index * step,
  );
}

function relationOrder(
  relation: Relation,
  inputOrder: ReadonlyMap<string, number>,
  fromPersonId: string,
): number {
  const typeRank = biologicalParentTypes.has(relation.type)
    ? 0
    : relation.type === 'spouse_of'
      ? 1
      : parentRelationTypes.has(relation.type)
        ? 2
        : 3;
  return (
    typeRank * 100_000 +
    (inputOrder.get(otherPersonId(relation, fromPersonId)) ??
      Number.MAX_SAFE_INTEGER)
  );
}

function biologicalChildrenOf(
  personId: string,
  relations: Relation[],
  allowedPersonIds: ReadonlySet<string>,
  inputOrder: ReadonlyMap<string, number>,
): string[] {
  return relations
    .filter(
      (relation) =>
        isStructuralRelation(relation) &&
        biologicalParentTypes.has(relation.type) &&
        relation.sourcePersonId === personId &&
        allowedPersonIds.has(relation.targetPersonId),
    )
    .map((relation) => relation.targetPersonId)
    .sort(
      (firstId, secondId) =>
        (inputOrder.get(firstId) ?? 0) -
        (inputOrder.get(secondId) ?? 0),
    );
}

function directPartnersOf(
  personId: string,
  relations: Relation[],
  allowedPersonIds: ReadonlySet<string>,
  inputOrder: ReadonlyMap<string, number>,
): string[] {
  return relations
    .filter(
      (relation) =>
        relation.type === 'spouse_of' &&
        isStructuralRelation(relation) &&
        (relation.sourcePersonId === personId ||
          relation.targetPersonId === personId),
    )
    .map((relation) => otherPersonId(relation, personId))
    .filter((partnerId) => allowedPersonIds.has(partnerId))
    .sort(
      (firstId, secondId) =>
        (inputOrder.get(firstId) ?? 0) -
        (inputOrder.get(secondId) ?? 0),
    );
}

function biologicalParentsOf(
  personId: string,
  relations: Relation[],
  allowedPersonIds: ReadonlySet<string>,
  inputOrder: ReadonlyMap<string, number>,
): string[] {
  const biologicalParents = relations
    .filter(
      (relation) =>
        isStructuralRelation(relation) &&
        biologicalParentTypes.has(relation.type) &&
        relation.targetPersonId === personId &&
        allowedPersonIds.has(relation.sourcePersonId),
    )
    .map((relation) => relation.sourcePersonId);
  if (biologicalParents.length > 0) {
    return biologicalParents.sort(
      (firstId, secondId) =>
        (inputOrder.get(firstId) ?? 0) -
        (inputOrder.get(secondId) ?? 0),
    );
  }
  return relations
    .filter(
      (relation) =>
        isStructuralRelation(relation) &&
        (relation.type === 'adoptive_father_of' ||
          relation.type === 'adoptive_mother_of') &&
        relation.targetPersonId === personId &&
        allowedPersonIds.has(relation.sourcePersonId),
    )
    .map((relation) => relation.sourcePersonId)
    .sort(
      (firstId, secondId) =>
        (inputOrder.get(firstId) ?? 0) -
        (inputOrder.get(secondId) ?? 0),
    );
}

function placeAncestors(
  anchorPersonId: string,
  componentPersonIds: ReadonlySet<string>,
  relations: Relation[],
  inputOrder: ReadonlyMap<string, number>,
  profile: LayoutProfile,
  positions: Record<string, GraphPosition>,
  assigned: Set<string>,
): void {
  let currentLevel = [anchorPersonId];
  let depth = 1;
  while (currentLevel.length > 0) {
    const nextLevel = [
      ...new Set(
        currentLevel.flatMap((personId) =>
          biologicalParentsOf(
            personId,
            relations,
            componentPersonIds,
            inputOrder,
          ),
        ),
      ),
    ].filter((personId) => !assigned.has(personId));
    const angles = evenlySpacedAngles(
      nextLevel.length,
      240,
      300,
    );
    nextLevel.forEach((personId, index) => {
      positions[personId] = polarPosition(
        profile.radialGap * depth,
        angles[index] ?? 270,
      );
      assigned.add(personId);
    });
    currentLevel = nextLevel;
    depth += 1;
  }
}

interface HouseholdUnit {
  partnerId: string | null;
  childIds: string[];
  inputRank: number;
  weight: number;
}

function createHouseholdUnits(
  anchorPersonId: string,
  componentPersonIds: ReadonlySet<string>,
  relations: Relation[],
  inputOrder: ReadonlyMap<string, number>,
): HouseholdUnit[] {
  const partners = directPartnersOf(
    anchorPersonId,
    relations,
    componentPersonIds,
    inputOrder,
  );
  const partnerSet = new Set(partners);
  const children = biologicalChildrenOf(
    anchorPersonId,
    relations,
    componentPersonIds,
    inputOrder,
  );
  const childrenByPartner = new Map<string, string[]>();
  const unpartneredChildren: string[] = [];

  children.forEach((childId) => {
    const coParentId = relations
      .filter(
        (relation) =>
          isStructuralRelation(relation) &&
          biologicalParentTypes.has(relation.type) &&
          relation.targetPersonId === childId &&
          relation.sourcePersonId !== anchorPersonId &&
          partnerSet.has(relation.sourcePersonId),
      )
      .sort(
        (first, second) =>
          (inputOrder.get(first.sourcePersonId) ?? 0) -
          (inputOrder.get(second.sourcePersonId) ?? 0),
      )[0]?.sourcePersonId;
    if (coParentId) {
      childrenByPartner.set(coParentId, [
        ...(childrenByPartner.get(coParentId) ?? []),
        childId,
      ]);
    } else {
      unpartneredChildren.push(childId);
    }
  });

  const units: HouseholdUnit[] = partners.map((partnerId) => {
    const childIds = childrenByPartner.get(partnerId) ?? [];
    return {
      partnerId,
      childIds,
      inputRank: inputOrder.get(partnerId) ?? Number.MAX_SAFE_INTEGER,
      weight: Math.max(1, childIds.length),
    };
  });
  if (unpartneredChildren.length > 0) {
    units.push({
      partnerId: null,
      childIds: unpartneredChildren,
      inputRank: Math.min(
        ...unpartneredChildren.map(
          (personId) =>
            inputOrder.get(personId) ?? Number.MAX_SAFE_INTEGER,
        ),
      ),
      weight: unpartneredChildren.length,
    });
  }
  return units.sort(
    (first, second) => first.inputRank - second.inputRank,
  );
}

function placeHouseholds(
  anchorPersonId: string,
  componentPersonIds: ReadonlySet<string>,
  relations: Relation[],
  inputOrder: ReadonlyMap<string, number>,
  profile: LayoutProfile,
  positions: Record<string, GraphPosition>,
  assigned: Set<string>,
): void {
  const units = createHouseholdUnits(
    anchorPersonId,
    componentPersonIds,
    relations,
    inputOrder,
  );
  if (units.length === 0) {
    return;
  }
  const totalWeight = units.reduce(
    (total, unit) => total + unit.weight,
    0,
  );
  const totalSweep = 130;
  const unitGap = units.length > 1 ? 5 : 0;
  const availableSweep = totalSweep - unitGap * (units.length - 1);
  let cursor = 25;

  units.forEach((unit, unitIndex) => {
    const sweep =
      availableSweep * (unit.weight / Math.max(1, totalWeight));
    const unitStart = cursor;
    const unitEnd = cursor + sweep;
    if (unit.partnerId && !assigned.has(unit.partnerId)) {
      const partnerFraction = unitIndex % 2 === 0 ? 0.16 : 0.84;
      positions[unit.partnerId] = polarPosition(
        profile.radialGap,
        unitStart + sweep * partnerFraction,
      );
      assigned.add(unit.partnerId);
    }
    const childStart =
      unit.partnerId && unitIndex % 2 === 0
        ? unitStart + sweep * 0.38
        : unitStart + sweep * 0.08;
    const childEnd =
      unit.partnerId && unitIndex % 2 === 1
        ? unitEnd - sweep * 0.38
        : unitEnd - sweep * 0.08;
    const childAngles = evenlySpacedAngles(
      unit.childIds.length,
      childStart,
      childEnd,
    );
    const childAngleStep =
      unit.childIds.length > 1
        ? Math.abs(childEnd - childStart) /
          (unit.childIds.length - 1)
        : sweep;
    const minimumChildRadius =
      childAngleStep > 0
        ? (profile.minimumDistance + profile.coreExtraDistance) /
          (2 * Math.sin(toRadians(childAngleStep) / 2))
        : profile.radialGap * 2;
    unit.childIds.forEach((childId, childIndex) => {
      if (!assigned.has(childId)) {
        positions[childId] = polarPosition(
          Math.max(profile.radialGap * 2, minimumChildRadius),
          childAngles[childIndex] ??
            (unitStart + unitEnd) / 2,
        );
        assigned.add(childId);
      }
    });
    cursor = unitEnd + unitGap;
  });
}

function placeSideBranches(
  anchorPersonId: string,
  componentPersonIds: string[],
  relations: Relation[],
  inputOrder: ReadonlyMap<string, number>,
  profile: LayoutProfile,
  positions: Record<string, GraphPosition>,
  assigned: Set<string>,
): void {
  const componentSet = new Set(componentPersonIds);
  const adjacency = createRelationAdjacency(componentSet, relations);
  const seeds = (adjacency.get(anchorPersonId) ?? [])
    .map((relation) => otherPersonId(relation, anchorPersonId))
    .filter((personId) => !assigned.has(personId))
    .sort(
      (firstId, secondId) =>
        (inputOrder.get(firstId) ?? 0) -
        (inputOrder.get(secondId) ?? 0),
    );
  if (seeds.length === 0) {
    return;
  }

  const rightSeeds = seeds.filter((_, index) => index % 2 === 0);
  const leftSeeds = seeds.filter((_, index) => index % 2 === 1);
  const angleBySeed = new Map<string, number>();
  evenlySpacedAngles(rightSeeds.length, -24, 24).forEach(
    (angle, index) => {
      const personId = rightSeeds[index];
      if (personId) {
        angleBySeed.set(personId, angle);
      }
    },
  );
  evenlySpacedAngles(leftSeeds.length, 156, 204).forEach(
    (angle, index) => {
      const personId = leftSeeds[index];
      if (personId) {
        angleBySeed.set(personId, angle);
      }
    },
  );

  const ownerByPersonId = new Map<string, string>();
  const depthByPersonId = new Map<string, number>();
  const queue: string[] = [];
  seeds.forEach((seedId) => {
    ownerByPersonId.set(seedId, seedId);
    depthByPersonId.set(seedId, 1);
    queue.push(seedId);
  });
  while (queue.length > 0) {
    const currentPersonId = queue.shift();
    if (!currentPersonId) {
      continue;
    }
    const ownerId = ownerByPersonId.get(currentPersonId);
    const depth = depthByPersonId.get(currentPersonId) ?? 1;
    (adjacency.get(currentPersonId) ?? [])
      .sort(
        (first, second) =>
          relationOrder(first, inputOrder, currentPersonId) -
          relationOrder(second, inputOrder, currentPersonId),
      )
      .forEach((relation) => {
        const neighborId = otherPersonId(relation, currentPersonId);
        if (
          neighborId === anchorPersonId ||
          assigned.has(neighborId) ||
          ownerByPersonId.has(neighborId)
        ) {
          return;
        }
        ownerByPersonId.set(neighborId, ownerId ?? currentPersonId);
        depthByPersonId.set(neighborId, depth + 1);
        queue.push(neighborId);
      });
  }

  seeds.forEach((seedId) => {
    const branchPersonIds = [...ownerByPersonId.entries()]
      .filter(([, ownerId]) => ownerId === seedId)
      .map(([personId]) => personId);
    const branchAngle = angleBySeed.get(seedId) ?? 0;
    const maximumDepth = Math.max(
      ...branchPersonIds.map(
        (personId) => depthByPersonId.get(personId) ?? 1,
      ),
    );
    for (let depth = 1; depth <= maximumDepth; depth += 1) {
      const levelIds = branchPersonIds
        .filter(
          (personId) =>
            (depthByPersonId.get(personId) ?? 1) === depth,
        )
        .sort(
          (firstId, secondId) =>
            (inputOrder.get(firstId) ?? 0) -
            (inputOrder.get(secondId) ?? 0),
        );
      const levelSweep = Math.min(50, 18 + levelIds.length * 10);
      const angles = evenlySpacedAngles(
        levelIds.length,
        branchAngle - levelSweep / 2,
        branchAngle + levelSweep / 2,
      );
      levelIds.forEach((personId, index) => {
        if (!assigned.has(personId)) {
          positions[personId] = polarPosition(
            profile.radialGap * depth,
            angles[index] ?? branchAngle,
          );
          assigned.add(personId);
        }
      });
    }
  });
}

function placeRemainingPeople(
  componentPersonIds: string[],
  inputOrder: ReadonlyMap<string, number>,
  profile: LayoutProfile,
  positions: Record<string, GraphPosition>,
  assigned: Set<string>,
): void {
  const remaining = componentPersonIds
    .filter((personId) => !assigned.has(personId))
    .sort(
      (firstId, secondId) =>
        (inputOrder.get(firstId) ?? 0) -
        (inputOrder.get(secondId) ?? 0),
    );
  const ringCapacity = 8;
  remaining.forEach((personId, index) => {
    const ring = Math.floor(index / ringCapacity) + 2;
    const ringIndex = index % ringCapacity;
    const countOnRing = Math.min(
      ringCapacity,
      remaining.length - (ring - 2) * ringCapacity,
    );
    const angle = (360 / Math.max(1, countOnRing)) * ringIndex - 90;
    positions[personId] = polarPosition(
      profile.radialGap * ring,
      angle,
    );
    assigned.add(personId);
  });
}

function createSemanticComponentLayout(
  componentPersonIds: string[],
  anchorPersonId: string,
  relations: Relation[],
  inputOrder: ReadonlyMap<string, number>,
  profile: LayoutProfile,
): ComponentLayout {
  const componentSet = new Set(componentPersonIds);
  const positions: Record<string, GraphPosition> = {
    [anchorPersonId]: { x: 0, y: 0 },
  };
  const assigned = new Set([anchorPersonId]);

  placeAncestors(
    anchorPersonId,
    componentSet,
    relations,
    inputOrder,
    profile,
    positions,
    assigned,
  );
  placeHouseholds(
    anchorPersonId,
    componentSet,
    relations,
    inputOrder,
    profile,
    positions,
    assigned,
  );
  placeSideBranches(
    anchorPersonId,
    componentPersonIds,
    relations,
    inputOrder,
    profile,
    positions,
    assigned,
  );
  placeRemainingPeople(
    componentPersonIds,
    inputOrder,
    profile,
    positions,
    assigned,
  );

  return { anchorPersonId, personIds: componentPersonIds, positions };
}

function positionsBounds(
  positions: Readonly<Record<string, GraphPosition>>,
): GraphBounds {
  const values = Object.values(positions);
  if (values.length === 0) {
    return {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      width: 0,
      height: 0,
    };
  }
  const xs = values.map((position) => position.x);
  const ys = values.map((position) => position.y);
  const x1 = Math.min(...xs);
  const x2 = Math.max(...xs);
  const y1 = Math.min(...ys);
  const y2 = Math.max(...ys);
  return { x1, y1, x2, y2, width: x2 - x1, height: y2 - y1 };
}

function translateComponents(
  components: ComponentLayout[],
  profile: LayoutProfile,
  lockedPersonIds: ReadonlySet<string>,
  previousPositions: Readonly<Record<string, GraphPosition>>,
): {
  positions: Record<string, GraphPosition>;
  componentCenters: ReadonlyMap<string, GraphPosition>;
} {
  const positions: Record<string, GraphPosition> = {};
  const componentCenters = new Map<string, GraphPosition>();
  const primaryBounds = positionsBounds(components[0]?.positions ?? {});
  const primaryExtent =
    Math.max(primaryBounds.width, primaryBounds.height) / 2;

  components.forEach((component, index) => {
    const localBounds = positionsBounds(component.positions);
    const localExtent = Math.max(localBounds.width, localBounds.height) / 2;
    const lockedAnchorPosition =
      lockedPersonIds.has(component.anchorPersonId)
        ? previousPositions[component.anchorPersonId]
        : undefined;
    let center: GraphPosition;
    if (lockedAnchorPosition) {
      center = lockedAnchorPosition;
    } else if (index === 0) {
      center = { x: 0, y: 0 };
    } else {
      const ring = Math.ceil(index / 6);
      const angle = (index - 1) * 137.5;
      const radius =
        primaryExtent +
        localExtent +
        profile.componentGap +
        (ring - 1) * (localExtent * 2 + profile.componentGap);
      center = polarPosition(radius, angle);
    }
    component.personIds.forEach((personId) => {
      const localPosition = component.positions[personId] ?? {
        x: 0,
        y: 0,
      };
      positions[personId] = {
        x: localPosition.x + center.x,
        y: localPosition.y + center.y,
      };
      componentCenters.set(personId, center);
    });
  });

  return { positions, componentCenters };
}

function translateComponentsBySector(
  components: ComponentLayout[],
  sectors: Readonly<Record<string, LayoutSector>>,
  profile: LayoutProfile,
  lockedPersonIds: ReadonlySet<string>,
  previousPositions: Readonly<Record<string, GraphPosition>>,
): {
  positions: Record<string, GraphPosition>;
  componentCenters: ReadonlyMap<string, GraphPosition>;
} {
  const positions: Record<string, GraphPosition> = {};
  const componentCenters = new Map<string, GraphPosition>();
  const sectorOrder: LayoutSector[] = ['wei', 'shu', 'wu', 'neutral'];

  sectorOrder.forEach((sector) => {
    const sectorComponents = components.filter(
      (component) =>
        sectors[component.anchorPersonId] === sector,
    );
    if (sectorComponents.length === 0) {
      return;
    }
    const translated = translateComponents(
      sectorComponents,
      profile,
      lockedPersonIds,
      previousPositions,
    );
    Object.assign(positions, translated.positions);
    translated.componentCenters.forEach((center, personId) => {
      componentCenters.set(personId, center);
    });
  });

  return { positions, componentCenters };
}

function applyFactionSectors(
  initialPositions: Record<string, GraphPosition>,
  initialComponentCenters: ReadonlyMap<string, GraphPosition>,
  sectors: Readonly<Record<string, LayoutSector>>,
  profile: LayoutProfile,
): {
  positions: Record<string, GraphPosition>;
  componentCenters: ReadonlyMap<string, GraphPosition>;
} {
  const sectorPersonIds = new Map<LayoutSector, string[]>();
  Object.keys(initialPositions).forEach((personId) => {
    const sector = sectors[personId] ?? 'neutral';
    sectorPersonIds.set(sector, [
      ...(sectorPersonIds.get(sector) ?? []),
      personId,
    ]);
  });
  const sectorBounds = new Map<LayoutSector, GraphBounds>();
  sectorPersonIds.forEach((personIds, sector) => {
    sectorBounds.set(
      sector,
      positionsBounds(
        Object.fromEntries(
          personIds.map((personId) => [
            personId,
            initialPositions[personId] ?? { x: 0, y: 0 },
          ]),
        ),
      ),
    );
  });

  const maximumHalfWidth = Math.max(
    profile.radialGap,
    ...[...sectorBounds.values()].map((bounds) => bounds.width / 2),
  );
  const maximumHalfHeight = Math.max(
    profile.radialGap,
    ...[...sectorBounds.values()].map((bounds) => bounds.height / 2),
  );
  const horizontalOffset =
    maximumHalfWidth + profile.componentGap + profile.minimumDistance;
  const verticalOffset =
    maximumHalfHeight + profile.componentGap + profile.minimumDistance;
  const targetCenters: Readonly<Record<LayoutSector, GraphPosition>> = {
    wei: { x: 0, y: -verticalOffset },
    shu: { x: -horizontalOffset, y: verticalOffset },
    wu: { x: horizontalOffset, y: verticalOffset },
    neutral: { x: 0, y: verticalOffset * 3 },
  };
  const translations = new Map<LayoutSector, GraphPosition>();
  sectorBounds.forEach((bounds, sector) => {
    const target = targetCenters[sector];
    translations.set(sector, {
      x: target.x - (bounds.x1 + bounds.x2) / 2,
      y: target.y - (bounds.y1 + bounds.y2) / 2,
    });
  });

  const positions: Record<string, GraphPosition> = {};
  const componentCenters = new Map<string, GraphPosition>();
  Object.entries(initialPositions).forEach(([personId, position]) => {
    const sector = sectors[personId] ?? 'neutral';
    const translation = translations.get(sector) ?? { x: 0, y: 0 };
    positions[personId] = {
      x: position.x + translation.x,
      y: position.y + translation.y,
    };
    const componentCenter =
      initialComponentCenters.get(personId) ?? { x: 0, y: 0 };
    componentCenters.set(personId, {
      x: componentCenter.x + translation.x,
      y: componentCenter.y + translation.y,
    });
  });

  return { positions, componentCenters };
}

function placeIsolatedFactionGrids(
  initialPositions: Record<string, GraphPosition>,
  initialComponentCenters: ReadonlyMap<string, GraphPosition>,
  isolatedPersonIds: readonly string[],
  sectors: Readonly<Record<string, LayoutSector>>,
  profile: LayoutProfile,
  inputOrder: ReadonlyMap<string, number>,
): {
  positions: Record<string, GraphPosition>;
  componentCenters: ReadonlyMap<string, GraphPosition>;
} {
  const positions = { ...initialPositions };
  const componentCenters = new Map(initialComponentCenters);
  const connectedBounds = positionsBounds(initialPositions);
  const centerX = (connectedBounds.x1 + connectedBounds.x2) / 2;
  const centerY = (connectedBounds.y1 + connectedBounds.y2) / 2;
  const spacing = profile.minimumDistance;
  const gap = profile.componentGap + spacing;
  const sectorOrder: LayoutSector[] = ['wei', 'shu', 'wu', 'neutral'];

  sectorOrder.forEach((sector) => {
    const personIds = isolatedPersonIds
      .filter((personId) => (sectors[personId] ?? 'neutral') === sector)
      .sort(
        (first, second) =>
          (inputOrder.get(first) ?? 0) - (inputOrder.get(second) ?? 0),
      );
    if (personIds.length === 0) {
      return;
    }
    const columns = Math.max(
      1,
      Math.ceil(Math.sqrt(personIds.length * 1.6)),
    );
    const rows = Math.ceil(personIds.length / columns);
    const gridWidth = (columns - 1) * spacing;
    const gridHeight = (rows - 1) * spacing;

    personIds.forEach((personId, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      let position: GraphPosition;
      if (sector === 'wei') {
        position = {
          x: centerX - gridWidth / 2 + column * spacing,
          y: connectedBounds.y1 - gap - gridHeight + row * spacing,
        };
      } else if (sector === 'shu') {
        position = {
          x: connectedBounds.x1 - gap - gridWidth + column * spacing,
          y: centerY + gap + row * spacing,
        };
      } else if (sector === 'wu') {
        position = {
          x: connectedBounds.x2 + gap + column * spacing,
          y: centerY + gap + row * spacing,
        };
      } else {
        position = {
          x: centerX - gridWidth / 2 + column * spacing,
          y: connectedBounds.y2 + gap + row * spacing,
        };
      }
      positions[personId] = position;
      componentCenters.set(personId, position);
    });
  });

  return { positions, componentCenters };
}

function spatialCellKey(
  position: GraphPosition,
  cellSize: number,
): string {
  return `${Math.floor(position.x / cellSize)}:${Math.floor(
    position.y / cellSize,
  )}`;
}

function resolveCollisions(
  initialPositions: Record<string, GraphPosition>,
  componentCenters: ReadonlyMap<string, GraphPosition>,
  persons: Person[],
  profile: LayoutProfile,
  anchorPersonId: string,
  lockedPersonIds: ReadonlySet<string>,
  previousPositions: Readonly<Record<string, GraphPosition>>,
  inputOrder: ReadonlyMap<string, number>,
): Record<string, GraphPosition> {
  const positions = { ...initialPositions };
  lockedPersonIds.forEach((personId) => {
    const previousPosition = previousPositions[personId];
    if (previousPosition && positions[personId]) {
      positions[personId] = { ...previousPosition };
    }
  });

  const cellSize = profile.minimumDistance + profile.coreExtraDistance;
  const cells = new Map<string, string[]>();
  const placed = new Set<string>();
  const addToGrid = (personId: string) => {
    const position = positions[personId];
    if (!position) {
      return;
    }
    const key = spatialCellKey(position, cellSize);
    cells.set(key, [...(cells.get(key) ?? []), personId]);
    placed.add(personId);
  };
  const nearbyPersonIds = (position: GraphPosition): string[] => {
    const cellX = Math.floor(position.x / cellSize);
    const cellY = Math.floor(position.y / cellSize);
    const result: string[] = [];
    for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
      for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
        result.push(
          ...(cells.get(`${cellX + xOffset}:${cellY + yOffset}`) ?? []),
        );
      }
    }
    return result;
  };
  const requiredDistance = (
    firstPersonId: string,
    secondPersonId: string,
  ) =>
    profile.minimumDistance +
    (firstPersonId === anchorPersonId ||
    secondPersonId === anchorPersonId
      ? profile.coreExtraDistance
      : 0);
  const collides = (personId: string, position: GraphPosition) =>
    nearbyPersonIds(position).some((otherPersonId) => {
      const otherPosition = positions[otherPersonId];
      return (
        otherPosition !== undefined &&
        distance(position, otherPosition) <
          requiredDistance(personId, otherPersonId)
      );
    });

  persons
    .filter((person) => lockedPersonIds.has(person.id))
    .forEach((person) => addToGrid(person.id));
  persons
    .filter((person) => !lockedPersonIds.has(person.id))
    .sort((first, second) => {
      if (first.id === anchorPersonId) {
        return -1;
      }
      if (second.id === anchorPersonId) {
        return 1;
      }
      const firstPosition = positions[first.id] ?? { x: 0, y: 0 };
      const secondPosition = positions[second.id] ?? { x: 0, y: 0 };
      const firstCenter =
        componentCenters.get(first.id) ?? { x: 0, y: 0 };
      const secondCenter =
        componentCenters.get(second.id) ?? { x: 0, y: 0 };
      return (
        distance(firstPosition, firstCenter) -
          distance(secondPosition, secondCenter) ||
        (inputOrder.get(first.id) ?? 0) -
          (inputOrder.get(second.id) ?? 0)
      );
    })
    .forEach((person) => {
      let position = positions[person.id] ?? { x: 0, y: 0 };
      const center =
        componentCenters.get(person.id) ?? { x: 0, y: 0 };
      let dx = position.x - center.x;
      let dy = position.y - center.y;
      if (Math.hypot(dx, dy) < 0.001) {
        const fallbackAngle =
          ((inputOrder.get(person.id) ?? 0) * 137.5) % 360;
        const fallback = polarPosition(1, fallbackAngle);
        dx = fallback.x;
        dy = fallback.y;
      }
      const vectorLength = Math.max(1, Math.hypot(dx, dy));
      const unitX = dx / vectorLength;
      const unitY = dy / vectorLength;
      const step = Math.max(36, profile.minimumDistance * 0.34);
      let attempts = 0;
      while (collides(person.id, position) && attempts < 500) {
        position = {
          x: position.x + unitX * step,
          y: position.y + unitY * step,
        };
        attempts += 1;
      }
      positions[person.id] = position;
      addToGrid(person.id);
    });

  return positions;
}

function normalizedPairKey(relation: Relation): string {
  return [
    relation.sourcePersonId,
    relation.targetPersonId,
  ]
    .sort()
    .join('|');
}

function quadraticPoint(
  source: GraphPosition,
  control: GraphPosition,
  target: GraphPosition,
  progress: number,
): GraphPosition {
  const inverse = 1 - progress;
  return {
    x:
      inverse * inverse * source.x +
      2 * inverse * progress * control.x +
      progress * progress * target.x,
    y:
      inverse * inverse * source.y +
      2 * inverse * progress * control.y +
      progress * progress * target.y,
  };
}

export function sampleGraphEdgeRoute(
  source: GraphPosition,
  target: GraphPosition,
  route: GraphEdgeRoute,
  segmentCount = 64,
): GraphPosition[] {
  if (
    route.curveStyle === 'straight' ||
    Math.abs(route.controlPointDistance) < 0.001
  ) {
    return [source, target];
  }
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const midpoint = {
    x:
      source.x +
      dx * route.controlPointWeight,
    y:
      source.y +
      dy * route.controlPointWeight,
  };
  const control = {
    x:
      midpoint.x -
      (dy / length) * route.controlPointDistance,
    y:
      midpoint.y +
      (dx / length) * route.controlPointDistance,
  };
  return Array.from({ length: segmentCount + 1 }, (_, index) =>
    quadraticPoint(
      source,
      control,
      target,
      index / segmentCount,
    ),
  );
}

function pointToSegmentDistance(
  point: GraphPosition,
  source: GraphPosition,
  target: GraphPosition,
): number {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const denominator = dx * dx + dy * dy;
  if (denominator === 0) {
    return distance(point, source);
  }
  const progress = Math.max(
    0,
    Math.min(
      1,
      ((point.x - source.x) * dx +
        (point.y - source.y) * dy) /
        denominator,
    ),
  );
  return distance(point, {
    x: source.x + progress * dx,
    y: source.y + progress * dy,
  });
}

function polylineDistanceToPoint(
  points: GraphPosition[],
  point: GraphPosition,
): number {
  let minimumDistance = Number.POSITIVE_INFINITY;
  for (let index = 1; index < points.length; index += 1) {
    const source = points[index - 1];
    const target = points[index];
    if (source && target) {
      minimumDistance = Math.min(
        minimumDistance,
        pointToSegmentDistance(point, source, target),
      );
    }
  }
  return minimumDistance;
}

function orientation(
  first: GraphPosition,
  second: GraphPosition,
  third: GraphPosition,
): number {
  return (
    (second.x - first.x) * (third.y - first.y) -
    (second.y - first.y) * (third.x - first.x)
  );
}

function segmentsCross(
  firstSource: GraphPosition,
  firstTarget: GraphPosition,
  secondSource: GraphPosition,
  secondTarget: GraphPosition,
): boolean {
  return (
    orientation(firstSource, firstTarget, secondSource) *
      orientation(firstSource, firstTarget, secondTarget) <
      0 &&
    orientation(secondSource, secondTarget, firstSource) *
      orientation(secondSource, secondTarget, firstTarget) <
      0
  );
}

function polylineCrossings(
  points: GraphPosition[],
  routed: RoutedPolyline[],
  relation: Relation,
): number {
  let crossings = 0;
  routed.forEach((existing) => {
    const sharesEndpoint =
      relation.sourcePersonId === existing.relation.sourcePersonId ||
      relation.sourcePersonId === existing.relation.targetPersonId ||
      relation.targetPersonId === existing.relation.sourcePersonId ||
      relation.targetPersonId === existing.relation.targetPersonId;
    if (sharesEndpoint) {
      return;
    }
    for (let firstIndex = 1; firstIndex < points.length; firstIndex += 1) {
      const firstSource = points[firstIndex - 1];
      const firstTarget = points[firstIndex];
      if (!firstSource || !firstTarget) {
        continue;
      }
      for (
        let secondIndex = 1;
        secondIndex < existing.points.length;
        secondIndex += 1
      ) {
        const secondSource = existing.points[secondIndex - 1];
        const secondTarget = existing.points[secondIndex];
        if (
          secondSource &&
          secondTarget &&
          segmentsCross(
            firstSource,
            firstTarget,
            secondSource,
            secondTarget,
          )
        ) {
          crossings += 1;
          break;
        }
      }
    }
  });
  return crossings;
}

function routeCollisionCount(
  points: GraphPosition[],
  relation: Relation,
  positions: Readonly<Record<string, GraphPosition>>,
  spatialIndex: ReadonlyMap<string, readonly string[]>,
  spatialCellSize: number,
  anchorPersonId: string,
): number {
  const candidatePersonIds = new Set<string>();
  const collisionRadius = 47;
  for (let index = 1; index < points.length; index += 1) {
    const source = points[index - 1];
    const target = points[index];
    if (!source || !target) {
      continue;
    }
    const minimumCellX = Math.floor(
      (Math.min(source.x, target.x) - collisionRadius) /
        spatialCellSize,
    );
    const maximumCellX = Math.floor(
      (Math.max(source.x, target.x) + collisionRadius) /
        spatialCellSize,
    );
    const minimumCellY = Math.floor(
      (Math.min(source.y, target.y) - collisionRadius) /
        spatialCellSize,
    );
    const maximumCellY = Math.floor(
      (Math.max(source.y, target.y) + collisionRadius) /
        spatialCellSize,
    );
    for (let cellX = minimumCellX; cellX <= maximumCellX; cellX += 1) {
      for (let cellY = minimumCellY; cellY <= maximumCellY; cellY += 1) {
        (spatialIndex.get(`${cellX}:${cellY}`) ?? []).forEach(
          (personId) => candidatePersonIds.add(personId),
        );
      }
    }
  }
  return [...candidatePersonIds].filter((personId) => {
    const position = positions[personId];
    return (
      position !== undefined &&
      personId !== relation.sourcePersonId &&
      personId !== relation.targetPersonId &&
      polylineDistanceToPoint(points, position) <
        (personId === anchorPersonId ? 47 : 41)
    );
  }).length;
}

function createEdgeRoutes(
  relations: Relation[],
  positions: Readonly<Record<string, GraphPosition>>,
  anchorPersonId: string,
): Record<string, GraphEdgeRoute> {
  const spatialCellSize = 112;
  const spatialIndex = new Map<string, string[]>();
  Object.entries(positions).forEach(([personId, position]) => {
    const key = spatialCellKey(position, spatialCellSize);
    spatialIndex.set(key, [...(spatialIndex.get(key) ?? []), personId]);
  });
  const pairGroups = new Map<string, Relation[]>();
  relations.forEach((relation) => {
    const key = normalizedPairKey(relation);
    pairGroups.set(key, [...(pairGroups.get(key) ?? []), relation]);
  });
  const routed: RoutedPolyline[] = [];
  const routes: Record<string, GraphEdgeRoute> = {};

  relations.forEach((relation) => {
    const source = positions[relation.sourcePersonId];
    const target = positions[relation.targetPersonId];
    if (!source || !target) {
      return;
    }
    const pairRelations = pairGroups.get(normalizedPairKey(relation)) ?? [
      relation,
    ];
    const pairIndex = pairRelations.findIndex(
      (candidate) => candidate.id === relation.id,
    );
    const isParallel = pairRelations.length > 1;
    const kind: GraphEdgeRouteKind = isParallel
      ? 'parallel'
      : relation.origin === 'candidate'
        ? 'secondary'
        : biologicalParentTypes.has(relation.type) ||
          relation.type === 'spouse_of'
        ? 'primary'
        : 'secondary';
    if (kind === 'primary') {
      const straightRoute: GraphEdgeRoute = {
        kind,
        curveStyle: 'straight',
        controlPointDistance: 0,
        controlPointWeight: 0.5,
      };
      const straightPoints = sampleGraphEdgeRoute(
        source,
        target,
        straightRoute,
      );
      if (
        routeCollisionCount(
          straightPoints,
          relation,
          positions,
          spatialIndex,
          spatialCellSize,
          anchorPersonId,
        ) === 0
      ) {
        routes[relation.id] = straightRoute;
        routed.push({ relation, points: straightPoints });
        return;
      }
    }
    const midpoint = {
      x: (source.x + target.x) / 2,
      y: (source.y + target.y) / 2,
    };
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const normal = { x: -dy / length, y: dx / length };
    const positiveControl = {
      x: midpoint.x + normal.x * 36,
      y: midpoint.y + normal.y * 36,
    };
    const negativeControl = {
      x: midpoint.x - normal.x * 36,
      y: midpoint.y - normal.y * 36,
    };
    const outwardSign =
      distance(positiveControl, { x: 0, y: 0 }) >=
      distance(negativeControl, { x: 0, y: 0 })
        ? 1
        : -1;
    let candidateDistanceBatches: number[][];
    if (isParallel) {
      const pairSign = pairIndex % 2 === 0 ? -1 : 1;
      const pairLevel = Math.floor(pairIndex / 2) + 1;
      candidateDistanceBatches = [
        pairSign * 36 * pairLevel,
        pairSign * 72 * pairLevel,
        pairSign * 108 * pairLevel,
        pairSign * 144 * pairLevel,
        pairSign * 180 * pairLevel,
      ].map((distanceValue) => [distanceValue]);
    } else {
      const distanceLevelCount = Math.min(
        160,
        Math.max(24, Math.ceil((length * 0.55) / 36)),
      );
      candidateDistanceBatches = Array.from(
        { length: distanceLevelCount },
        (_, index) => (index + 1) * 36,
      ).map((magnitude) => [
          magnitude * outwardSign,
          -magnitude * outwardSign,
        ]);
    }

    let best:
      | {
          route: GraphEdgeRoute;
          points: GraphPosition[];
          score: number;
        }
      | undefined;
    const candidateWeights = isParallel
      ? [0.5]
      : [0.5, 0.35, 0.65, 0.2, 0.8, 0.1, 0.9, 0.05, 0.95];
    for (const distanceBatch of candidateDistanceBatches) {
      let foundCollisionFreeRoute = false;
      for (const controlPointDistance of distanceBatch) {
        for (const controlPointWeight of candidateWeights) {
          const route: GraphEdgeRoute = {
            kind,
            curveStyle:
              controlPointDistance === 0
                ? 'straight'
                : 'unbundled-bezier',
            controlPointDistance,
            controlPointWeight,
          };
          const points = sampleGraphEdgeRoute(source, target, route);
          const collisions = routeCollisionCount(
            points,
            relation,
            positions,
            spatialIndex,
            spatialCellSize,
            anchorPersonId,
          );
          const crossings =
            collisions === 0
              ? polylineCrossings(points, routed, relation)
              : 0;
          const bendPenalty =
            Math.abs(controlPointDistance) / 180 +
            Math.abs(controlPointWeight - 0.5);
          const score =
            collisions * 10_000 + crossings * 10 + bendPenalty;
          if (!best || score < best.score) {
            best = { route, points, score };
          }
          if (collisions === 0) {
            foundCollisionFreeRoute = true;
          }
        }
      }
      if (foundCollisionFreeRoute) {
        break;
      }
    }
    const selected =
      best ?? {
        route: {
          kind,
          curveStyle: 'straight' as const,
          controlPointDistance: 0,
          controlPointWeight: 0.5,
        },
        points: [source, target],
        score: 0,
      };
    routes[relation.id] = selected.route;
    routed.push({ relation, points: selected.points });
  });

  return routes;
}

export function createGraphLayout(
  persons: Person[],
  relations: Relation[],
  options: GraphLayoutOptions,
): GraphLayout {
  const profile = options.compact ? compactProfile : desktopProfile;
  const requestedAnchorId =
    options.anchorPersonId ?? defaultAnchorPersonId;
  const lockedPersonIds =
    options.lockedPersonIds ?? new Set<string>();
  const previousPositions = options.previousPositions ?? {};
  const inputOrder = createInputOrder(persons);
  const degrees = createDegreeMap(persons, relations);
  const generations = createGenerations(persons, relations);
  const sectors = createLayoutSectors(persons, relations);
  const sameSectorRelations = relations.filter(
    (relation) =>
      sectors[relation.sourcePersonId] !== undefined &&
      sectors[relation.sourcePersonId] === sectors[relation.targetPersonId],
  );
  const sectorAnchorIds: Readonly<Record<LayoutSector, string>> = {
    wei: defaultAnchorPersonId,
    shu: 'person:sg:liu_bei',
    wu: 'person:sg:sun_quan',
    neutral: requestedAnchorId,
  };
  const requestedAnchorSector = sectors[requestedAnchorId];
  const componentSeeds = createConnectedComponents(
    persons,
    sameSectorRelations,
  )
    .map((personIds) => ({
      personIds,
      anchorPersonId: chooseComponentAnchor(
        personIds,
        requestedAnchorSector === sectors[personIds[0] ?? '']
          ? requestedAnchorId
          : sectorAnchorIds[sectors[personIds[0] ?? ''] ?? 'neutral'],
        degrees,
        inputOrder,
      ),
    }))
    .sort((first, second) => {
      if (first.personIds.includes(requestedAnchorId)) {
        return -1;
      }
      if (second.personIds.includes(requestedAnchorId)) {
        return 1;
      }
      const firstSector = sectors[first.anchorPersonId] ?? 'neutral';
      const secondSector = sectors[second.anchorPersonId] ?? 'neutral';
      const firstIsSectorAnchor =
        first.anchorPersonId === sectorAnchorIds[firstSector];
      const secondIsSectorAnchor =
        second.anchorPersonId === sectorAnchorIds[secondSector];
      if (firstIsSectorAnchor !== secondIsSectorAnchor) {
        return firstIsSectorAnchor ? -1 : 1;
      }
      return (
        (inputOrder.get(first.anchorPersonId) ?? 0) -
        (inputOrder.get(second.anchorPersonId) ?? 0)
      );
    });
  const isolatedPersonIds = componentSeeds
    .filter(
      (component) =>
        component.personIds.length === 1 &&
        (degrees.get(component.personIds[0] ?? '') ?? 0) === 0,
    )
    .flatMap((component) => component.personIds);
  const components = componentSeeds
    .filter(
      (component) =>
        component.personIds.length > 1 ||
        (degrees.get(component.personIds[0] ?? '') ?? 0) > 0,
    )
    .map(({ personIds, anchorPersonId }) =>
      createSemanticComponentLayout(
        personIds,
        anchorPersonId,
        relations,
        inputOrder,
        profile,
      ),
    );
  const translated = translateComponentsBySector(
    components,
    sectors,
    profile,
    lockedPersonIds,
    previousPositions,
  );
  const sectorized = applyFactionSectors(
    translated.positions,
    translated.componentCenters,
    sectors,
    profile,
  );
  const withIsolatedGrids = placeIsolatedFactionGrids(
    sectorized.positions,
    sectorized.componentCenters,
    isolatedPersonIds,
    sectors,
    profile,
    inputOrder,
  );
  const anchorPersonId =
    components[0]?.anchorPersonId ?? requestedAnchorId;
  const positions = resolveCollisions(
    withIsolatedGrids.positions,
    withIsolatedGrids.componentCenters,
    persons,
    profile,
    anchorPersonId,
    lockedPersonIds,
    previousPositions,
    inputOrder,
  );

  return {
    positions,
    generations: Object.fromEntries(generations),
    sectors,
    bounds: positionsBounds(positions),
    edgeRoutes: createEdgeRoutes(
      relations,
      positions,
      anchorPersonId,
    ),
  };
}
