import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import {
  getRelationClaim,
  relationDirectionLabel,
} from './relationPresentation';

function relation(id: string) {
  const result = graphData.relations.find((item) => item.id === id);
  if (!result) {
    throw new Error(`测试关系不存在：${id}`);
  }
  return result;
}

describe('relation presentation', () => {
  it('distinguishes a directly recorded successor wife', () => {
    const claim = getRelationClaim(
      relation('relation:sg:cao_cao_spouse_empress_bian'),
      graphData.persons,
    );

    expect(claim.relationshipQualifier).toContain('继室');
    expect(claim.evidenceBasis).toBe('direct_record');
  });

  it('does not overstate Lady Huan as a specific spouse rank', () => {
    const claim = getRelationClaim(
      relation('relation:sg:cao_cao_spouse_lady_huan'),
      graphData.persons,
    );

    expect(claim.evidenceBasis).toBe('indirect_inference');
    expect(claim.relationshipQualifier).toContain('具体位序未见');
    expect(claim.modernInterpretation).toContain('不将“夫人”进一步等同');
  });

  it('presents clan relationships as undirected and keeps precise wording', () => {
    const clanRelation = relation(
      'relation:sg:cao_shuang_clan_xiahou_xuan',
    );
    const claim = getRelationClaim(clanRelation, graphData.persons);

    expect(relationDirectionLabel(clanRelation)).toContain('无方向');
    expect(claim.relationshipQualifier).toContain('姑表亲');
    expect(claim.evidenceBasis).toBe('direct_record');
  });
});
