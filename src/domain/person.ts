import type { ReviewStatus } from './reviewStatus';

export type Gender = 'male' | 'female' | 'unknown';
export type Historicity = 'historical' | 'fictional' | 'disputed';
export type VisualFaction = 'wei' | 'shu' | 'wu' | 'other';
export type ImportBatch = 1 | 2 | 3 | 4 | 5;

export interface Person {
  id: string;
  name: string;
  courtesyName: string | null;
  otherNames: string[];
  gender: Gender;
  birthYear: number | null;
  deathYear: number | null;
  clan: string | null;
  factions: string[];
  visualFaction?: VisualFaction;
  importBatch: ImportBatch;
  description: string;
  historicity: Historicity;
  reviewStatus: ReviewStatus;
  sourceIds: string[];
  externalIds: {
    wikidata?: string;
  };
  note: string;
}
