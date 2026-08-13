import type {
  HistoricalLayer,
  HistoricalSource,
  Person,
  Relation,
} from '../domain';
import { relationTypeLabels } from './relationPresentation';

export type SourceBrowserLayer = HistoricalLayer | 'all';
export type SourceUsageKind = 'person' | 'supporting' | 'opposing';

export interface SourceUsage {
  persons: Person[];
  supportingRelations: Relation[];
  opposingRelations: Relation[];
}

export const sourceBrowserLayerLabels: Readonly<
  Record<SourceBrowserLayer, string>
> = {
  all: '全部史料层',
  official_history: '正史正文',
  annotated_history: '注引材料',
  later_tradition: '其他古代史料',
  literature: '文学作品',
  structured_candidate: '结构化候选',
};

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase('zh-CN');
}

export function getSourceUsage(
  sourceId: string,
  persons: Person[],
  relations: Relation[],
): SourceUsage {
  return {
    persons: persons.filter((person) => person.sourceIds.includes(sourceId)),
    supportingRelations: relations.filter((relation) =>
      relation.sourceIds.includes(sourceId),
    ),
    opposingRelations: relations.filter((relation) =>
      relation.claim?.opposingSourceIds.includes(sourceId),
    ),
  };
}

export function buildSourceSearchText(
  source: HistoricalSource,
  usage: SourceUsage,
  peopleById: ReadonlyMap<string, Person>,
): string {
  const relationText = [
    ...usage.supportingRelations,
    ...usage.opposingRelations,
  ].flatMap((relation) => [
    peopleById.get(relation.sourcePersonId)?.name ?? '',
    peopleById.get(relation.targetPersonId)?.name ?? '',
    relationTypeLabels[relation.type],
    relation.claim?.relationshipQualifier ?? relation.note,
  ]);
  return normalizeSearchText(
    [
      source.work,
      source.reference,
      source.section,
      source.author ?? '',
      source.commentator ?? '',
      source.quotation ?? '',
      source.note,
      ...usage.persons.flatMap((person) => [
        person.name,
        person.courtesyName ?? '',
        ...person.otherNames,
      ]),
      ...relationText,
    ].join(' '),
  );
}

export function filterSources(
  sources: HistoricalSource[],
  persons: Person[],
  relations: Relation[],
  query: string,
  layer: SourceBrowserLayer,
): HistoricalSource[] {
  const normalizedQuery = normalizeSearchText(query);
  const peopleById = new Map(persons.map((person) => [person.id, person]));
  return sources.filter((source) => {
    if (layer !== 'all' && source.historicalLayer !== layer) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return buildSourceSearchText(
      source,
      getSourceUsage(source.id, persons, relations),
      peopleById,
    ).includes(normalizedQuery);
  });
}
