export function GraphGuide() {
  return (
    <section className="graph-guide" aria-labelledby="graph-guide-title">
      <div>
        <h2 id="graph-guide-title">图谱方法与阅读指南</h2>
        <ul>
          <li>点击人物查看档案；点击连线核对关系证据。</li>
          <li>实线表示已确认，虚线表示待定、存疑或候选。</li>
          <li>拖动画布浏览远处分支；缩小时关系标签会智能收起。</li>
        </ul>
      </div>
      <div>
        <h2>数据与方法</h2>
        <ul>
          <li>魏蓝、蜀红、吴绿、其他灰；男性深色，女性浅色。</li>
          <li>候选默认关闭，不参与正式史实认定。</li>
          <li>双击节点可展开关系，右侧操作可锁定或隐藏节点。</li>
        </ul>
      </div>
    </section>
  );
}
