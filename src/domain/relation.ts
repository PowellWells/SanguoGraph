import type { Certainty } from './certainty';
import type { HistoricalLayer } from './historicalLayer';
import type { ReviewStatus } from './reviewStatus';

export type RelationType =
  | 'father_of'
  | 'mother_of'
  | 'spouse_of'
  | 'adoptive_father_of'
  | 'adoptive_mother_of'
  | 'clan_relative_of';

export type RelationOrigin = 'recorded' | 'candidate' | 'derived';

export interface Relation {
  id: string;
  sourcePersonId: string;
  targetPersonId: string;
  type: RelationType;
  certainty: Certainty;
  historicalLayer: HistoricalLayer;
  reviewStatus: ReviewStatus;
  origin: RelationOrigin;
  sourceIds: string[];
  note: string;
}
