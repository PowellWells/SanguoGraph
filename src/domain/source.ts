import type { HistoricalLayer } from './historicalLayer';
import type { ReviewStatus } from './reviewStatus';

export type SourceType =
  | 'primary'
  | 'secondary'
  | 'literary'
  | 'structured_dataset';

export interface HistoricalSource {
  id: string;
  work: string;
  section: string;
  author: string | null;
  commentator: string | null;
  quotation: string | null;
  reference: string;
  url: string | null;
  sourceType: SourceType;
  historicalLayer: HistoricalLayer;
  reviewStatus: ReviewStatus;
  note: string;
}
