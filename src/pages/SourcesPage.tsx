import { SourcePolicyNotice } from '../components/source/SourcePolicyNotice';
import { graphData } from '../data';
import { relationTypeLabels } from '../services/relationPresentation';
import {
  countRelationsBySourceLayer,
  sourceLayerOptions,
} from '../services/sourceLayers';

export function SourcesPage() {
  const peopleById = new Map(
    graphData.persons.map((person) => [person.id, person]),
  );
  const layerCounts = countRelationsBySourceLayer(
    graphData.relations,
    graphData.persons,
  );

  return (
    <article className="text-page">
      <header>
        <p className="eyebrow">Source policy</p>
        <h1>史料说明</h1>
        <p>
          三国人物关系谱 · SanguoGraph 将正史正文、注引材料和结构化候选分层保存，
          每条正式关系都可回到具体卷次。
        </p>
      </header>
      <SourcePolicyNotice />
      <section>
        <h2>来源体系</h2>
        <p>
          来源类型与可信度、编辑核验状态分别记录。某一来源中出现关系，
          不会自动把它提升为已确认史实。
        </p>
        <div className="source-layer-catalog">
          {sourceLayerOptions.map((layer) => (
            <article key={layer.key}>
              <strong>{layer.label}</strong>
              <span>{layerCounts[layer.key]} 条关系</span>
              <p>{layer.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2>本里程碑使用的史料</h2>
        <div className="source-catalog">
          {graphData.sources.map((source) => (
            <article key={source.id}>
              <h3>{source.reference}</h3>
              <dl className="evidence-metadata">
                <div><dt>作者</dt><dd>{source.author ?? '未详'}</dd></div>
                {source.commentator && (
                  <div><dt>注者</dt><dd>{source.commentator}</dd></div>
                )}
                <div><dt>卷篇</dt><dd>{source.section}</dd></div>
                <div>
                  <dt>核验</dt>
                  <dd>{source.reviewStatus === 'verified' ? '已核验' : '待核验'}</dd>
                </div>
              </dl>
              {source.quotation && <blockquote>“{source.quotation}”</blockquote>}
              <p>{source.note || '已人工定位卷次与短引文。'}</p>
              <h4>对应人物与关系</h4>
              <p>
                人物：
                {graphData.persons
                  .filter((person) => person.sourceIds.includes(source.id))
                  .map((person) => person.name)
                  .join('、') || '无'}
              </p>
              <ul className="source-page-relations">
                {graphData.relations
                  .filter((relation) => relation.sourceIds.includes(source.id))
                  .map((relation) => (
                    <li key={relation.id}>
                      {peopleById.get(relation.sourcePersonId)?.name ?? '未知'}
                      {' → '}
                      {peopleById.get(relation.targetPersonId)?.name ?? '未知'}
                      <small>{relationTypeLabels[relation.type]}</small>
                    </li>
                  ))}
              </ul>
              {source.url && (
                <a href={source.url} target="_blank" rel="noreferrer">
                  查看原文
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2>候选数据不等于史实</h2>
        <p>
          Wikidata、既有知识图谱和后世整理成果可以帮助发现线索，但不能替代对原始史料的人工核验。
          候选线索默认隐藏，也不能单独支撑 confirmed 关系。
        </p>
      </section>
    </article>
  );
}
