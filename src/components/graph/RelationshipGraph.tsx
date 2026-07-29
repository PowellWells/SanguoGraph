import type { Core } from 'cytoscape';
import { useEffect, useRef } from 'react';

export function RelationshipGraph() {
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = graphContainerRef.current;

    if (!container) {
      return undefined;
    }

    let graph: Core | undefined;
    let disposed = false;

    const initializeGraph = async () => {
      const { default: cytoscape } = await import('cytoscape');

      if (disposed) {
        return;
      }

      graph = cytoscape({
        container,
        elements: [],
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#9f312a',
              label: 'data(label)',
            },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              'line-color': '#938a7a',
              'target-arrow-color': '#938a7a',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
            },
          },
        ],
      });
    };

    void initializeGraph();

    return () => {
      disposed = true;
      graph?.destroy();
    };
  }, []);

  return (
    <section className="graph-card" aria-labelledby="graph-title">
      <div className="panel-heading graph-heading">
        <div>
          <p className="eyebrow">关系画布</p>
          <h2 id="graph-title">人物关系图谱</h2>
        </div>
        <span className="status-badge">骨架阶段</span>
      </div>
      <div
        ref={graphContainerRef}
        className="graph-canvas"
        data-testid="relationship-graph"
        role="img"
        aria-label="空白人物关系图谱画布"
      >
        <div className="graph-empty-state">
          <span className="empty-seal" aria-hidden="true">
            史
          </span>
          <h3>关系图谱将在下一阶段开放</h3>
          <p>当前已完成画布与数据结构，人物节点尚未载入。</p>
        </div>
      </div>
    </section>
  );
}
