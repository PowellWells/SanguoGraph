import type {
  ImportBatch,
  Person,
  Relation,
  RelationType,
  VisualFaction,
} from '../domain';
import { getFactionColorKey } from './graphVisualEncoding';

export const IMPORT_BATCHES: readonly ImportBatch[] = [1, 2, 3, 4, 5, 6, 7];

export const VISUAL_FACTIONS: readonly VisualFaction[] = [
  'wei',
  'shu',
  'wu',
  'other',
];

export const RELATION_TYPES: readonly RelationType[] = [
  'father_of',
  'mother_of',
  'spouse_of',
  'adoptive_father_of',
  'adoptive_mother_of',
  'clan_relative_of',
];

export interface RelationCoverageGroup {
  totalPeople: number;
  relatedPeople: number;
  isolatedPeople: number;
  coveragePercent: number;
}

export interface RelationCoverageReport {
  personCount: number;
  relationCount: number;
  relatedPersonCount: number;
  isolatedPersonCount: number;
  coveragePercent: number;
  isolatedPersonIds: string[];
  byImportBatch: Record<ImportBatch, RelationCoverageGroup>;
  byVisualFaction: Record<VisualFaction, RelationCoverageGroup>;
  byRelationType: Record<RelationType, number>;
  connectedComponentCount: number;
  largestConnectedComponentSizes: number[];
}

export type RelationResearchCohort =
  | 'family_batch_gap'
  | 'major_roster'
  | 'complete_roster';

interface RelationGraphData {
  persons: readonly Person[];
  relations: readonly Relation[];
}

function percentage(part: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Number(((part / total) * 100).toFixed(1));
}

function coverageGroup(
  persons: readonly Person[],
  relatedPersonIds: ReadonlySet<string>,
): RelationCoverageGroup {
  const relatedPeople = persons.filter((person) =>
    relatedPersonIds.has(person.id),
  ).length;
  return {
    totalPeople: persons.length,
    relatedPeople,
    isolatedPeople: persons.length - relatedPeople,
    coveragePercent: percentage(relatedPeople, persons.length),
  };
}

function connectedComponentSizes(
  relatedPersonIds: ReadonlySet<string>,
  relations: readonly Relation[],
): number[] {
  const neighbors = new Map<string, Set<string>>();
  for (const personId of relatedPersonIds) {
    neighbors.set(personId, new Set());
  }
  for (const relation of relations) {
    neighbors.get(relation.sourcePersonId)?.add(relation.targetPersonId);
    neighbors.get(relation.targetPersonId)?.add(relation.sourcePersonId);
  }

  const visited = new Set<string>();
  const sizes: number[] = [];
  for (const personId of relatedPersonIds) {
    if (visited.has(personId)) {
      continue;
    }
    const pending = [personId];
    visited.add(personId);
    let size = 0;
    while (pending.length > 0) {
      const current = pending.pop();
      if (!current) {
        continue;
      }
      size += 1;
      for (const neighbor of neighbors.get(current) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          pending.push(neighbor);
        }
      }
    }
    sizes.push(size);
  }
  return sizes.sort((first, second) => second - first);
}

export function analyzeRelationCoverage(
  data: RelationGraphData,
): RelationCoverageReport {
  const relatedPersonIds = new Set<string>();
  const byRelationType = Object.fromEntries(
    RELATION_TYPES.map((type) => [type, 0]),
  ) as Record<RelationType, number>;

  for (const relation of data.relations) {
    relatedPersonIds.add(relation.sourcePersonId);
    relatedPersonIds.add(relation.targetPersonId);
    byRelationType[relation.type] += 1;
  }

  const isolatedPersonIds = data.persons
    .filter((person) => !relatedPersonIds.has(person.id))
    .map((person) => person.id);
  const byImportBatch = Object.fromEntries(
    IMPORT_BATCHES.map((batch) => [
      batch,
      coverageGroup(
        data.persons.filter((person) => person.importBatch === batch),
        relatedPersonIds,
      ),
    ]),
  ) as Record<ImportBatch, RelationCoverageGroup>;
  const byVisualFaction = Object.fromEntries(
    VISUAL_FACTIONS.map((faction) => [
      faction,
      coverageGroup(
        data.persons.filter(
          (person) => getFactionColorKey(person) === faction,
        ),
        relatedPersonIds,
      ),
    ]),
  ) as Record<VisualFaction, RelationCoverageGroup>;
  const componentSizes = connectedComponentSizes(
    relatedPersonIds,
    data.relations,
  );

  return {
    personCount: data.persons.length,
    relationCount: data.relations.length,
    relatedPersonCount: relatedPersonIds.size,
    isolatedPersonCount: isolatedPersonIds.length,
    coveragePercent: percentage(relatedPersonIds.size, data.persons.length),
    isolatedPersonIds,
    byImportBatch,
    byVisualFaction,
    byRelationType,
    connectedComponentCount: componentSizes.length,
    largestConnectedComponentSizes: componentSizes.slice(0, 10),
  };
}

export function getRelationResearchCohort(
  person: Person,
): RelationResearchCohort {
  if (person.importBatch === 2) {
    return 'major_roster';
  }
  if (person.importBatch === 6 || person.importBatch === 7) {
    return 'complete_roster';
  }
  return 'family_batch_gap';
}

export function buildRelationResearchQueue(
  data: RelationGraphData,
  report: RelationCoverageReport = analyzeRelationCoverage(data),
): Record<RelationResearchCohort, Person[]> {
  const isolatedPersonIds = new Set(report.isolatedPersonIds);
  const queue: Record<RelationResearchCohort, Person[]> = {
    family_batch_gap: [],
    major_roster: [],
    complete_roster: [],
  };
  for (const person of data.persons) {
    if (isolatedPersonIds.has(person.id)) {
      queue[getRelationResearchCohort(person)].push(person);
    }
  }
  return queue;
}
