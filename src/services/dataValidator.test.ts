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

describe('validateGraphData', () => {
  it('accepts the pending-review sample data', () => {
    expect(validateGraphData(graphData)).toEqual([]);
  });

  it('rejects duplicate IDs in an entity collection', () => {
    const data = copyGraphData();
    data.persons.push(structuredClone(data.persons[0]));

    expect(issueCodes(data)).toContain('DUPLICATE_ID');
  });

  it('rejects relations that reference a missing person', () => {
    const data = copyGraphData();
    data.relations[0].targetPersonId = 'person_missing';

    expect(issueCodes(data)).toContain('UNKNOWN_PERSON');
  });

  it('rejects self-relations', () => {
    const data = copyGraphData();
    data.relations[0].targetPersonId = data.relations[0].sourcePersonId;

    expect(issueCodes(data)).toContain('SELF_RELATION');
  });

  it('rejects relations that reference a missing source', () => {
    const data = copyGraphData();
    data.relations[0].sourceIds = ['source_missing'];

    expect(issueCodes(data)).toContain('UNKNOWN_SOURCE');
  });

  it('requires confirmed relations to be verified and source-backed', () => {
    const data = copyGraphData();
    data.relations[0].certainty = 'confirmed';

    expect(issueCodes(data)).toEqual(
      expect.arrayContaining([
        'CONFIRMED_RELATION_NOT_VERIFIED',
        'CONFIRMED_RELATION_WITHOUT_SOURCE',
      ]),
    );
  });

  it('accepts a verified confirmed relation with a valid source', () => {
    const data = copyGraphData();
    const source: HistoricalSource = {
      id: 'source_test',
      work: '测试史料',
      section: '测试卷次',
      author: null,
      commentator: null,
      quotation: null,
      reference: '仅用于自动化测试',
      url: null,
      sourceType: 'primary',
      historicalLayer: 'official_history',
      reviewStatus: 'verified',
      note: '测试数据',
    };
    data.sources.push(source);
    data.relations[0].certainty = 'confirmed';
    data.relations[0].reviewStatus = 'verified';
    data.relations[0].sourceIds = [source.id];

    expect(validateGraphData(data)).toEqual([]);
  });
});

