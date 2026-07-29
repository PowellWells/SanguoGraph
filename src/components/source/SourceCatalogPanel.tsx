import type { HistoricalSource, Person, Relation } from '../../domain';
import { relationTypeLabels } from '../../services/relationPresentation';

interface SourceCatalogPanelProps {
  sources: HistoricalSource[];
  relations: Relation[];
  persons: Person[];
  onSelectRelation: (relationId: string) => void;
  onClose: () => void;
}

export function SourceCatalogPanel({
  sources,
  relations,
  persons,
  onSelectRelation,
  onClose,
}: SourceCatalogPanelProps) {
  const peopleById = new Map(persons.map((person) => [person.id, person]));

  return (
    <aside className="panel-card person-panel" aria-labelledby="source-panel-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">当前筛选</p>
          <h2 id="source-panel-title">史料记录（{sources.length}）</h2>
        </div>
        <button className="panel-close" type="button" onClick={onClose}>
          返回档案
        </button>
      </div>
      <p className="detail-note">
        这里只统计当前画布中关系实际引用的史料；更改关系类型、来源层或查看范围后会同步更新。
      </p>
      <div className="source-panel-list">
        {sources.map((source) => {
          const related = relations.filter((relation) =>
            relation.sourceIds.includes(source.id),
          );
          const relatedPeople = persons.filter((person) =>
            person.sourceIds.includes(source.id),
          );
          return (
            <article key={source.id}>
              <h3>{source.reference}</h3>
              <dl className="evidence-metadata">
                <div><dt>作者</dt><dd>{source.author ?? '未详'}</dd></div>
                <div><dt>卷篇</dt><dd>{source.section}</dd></div>
                <div><dt>录入状态</dt><dd>已录入</dd></div>
                <div><dt>核验状态</dt><dd>{source.reviewStatus === 'verified' ? '已核验' : '待核验'}</dd></div>
              </dl>
              {source.quotation && <blockquote>“{source.quotation}”</blockquote>}
              <h4>对应人物</h4>
              <p className="source-person-list">
                {relatedPeople.length > 0
                  ? relatedPeople.map((person) => person.name).join('、')
                  : '当前筛选中无人物直接引用'}
              </p>
              <h4>对应关系</h4>
              {related.length > 0 ? (
                <ul className="source-relation-list">
                  {related.map((relation) => (
                    <li key={relation.id}>
                      <button
                        type="button"
                        onClick={() => onSelectRelation(relation.id)}
                      >
                        {peopleById.get(relation.sourcePersonId)?.name ?? '未知'}
                        {' — '}
                        {peopleById.get(relation.targetPersonId)?.name ?? '未知'}
                        <small>{relationTypeLabels[relation.type]}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="source-person-list">当前筛选中无关系直接引用</p>
              )}
              {source.url && (
                <a href={source.url} target="_blank" rel="noreferrer">
                  查看原文
                </a>
              )}
            </article>
          );
        })}
      </div>
    </aside>
  );
}
