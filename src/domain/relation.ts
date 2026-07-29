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

export type EvidenceBasis =
  | 'direct_record'
  | 'indirect_inference'
  | 'editor_inference'
  | 'structured_candidate';

export type DisputeStatus =
  | 'none_recorded'
  | 'not_assessed'
  | 'disputed'
  | 'conflicting'
  | 'rejected';

export type DecisionStatus =
  | 'candidate'
  | 'pending_review'
  | 'confirmed'
  | 'disputed'
  | 'rejected';

export interface RelationClaim {
  periodLabel: string;
  relationshipQualifier: string;
  evidenceBasis: EvidenceBasis;
  modernInterpretation: string;
  disputeStatus: DisputeStatus;
  decisionStatus: DecisionStatus;
  opposingSourceIds: string[];
  scholarlyViews: string[];
}

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
  claim?: RelationClaim;
}
