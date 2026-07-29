export function GraphLegend() {
  return (
    <div className="graph-legend" aria-label="关系图例">
      <span><i className="legend-line father" />父亲</span>
      <span><i className="legend-line mother" />母亲</span>
      <span><i className="legend-line spouse" />夫妻</span>
      <span><i className="legend-line adoptive" />收养</span>
      <span><i className="legend-line inferred" />正史间接推定</span>
      <span><i className="legend-line candidate" />未核验候选</span>
    </div>
  );
}
