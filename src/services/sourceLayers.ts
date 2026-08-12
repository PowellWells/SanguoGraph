import type { Person, Relation } from '../domain';
import { getRelationClaim } from './relationPresentation';

export type SourceLayerKey =
  | 'official_direct'
  | 'official_inferred'
  | 'ancient_other'
  | 'modern_research'
  | 'literature'
  | 'structured_candidate'
  | 'editor_inference';

export interface SourceLayerOption {
  key: SourceLayerKey;
  label: string;
  description: string;
}

export const sourceLayerOptions: readonly SourceLayerOption[] = [
  {
    key: 'official_direct',
    label: '正史直接记载',
    description: '正史正文直接说明该关系。',
  },
  {
    key: 'official_inferred',
    label: '正史间接推定',
    description: '依据正史正文中的子女、称谓或上下文谨慎推定。',
  },
  {
    key: 'ancient_other',
    label: '其他古代史料',
    description: '裴注所引材料、地方志、族谱等，单独分层。',
  },
  {
    key: 'modern_research',
    label: '现代学术研究',
    description: '当前数据尚未收录。',
  },
  {
    key: 'literature',
    label: '文学作品',
    description: '《三国演义》等文学叙事，与正史关系分层并以虚线展示。',
  },
  {
    key: 'editor_inference',
    label: '编辑者推断',
    description: '程序或编辑推断，当前正式图谱不展示。',
  },
];

export const initialSourceLayers = new Set<SourceLayerKey>([
  'official_direct',
  'official_inferred',
  'ancient_other',
  'literature',
]);

export function getRelationSourceLayer(
  relation: Relation,
  persons: Person[],
): SourceLayerKey {
  if (relation.origin === 'candidate') {
    return 'structured_candidate';
  }
  if (relation.origin === 'derived') {
    return 'editor_inference';
  }
  if (relation.historicalLayer === 'literature') {
    return 'literature';
  }
  if (
    relation.historicalLayer === 'annotated_history' ||
    relation.historicalLayer === 'later_tradition'
  ) {
    return 'ancient_other';
  }
  return getRelationClaim(relation, persons).evidenceBasis ===
    'indirect_inference'
    ? 'official_inferred'
    : 'official_direct';
}

export function filterRelationsBySourceLayers(
  relations: Relation[],
  persons: Person[],
  enabledLayers: ReadonlySet<SourceLayerKey>,
): Relation[] {
  return relations.filter((relation) =>
    enabledLayers.has(getRelationSourceLayer(relation, persons)),
  );
}

export function countRelationsBySourceLayer(
  relations: Relation[],
  persons: Person[],
): Record<SourceLayerKey, number> {
  const counts: Record<SourceLayerKey, number> = {
    official_direct: 0,
    official_inferred: 0,
    ancient_other: 0,
    modern_research: 0,
    literature: 0,
    structured_candidate: 0,
    editor_inference: 0,
  };
  relations.forEach((relation) => {
    counts[getRelationSourceLayer(relation, persons)] += 1;
  });
  return counts;
}
