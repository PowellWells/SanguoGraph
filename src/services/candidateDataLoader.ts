import type { Person } from '../domain';
import { adaptCandidateGraph, type CandidateGraph } from './candidateAdapter';

export type LoadCandidateJson = () => Promise<unknown>;

async function importCandidateJson(): Promise<unknown> {
  const module = await import('../../data/processed/graph.json');
  return module.default;
}

export async function loadCandidateGraph(
  persons: Person[],
  loadJson: LoadCandidateJson = importCandidateJson,
): Promise<CandidateGraph> {
  return adaptCandidateGraph(await loadJson(), persons);
}
