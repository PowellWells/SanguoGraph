import type { Person } from '../../domain';
import { sanguozhiSourceId } from '../majorSources';
import { sixthRosterManifest } from './manifest';

export const sixthRosterPersons: Person[] = sixthRosterManifest.map(
  (entry) => ({
    id: entry.id,
    name: entry.name,
    courtesyName: null,
    otherNames: [...entry.aliases],
    gender: entry.gender,
    birthYear: null,
    deathYear: null,
    clan: null,
    factions: [...entry.historicalAffiliations],
    visualFaction: entry.visualFaction,
    importBatch: 6,
    description: `${entry.disambiguation}。`,
    historicity: 'historical',
    reviewStatus: 'verified',
    sourceIds: [sanguozhiSourceId(entry.volume)],
    externalIds: {},
    note: '第六批仅核验人物身份与列传定位；未核验的别名、生卒年、政治归属和人物关系不作补录。',
  }),
);
