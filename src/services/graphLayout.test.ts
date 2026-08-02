import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import type { Person, Relation } from '../domain';
import {
  createGraphLayout,
  sampleGraphEdgeRoute,
  type GraphLayout,
  type GraphPosition,
} from './graphLayout';

const corePersonId = 'person:sg:cao_cao';

function distance(
  first: GraphPosition,
  second: GraphPosition,
): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function pointToSegmentDistance(
  point: GraphPosition,
  source: GraphPosition,
  target: GraphPosition,
): number {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const denominator = dx * dx + dy * dy;
  if (denominator === 0) {
    return distance(point, source);
  }
  const progress = Math.max(
    0,
    Math.min(
      1,
      ((point.x - source.x) * dx +
        (point.y - source.y) * dy) /
        denominator,
    ),
  );
  return distance(point, {
    x: source.x + progress * dx,
    y: source.y + progress * dy,
  });
}

function polylineDistanceToPoint(
  points: GraphPosition[],
  point: GraphPosition,
): number {
  let minimum = Number.POSITIVE_INFINITY;
  for (let index = 1; index < points.length; index += 1) {
    const source = points[index - 1];
    const target = points[index];
    if (source && target) {
      minimum = Math.min(
        minimum,
        pointToSegmentDistance(point, source, target),
      );
    }
  }
  return minimum;
}

function expectNoNodeOverlap(
  layout: GraphLayout,
  persons: Person[],
  minimumDistance: number,
) {
  persons.forEach((firstPerson, firstIndex) => {
    persons.slice(firstIndex + 1).forEach((secondPerson) => {
      const requiredDistance =
        minimumDistance +
        (firstPerson.id === corePersonId ||
        secondPerson.id === corePersonId
          ? 12
          : 0);
      expect(
        distance(
          layout.positions[firstPerson.id],
          layout.positions[secondPerson.id],
        ),
      ).toBeGreaterThanOrEqual(requiredDistance - 0.001);
    });
  });
}

function expectRoutesAvoidUnrelatedNodes(
  layout: GraphLayout,
  persons: Person[],
  relations: Relation[],
) {
  relations
    .filter((relation) => relation.origin !== 'candidate')
    .forEach((relation) => {
      const points = sampleGraphEdgeRoute(
        layout.positions[relation.sourcePersonId],
        layout.positions[relation.targetPersonId],
        layout.edgeRoutes[relation.id],
        64,
      );
      persons
        .filter(
          (person) =>
            person.id !== relation.sourcePersonId &&
            person.id !== relation.targetPersonId,
        )
        .forEach((person) => {
          expect(
            polylineDistanceToPoint(
              points,
              layout.positions[person.id],
            ),
            `${relation.id} 不应穿过 ${person.id}`,
          ).toBeGreaterThanOrEqual(
            person.id === corePersonId ? 47 : 41,
          );
        });
    });
}

function getDefaultGraph() {
  const personIds = new Set([corePersonId]);
  graphData.relations.forEach((relation) => {
    if (
      relation.sourcePersonId === corePersonId ||
      relation.targetPersonId === corePersonId
    ) {
      personIds.add(relation.sourcePersonId);
      personIds.add(relation.targetPersonId);
    }
  });
  const persons = graphData.persons.filter((person) =>
    personIds.has(person.id),
  );
  const relations = graphData.relations.filter(
    (relation) =>
      personIds.has(relation.sourcePersonId) &&
      personIds.has(relation.targetPersonId),
  );
  return { persons, relations };
}

function boundsForPeople(
  layout: GraphLayout,
  personIds: string[],
) {
  const positions = personIds.map((personId) => layout.positions[personId]);
  const xs = positions.map((position) => position.x);
  const ys = positions.map((position) => position.y);
  return {
    x1: Math.min(...xs),
    x2: Math.max(...xs),
    y1: Math.min(...ys),
    y2: Math.max(...ys),
  };
}

function createLargeSyntheticGraph(): {
  persons: Person[];
  relations: Relation[];
} {
  const personTemplate = graphData.persons[0];
  const fatherTemplate = graphData.relations.find(
    (relation) => relation.type === 'father_of',
  );
  const clanTemplate = graphData.relations.find(
    (relation) => relation.type === 'clan_relative_of',
  );
  if (!personTemplate || !fatherTemplate || !clanTemplate) {
    throw new Error('合成布局测试缺少正式数据模板。');
  }

  const anchorId = 'person:test:anchor';
  const persons: Person[] = [
    {
      ...personTemplate,
      id: anchorId,
      name: '合成核心',
      courtesyName: null,
      externalIds: {},
    },
  ];
  const relations: Relation[] = [];

  for (let branchIndex = 0; branchIndex < 8; branchIndex += 1) {
    const branchId = `person:test:branch_${branchIndex}`;
    persons.push({
      ...personTemplate,
      id: branchId,
      name: `分支${branchIndex}`,
      courtesyName: null,
      externalIds: {},
    });
    relations.push({
      ...clanTemplate,
      id: `relation:test:clan_${branchIndex}`,
      sourcePersonId: anchorId,
      targetPersonId: branchId,
      claim: clanTemplate.claim
        ? {
            ...clanTemplate.claim,
            relationshipQualifier: '同代宗族',
          }
        : undefined,
    });

    let parentId = branchId;
    for (let depth = 0; depth < 14; depth += 1) {
      const childId = `person:test:branch_${branchIndex}_child_${depth}`;
      persons.push({
        ...personTemplate,
        id: childId,
        name: `分支${branchIndex}后代${depth}`,
        courtesyName: null,
        externalIds: {},
      });
      relations.push({
        ...fatherTemplate,
        id: `relation:test:branch_${branchIndex}_father_${depth}`,
        sourcePersonId: parentId,
        targetPersonId: childId,
      });
      parentId = childId;
    }
  }

  return { persons, relations };
}

describe('graph layout', () => {
  it('places Wei above Shu and Wu while relationship-linked others follow', () => {
    const layout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: false },
    );
    const peopleBySector = {
      wei: graphData.persons
        .filter((person) => layout.sectors[person.id] === 'wei')
        .map((person) => person.id),
      shu: graphData.persons
        .filter((person) => layout.sectors[person.id] === 'shu')
        .map((person) => person.id),
      wu: graphData.persons
        .filter((person) => layout.sectors[person.id] === 'wu')
        .map((person) => person.id),
      neutral: graphData.persons
        .filter((person) => layout.sectors[person.id] === 'neutral')
        .map((person) => person.id),
    };
    const weiBounds = boundsForPeople(layout, peopleBySector.wei);
    const shuBounds = boundsForPeople(layout, peopleBySector.shu);
    const wuBounds = boundsForPeople(layout, peopleBySector.wu);
    const neutralBounds = boundsForPeople(layout, peopleBySector.neutral);

    expect(weiBounds.y2).toBeLessThan(shuBounds.y1);
    expect(weiBounds.y2).toBeLessThan(wuBounds.y1);
    expect(shuBounds.x2).toBeLessThan(wuBounds.x1);
    expect(neutralBounds.y1).toBeGreaterThan(
      Math.max(shuBounds.y2, wuBounds.y2),
    );
    expect(layout.sectors['person:sg:cao_teng']).toBe('wei');
    expect(layout.sectors['person:sg:cao_song']).toBe('wei');
    expect(layout.sectors['person:sg:lady_sun_shu']).toBe('wu');
    expect(layout.sectors['person:sg:diaochan']).toBe('neutral');
  });

  it('fans the current family graph into semantic directions', () => {
    const layout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: false },
    );
    const core = layout.positions[corePersonId];

    expect(layout.positions['person:sg:cao_song'].y).toBeLessThan(
      core.y,
    );
    expect(layout.positions['person:sg:cao_pi'].y).toBeGreaterThan(
      core.y,
    );
    expect(layout.positions['person:sg:cao_ren'].x).toBeGreaterThan(
      core.x,
    );
    expect(layout.positions['person:sg:cao_hong'].x).toBeLessThan(
      core.x,
    );
    expect(layout.generations['person:sg:lady_liu']).toBe(
      layout.generations[corePersonId],
    );
    expect(layout.generations['person:sg:cao_zhen']).toBe(
      layout.generations[corePersonId] + 1,
    );
    expect(layout.generations['person:sg:xiahou_xuan']).toBe(
      layout.generations['person:sg:cao_shuang'],
    );
  });

  it('keeps the default and complete graphs collision free', () => {
    const defaultGraph = getDefaultGraph();
    const defaultLayout = createGraphLayout(
      defaultGraph.persons,
      defaultGraph.relations,
      { compact: false },
    );
    const completeLayout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: false },
    );
    const compactLayout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: true },
    );

    expect(defaultGraph.persons).toHaveLength(18);
    expectNoNodeOverlap(defaultLayout, defaultGraph.persons, 112);
    expectNoNodeOverlap(completeLayout, graphData.persons, 112);
    expectNoNodeOverlap(compactLayout, graphData.persons, 104);
  });

  it('routes every formal edge around unrelated nodes', () => {
    const layout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: false },
    );

    expectRoutesAvoidUnrelatedNodes(
      layout,
      graphData.persons,
      graphData.relations,
    );
    const clanRoute =
      layout.edgeRoutes['relation:sg:cao_cao_clan_cao_zhen'];
    const adoptionRoute =
      layout.edgeRoutes[
        'relation:sg:cao_cao_adoptive_father_cao_zhen'
      ];
    expect(clanRoute.kind).toBe('parallel');
    expect(adoptionRoute.kind).toBe('parallel');
    expect(
      Math.sign(clanRoute.controlPointDistance),
    ).toBe(-Math.sign(adoptionRoute.controlPointDistance));
  });

  it('is deterministic for the same graph', () => {
    const first = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: false },
    );
    const second = createGraphLayout(
      graphData.persons,
      graphData.relations,
      { compact: false },
    );

    expect(second).toEqual(first);
  });

  it('ignores candidate edges when assigning formal layout and routes', () => {
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

    expect(withCandidate.positions).toEqual(baseline.positions);
    expect(withCandidate.generations).toEqual(baseline.generations);
    expect(withCandidate.sectors).toEqual(baseline.sectors);
    expect(withCandidate.bounds).toEqual(baseline.bounds);
    graphData.relations.forEach((relation) => {
      expect(withCandidate.edgeRoutes[relation.id]).toEqual(
        baseline.edgeRoutes[relation.id],
      );
    });
  });

  it('separates disconnected family components', () => {
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
      distance(
        layout.positions[firstPerson.id],
        layout.positions[secondPerson.id],
      ),
    ).toBeGreaterThanOrEqual(180);
  });

  it('preserves locked positions and moves unlocked nodes around them', () => {
    const lockedPosition = { x: 880, y: 90 };
    const layout = createGraphLayout(
      graphData.persons,
      graphData.relations,
      {
        compact: true,
        lockedPersonIds: new Set([corePersonId]),
        previousPositions: {
          [corePersonId]: lockedPosition,
        },
      },
    );

    expect(layout.positions[corePersonId]).toEqual(lockedPosition);
    Object.entries(layout.positions)
      .filter(([personId]) => personId !== corePersonId)
      .forEach(([, position]) => {
        expect(distance(position, lockedPosition)).toBeGreaterThanOrEqual(
          116,
        );
      });
  });

  it('scales deterministically to a 120-person multi-branch graph', () => {
    const synthetic = createLargeSyntheticGraph();
    const first = createGraphLayout(
      synthetic.persons,
      synthetic.relations,
      {
        compact: false,
        anchorPersonId: 'person:test:anchor',
      },
    );
    const second = createGraphLayout(
      synthetic.persons,
      synthetic.relations,
      {
        compact: false,
        anchorPersonId: 'person:test:anchor',
      },
    );

    expect(synthetic.persons.length).toBeGreaterThanOrEqual(120);
    expectNoNodeOverlap(first, synthetic.persons, 112);
    expect(first.bounds.width).toBeGreaterThan(1_000);
    expect(first.bounds.height).toBeGreaterThan(1_000);
    expect(second).toEqual(first);
  });
});
