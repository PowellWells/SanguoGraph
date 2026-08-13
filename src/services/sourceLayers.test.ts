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

    expect(counts.official_direct).toBe(324);
    expect(counts.official_inferred).toBe(7);
    expect(counts.ancient_other).toBe(26);
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
      'relation:sg:major_wu_sun_jing_clan_sun_jun',
      'relation:sg:major_wu_sun_jing_clan_sun_chen',
      'relation:sg:major_wu_sun_ben_clan_sun_jian',
      'relation:sg:major_wu_sun_shao_clan_sun_huan',
      'relation:sg:major_shu_other_gongsun_du_clan_gongsun_yuan',
    ]);
  });
});
