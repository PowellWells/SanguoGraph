import personsJson from './persons.json';
import sourcesJson from './sources.json';
import type {
  HistoricalLayer,
  HistoricalSource,
  Person,
  VisualFaction,
} from '../domain';
import { getFactionColorKey } from '../services/graphVisualEncoding';
import { familyPersons } from './familyPersons';
import { familySources } from './familySources';
import { fifthFamilyPersons } from './fifthFamilyPersons';
import { fifthFamilySources } from './fifthFamilySources';
import { fourthFamilyPersons } from './fourthFamilyPersons';
import { fourthFamilySources } from './fourthFamilySources';
import { majorPersons } from './majorPersons';
import { majorSources } from './majorSources';
import { sixthRosterManifest, sixthRosterPersons } from './sixthRoster';
import { sixthRosterRelationshipBatchOneSources } from './sixthRosterRelationshipBatchOneSources';
import { seventhSourceAuditBatchOnePersons } from './seventhSourceAuditBatchOnePersons';
import { seventhSourceAuditBatchOneSources } from './seventhSourceAuditBatchOneSources';
import { seventhSourceAuditBatchTwoPersons } from './seventhSourceAuditBatchTwoPersons';
import { seventhSourceAuditBatchTwoSources } from './seventhSourceAuditBatchTwoSources';
import { dataFreezeOmissionPersons } from './dataFreezeOmissionPersons';
import { dataFreezeOmissionSources } from './dataFreezeOmissionSources';

export interface CompleteRosterManifestEntry {
  id: string;
  name: string;
  aliases: readonly string[];
  sourceLocator: string;
  historicalLayer: HistoricalLayer;
  visualFaction: VisualFaction;
  historicalAffiliations: readonly string[];
  disambiguation: string;
  importBatch: Person['importBatch'];
}

const priorPersons: Person[] = [
  ...(personsJson as Person[]),
  ...majorPersons,
  ...familyPersons,
  ...fourthFamilyPersons,
  ...fifthFamilyPersons,
];

const sources: HistoricalSource[] = [
  ...(sourcesJson as HistoricalSource[]),
  ...majorSources,
  ...familySources,
  ...fourthFamilySources,
  ...fifthFamilySources,
  ...sixthRosterRelationshipBatchOneSources,
  ...seventhSourceAuditBatchOneSources,
  ...seventhSourceAuditBatchTwoSources,
  ...dataFreezeOmissionSources,
];

const sourcesById = new Map(sources.map((source) => [source.id, source]));

const priorManifest: CompleteRosterManifestEntry[] = priorPersons.map(
  (person) => {
    const source = sourcesById.get(person.sourceIds[0] ?? '');
    return {
      id: person.id,
      name: person.name,
      aliases: [
        ...(person.courtesyName ? [person.courtesyName] : []),
        ...person.otherNames,
      ],
      sourceLocator: source?.section ?? person.sourceIds[0] ?? '',
      historicalLayer: source?.historicalLayer ?? 'official_history',
      visualFaction: getFactionColorKey(person),
      historicalAffiliations: [...person.factions],
      disambiguation: person.description,
      importBatch: person.importBatch,
    };
  },
);

const sixthManifest: CompleteRosterManifestEntry[] =
  sixthRosterManifest.map((entry) => ({
    id: entry.id,
    name: entry.name,
    aliases: [...entry.aliases],
    sourceLocator: `《三国志》卷${entry.volume}·${entry.sectionAnchor}`,
    historicalLayer: entry.historicalLayer,
    visualFaction: entry.visualFaction,
    historicalAffiliations: [...entry.historicalAffiliations],
    disambiguation: entry.disambiguation,
    importBatch: 6,
  }));

const seventhAuditManifest: CompleteRosterManifestEntry[] = [
  ...seventhSourceAuditBatchOnePersons,
  ...seventhSourceAuditBatchTwoPersons,
  ...dataFreezeOmissionPersons,
].map((person) => {
    const source = sourcesById.get(person.sourceIds[0] ?? '');
    return {
      id: person.id,
      name: person.name,
      aliases: [
        ...(person.courtesyName ? [person.courtesyName] : []),
        ...person.otherNames,
      ],
      sourceLocator: source?.section ?? person.sourceIds[0] ?? '',
      historicalLayer: source?.historicalLayer ?? 'official_history',
      visualFaction: getFactionColorKey(person),
      historicalAffiliations: [...person.factions],
      disambiguation: person.description,
      importBatch: person.importBatch,
    };
  });

export const completeRosterManifest: readonly CompleteRosterManifestEntry[] = [
  ...priorManifest,
  ...sixthManifest,
  ...seventhAuditManifest,
];

export const COMPLETE_ROSTER_EXPECTED_COUNT = 580;
export const COMPLETE_ROSTER_EXPECTED_FACTION_COUNTS: Readonly<
  Record<VisualFaction, number>
> = {
  wei: 286,
  shu: 122,
  wu: 133,
  other: 39,
};

// Keep the authoring data and the frozen manifest aligned at module load.
if (sixthRosterPersons.length !== sixthRosterManifest.length) {
  throw new Error('第六批人物数据与名单不一致。');
}
