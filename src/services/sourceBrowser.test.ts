import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import { filterSources, getSourceUsage } from './sourceBrowser';

describe('source browser', () => {
  it('finds a source through its cited person and relation endpoints', () => {
    const results = filterSources(
      graphData.sources,
      graphData.persons,
      graphData.relations,
      '曹节 刘协',
      'all',
    );
    expect(results.map(({ id }) => id)).toContain(
      'source:sg:round_06_hhs_10b_cao_daughters',
    );
  });

  it('filters sources by historical layer', () => {
    const results = filterSources(
      graphData.sources,
      graphData.persons,
      graphData.relations,
      '',
      'literature',
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(({ historicalLayer }) => historicalLayer === 'literature')).toBe(true);
  });

  it('separates person locators, supporting claims, and opposing claims', () => {
    const usage = getSourceUsage(
      'source:sg:round_06_hhs_10b_cao_daughters',
      graphData.persons,
      graphData.relations,
    );
    expect(usage.persons.map(({ name }) => name)).toEqual([
      '曹宪',
      '曹节',
      '曹华',
    ]);
    expect(usage.supportingRelations).toHaveLength(6);
    expect(usage.opposingRelations).toHaveLength(0);
  });
});
