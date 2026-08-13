import { useMemo, useState } from 'react';
import { SourcePolicyNotice } from '../components/source/SourcePolicyNotice';
import { graphData } from '../data';
import type { HistoricalSource } from '../domain';
import { relationTypeLabels } from '../services/relationPresentation';
import {
  filterSources,
  getSourceUsage,
  sourceBrowserLayerLabels,
  type SourceBrowserLayer,
} from '../services/sourceBrowser';
import {
  countRelationsBySourceLayer,
  sourceLayerOptions,
} from '../services/sourceLayers';

const browsableLayers: readonly SourceBrowserLayer[] = [
  'all',
  'official_history',
  'annotated_history',
  'later_tradition',
  'literature',
];

const sourceTypeLabels: Readonly<Record<HistoricalSource['sourceType'], string>> = {
  primary: '原始史料',
  secondary: '现代研究',
  literary: '文学文本',
  structured_dataset: '结构化候选',
};

export function SourcesPage() {
  const [query, setQuery] = useState('');
  const [layer, setLayer] = useState<SourceBrowserLayer>('all');
  const [work, setWork] = useState('all');
  const peopleById = useMemo(
    () => new Map(graphData.persons.map((person) => [person.id, person])),
    [],
  );
  const layerCounts = useMemo(
    () => countRelationsBySourceLayer(graphData.relations, graphData.persons),
    [],
  );
  const works = useMemo(
    () => [...new Set(graphData.sources.map((source) => source.work))].sort(),
    [],
  );
  const matchingSources = useMemo(
    () =>
      filterSources(
        graphData.sources,
        graphData.persons,
        graphData.relations,
        query,
        layer,
      ).filter((source) => work === 'all' || source.work === work),
    [layer, query, work],
  );

  const clearFilters = () => {
    setQuery('');
    setLayer('all');
    setWork('all');
  };

  return (
    <article className="text-page sources-page">
      <header>
        <p className="eyebrow">Source browser</p>
        <h1>史料浏览</h1>
        <p>
          按书名、卷篇、人物或关系检索正式史料，并区分人物定位、关系支持证据与
          反对证据。每条关系仍可回到具体卷次和原文摘录。
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
          {sourceLayerOptions.map((sourceLayer) => (
            <article key={sourceLayer.key}>
              <strong>{sourceLayer.label}</strong>
              <span>{layerCounts[sourceLayer.key]} 条关系</span>
              <p>{sourceLayer.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="source-browser-title">
        <div className="section-heading-row">
          <div>
            <h2 id="source-browser-title">正式史料目录</h2>
            <p>共收录 {graphData.sources.length} 条；筛选结果不会改变正式图谱。</p>
          </div>
          <strong aria-live="polite">{matchingSources.length} 条结果</strong>
        </div>
        <div className="source-browser-controls">
          <label>
            <span>检索史料</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="书名、作者、卷篇、人物或关系"
            />
          </label>
          <label>
            <span>史料层</span>
            <select
              value={layer}
              onChange={(event) =>
                setLayer(event.target.value as SourceBrowserLayer)
              }
            >
              {browsableLayers.map((value) => (
                <option key={value} value={value}>
                  {sourceBrowserLayerLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>典籍</span>
            <select value={work} onChange={(event) => setWork(event.target.value)}>
              <option value="all">全部典籍</option>
              {works.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={clearFilters}>
            清除筛选
          </button>
        </div>
        {matchingSources.length === 0 ? (
          <div className="source-empty-state">
            <strong>没有匹配的正式史料</strong>
            <p>请缩短检索词，或清除史料层与典籍筛选。</p>
          </div>
        ) : (
          <div className="source-browser-results">
            {matchingSources.map((source) => {
              const usage = getSourceUsage(
                source.id,
                graphData.persons,
                graphData.relations,
              );
              const shouldExpand = query.trim().length > 0 && matchingSources.length <= 8;
              return (
                <details key={`${source.id}:${query}:${layer}:${work}`} open={shouldExpand}>
                  <summary>
                    <span>
                      <strong>{source.reference}</strong>
                      <small>{source.section}</small>
                    </span>
                    <span className="source-record-badges">
                      <em>{sourceBrowserLayerLabels[source.historicalLayer]}</em>
                      <em>{usage.persons.length} 人物</em>
                      <em>{usage.supportingRelations.length} 支持关系</em>
                    </span>
                  </summary>
                  <div className="source-record-body">
                    <dl className="evidence-metadata">
                      <div><dt>典籍</dt><dd>{source.work}</dd></div>
                      <div><dt>作者</dt><dd>{source.author ?? '未详'}</dd></div>
                      {source.commentator && (
                        <div><dt>注者</dt><dd>{source.commentator}</dd></div>
                      )}
                      <div><dt>类型</dt><dd>{sourceTypeLabels[source.sourceType]}</dd></div>
                      <div>
                        <dt>核验</dt>
                        <dd>{source.reviewStatus === 'verified' ? '已核验' : '待核验'}</dd>
                      </div>
                    </dl>
                    {source.quotation && <blockquote>“{source.quotation}”</blockquote>}
                    <p>{source.note || '已人工定位卷次与短引文。'}</p>
                    <div className="source-usage-grid">
                      <section>
                        <h3>人物定位引用（{usage.persons.length}）</h3>
                        <p>
                          {usage.persons.length > 0
                            ? usage.persons.map((person) => person.name).join('、')
                            : '没有人物条目直接引用此来源。'}
                        </p>
                      </section>
                      <section>
                        <h3>关系支持证据（{usage.supportingRelations.length}）</h3>
                        {usage.supportingRelations.length > 0 ? (
                          <ul className="source-page-relations">
                            {usage.supportingRelations.map((relation) => (
                              <li key={relation.id}>
                                {peopleById.get(relation.sourcePersonId)?.name ?? '未知'}
                                {' — '}
                                {peopleById.get(relation.targetPersonId)?.name ?? '未知'}
                                <small>{relationTypeLabels[relation.type]}</small>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>没有关系以此来源作为支持证据。</p>
                        )}
                      </section>
                      <section>
                        <h3>关系反对证据（{usage.opposingRelations.length}）</h3>
                        {usage.opposingRelations.length > 0 ? (
                          <ul className="source-page-relations">
                            {usage.opposingRelations.map((relation) => (
                              <li key={relation.id}>
                                {peopleById.get(relation.sourcePersonId)?.name ?? '未知'}
                                {' — '}
                                {peopleById.get(relation.targetPersonId)?.name ?? '未知'}
                                <small>{relationTypeLabels[relation.type]}</small>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>当前没有关系把此来源登记为反对证据。</p>
                        )}
                      </section>
                    </div>
                    {source.url && (
                      <a href={source.url} target="_blank" rel="noreferrer">
                        查看原文
                      </a>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>
      <section>
        <h2>候选数据不等于史实</h2>
        <p>
          既有知识图谱和后世整理成果可以帮助发现线索，但不能替代对原始史料的人工核验。
          候选线索默认隐藏，也不能单独支撑 confirmed 关系。
        </p>
      </section>
    </article>
  );
}
