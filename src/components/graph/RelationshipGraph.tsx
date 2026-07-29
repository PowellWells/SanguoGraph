import type { Core, ElementDefinition, EventObject } from 'cytoscape';
import { useEffect, useRef } from 'react';
import type { Person, Relation, RelationType } from '../../domain';
import {
  getPersonGraphClasses,
  getRelationGraphClasses,
} from '../../services/graphVisualEncoding';
import {
  createGraphLayout,
  type GraphLayout,
  type GraphPosition,
} from '../../services/graphLayout';
import { getRelationClaim } from '../../services/relationPresentation';
import { GraphLegend } from './GraphLegend';
import { GraphToolbar } from './GraphToolbar';

interface RelationshipGraphProps {
  persons: Person[];
  relations: Relation[];
  selectedPersonId: string | null;
  selectedRelationId: string | null;
  lockedPersonIds: ReadonlySet<string>;
  highlightedRelationIds: ReadonlySet<string>;
  onSelectPerson: (personId: string) => void;
  onSelectRelation: (relationId: string) => void;
  onToggleExpand: (personId: string) => void;
}

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
  layout: GraphLayout,
  lockedPersonIds: ReadonlySet<string>,
  highlightedRelationIds: ReadonlySet<string>,
): ElementDefinition[] {
  const coreGeneration =
    layout.generations['person:sg:cao_cao'] ?? Number.MAX_SAFE_INTEGER;
  const nodes: ElementDefinition[] = persons.map((person) => ({
    data: {
      id: person.id,
      label: person.courtesyName
        ? `${person.name}\n字${person.courtesyName}`
        : person.name,
      gender: person.gender,
      ancestor: (layout.generations[person.id] ?? 0) < coreGeneration,
    },
    position: layout.positions[person.id],
    classes: getPersonGraphClasses(
      person,
      lockedPersonIds.has(person.id),
    ),
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
    classes: getRelationGraphClasses(
      relation,
      getRelationClaim(relation, persons).evidenceBasis,
      highlightedRelationIds.has(relation.id),
    ),
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
  lockedPersonIds,
  highlightedRelationIds,
  onSelectPerson,
  onSelectRelation,
  onToggleExpand,
}: RelationshipGraphProps) {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Core | null>(null);
  const positionCacheRef = useRef<Record<string, GraphPosition>>({});
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
    const rememberPositions = () => {
      if (!currentGraph) {
        return;
      }
      const nextPositions = { ...positionCacheRef.current };
      currentGraph.nodes().forEach((node) => {
        const position = node.position();
        nextPositions[node.id()] = { x: position.x, y: position.y };
      });
      positionCacheRef.current = nextPositions;
    };
    const getLayout = () =>
      createGraphLayout(persons, relations, {
        compact: container.clientWidth < 500,
        lockedPersonIds,
        previousPositions: positionCacheRef.current,
      });
    const fitToContainer = () => {
      if (currentGraph) {
        rememberPositions();
        const layout = getLayout();
        currentGraph
          .nodes()
          .positions(
            (node) =>
              layout.positions[node.id()] ??
              positionCacheRef.current[node.id()] ?? { x: 0, y: 0 },
          );
        currentGraph.resize();
        currentGraph.fit(undefined, 24);
      }
    };
    window.addEventListener('resize', fitToContainer);

    const initializeGraph = async () => {
      const { default: cytoscape } = await import('cytoscape');
      if (disposed) {
        return;
      }

      graphRef.current?.destroy();
      const layout = getLayout();
      const graph = cytoscape({
        container,
        elements: buildElements(
          persons,
          relations,
          layout,
          lockedPersonIds,
          highlightedRelationIds,
        ),
        minZoom: 0.2,
        maxZoom: 2.4,
        style: [
          {
            selector: 'node',
            style: {
              width: 54,
              height: 54,
              'background-color': '#68727d',
              'border-color': '#47515c',
              'border-width': 2,
              color: '#ffffff',
              label: 'data(label)',
              'font-family': 'Songti SC, Microsoft YaHei, serif',
              'font-size': 10,
              'font-weight': 700,
              'line-height': 1.25,
              'text-wrap': 'wrap',
              'text-valign': 'center',
              'text-halign': 'center',
            },
          },
          {
            selector: 'node.faction-wei',
            style: {
              'background-color': '#3f6f9f',
              'border-color': '#244e79',
              color: '#ffffff',
            },
          },
          {
            selector: 'node.faction-wei.female',
            style: {
              'background-color': '#dce9f5',
              'border-color': '#47749e',
              color: '#183751',
            },
          },
          {
            selector: 'node.faction-shu',
            style: {
              'background-color': '#aa3d45',
              'border-color': '#7f252c',
              color: '#ffffff',
            },
          },
          {
            selector: 'node.faction-shu.female',
            style: {
              'background-color': '#f3dadd',
              'border-color': '#bd6269',
              color: '#5f2227',
            },
          },
          {
            selector: 'node.faction-wu',
            style: {
              'background-color': '#3f7b59',
              'border-color': '#285d40',
              color: '#ffffff',
            },
          },
          {
            selector: 'node.faction-wu.female',
            style: {
              'background-color': '#dcecdf',
              'border-color': '#5f8f70',
              color: '#244a33',
            },
          },
          {
            selector: 'node.faction-other',
            style: {
              'background-color': '#68727d',
              'border-color': '#47515c',
              color: '#ffffff',
            },
          },
          {
            selector: 'node.faction-other.female',
            style: {
              'background-color': '#e8ebee',
              'border-color': '#7f8891',
              color: '#343a40',
            },
          },
          {
            selector: 'node.person-confirmed',
            style: {
              'border-style': 'solid',
            },
          },
          {
            selector: 'node.person-pending',
            style: {
              'border-style': 'dashed',
            },
          },
          {
            selector: 'node.core',
            style: {
              width: 66,
              height: 66,
              'border-width': 3,
              'font-size': 13,
            },
          },
          {
            selector: 'node:selected',
            style: {
              'border-color': '#d5a52f',
              'border-width': 4,
              'underlay-color': '#d5a52f',
              'underlay-opacity': 0.16,
              'underlay-padding': 7,
            },
          },
          {
            selector: 'node.locked',
            style: {
              'underlay-color': '#1d2630',
              'underlay-opacity': 0.13,
              'underlay-padding': 10,
            },
          },
          {
            selector: 'edge',
            style: {
              width: 1.8,
              'line-color': '#b51217',
              'target-arrow-color': '#b51217',
              'target-arrow-shape': 'triangle',
              'arrow-scale': 0.8,
              'curve-style': 'bezier',
              label: 'data(label)',
              color: '#4e5054',
              'font-family': 'Microsoft YaHei, sans-serif',
              'font-size': 8.5,
              'font-weight': 700,
              'text-background-color': '#ffffff',
              'text-background-opacity': 0.94,
              'text-background-padding': '3px',
              'text-rotation': 'autorotate',
            },
          },
          {
            selector: 'edge.mother_of',
            style: {
              'line-color': '#b51217',
              'target-arrow-color': '#b51217',
            },
          },
          {
            selector: 'edge.spouse_of',
            style: {
              width: 1.8,
              'line-color': '#34383d',
              'target-arrow-shape': 'none',
              'text-rotation': 'none',
            },
          },
          {
            selector: 'edge.adoptive_father_of, edge.adoptive_mother_of',
            style: {
              'line-color': '#b51217',
              'target-arrow-color': '#b51217',
              'target-arrow-shape': 'triangle',
            },
          },
          {
            selector: 'edge.indirect_inference',
            style: {
              'line-color': '#b51217',
              'target-arrow-color': '#b51217',
            },
          },
          {
            selector: 'edge.candidate',
            style: {
              'line-color': '#8d9299',
              'target-arrow-color': '#8d9299',
              'curve-style': 'unbundled-bezier',
              'control-point-distances': 28,
              'control-point-weights': 0.5,
              color: '#71767d',
              width: 1.4,
              opacity: 0.82,
            },
          },
          {
            selector: 'edge.relation-confirmed',
            style: {
              'line-style': 'solid',
              opacity: 1,
            },
          },
          {
            selector: 'edge.relation-pending',
            style: {
              'line-style': 'dashed',
              opacity: 0.76,
            },
          },
          {
            selector: 'edge:selected',
            style: {
              width: 4,
              'line-color': '#b51217',
              'target-arrow-color': '#b51217',
              'z-index': 10,
            },
          },
          {
            selector: 'edge.path-highlight',
            style: {
              width: 4,
              'line-color': '#c08324',
              'target-arrow-color': '#c08324',
              'z-index': 9,
            },
          },
        ],
        layout: {
          name: 'preset',
          fit: true,
          padding: 24,
          animate: false,
        },
      });
      currentGraph = graph;
      lockedPersonIds.forEach((personId) => {
        graph.getElementById(personId).lock();
      });
      let lastTappedNodeId: string | null = null;
      let lastTappedAt = 0;
      graph.on('tap', 'node', (event: EventObject) => {
        const personId = event.target.id();
        const now = Date.now();
        if (lastTappedNodeId === personId && now - lastTappedAt < 360) {
          lastTappedNodeId = null;
          lastTappedAt = 0;
          onToggleExpand(personId);
          return;
        }
        lastTappedNodeId = personId;
        lastTappedAt = now;
        onSelectPerson(personId);
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
      rememberPositions();
      currentGraph?.destroy();
      if (graphRef.current === currentGraph) {
        graphRef.current = null;
      }
    };
  }, [
    highlightedRelationIds,
    lockedPersonIds,
    onSelectPerson,
    onSelectRelation,
    onToggleExpand,
    persons,
    relations,
  ]);

  useEffect(() => {
    const graph = graphRef.current;
    if (graph) {
      selectGraphElement(graph, selectedPersonId, selectedRelationId, true);
    }
  }, [selectedPersonId, selectedRelationId]);

  const fitGraph = () => {
    graphRef.current?.fit(undefined, 24);
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
      <h2 id="graph-title" className="visually-hidden">曹操核心家庭关系图谱</h2>
      <div className="graph-meta-row">
        <GraphLegend />
        <GraphToolbar
          onHome={() => onSelectPerson('person:sg:cao_cao')}
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
