export function GraphLegend() {
  return (
    <div className="graph-legend" aria-label="关系图例">
      <span><i className="legend-line confirmed" />关系确凿</span>
      <span><i className="legend-line pending" />关系待定</span>
      <span>宗族／婚姻为无向连线</span>
      <span><i className="legend-person confirmed" />人物确凿</span>
      <span><i className="legend-person pending" />人物待定</span>
      <span><i className="legend-color wei" />魏</span>
      <span><i className="legend-color shu" />蜀</span>
      <span><i className="legend-color wu" />吴</span>
      <span><i className="legend-color other" />其他</span>
      <span>男深／女浅</span>
    </div>
  );
}
