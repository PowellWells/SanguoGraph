export function GraphGuide() {
  return (
    <section className="graph-guide" aria-labelledby="graph-guide-title">
      <div>
        <h2 id="graph-guide-title">图谱方法与阅读指南</h2>
        <ul>
          <li>点击人物查看档案；点击连线核对关系证据。</li>
          <li>实线为直接记录，虚线为推定或候选线索。</li>
          <li>双击节点可展开关系，右侧操作可锁定或隐藏节点。</li>
        </ul>
      </div>
      <div>
        <h2>数据与方法</h2>
        <ul>
          <li>正史、注引材料与开放知识库候选分层保存。</li>
          <li>候选默认关闭，不参与正式史实认定。</li>
          <li>当前图谱使用 Cytoscape.js 在本地完成交互。</li>
        </ul>
      </div>
    </section>
  );
}
