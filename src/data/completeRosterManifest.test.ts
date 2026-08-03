import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { getFactionColorKey } from '../services/graphVisualEncoding';
import {
  COMPLETE_ROSTER_EXPECTED_COUNT,
  COMPLETE_ROSTER_EXPECTED_FACTION_COUNTS,
  completeRosterManifest,
} from './completeRosterManifest';
import { graphData } from './index';
import { sanguozhiSourceId } from './majorSources';
import {
  SIXTH_ROSTER_EXPECTED_COUNT,
  sixthOtherRoster,
  sixthRosterManifest,
  sixthShuRoster,
  sixthWeiRoster,
  sixthWuRoster,
} from './sixthRoster';

describe('complete biographical roster manifest', () => {
  it('freezes the complete 537-person roster and sixth batch', () => {
    expect(COMPLETE_ROSTER_EXPECTED_COUNT).toBe(537);
    expect(completeRosterManifest).toHaveLength(
      COMPLETE_ROSTER_EXPECTED_COUNT,
    );
    expect(graphData.persons).toHaveLength(COMPLETE_ROSTER_EXPECTED_COUNT);
    expect(sixthRosterManifest).toHaveLength(SIXTH_ROSTER_EXPECTED_COUNT);
    expect(
      graphData.persons.filter((person) => person.importBatch === 6),
    ).toHaveLength(SIXTH_ROSTER_EXPECTED_COUNT);
    expect([
      ...sixthWeiRoster,
      ...sixthShuRoster,
      ...sixthWuRoster,
      ...sixthOtherRoster,
    ]).toHaveLength(SIXTH_ROSTER_EXPECTED_COUNT);
    expect(sixthWeiRoster).toHaveLength(145);
    expect(sixthShuRoster).toHaveLength(26);
    expect(sixthWuRoster).toHaveLength(56);
    expect(sixthOtherRoster).toHaveLength(5);

    const manifestIds = completeRosterManifest.map((entry) => entry.id);
    expect(new Set(manifestIds).size).toBe(manifestIds.length);
    expect(new Set(manifestIds)).toEqual(
      new Set(graphData.persons.map((person) => person.id)),
    );
  });

  it('covers all 65 Sanguozhi volumes with verified primary sources', () => {
    for (let volume = 1; volume <= 65; volume += 1) {
      const source = graphData.sources.find(
        (candidate) => candidate.id === sanguozhiSourceId(volume),
      );
      expect(source).toMatchObject({
        work: '三国志',
        sourceType: 'primary',
        historicalLayer: 'official_history',
        reviewStatus: 'verified',
      });
    }
    sixthRosterManifest.forEach((entry) => {
      expect(entry.sectionAnchor).toBe(entry.name);
      expect(entry.disambiguation).toContain(`卷${entry.volume}`);
      expect(entry.historicalAffiliations).toEqual([]);
    });
  });

  it('keeps visual factions distinct from historical affiliations', () => {
    const counts = graphData.persons.reduce(
      (result, person) => {
        result[getFactionColorKey(person)] += 1;
        return result;
      },
      { wei: 0, shu: 0, wu: 0, other: 0 },
    );
    expect(counts).toEqual(COMPLETE_ROSTER_EXPECTED_FACTION_COUNTS);
  });

  it('disambiguates every same-name identity in the manifest', () => {
    const identitiesByName = new Map<string, typeof completeRosterManifest>();
    completeRosterManifest.forEach((entry) => {
      identitiesByName.set(entry.name, [
        ...(identitiesByName.get(entry.name) ?? []),
        entry,
      ]);
    });
    [...identitiesByName.values()]
      .filter((entries) => entries.length > 1)
      .forEach((entries) => {
        expect(new Set(entries.map((entry) => entry.id)).size).toBe(
          entries.length,
        );
        entries.forEach((entry) => {
          expect(entry.sourceLocator.length).toBeGreaterThan(0);
          expect(entry.disambiguation.length).toBeGreaterThan(0);
        });
      });
  });

  it('freezes the 184-record relation set after the Yuan family enrichment', () => {
    expect(graphData.relations).toHaveLength(184);
    expect(
      createHash('sha256')
        .update(JSON.stringify(graphData.relations))
        .digest('hex'),
    ).toBe('2c2c89b49c801023156941d2d688f2a3f7476e177e15b00083bfd89bdd2fa612');
  });

  it('records the source-backed Yuan family cluster', () => {
    const relationIds = new Set(graphData.relations.map(({ id }) => id));
    [
      'relation:sg:yuan_shao_father_yuan_tan',
      'relation:sg:yuan_shao_father_sgz_v06_01',
      'relation:sg:yuan_shao_father_sgz_v06_02',
      'relation:sg:yuan_xi_spouse_empress_zhen',
    ].forEach((id) => expect(relationIds.has(id)).toBe(true));

    const marriage = graphData.relations.find(
      ({ id }) => id === 'relation:sg:yuan_xi_spouse_empress_zhen',
    );
    expect(marriage?.sourceIds).toEqual([
      'source:sg:family_sgz_05_zhen_yuan_xi',
    ]);
  });
});
