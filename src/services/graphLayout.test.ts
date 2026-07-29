import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import type { Relation } from '../domain';
import { createGraphLayout } from './graphLayout';

function distance(
  first: { x: number; y: number },
  second: { x: number; y: number },
): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

describe('graph layout', () => {
  it('places parents above children and keeps spouses near the core person', () => {
    const layout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: false },
    );
    const positions = layout.positions;

    expect(positions['person:sg:cao_teng'].y).toBeLessThan(
      positions['person:sg:cao_song'].y,
    );
    expect(positions['person:sg:cao_song'].y).toBeLessThan(
      positions['person:sg:cao_cao'].y,
    );
    expect(positions['person:sg:cao_cao'].y).toBeLessThan(
      positions['person:sg:cao_pi'].y,
    );
    expect(positions['person:sg:lady_liu'].y).toBe(
      positions['person:sg:cao_cao'].y,
    );
    expect(
      Math.abs(
        positions['person:sg:lady_liu'].x -
          positions['person:sg:cao_cao'].x,
      ),
    ).toBeLessThanOrEqual(135);
  });

  it('wraps dense generations on compact screens without overlapping nodes', () => {
    const layout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: true },
    );
    const descendantRows = new Set(
      [
        'person:sg:cao_ang',
        'person:sg:cao_pi',
        'person:sg:cao_zhang',
        'person:sg:cao_zhi',
        'person:sg:cao_xiong',
        'person:sg:cao_chong',
        'person:sg:cao_ju',
        'person:sg:cao_yu',
      ].map((personId) => layout.positions[personId].y),
    );
    const positions = Object.values(layout.positions);

    expect(descendantRows.size).toBe(2);
    positions.forEach((firstPosition, firstIndex) => {
      positions.slice(firstIndex + 1).forEach((secondPosition) => {
        expect(distance(firstPosition, secondPosition)).toBeGreaterThan(75);
      });
    });
  });

  it('ignores candidate edges when assigning formal generations', () => {
    const candidateRelation: Relation = {
      id: 'relation:sg:candidate_generation_noise',
      sourcePersonId: 'person:sg:cao_yu',
      targetPersonId: 'person:sg:cao_teng',
      type: 'father_of',
      certainty: 'probable',
      historicalLayer: 'structured_candidate',
      reviewStatus: 'pending_review',
      origin: 'candidate',
      sourceIds: ['source:sg:wikidata'],
      note: '',
    };
    const baseline = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: false },
    );
    const withCandidate = createGraphLayout(
      graphData.persons,
      [...graphData.relations, candidateRelation],
      { compact: false },
    );

    expect(withCandidate).toEqual(baseline);
  });

  it('adds separation between disconnected family groups', () => {
    const firstPerson = {
      ...graphData.persons[0],
      id: 'person:sg:first_family',
      clan: '第一家族',
    };
    const secondPerson = {
      ...graphData.persons[1],
      id: 'person:sg:second_family',
      clan: '第二家族',
    };
    const layout = createGraphLayout(
      [firstPerson, secondPerson],
      [],
      { compact: false },
    );

    expect(
      Math.abs(
        layout.positions[firstPerson.id].x -
          layout.positions[secondPerson.id].x,
      ),
    ).toBeGreaterThan(135);
  });

  it('preserves locked positions across a relayout', () => {
    const lockedPosition = { x: 880, y: 90 };
    const layout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      {
        compact: true,
        lockedPersonIds: new Set(['person:sg:cao_cao']),
        previousPositions: {
          'person:sg:cao_cao': lockedPosition,
        },
      },
    );

    expect(layout.positions['person:sg:cao_cao']).toEqual(lockedPosition);
    Object.entries(layout.positions)
      .filter(([personId]) => personId !== 'person:sg:cao_cao')
      .forEach(([, position]) => {
        expect(distance(position, lockedPosition)).toBeGreaterThanOrEqual(78);
      });
  });
});
