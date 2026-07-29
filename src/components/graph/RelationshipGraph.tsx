import type { Core, ElementDefinition, EventObject } from 'cytoscape';
import { useEffect, useRef } from 'react';
import type { Person, Relation, RelationType } from '../../domain';
import { GraphLegend } from './GraphLegend';
import { GraphToolbar } from './GraphToolbar';

interface RelationshipGraphProps {
  persons: Person[];
  relations: Relation[];
  selectedPersonId: string | null;
  selectedRelationId: string | null;
  onSelectPerson: (personId: string) => void;
  onSelectRelation: (relationId: string) => void;
}

const personPositions: Readonly<Record<string, { x: number; y: number }>> = {
  'person:sg:cao_teng': { x: 560, y: 55 },
  'person:sg:cao_song': { x: 560, y: 155 },
  'person:sg:cao_cao': { x: 560, y: 275 },
  'person:sg:lady_ding': { x: 250, y: 275 },
  'person:sg:lady_liu': { x: 355, y: 275 },
  'person:sg:empress_bian': { x: 765, y: 275 },
  'person:sg:lady_huan': { x: 870, y: 275 },
  'person:sg:cao_ang': { x: 90, y: 500 },
  'person:sg:cao_pi': { x: 225, y: 500 },
  'person:sg:cao_zhang': { x: 360, y: 500 },
  'person:sg:cao_zhi': { x: 495, y: 500 },
  'person:sg:cao_xiong': { x: 630, y: 500 },
  'person:sg:cao_chong': { x: 765, y: 500 },
  'person:sg:cao_ju': { x: 900, y: 500 },
  'person:sg:cao_yu': { x: 1035, y: 500 },
};

const compactPersonPositions: Readonly<
  Record<string, { x: number; y: number }>
> = {
  'person:sg:cao_teng': { x: 260, y: 45 },
  'person:sg:cao_song': { x: 260, y: 135 },
  'person:sg:cao_cao': { x: 260, y: 230 },
  'person:sg:lady_ding': { x: 80, y: 325 },
  'person:sg:lady_liu': { x: 195, y: 325 },
  'person:sg:empress_bian': { x: 325, y: 325 },
  'person:sg:lady_huan': { x: 440, y: 325 },
  'person:sg:cao_ang': { x: 65, y: 470 },
  'person:sg:cao_pi': { x: 195, y: 470 },
  'person:sg:cao_zhang': { x: 325, y: 470 },
  'person:sg:cao_zhi': { x: 455, y: 470 },
  'person:sg:cao_xiong': { x: 65, y: 610 },
  'person:sg:cao_chong': { x: 195, y: 610 },
  'person:sg:cao_ju': { x: 325, y: 610 },
  'person:sg:cao_yu': { x: 455, y: 610 },
};

const relationLabels: Readonly<Record<RelationType, string>> = {
  father_of: '父',
  mother_of: '母',
  spouse_of: '夫妻',
  adoptive_father_of: '养父',
  adoptive_mother_of: '养母',
  clan_relative_of: '宗族',
};

function buildElements(
  persons: Person[],
  relations: Relation[],
  compact: boolean,
): ElementDefinition[] {
  const positions = compact ? compactPersonPositions : personPositions;
  const nodes: ElementDefinition[] = persons.map((person) => ({
    data: {
      id: person.id,
      label: person.courtesyName
        ? `${person.name}\n字${person.courtesyName}`
        : person.name,
      gender: person.gender,
      ancestor:
        person.id === 'person:sg:cao_teng' ||
        person.id === 'person:sg:cao_song' ||
        person.id === 'person:sg:cao_cao',
    },
    position: positions[person.id],
    classes: `person ${person.gender}`,
  }));
  const edges: ElementDefinition[] = relations.map((relation) => ({
    data: {
      id: relation.id,
      source: relation.sourcePersonId,
      target: relation.targetPersonId,
      type: relation.type,
      label:
        relation.origin === 'candidate'
          ? '候选'
          : relationLabels[relation.type],
    },
    classes: `${relation.type} ${relation.origin}`,
  }));
  return [...nodes, ...edges];
}

function selectGraphElement(
  graph: Core,
  selectedPersonId: string | null,
  selectedRelationId: string | null,
  shouldCenter: boolean,
) {
  graph.elements().unselect();
  const selectedId = selectedRelationId ?? selectedPersonId;
  if (!selectedId) {
    return;
  }
  const selected = graph.getElementById(selectedId);
  selected.select();
  if (shouldCenter && selected.isNode()) {
    graph.animate({ center: { eles: selected }, duration: 240 });
  }
}

export function RelationshipGraph({
  persons,
  relations,
  selectedPersonId,
  selectedRelationId,
  onSelectPerson,
  onSelectRelation,
}: RelationshipGraphProps) {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Core | null>(null);
  const selectedPersonRef = useRef(selectedPersonId);
  const selectedRelationRef = useRef(selectedRelationId);
  selectedPersonRef.current = selectedPersonId;
  selectedRelationRef.current = selectedRelationId;

  useEffect(() => {
    const container = graphContainerRef.current;
    if (!container) {
      return undefined;
    }

    let disposed = false;
    let currentGraph: Core | null = null;
    const fitToContainer = () => {
      if (currentGraph) {
        const positions =
          container.clientWidth < 500
            ? compactPersonPositions
            : personPositions;
        currentGraph
          .nodes()
          .positions((node) => positions[node.id()] ?? { x: 0, y: 0 });
        currentGraph.resize();
        currentGraph.fit(undefined, 36);
      }
    };
    window.addEventListener('resize', fitToContainer);

    const initializeGraph = async () => {
      const { default: cytoscape } = await import('cytoscape');
      if (disposed) {
        return;
      }

      graphRef.current?.destroy();
      const graph = cytoscape({
        container,
        elements: buildElements(persons, relations, container.clientWidth < 500),
        minZoom: 0.2,
        maxZoom: 2.4,
        style: [
          {
            selector: 'node',
            style: {
              width: 72,
              height: 72,
              'background-color': '#f8f3e9',
              'border-color': '#7e7567',
              'border-width': 2,
              color: '#292720',
              label: 'data(label)',
              'font-family': 'Microsoft YaHei, sans-serif',
              'font-size': 11,
              'font-weight': 700,
              'line-height': 1.45,
              'text-wrap': 'wrap',
              'text-valign': 'center',
              'text-halign': 'center',
            },
          },
          {
            selector: 'node[ancestor]',
            style: {
              'background-color': '#efe7d8',
              'border-color': '#6b6255',
              'border-width': 3,
            },
          },
          {
            selector: 'node.female',
            style: {
              'background-color': '#f4e3de',
              'border-color': '#a65b52',
              shape: 'round-diamond',
            },
          },
          {
            selector: 'node:selected',
            style: {
              'background-color': '#fffaf0',
              'border-color': '#9f312a',
              'border-width': 4,
              'underlay-color': '#9f312a',
              'underlay-opacity': 0.1,
              'underlay-padding': 10,
            },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              'line-color': '#6f685e',
              'target-arrow-color': '#6f685e',
              'target-arrow-shape': 'triangle',
              'arrow-scale': 0.8,
              'curve-style': 'bezier',
              label: 'data(label)',
              color: '#655f56',
              'font-family': 'Microsoft YaHei, sans-serif',
              'font-size': 8,
              'font-weight': 700,
              'text-background-color': '#faf7f0',
              'text-background-opacity': 0.94,
              'text-background-padding': '3px',
              'text-rotation': 'autorotate',
            },
          },
          {
            selector: 'edge.mother_of',
            style: {
              'line-color': '#b16056',
              'target-arrow-color': '#b16056',
            },
          },
          {
            selector: 'edge.spouse_of',
            style: {
              width: 2.4,
              'line-color': '#9f312a',
              'target-arrow-shape': 'none',
              'line-style': 'solid',
              'text-rotation': 'none',
            },
          },
          {
            selector: 'edge.adoptive_father_of, edge.adoptive_mother_of',
            style: {
              'line-style': 'dashed',
              'target-arrow-shape': 'triangle',
            },
          },
          {
            selector: 'edge.candidate',
            style: {
              'line-color': '#aaa49a',
              'target-arrow-color': '#aaa49a',
              'line-style': 'dashed',
              'curve-style': 'unbundled-bezier',
              'control-point-distances': 28,
              'control-point-weights': 0.5,
              color: '#817b72',
              width: 1.5,
              opacity: 0.82,
            },
          },
          {
            selector: 'edge:selected',
            style: {
              width: 4,
              'line-color': '#9f312a',
              'target-arrow-color': '#9f312a',
              'z-index': 10,
            },
          },
        ],
        layout: {
          name: 'preset',
          fit: true,
          padding: 42,
          animate: false,
        },
      });
      currentGraph = graph;
      graph.on('tap', 'node', (event: EventObject) => {
        onSelectPerson(event.target.id());
      });
      graph.on('tap', 'edge', (event: EventObject) => {
        onSelectRelation(event.target.id());
      });
      graphRef.current = graph;
      selectGraphElement(
        graph,
        selectedPersonRef.current,
        selectedRelationRef.current,
        false,
      );
      window.requestAnimationFrame(fitToContainer);
    };

    void initializeGraph();
    return () => {
      disposed = true;
      window.removeEventListener('resize', fitToContainer);
      graphRef.current?.destroy();
      graphRef.current = null;
    };
  }, [onSelectPerson, onSelectRelation, persons, relations]);

  useEffect(() => {
    const graph = graphRef.current;
    if (graph) {
      selectGraphElement(graph, selectedPersonId, selectedRelationId, true);
    }
  }, [selectedPersonId, selectedRelationId]);

  const fitGraph = () => {
    graphRef.current?.fit(undefined, 42);
  };
  const zoomGraph = (factor: number) => {
    const graph = graphRef.current;
    if (graph) {
      graph.zoom(Math.min(2.4, Math.max(0.2, graph.zoom() * factor)));
      graph.center();
    }
  };
  const candidateCount = relations.filter(
    (relation) => relation.origin === 'candidate',
  ).length;

  return (
    <section className="graph-card" aria-labelledby="graph-title">
      <div className="panel-heading graph-heading">
        <div>
          <p className="eyebrow">关系画布</p>
          <h2 id="graph-title">曹操核心家庭</h2>
        </div>
        <span className="status-badge">史料核验层</span>
      </div>
      <div className="graph-meta-row">
        <GraphLegend />
        <GraphToolbar
          onZoomIn={() => zoomGraph(1.18)}
          onZoomOut={() => zoomGraph(0.84)}
          onFit={fitGraph}
        />
      </div>
      <div className="graph-stage">
        <div
          ref={graphContainerRef}
          className="graph-canvas"
          data-testid="relationship-graph"
          data-node-count={persons.length}
          data-relation-count={relations.length}
          data-candidate-count={candidateCount}
          role="img"
          aria-label="曹操核心家庭人物关系图谱"
        />
        <div className="graph-readout" aria-live="polite">
          <span>{persons.length} 人物</span>
          <span>{relations.length - candidateCount} 正式关系</span>
          {candidateCount > 0 && <span>{candidateCount} 候选线索</span>}
        </div>
      </div>
    </section>
  );
}
