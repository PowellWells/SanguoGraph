import type { ReviewStatus } from './reviewStatus';

export type Gender = 'male' | 'female' | 'unknown';
export type Historicity = 'historical' | 'fictional' | 'disputed';

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
  description: string;
  historicity: Historicity;
  reviewStatus: ReviewStatus;
  sourceIds: string[];
  externalIds: {
    wikidata?: string;
  };
  note: string;
}
