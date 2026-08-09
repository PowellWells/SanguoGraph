import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { majorWeiRelationshipRelations } from './majorWeiRelationshipRelations';
import { majorWeiRelationshipSources } from './majorWeiRelationshipSources';
import { analyzeRelationCoverage } from '../services/relationCoverage';

describe('major Wei relationship expansion batch one', () => {
  it('adds only source-backed relations between existing formal people', () => {
    expect(majorWeiRelationshipRelations).toHaveLength(16);
    expect(majorWeiRelationshipSources).toHaveLength(12);

    const personIds = new Set(graphData.persons.map((person) => person.id));
    const sourceIds = new Set(graphData.sources.map((source) => source.id));
    for (const relation of majorWeiRelationshipRelations) {
      expect(personIds.has(relation.sourcePersonId)).toBe(true);
      expect(personIds.has(relation.targetPersonId)).toBe(true);
      expect(relation.origin).toBe('recorded');
      expect(relation.sourceIds).toHaveLength(1);
      expect(sourceIds.has(relation.sourceIds[0] ?? '')).toBe(true);
      expect(relation.claim?.evidenceBasis).toBe('direct_record');
    }
    for (const source of majorWeiRelationshipSources) {
      expect(source.reviewStatus).toBe('verified');
      expect(source.quotation?.length).toBeGreaterThan(0);
      expect(source.url).toMatch(/^https:\/\/zh\.wikisource\.org\//);
    }
  });

  it('connects sixteen first-priority people without treating the He Yan lead as confirmed', () => {
    const expectedMajorPeople = [
      '曹髦',
      '曹奂',
      '荀彧',
      '荀攸',
      '崔琰',
      '钟繇',
      '王朗',
      '王肃',
      '程昱',
      '刘晔',
      '贾逵',
      '贾充',
      '陈群',
      '陈泰',
      '钟会',
      '何晏',
    ];
    const relatedIds = new Set(
      majorWeiRelationshipRelations.flatMap((relation) => [
        relation.sourcePersonId,
        relation.targetPersonId,
      ]),
    );
    for (const name of expectedMajorPeople) {
      const person = graphData.persons.find((candidate) => candidate.name === name);
      expect(person).toBeDefined();
      expect(relatedIds.has(person?.id ?? '')).toBe(true);
    }

    const heYanRelation = majorWeiRelationshipRelations.find(
      (relation) => relation.targetPersonId === 'person:sg:he_yan',
    );
    expect(heYanRelation).toMatchObject({
      certainty: 'probable',
      historicalLayer: 'annotated_history',
      reviewStatus: 'pending_review',
      claim: { decisionStatus: 'pending_review' },
    });
  });

  it('improves formal relation coverage without adding people', () => {
    const report = analyzeRelationCoverage(graphData);
    expect(report).toMatchObject({
      personCount: 537,
      relationCount: 235,
      relatedPersonCount: 257,
      isolatedPersonCount: 280,
      coveragePercent: 47.9,
    });
  });
});
