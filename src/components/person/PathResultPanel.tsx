import type { Person } from '../../domain';
import type { RelationshipPath } from '../../services/relationshipPath';
import {
  certaintyLabels,
  getPerspectiveRelationLabel,
} from '../../services/relationPresentation';

interface PathResultPanelProps {
  path: RelationshipPath | null;
  persons: Person[];
  startPersonId: string;
  endPersonId: string;
  onSelectRelation: (relationId: string) => void;
  onClose: () => void;
}

export function PathResultPanel({
  path,
  persons,
  startPersonId,
  endPersonId,
  onSelectRelation,
  onClose,
}: PathResultPanelProps) {
  const peopleById = new Map(persons.map((person) => [person.id, person]));
  const start = peopleById.get(startPersonId);
  const end = peopleById.get(endPersonId);

  return (
    <aside className="panel-card person-panel" aria-labelledby="path-title">
      <header className="panel-titlebar">
        <h2 id="path-title">
          <span aria-hidden="true">⌘</span>
          双人物关系
        </h2>
        <button className="panel-close" type="button" onClick={onClose}>
          返回
        </button>
      </header>
      <div className="panel-scroll-body detail-body">
        <h3 className="relation-title">{start?.name} — {end?.name}</h3>
        <p className="detail-note">
          结果限定于当前已启用的关系类型和来源层，展示最短关系路径。
        </p>
        {!path ? (
          <p className="candidate-warning">当前筛选条件下未发现关系路径。</p>
        ) : path.relations.length === 0 ? (
          <p className="detail-description">起点与终点是同一人物。</p>
        ) : (
          <>
            <p className="path-summary">
              共经过 {path.relations.length} 条关系；点击任一关系查看完整证据。
            </p>
            <ol className="path-steps">
              {path.relations.map((relation, index) => {
                const from = peopleById.get(path.personIds[index]);
                const to = peopleById.get(path.personIds[index + 1]);
                return (
                  <li key={relation.id}>
                    <button
                      type="button"
                      onClick={() => onSelectRelation(relation.id)}
                    >
                      <strong>{from?.name} → {to?.name}</strong>
                      <span>
                        {from
                          ? getPerspectiveRelationLabel(relation, from, to)
                          : '关系'}{' '}
                        ·{' '}
                        {certaintyLabels[relation.certainty]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </aside>
  );
}
