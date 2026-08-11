import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import { adaptCandidateGraph } from './candidateAdapter';

const internalCandidateIds: Readonly<Record<string, string>> = {
  'person:sg:cao_cao': 'Q204077',
  'person:sg:empress_bian': 'Q292698',
  'person:sg:cao_pi': 'Q313333',
};
const internalCandidatePersons = graphData.persons.map((person) => ({
  ...person,
  externalIds: internalCandidateIds[person.id]
    ? { wikidata: internalCandidateIds[person.id] }
    : {},
}));

function link(
  id: string,
  sourceId: string,
  targetId: string,
  relationType: string,
) {
  return {
    id,
    source_id: sourceId,
    target_id: targetId,
    relation_type: relationType,
  };
}

describe('adaptCandidateGraph', () => {
  it('reverses Wikidata child-to-parent father and mother semantics', () => {
    const result = adaptCandidateGraph(
      {
        links: [
          link('father', 'person:wd:Q313333', 'person:wd:Q204077', 'father'),
          link('mother', 'person:wd:Q313333', 'person:wd:Q292698', 'mother'),
        ],
      },
      internalCandidatePersons,
    );

    expect(result.relations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourcePersonId: 'person:sg:cao_cao',
          targetPersonId: 'person:sg:cao_pi',
          type: 'father_of',
          origin: 'candidate',
          reviewStatus: 'pending_review',
        }),
        expect.objectContaining({
          sourcePersonId: 'person:sg:empress_bian',
          targetPersonId: 'person:sg:cao_pi',
          type: 'mother_of',
        }),
      ]),
    );
  });

  it('excludes sibling, generic child and out-of-scope links', () => {
    const result = adaptCandidateGraph(
      {
        links: [
          link('sibling', 'person:wd:Q313333', 'person:wd:Q699893', 'sibling'),
          link('child', 'person:wd:Q204077', 'person:wd:Q313333', 'child'),
          link('outside', 'person:wd:Q313333', 'person:wd:Q999999', 'father'),
        ],
      },
      internalCandidatePersons,
    );

    expect(result.relations).toEqual([]);
  });

  it('normalizes and deduplicates undirected spouse links', () => {
    const result = adaptCandidateGraph(
      {
        links: [
          link('a', 'person:wd:Q204077', 'person:wd:Q292698', 'spouse'),
          link('b', 'person:wd:Q292698', 'person:wd:Q204077', 'spouse'),
        ],
      },
      internalCandidatePersons,
    );

    expect(result.relations).toHaveLength(1);
    expect(result.relations[0]).toMatchObject({
      sourcePersonId: 'person:sg:cao_cao',
      targetPersonId: 'person:sg:empress_bian',
      type: 'spouse_of',
    });
  });
});
