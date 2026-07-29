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
});
