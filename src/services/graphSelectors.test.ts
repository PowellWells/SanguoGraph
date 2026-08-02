import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import { filterRelations, selectNeighborhood } from './graphSelectors';

describe('graph selectors', () => {
  it('filters relationship types', () => {
    const result = filterRelations(
      graphData.relations,
      new Set(['spouse_of']),
    );
    expect(result).toHaveLength(24);
    expect(result.every((relation) => relation.type === 'spouse_of')).toBe(true);
  });

  it('selects all, one-hop and two-hop neighborhoods', () => {
    const all = selectNeighborhood(
      graphData.relations,
      'person:sg:cao_ang',
      'all',
      graphData.persons.map((person) => person.id),
    );
    const oneHop = selectNeighborhood(
      graphData.relations,
      'person:sg:cao_ang',
      1,
    );
    const twoHop = selectNeighborhood(
      graphData.relations,
      'person:sg:cao_ang',
      2,
    );

    expect(all.personIds.size).toBe(235);
    expect(oneHop.personIds).toEqual(
      new Set([
        'person:sg:cao_ang',
        'person:sg:cao_cao',
        'person:sg:lady_liu',
        'person:sg:lady_ding',
      ]),
    );
    expect(twoHop.personIds.size).toBeGreaterThan(oneHop.personIds.size);
    expect(twoHop.personIds.has('person:sg:cao_pi')).toBe(true);
  });

  it('keeps a selected person without relation lines visible', () => {
    const isolated = selectNeighborhood(
      graphData.relations,
      'person:sg:jiang_wei',
      1,
      graphData.persons.map((person) => person.id),
    );

    expect(isolated.personIds).toEqual(new Set(['person:sg:jiang_wei']));
    expect(isolated.relations).toEqual([]);
  });
});
