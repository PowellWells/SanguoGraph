import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import type { HistoricalSource } from '../domain';
import type { GraphData, ValidationCode } from './dataValidator';
import { validateGraphData } from './dataValidator';

function copyGraphData(): GraphData {
  return structuredClone(graphData);
}

function issueCodes(data: GraphData): ValidationCode[] {
  return validateGraphData(data).map((issue) => issue.code);
}

describe('formal graph data', () => {
  it('contains exactly the 15 Milestone 1 people and valid evidence', () => {
    expect(graphData.persons).toHaveLength(15);
    expect(graphData.relations).toHaveLength(23);
    expect(validateGraphData(graphData)).toEqual([]);
  });

  it('uses project-local person IDs and formal sources for verified people', () => {
    expect(
      graphData.persons.every((person) => person.id.startsWith('person:sg:')),
    ).toBe(true);
    expect(
      graphData.persons.every(
        (person) => person.reviewStatus === 'verified' && person.sourceIds.length > 0,
      ),
    ).toBe(true);
  });

  it('requires confirmed relations to cite historical, non-dataset evidence', () => {
    const data = copyGraphData();
    const structured: HistoricalSource = {
      id: 'source:candidate:test',
      work: '测试结构化数据',
      section: '候选',
      author: null,
      commentator: null,
      quotation: null,
      reference: '测试',
      url: null,
      sourceType: 'structured_dataset',
      historicalLayer: 'structured_candidate',
      reviewStatus: 'pending_review',
      note: '',
    };
    data.sources.push(structured);
    data.relations[0].sourceIds = [structured.id];

    expect(issueCodes(data)).toContain(
      'CONFIRMED_RELATION_WITHOUT_HISTORICAL_SOURCE',
    );
  });

  it('rejects duplicate IDs, missing references and self-relations', () => {
    const duplicate = copyGraphData();
    duplicate.persons.push(structuredClone(duplicate.persons[0]));
    expect(issueCodes(duplicate)).toContain('DUPLICATE_ID');

    const missing = copyGraphData();
    missing.relations[0].targetPersonId = 'person:sg:missing';
    expect(issueCodes(missing)).toContain('UNKNOWN_PERSON');

    const self = copyGraphData();
    self.relations[0].targetPersonId = self.relations[0].sourcePersonId;
    expect(issueCodes(self)).toContain('SELF_RELATION');
  });

  it('rejects candidate or derived relations in formal raw data', () => {
    const candidate = copyGraphData();
    candidate.relations[0].origin = 'candidate';
    candidate.relations[0].reviewStatus = 'verified';
    expect(issueCodes(candidate)).toEqual(
      expect.arrayContaining(['RAW_RELATION_NOT_RECORDED', 'CANDIDATE_NOT_PENDING']),
    );

    const derived = copyGraphData();
    derived.relations[0].origin = 'derived';
    expect(issueCodes(derived)).toContain('RAW_RELATION_NOT_RECORDED');
  });

  it('rejects reverse duplicate spouse relations', () => {
    const data = copyGraphData();
    const spouse = structuredClone(
      data.relations.find((relation) => relation.type === 'spouse_of'),
    );
    if (!spouse) {
      throw new Error('测试数据缺少夫妻关系。');
    }
    [spouse.sourcePersonId, spouse.targetPersonId] = [
      spouse.targetPersonId,
      spouse.sourcePersonId,
    ];
    spouse.id = 'relation:sg:test_reverse_spouse';
    data.relations.push(spouse);

    expect(issueCodes(data)).toContain('DUPLICATE_SPOUSE');
  });

  it('rejects directed parent cycles', () => {
    const data = copyGraphData();
    const relation = structuredClone(data.relations[1]);
    relation.id = 'relation:sg:test_parent_cycle';
    relation.sourcePersonId = 'person:sg:cao_cao';
    relation.targetPersonId = 'person:sg:cao_song';
    data.relations.push(relation);

    expect(issueCodes(data)).toContain('PARENT_CYCLE');
  });

  it('validates claim decisions and opposing source references', () => {
    const data = copyGraphData();
    data.relations[0].claim = {
      periodLabel: '测试时期',
      relationshipQualifier: '测试关系',
      evidenceBasis: 'direct_record',
      modernInterpretation: '测试解释',
      disputeStatus: 'conflicting',
      decisionStatus: 'disputed',
      opposingSourceIds: ['source:sg:missing_opposition'],
      scholarlyViews: [],
    };

    expect(issueCodes(data)).toEqual(
      expect.arrayContaining([
        'UNKNOWN_OPPOSING_SOURCE',
        'CLAIM_DECISION_MISMATCH',
      ]),
    );
  });
});
