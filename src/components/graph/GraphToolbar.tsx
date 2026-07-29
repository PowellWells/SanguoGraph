interface GraphToolbarProps {
  onHome: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}

export function GraphToolbar({
  onHome,
  onZoomIn,
  onZoomOut,
  onFit,
}: GraphToolbarProps) {
  return (
    <div className="graph-toolbar" aria-label="图谱视图控制">
      <button type="button" onClick={onHome} aria-label="返回核心人物" title="返回曹操">
        ◆
      </button>
      <button type="button" onClick={onFit} aria-label="适应画布" title="显示全部">
        ⛶
      </button>
      <button type="button" onClick={onZoomIn} aria-label="放大图谱" title="放大">
        ＋
      </button>
      <button type="button" onClick={onZoomOut} aria-label="缩小图谱" title="缩小">
        －
      </button>
    </div>
  );
}
