import candidateGraphUrl from '../../data/processed/graph.json?url';
import type { Person } from '../domain';
import { adaptCandidateGraph, type CandidateGraph } from './candidateAdapter';

export type FetchJson = (input: RequestInfo | URL) => Promise<Response>;

export async function loadCandidateGraph(
  persons: Person[],
  fetchJson: FetchJson = fetch,
  url = candidateGraphUrl,
): Promise<CandidateGraph> {
  const response = await fetchJson(url);
  if (!response.ok) {
    throw new Error(`候选数据加载失败（HTTP ${response.status}）。`);
  }
  return adaptCandidateGraph(await response.json(), persons);
}
