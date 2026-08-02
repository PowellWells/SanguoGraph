import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import {
  countRelationsBySourceLayer,
  filterRelationsBySourceLayers,
} from './sourceLayers';

describe('source layers', () => {
  it('keeps direct, inferred and annotated evidence separate', () => {
    const counts = countRelationsBySourceLayer(
      graphData.relations,
      graphData.persons,
    );

    expect(counts.official_direct).toBe(165);
    expect(counts.official_inferred).toBe(2);
    expect(counts.ancient_other).toBe(12);
    expect(counts.literature).toBe(1);
  });

  it('filters relations independently by source layer', () => {
    const inferred = filterRelationsBySourceLayers(
      graphData.relations,
      graphData.persons,
      new Set(['official_inferred']),
    );

    expect(inferred.map((relation) => relation.id)).toEqual([
      'relation:sg:cao_cao_spouse_lady_liu',
      'relation:sg:cao_cao_spouse_lady_huan',
    ]);
  });
});
