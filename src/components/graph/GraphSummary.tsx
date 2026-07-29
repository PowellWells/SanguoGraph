interface GraphSummaryProps {
  personCount: number;
  relationCount: number;
  sourceCount: number;
  onOpenSources: () => void;
}

export function GraphSummary({
  personCount,
  relationCount,
  sourceCount,
  onOpenSources,
}: GraphSummaryProps) {
  return (
    <dl className="graph-summary" aria-label="图谱数据摘要">
      <div>
        <dt>当前人物</dt>
        <dd>{personCount}</dd>
      </div>
      <div>
        <dt>当前关系</dt>
        <dd>{relationCount}</dd>
      </div>
      <div className="summary-action">
        <dt>当前史料</dt>
        <dd>
          <button type="button" onClick={onOpenSources}>
            {sourceCount}
            <span>查看列表</span>
          </button>
        </dd>
      </div>
    </dl>
  );
}
