import type { Core, ElementDefinition, EventObject } from 'cytoscape';
import { useEffect, useRef, useState } from 'react';
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
import {
  coreReturnGraphZoom,
  ensureReadableGraphZoom,
  shouldShowAllRelationLabels,
} from '../../services/graphViewport';
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
const corePersonId = 'person:sg:cao_cao';

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
  const edges: ElementDefinition[] = relations.map((relation) => {
    const route = layout.edgeRoutes[relation.id] ?? {
      kind: 'secondary',
      curveStyle: 'unbundled-bezier',
      controlPointDistance: 36,
      controlPointWeight: 0.5,
    };
    return {
      data: {
        id: relation.id,
        source: relation.sourcePersonId,
        target: relation.targetPersonId,
        type: relation.type,
        label:
          relation.origin === 'candidate'
            ? '候选'
            : relationLabels[relation.type],
        controlPointDistance: route.controlPointDistance,
        controlPointWeight: route.controlPointWeight,
      },
      classes: [
        getRelationGraphClasses(
          relation,
          getRelationClaim(relation, persons).evidenceBasis,
          highlightedRelationIds.has(relation.id),
        ),
        `route-${route.kind}`,
        route.curveStyle === 'straight'
          ? 'route-straight'
          : 'route-curved',
      ].join(' '),
    };
  });
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
    graph.animate({
      center: { eles: selected },
      zoom: Math.max(graph.zoom(), coreReturnGraphZoom),
      duration: 240,
    });
  }
}

function updateGraphLabelVisibility(
  graph: Core,
  showAllLabels: boolean,
) {
  const edges = graph.edges();
  edges.removeClass('label-visible');
  if (
    shouldShowAllRelationLabels(graph.zoom(), showAllLabels)
  ) {
    edges.addClass('label-visible');
    return;
  }
  graph.edges('.path-highlight').addClass('label-visible');
  graph.edges('.hover-label').addClass('label-visible');
  graph.edges(':selected').addClass('label-visible');
  graph.nodes(':selected').connectedEdges().addClass('label-visible');
}

function fitReadableGraph(graph: Core, focusPersonId: string) {
  graph.fit(undefined, 24);
  const fittedZoom = graph.zoom();
  const readableZoom = ensureReadableGraphZoom(fittedZoom);
  if (readableZoom === fittedZoom) {
    return;
  }
  graph.zoom(readableZoom);
  const focus = graph.getElementById(focusPersonId);
  if (focus.nonempty()) {
    graph.center(focus);
  } else {
    graph.center();
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
  const [showAllLabels, setShowAllLabels] = useState(false);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Core | null>(null);
  const positionCacheRef = useRef<Record<string, GraphPosition>>({});
  const viewportCacheRef = useRef<{
    zoom: number;
    pan: GraphPosition;
  } | null>(null);
  const selectedPersonRef = useRef(selectedPersonId);
  const selectedRelationRef = useRef(selectedRelationId);
  const showAllLabelsRef = useRef(showAllLabels);
  selectedPersonRef.current = selectedPersonId;
  selectedRelationRef.current = selectedRelationId;
  showAllLabelsRef.current = showAllLabels;

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
    const rememberViewport = () => {
      if (!currentGraph) {
        return;
      }
      const pan = currentGraph.pan();
      viewportCacheRef.current = {
        zoom: currentGraph.zoom(),
        pan: { x: pan.x, y: pan.y },
      };
    };
    const getLayout = () =>
      createGraphLayout(persons, relations, {
        compact: container.clientWidth < 500,
        anchorPersonId: corePersonId,
        lockedPersonIds,
        previousPositions: positionCacheRef.current,
      });
    const resizePreservingViewport = () => {
      if (currentGraph) {
        rememberPositions();
        rememberViewport();
        const layout = getLayout();
        currentGraph
          .nodes()
          .positions(
            (node) =>
              layout.positions[node.id()] ??
              positionCacheRef.current[node.id()] ?? { x: 0, y: 0 },
          );
        currentGraph.resize();
        const cachedViewport = viewportCacheRef.current;
        if (cachedViewport) {
          currentGraph.zoom(cachedViewport.zoom);
          currentGraph.pan(cachedViewport.pan);
        }
        updateGraphLabelVisibility(
          currentGraph,
          showAllLabelsRef.current,
        );
      }
    };
    window.addEventListener('resize', resizePreservingViewport);

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
              'curve-style': 'straight',
              label: '',
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
            selector: 'edge.label-visible',
            style: {
              label: 'data(label)',
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
            selector: 'edge.clan_relative_of',
            style: {
              width: 1.8,
              'line-color': '#526b82',
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
              color: '#71767d',
              width: 1.4,
              opacity: 0.82,
            },
          },
          {
            selector: 'edge.route-straight',
            style: {
              'curve-style': 'straight',
            },
          },
          {
            selector: 'edge.route-curved',
            style: {
              'curve-style': 'unbundled-bezier',
              'control-point-distances':
                'data(controlPointDistance)',
              'control-point-weights':
                'data(controlPointWeight)',
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
          fit: false,
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
      graph.on('mouseover', 'edge', (event: EventObject) => {
        event.target.addClass('hover-label');
        updateGraphLabelVisibility(
          graph,
          showAllLabelsRef.current,
        );
      });
      graph.on('mouseout', 'edge', (event: EventObject) => {
        event.target.removeClass('hover-label');
        updateGraphLabelVisibility(
          graph,
          showAllLabelsRef.current,
        );
      });
      graph.on('zoom', () => {
        updateGraphLabelVisibility(
          graph,
          showAllLabelsRef.current,
        );
      });
      graphRef.current = graph;
      const cachedViewport = viewportCacheRef.current;
      selectGraphElement(
        graph,
        selectedPersonRef.current,
        selectedRelationRef.current,
        cachedViewport !== null &&
          selectedPersonRef.current !== null,
      );
      window.requestAnimationFrame(() => {
        graph.resize();
        if (cachedViewport) {
          graph.zoom(cachedViewport.zoom);
          graph.pan(cachedViewport.pan);
          if (selectedPersonRef.current) {
            const selected = graph.getElementById(
              selectedPersonRef.current,
            );
            if (selected.nonempty()) {
              graph.center(selected);
            }
          }
        } else {
          fitReadableGraph(
            graph,
            selectedPersonRef.current ?? corePersonId,
          );
        }
        updateGraphLabelVisibility(
          graph,
          showAllLabelsRef.current,
        );
      });
    };

    void initializeGraph();
    return () => {
      disposed = true;
      window.removeEventListener(
        'resize',
        resizePreservingViewport,
      );
      rememberPositions();
      rememberViewport();
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
      updateGraphLabelVisibility(graph, showAllLabelsRef.current);
    }
  }, [selectedPersonId, selectedRelationId]);

  useEffect(() => {
    const graph = graphRef.current;
    if (graph) {
      updateGraphLabelVisibility(graph, showAllLabels);
    }
  }, [showAllLabels]);

  const fitGraph = () => {
    const graph = graphRef.current;
    if (graph) {
      graph.fit(undefined, 24);
      updateGraphLabelVisibility(graph, showAllLabelsRef.current);
    }
  };
  const zoomGraph = (factor: number) => {
    const graph = graphRef.current;
    if (graph) {
      graph.zoom(Math.min(2.4, Math.max(0.2, graph.zoom() * factor)));
      updateGraphLabelVisibility(graph, showAllLabelsRef.current);
    }
  };
  const returnToCore = () => {
    onSelectPerson(corePersonId);
    const graph = graphRef.current;
    if (graph) {
      const core = graph.getElementById(corePersonId);
      if (core.nonempty()) {
        graph.animate({
          center: { eles: core },
          zoom: Math.max(graph.zoom(), coreReturnGraphZoom),
          duration: 240,
        });
      }
    }
  };
  const candidateCount = relations.filter(
    (relation) => relation.origin === 'candidate',
  ).length;

  return (
    <section className="graph-card" aria-labelledby="graph-title">
      <h2 id="graph-title" className="visually-hidden">三国主要人物关系图谱</h2>
      <div className="graph-meta-row">
        <GraphLegend />
        <GraphToolbar
          onHome={returnToCore}
          onZoomIn={() => zoomGraph(1.18)}
          onZoomOut={() => zoomGraph(0.84)}
          onFit={fitGraph}
          showAllLabels={showAllLabels}
          onToggleLabels={() =>
            setShowAllLabels((current) => !current)
          }
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
          aria-label="三国主要人物关系图谱"
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
