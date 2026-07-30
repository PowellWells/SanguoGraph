import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import type { Person, Relation } from '../domain';
import {
  getFactionColorKey,
  getPersonGraphClasses,
  getRelationGraphClasses,
  isConfirmedPerson,
  isConfirmedRelation,
} from './graphVisualEncoding';

const caoCao = graphData.persons.find(
  (person) => person.id === 'person:sg:cao_cao',
);
const ladyDing = graphData.persons.find(
  (person) => person.id === 'person:sg:lady_ding',
);
const caoAng = graphData.persons.find(
  (person) => person.id === 'person:sg:cao_ang',
);
const caoSong = graphData.persons.find(
  (person) => person.id === 'person:sg:cao_song',
);
const xiahouYuan = graphData.persons.find(
  (person) => person.id === 'person:sg:xiahou_yuan',
);
const liuBei = graphData.persons.find(
  (person) => person.id === 'person:sg:liu_bei',
);
const confirmedRelation = graphData.relations.find(
  (relation) => relation.id === 'relation:sg:cao_cao_spouse_lady_huan',
);
const probableRelation = graphData.relations.find(
  (relation) => relation.certainty === 'probable',
);

if (
  !caoCao ||
  !ladyDing ||
  !caoAng ||
  !caoSong ||
  !xiahouYuan ||
  !liuBei ||
  !confirmedRelation ||
  !probableRelation
) {
  throw new Error('图谱视觉编码测试缺少所需的正式数据。');
}

describe('graph visual encoding', () => {
  it('applies the curated Cao-family visual faction without rewriting source data', () => {
    expect(getFactionColorKey(caoCao)).toBe('wei');
    expect(getFactionColorKey(ladyDing)).toBe('wei');
    expect(getFactionColorKey(caoAng)).toBe('wei');
    expect(getFactionColorKey(caoSong)).toBe('other');
    expect(getFactionColorKey(xiahouYuan)).toBe('wei');
  });

  it('maps non-overridden factions to Wei, Shu, Wu and other', () => {
    expect(getFactionColorKey(liuBei)).toBe('shu');
    expect(
      getFactionColorKey({
        ...caoSong,
        id: 'person:test:shu',
        factions: ['蜀汉'],
      }),
    ).toBe('shu');
    expect(
      getFactionColorKey({
        ...caoSong,
        id: 'person:test:wu',
        factions: ['孙吴'],
      }),
    ).toBe('wu');
  });

  it('encodes gender, faction and verification on person nodes', () => {
    expect(isConfirmedPerson(caoCao)).toBe(true);
    expect(getPersonGraphClasses(caoCao, false)).toContain(
      'male faction-wei person-confirmed core',
    );
    expect(getPersonGraphClasses(ladyDing, false)).toContain(
      'female faction-wei person-confirmed',
    );

    const pendingPerson: Person = {
      ...ladyDing,
      reviewStatus: 'pending_review',
      sourceIds: [],
    };
    expect(getPersonGraphClasses(pendingPerson, true)).toContain(
      'person-pending locked',
    );
  });

  it('uses solid encoding only for confirmed and verified recorded relations', () => {
    expect(isConfirmedRelation(confirmedRelation)).toBe(true);
    expect(
      getRelationGraphClasses(
        confirmedRelation,
        'indirect_inference',
        false,
      ),
    ).toContain('relation-confirmed');

    expect(isConfirmedRelation(probableRelation)).toBe(false);
    expect(
      getRelationGraphClasses(probableRelation, 'indirect_inference', false),
    ).toContain('relation-pending');

    const candidate: Relation = {
      ...confirmedRelation,
      id: 'relation:runtime:candidate',
      origin: 'candidate',
      certainty: 'probable',
      reviewStatus: 'pending_review',
    };
    expect(
      getRelationGraphClasses(candidate, 'structured_candidate', true),
    ).toContain('relation-pending path-highlight');
  });
});
