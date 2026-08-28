import { describe, expect, it } from 'vitest';
import { graphData } from './index';

const corePersonIds = [
  'person:sg:cao_teng',
  'person:sg:cao_song',
  'person:sg:cao_cao',
  'person:sg:lady_ding',
  'person:sg:empress_bian',
  'person:sg:lady_liu',
  'person:sg:lady_huan',
  'person:sg:cao_ang',
  'person:sg:cao_pi',
  'person:sg:cao_zhang',
  'person:sg:cao_zhi',
  'person:sg:cao_xiong',
  'person:sg:cao_chong',
  'person:sg:cao_ju',
  'person:sg:cao_yu',
] as const;

const addedSourceIds = [
  'source:sg:hhs_78_caoteng',
  'source:sg:zztj_60_caosong',
  'source:sg:zztj_62_caoang',
  'source:sg:zztj_65_caopi',
  'source:sg:zztj_69_caozhang_caozhi',
  'source:sg:zztj_69_empress_bian',
  'source:sg:hyz_06_caocao_caopi',
] as const;

describe('曹操十五人核心家族多典籍来源', () => {
  it('保留十五人范围并为每人提供已核验史料', () => {
    const personsById = new Map(
      graphData.persons.map((person) => [person.id, person]),
    );

    expect(corePersonIds).toHaveLength(15);
    corePersonIds.forEach((personId) => {
      const person = personsById.get(personId);
      expect(person, personId).toBeDefined();
      expect(person?.reviewStatus).toBe('verified');
      expect(person?.sourceIds.length).toBeGreaterThan(0);
    });
  });

  it('新增来源均可定位、带短引文且被人物或关系实际引用', () => {
    const sourcesById = new Map(
      graphData.sources.map((source) => [source.id, source]),
    );

    addedSourceIds.forEach((sourceId) => {
      const source = sourcesById.get(sourceId);
      expect(source, sourceId).toBeDefined();
      expect(source?.section.trim().length).toBeGreaterThan(0);
      expect(source?.quotation?.trim().length).toBeGreaterThan(0);
      expect(source?.reviewStatus).toBe('verified');

      const isUsedByPerson = graphData.persons.some((person) =>
        person.sourceIds.includes(sourceId),
      );
      const isUsedByRelation = graphData.relations.some((relation) =>
        relation.sourceIds.includes(sourceId),
      );
      expect(isUsedByPerson || isUsedByRelation, sourceId).toBe(true);
    });

    const addedWorks = new Set(
      addedSourceIds.map((sourceId) => sourcesById.get(sourceId)?.work),
    );
    expect(addedWorks).toEqual(new Set(['后汉书', '资治通鉴', '华阳国志']));
  });

  it('只把能够直接支持亲属主张的新增来源挂到关系上', () => {
    const relationsById = new Map(
      graphData.relations.map((relation) => [relation.id, relation]),
    );

    expect(
      relationsById.get('relation:sg:cao_teng_adoptive_father_cao_song')
        ?.sourceIds,
    ).toContain('source:sg:hhs_78_caoteng');
    expect(
      relationsById.get('relation:sg:cao_song_father_cao_cao')?.sourceIds,
    ).toEqual(
      expect.arrayContaining([
        'source:sg:hhs_78_caoteng',
        'source:sg:zztj_60_caosong',
      ]),
    );
    expect(
      relationsById.get('relation:sg:cao_cao_father_cao_ang')?.sourceIds,
    ).toContain('source:sg:zztj_62_caoang');
    expect(
      relationsById.get('relation:sg:cao_cao_father_cao_pi')?.sourceIds,
    ).toEqual(
      expect.arrayContaining([
        'source:sg:zztj_65_caopi',
        'source:sg:hyz_06_caocao_caopi',
      ]),
    );

    const personOnlySources = new Set([
      'source:sg:zztj_69_caozhang_caozhi',
      'source:sg:zztj_69_empress_bian',
    ]);
    expect(
      graphData.relations.some((relation) =>
        relation.sourceIds.some((sourceId) => personOnlySources.has(sourceId)),
      ),
    ).toBe(false);
  });
});
