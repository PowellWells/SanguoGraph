import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import { findShortestRelationshipPath } from './relationshipPath';

describe('findShortestRelationshipPath', () => {
  it('finds the shortest path between two people', () => {
    const path = findShortestRelationshipPath(
      graphData.relations,
      'person:sg:cao_teng',
      'person:sg:cao_pi',
    );

    expect(path?.personIds).toEqual([
      'person:sg:cao_teng',
      'person:sg:cao_song',
      'person:sg:cao_cao',
      'person:sg:cao_pi',
    ]);
    expect(path?.relations).toHaveLength(3);
  });

  it('returns null when filters remove every possible path', () => {
    expect(
      findShortestRelationshipPath(
        [],
        'person:sg:cao_teng',
        'person:sg:cao_pi',
      ),
    ).toBeNull();
  });

  it('connects the Cao and Xiahou branches through recorded kinship', () => {
    const path = findShortestRelationshipPath(
      graphData.relations,
      'person:sg:cao_cao',
      'person:sg:xiahou_dun',
    );

    expect(path?.personIds).toEqual([
      'person:sg:cao_cao',
      'person:sg:cao_zhen',
      'person:sg:cao_shuang',
      'person:sg:xiahou_xuan',
      'person:sg:xiahou_shang',
      'person:sg:xiahou_yuan',
      'person:sg:xiahou_dun',
    ]);
    expect(path?.relations).toHaveLength(6);
    expect(
      path?.relations.every(
        (relation) =>
          relation.reviewStatus === 'verified' &&
          relation.origin === 'recorded',
      ),
    ).toBe(true);
  });
});
