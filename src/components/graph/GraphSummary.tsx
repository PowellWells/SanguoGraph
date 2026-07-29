interface GraphSummaryProps {
  personCount: number;
  relationCount: number;
  sourceCount: number;
}

export function GraphSummary({
  personCount,
  relationCount,
  sourceCount,
}: GraphSummaryProps) {
  return (
    <dl className="graph-summary" aria-label="图谱数据摘要">
      <div>
        <dt>正式人物</dt>
        <dd>{personCount}</dd>
      </div>
      <div>
        <dt>核验关系</dt>
        <dd>{relationCount}</dd>
      </div>
      <div>
        <dt>史料记录</dt>
        <dd>{sourceCount}</dd>
      </div>
    </dl>
  );
}
