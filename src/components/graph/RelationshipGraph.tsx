import type { Core, ElementDefinition, EventObject } from 'cytoscape';
import { useEffect, useRef } from 'react';
import type { Person, Relation } from '../../domain';
import { GraphLegend } from './GraphLegend';

interface RelationshipGraphProps {
  persons: Person[];
  relations: Relation[];
  selectedPersonId: string | null;
  selectedRelationId: string | null;
  onSelectPerson: (personId: string) => void;
  onSelectRelation: (relationId: string) => void;
}

function buildElements(
  persons: Person[],
  relations: Relation[],
): ElementDefinition[] {
  const nodes: ElementDefinition[] = persons.map((person) => ({
    data: {
      id: person.id,
      label: person.name,
      detail: person.courtesyName ? `字${person.courtesyName}` : '',
      gender: person.gender,
    },
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
          ? '未经过正史核验'
          : relation.type === 'spouse_of'
            ? '夫妻'
            : '',
    },
    classes: `${relation.type} ${relation.origin}`,
  }));
  return [...nodes, ...edges];
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

  useEffect(() => {
    const container = graphContainerRef.current;
    if (!container) {
      return undefined;
    }

    let disposed = false;
    const initializeGraph = async () => {
      const { default: cytoscape } = await import('cytoscape');
      if (disposed) {
        return;
      }

      graphRef.current?.destroy();
      const graph = cytoscape({
        container,
        elements: buildElements(persons, relations),
        minZoom: 0.45,
        maxZoom: 2.2,
        style: [
          {
            selector: 'node',
            style: {
              width: 58,
              height: 58,
              'background-color': '#f7f1e6',
              'border-color': '#8b8171',
              'border-width': 2,
              color: '#292720',
              label: 'data(label)',
              'font-family': 'Microsoft YaHei, sans-serif',
              'font-size': 13,
              'font-weight': 700,
              'text-valign': 'center',
              'text-halign': 'center',
            },
          },
          {
            selector: 'node.female',
            style: {
              'background-color': '#f4e5e1',
              'border-color': '#a65b52',
            },
          },
          {
            selector: 'node:selected',
            style: {
              'border-color': '#9f312a',
              'border-width': 4,
              'underlay-color': '#9f312a',
              'underlay-opacity': 0.08,
              'underlay-padding': 8,
            },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              'line-color': '#766d60',
              'target-arrow-color': '#766d60',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              color: '#736b61',
              'font-family': 'Microsoft YaHei, sans-serif',
              'font-size': 8,
              'text-background-color': '#f8f5ee',
              'text-background-opacity': 0.92,
              'text-background-padding': '2px',
            },
          },
          {
            selector: 'edge.mother_of',
            style: { 'line-color': '#a65b52', 'target-arrow-color': '#a65b52' },
          },
          {
            selector: 'edge.spouse_of',
            style: {
              'line-color': '#9f312a',
              'target-arrow-shape': 'none',
              'line-style': 'solid',
            },
          },
          {
            selector: 'edge.adoptive_father_of, edge.adoptive_mother_of',
            style: { 'line-style': 'dashed', 'target-arrow-shape': 'triangle' },
          },
          {
            selector: 'edge.candidate',
            style: {
              'line-color': '#aaa49a',
              'target-arrow-color': '#aaa49a',
              'line-style': 'dashed',
              width: 1.5,
              opacity: 0.85,
            },
          },
          {
            selector: 'edge:selected',
            style: { width: 4, 'line-color': '#9f312a' },
          },
        ],
        layout: {
          name: 'breadthfirst',
          directed: true,
          roots: ['person:sg:cao_teng'],
          padding: 24,
          spacingFactor: 1.15,
          animate: false,
        },
      });
      graph.on('tap', 'node', (event: EventObject) => {
        onSelectPerson(event.target.id());
      });
      graph.on('tap', 'edge', (event: EventObject) => {
        onSelectRelation(event.target.id());
      });
      graphRef.current = graph;
    };

    void initializeGraph();
    return () => {
      disposed = true;
      graphRef.current?.destroy();
      graphRef.current = null;
    };
  }, [onSelectPerson, onSelectRelation, persons, relations]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) {
      return;
    }
    graph.elements().unselect();
    const selectedId = selectedRelationId ?? selectedPersonId;
    if (selectedId) {
      const selected = graph.getElementById(selectedId);
      selected.select();
      if (selected.isNode()) {
        graph.animate({ center: { eles: selected }, duration: 250 });
      }
    }
  }, [selectedPersonId, selectedRelationId]);

  return (
    <section className="graph-card" aria-labelledby="graph-title">
      <div className="panel-heading graph-heading">
        <div>
          <p className="eyebrow">关系画布</p>
          <h2 id="graph-title">曹操核心家庭</h2>
        </div>
        <span className="status-badge">15 人 · 史料核验</span>
      </div>
      <GraphLegend />
      <div
        ref={graphContainerRef}
        className="graph-canvas"
        data-testid="relationship-graph"
        data-node-count={persons.length}
        data-relation-count={relations.length}
        data-candidate-count={
          relations.filter((relation) => relation.origin === 'candidate').length
        }
        role="img"
        aria-label="曹操核心家庭人物关系图谱"
      />
    </section>
  );
}
