import type { Person, RelationType } from '../../domain';
import type { NeighborhoodDepth } from '../../services/graphSelectors';

const relationOptions: ReadonlyArray<{ type: RelationType; label: string }> = [
  { type: 'father_of', label: '父亲' },
  { type: 'mother_of', label: '母亲' },
  { type: 'spouse_of', label: '夫妻' },
  { type: 'adoptive_father_of', label: '养父' },
  { type: 'adoptive_mother_of', label: '养母' },
];

interface GraphControlsProps {
  query: string;
  searchResults: Person[];
  enabledTypes: ReadonlySet<RelationType>;
  depth: NeighborhoodDepth;
  showCandidates: boolean;
  candidateStatus: 'idle' | 'loading' | 'loaded' | 'error';
  candidateError: string | null;
  onQueryChange: (query: string) => void;
  onSelectPerson: (personId: string) => void;
  onToggleType: (type: RelationType) => void;
  onDepthChange: (depth: NeighborhoodDepth) => void;
  onCandidateToggle: (enabled: boolean) => void;
}

export function GraphControls({
  query,
  searchResults,
  enabledTypes,
  depth,
  showCandidates,
  candidateStatus,
  candidateError,
  onQueryChange,
  onSelectPerson,
  onToggleType,
  onDepthChange,
  onCandidateToggle,
}: GraphControlsProps) {
  return (
    <aside className="panel-card controls-panel" aria-labelledby="controls-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">浏览条件</p>
          <h2 id="controls-title">筛选关系</h2>
        </div>
      </div>
      <label htmlFor="person-search">人物搜索</label>
      <input
        id="person-search"
        type="search"
        value={query}
        placeholder="姓名、字或别名"
        onChange={(event) => onQueryChange(event.target.value)}
      />
      {query && (
        <ul className="search-results" aria-label="人物搜索结果">
          {searchResults.length === 0 ? (
            <li className="search-empty">未找到匹配人物</li>
          ) : (
            searchResults.map((person) => (
              <li key={person.id}>
                <button type="button" onClick={() => onSelectPerson(person.id)}>
                  <strong>{person.name}</strong>
                  {person.courtesyName && <span>字{person.courtesyName}</span>}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      <fieldset>
        <legend>关系类型</legend>
        {relationOptions.map((option) => (
          <label key={option.type}>
            <input
              type="checkbox"
              checked={enabledTypes.has(option.type)}
              onChange={() => onToggleType(option.type)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>查看范围</legend>
        {[
          { value: 'all', label: '全部' },
          { value: 1, label: '1 跳' },
          { value: 2, label: '2 跳' },
        ].map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="neighborhood"
              checked={depth === option.value}
              onChange={() =>
                onDepthChange(option.value as NeighborhoodDepth)
              }
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      <div className="candidate-toggle">
        <label>
          <input
            type="checkbox"
            checked={showCandidates}
            onChange={(event) => onCandidateToggle(event.target.checked)}
          />
          显示 Wikidata 候选线索
        </label>
        <p>默认关闭；候选边不构成史实认定。</p>
        {candidateStatus === 'loading' && (
          <p role="status">正在按需加载候选数据……</p>
        )}
        {candidateError && (
          <p className="inline-error" role="alert">
            {candidateError}
          </p>
        )}
      </div>
    </aside>
  );
}
