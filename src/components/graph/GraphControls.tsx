import type {
  Person,
  RelationType,
  VisualFaction,
} from '../../domain';
import type { NeighborhoodDepth } from '../../services/graphSelectors';
import { getFactionColorKey } from '../../services/graphVisualEncoding';
import {
  sourceLayerOptions,
  type SourceLayerKey,
} from '../../services/sourceLayers';

const relationOptions: ReadonlyArray<{ type: RelationType; label: string }> = [
  { type: 'father_of', label: '父亲' },
  { type: 'mother_of', label: '母亲' },
  { type: 'spouse_of', label: '夫妻／配偶' },
  { type: 'adoptive_father_of', label: '养父' },
  { type: 'adoptive_mother_of', label: '养母' },
  { type: 'clan_relative_of', label: '宗族／姻亲' },
];

const neighborhoodOptions: ReadonlyArray<{
  value: NeighborhoodDepth;
  label: string;
}> = [
  { value: 'all', label: '查看当前完整图谱' },
  { value: 1, label: '只看选中人物与直接亲属' },
  { value: 2, label: '查看选中人物的两层关系' },
];
const visualFactionOptions: ReadonlyArray<{
  key: VisualFaction;
  label: string;
}> = [
  { key: 'wei', label: '魏' },
  { key: 'shu', label: '蜀' },
  { key: 'wu', label: '吴' },
  { key: 'other', label: '其他' },
];
const visualFactionLabels: Readonly<Record<VisualFaction, string>> = {
  wei: '魏',
  shu: '蜀',
  wu: '吴',
  other: '其他',
};

interface GraphControlsProps {
  persons: Person[];
  query: string;
  searchResults: Person[];
  enabledTypes: ReadonlySet<RelationType>;
  depth: NeighborhoodDepth;
  enabledSourceLayers: ReadonlySet<SourceLayerKey>;
  sourceLayerCounts: Record<SourceLayerKey, number>;
  candidateStatus: 'idle' | 'loading' | 'loaded' | 'error';
  candidateError: string | null;
  visualFactionCounts: Record<VisualFaction, number>;
  pathStartId: string;
  pathEndId: string;
  onQueryChange: (query: string) => void;
  onSelectPerson: (personId: string) => void;
  onToggleType: (type: RelationType) => void;
  onDepthChange: (depth: NeighborhoodDepth) => void;
  onSourceLayerToggle: (layer: SourceLayerKey) => void;
  onShowVisualFaction: (visualFaction: VisualFaction) => void;
  onPathStartChange: (personId: string) => void;
  onPathEndChange: (personId: string) => void;
  onRunPathQuery: () => void;
}

function years(person: Person): string {
  if (person.birthYear === null && person.deathYear === null) {
    return '生卒年不详';
  }
  return `${person.birthYear ?? '？'}—${person.deathYear ?? '？'}`;
}

export function GraphControls({
  persons,
  query,
  searchResults,
  enabledTypes,
  depth,
  enabledSourceLayers,
  sourceLayerCounts,
  candidateStatus,
  candidateError,
  visualFactionCounts,
  pathStartId,
  pathEndId,
  onQueryChange,
  onSelectPerson,
  onToggleType,
  onDepthChange,
  onSourceLayerToggle,
  onShowVisualFaction,
  onPathStartChange,
  onPathEndChange,
  onRunPathQuery,
}: GraphControlsProps) {
  return (
    <aside className="panel-card controls-panel" aria-labelledby="controls-title">
      <header className="panel-titlebar">
        <h2 id="controls-title">
          <span aria-hidden="true">⌕</span>
          人物搜索与身份消歧
        </h2>
        <span aria-hidden="true">⌃</span>
      </header>
      <div className="panel-scroll-body controls-body">
        <section className="control-section search-section">
          <label htmlFor="person-search">人物搜索</label>
          <div className="search-input-wrap">
            <input
              id="person-search"
              type="search"
              value={query}
              placeholder="搜索人物（如：曹操、刘备）"
              onChange={(event) => onQueryChange(event.target.value)}
            />
            <span aria-hidden="true">⌕</span>
          </div>
          <p>支持姓名、字、别名、拼音、身份与阵营检索。</p>
          {query && (
            <ul className="search-results" aria-label="人物搜索结果">
              {searchResults.length === 0 ? (
                <li className="search-empty">未找到匹配人物</li>
              ) : (
                searchResults.map((person) => (
                  <li key={person.id}>
                    <button
                      type="button"
                      onClick={() => onSelectPerson(person.id)}
                    >
                      <span className="search-result-main">
                        <strong>{person.name}</strong>
                        <small>
                          {person.courtesyName
                            ? `字${person.courtesyName} · `
                            : ''}
                          {years(person)}
                        </small>
                        <small>
                          {person.clan ?? '籍贯／族属未详'} · 展示：
                          {visualFactionLabels[getFactionColorKey(person)]}{' '}
                          ·{' '}
                          {person.factions.length > 0
                            ? `历史归属：${person.factions.join('、')}`
                            : '历史归属未录'}
                        </small>
                        {person.importBatch === 6 && (
                          <small>{person.description.replace(/。$/, '')}</small>
                        )}
                      </span>
                      <span>选择</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
        <section
          className="control-section faction-scope"
          aria-labelledby="faction-scope-title"
        >
          <h3 id="faction-scope-title">按展示阵营浏览</h3>
          <div>
            {visualFactionOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => onShowVisualFaction(option.key)}
              >
                <span>{option.label}</span>
                <small>{visualFactionCounts[option.key]}</small>
              </button>
            ))}
          </div>
          <p>只改变人物范围，不产生阵营关系线。</p>
        </section>
        <fieldset className="control-section">
          <legend>关系类型筛选</legend>
          {relationOptions.map((option) => (
            <label key={option.type}>
              <input
                type="checkbox"
                checked={enabledTypes.has(option.type)}
                onChange={() => onToggleType(option.type)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="control-section">
          <legend>图谱视图模式</legend>
          {neighborhoodOptions.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="neighborhood"
                checked={depth === option.value}
                onChange={() => onDepthChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="control-section source-layer-filter">
          <legend>史料来源分层开关</legend>
          {sourceLayerOptions.map((option) => {
            const count = sourceLayerCounts[option.key];
            const isCandidate = option.key === 'structured_candidate';
            return (
              <label key={option.key} title={option.description}>
                <input
                  type="checkbox"
                  aria-label={option.label}
                  checked={enabledSourceLayers.has(option.key)}
                  disabled={count === 0 && !isCandidate}
                  onChange={() => onSourceLayerToggle(option.key)}
                />
                <span>
                  {option.label}
                  <small>
                    {isCandidate && candidateStatus === 'idle' ? '按需' : count}
                  </small>
                </span>
              </label>
            );
          })}
          <p>开放知识库候选默认关闭，不等于史料确认。</p>
          {candidateStatus === 'loading' && (
            <p role="status">正在按需加载候选数据……</p>
          )}
          {candidateError && (
            <p className="inline-error" role="alert">
              {candidateError}
            </p>
          )}
        </fieldset>
        <details className="control-section path-query">
          <summary>双人物关系查询</summary>
          <label htmlFor="path-start">人物 A</label>
          <select
            id="path-start"
            value={pathStartId}
            onChange={(event) => onPathStartChange(event.target.value)}
          >
            {persons.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <label htmlFor="path-end">人物 B</label>
          <select
            id="path-end"
            value={pathEndId}
            onChange={(event) => onPathEndChange(event.target.value)}
          >
            {persons.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={onRunPathQuery}>
            查询关系
          </button>
        </details>
      </div>
    </aside>
  );
}
