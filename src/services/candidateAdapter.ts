import type { HistoricalSource, Person, Relation, RelationType } from '../domain';

interface ProcessedLink {
  id: string;
  source_id: string;
  target_id: string;
  relation_type: string;
}

export interface CandidateGraph {
  relations: Relation[];
  sources: HistoricalSource[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isProcessedLink(value: unknown): value is ProcessedLink {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.source_id === 'string' &&
    typeof value.target_id === 'string' &&
    typeof value.relation_type === 'string'
  );
}

function candidateType(type: string): RelationType | null {
  if (type === 'father') {
    return 'father_of';
  }
  if (type === 'mother') {
    return 'mother_of';
  }
  if (type === 'spouse') {
    return 'spouse_of';
  }
  return null;
}

export function adaptCandidateGraph(
  input: unknown,
  persons: Person[],
): CandidateGraph {
  if (!isRecord(input) || !Array.isArray(input.links)) {
    throw new Error('候选图谱格式无效：缺少 links 数组。');
  }

  const localIdByProcessedId = new Map<string, string>();
  for (const person of persons) {
    const qid = person.externalIds.wikidata;
    if (qid) {
      localIdByProcessedId.set(`person:wd:${qid}`, person.id);
    }
  }

  const wikidataSource: HistoricalSource = {
    id: 'source:candidate:wikidata',
    work: 'Wikidata',
    section: '结构化亲属属性候选',
    author: null,
    commentator: null,
    quotation: null,
    reference: 'Wikidata 候选线索；未经过正史核验',
    url: 'https://www.wikidata.org/',
    sourceType: 'structured_dataset',
    historicalLayer: 'structured_candidate',
    reviewStatus: 'pending_review',
    note: '只用于发现候选关系，不构成历史证据。',
  };
  const seenSpouses = new Set<string>();
  const relations: Relation[] = [];

  for (const rawLink of input.links) {
    if (!isProcessedLink(rawLink)) {
      continue;
    }
    const type = candidateType(rawLink.relation_type);
    if (!type) {
      continue;
    }

    const rawSource = localIdByProcessedId.get(rawLink.source_id);
    const rawTarget = localIdByProcessedId.get(rawLink.target_id);
    if (!rawSource || !rawTarget || rawSource === rawTarget) {
      continue;
    }

    let sourcePersonId = rawSource;
    let targetPersonId = rawTarget;
    if (type === 'father_of' || type === 'mother_of') {
      sourcePersonId = rawTarget;
      targetPersonId = rawSource;
    } else {
      [sourcePersonId, targetPersonId] = [rawSource, rawTarget].sort();
      const spouseKey = `${sourcePersonId}|${targetPersonId}`;
      if (seenSpouses.has(spouseKey)) {
        continue;
      }
      seenSpouses.add(spouseKey);
    }

    relations.push({
      id: `relation:sg:candidate_${rawLink.id.replace(/[^a-z0-9]/gi, '_')}`,
      sourcePersonId,
      targetPersonId,
      type,
      certainty: 'probable',
      historicalLayer: 'structured_candidate',
      reviewStatus: 'pending_review',
      origin: 'candidate',
      sourceIds: [wikidataSource.id],
      note: 'Wikidata 候选线索，未经过正史核验。',
    });
  }

  return { relations, sources: [wikidataSource] };
}
