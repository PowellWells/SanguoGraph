import { useCallback, useMemo, useState } from 'react';
import { GraphControls } from '../components/graph/GraphControls';
import { GraphGuide } from '../components/graph/GraphGuide';
import { GraphSummary } from '../components/graph/GraphSummary';
import { RelationshipGraph } from '../components/graph/RelationshipGraph';
import { PathResultPanel } from '../components/person/PathResultPanel';
import { PersonPanel } from '../components/person/PersonPanel';
import { SourceCatalogPanel } from '../components/source/SourceCatalogPanel';
import { graphData } from '../data';
import type {
  RelationType,
  VisualFaction,
} from '../domain';
import {
  filterRelations,
  selectNeighborhood,
  type NeighborhoodDepth,
} from '../services/graphSelectors';
import { searchPersons } from '../services/personSearch';
import { getFactionColorKey } from '../services/graphVisualEncoding';
import {
  findShortestRelationshipPath,
  type RelationshipPath,
} from '../services/relationshipPath';
import {
  countRelationsBySourceLayer,
  filterRelationsBySourceLayers,
  initialSourceLayers,
  type SourceLayerKey,
} from '../services/sourceLayers';

const corePersonId = 'person:sg:cao_cao';
const initialTypes = new Set<RelationType>([
  'father_of',
  'mother_of',
  'spouse_of',
  'adoptive_father_of',
  'adoptive_mother_of',
  'clan_relative_of',
]);
const allFormalPersonIds = new Set(graphData.persons.map((person) => person.id));
const initialCorePersonIds = new Set([corePersonId]);
graphData.relations.forEach((relation) => {
  if (
    relation.sourcePersonId === corePersonId ||
    relation.targetPersonId === corePersonId
  ) {
    initialCorePersonIds.add(relation.sourcePersonId);
    initialCorePersonIds.add(relation.targetPersonId);
  }
});
const visualFactionCounts = graphData.persons.reduce<
  Record<VisualFaction, number>
>(
  (counts, person) => {
    counts[getFactionColorKey(person)] += 1;
    return counts;
  },
  { wei: 0, shu: 0, wu: 0, other: 0 },
);
const visualFactionFocus: Record<VisualFaction, string> = {
  wei: corePersonId,
  shu: 'person:sg:liu_bei',
  wu: 'person:sg:sun_quan',
  other: 'person:sg:liu_xie',
};

type DetailMode = 'record' | 'sources' | 'path';

export function HomePage() {
  const [query, setQuery] = useState('');
  const [enabledTypes, setEnabledTypes] = useState(initialTypes);
  const [depth, setDepth] = useState<NeighborhoodDepth>('all');
  const [enabledSourceLayers, setEnabledSourceLayers] = useState(
    () => new Set(initialSourceLayers),
  );
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(
    corePersonId,
  );
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(
    'relation:sg:cao_cao_spouse_lady_huan',
  );
  const [explorationPersonIds, setExplorationPersonIds] = useState(
    () => new Set(allFormalPersonIds),
  );
  const [visibilityHistory, setVisibilityHistory] = useState<string[][]>([]);
  const [expandedPersonIds, setExpandedPersonIds] = useState(
    () => new Set<string>(),
  );
  const [lockedPersonIds, setLockedPersonIds] = useState(
    () => new Set<string>(),
  );
  const [detailMode, setDetailMode] = useState<DetailMode>('record');
  const [pathStartId, setPathStartId] = useState(corePersonId);
  const [pathEndId, setPathEndId] = useState('person:sg:cao_pi');
  const [pathResult, setPathResult] = useState<RelationshipPath | null>(null);

  const searchResults = useMemo(
    () => searchPersons(graphData.persons, query),
    [query],
  );
  const typeFilteredRelations = useMemo(
    () => filterRelations(graphData.relations, enabledTypes),
    [enabledTypes],
  );
  const sourceLayerCounts = useMemo(
    () => countRelationsBySourceLayer(graphData.relations, graphData.persons),
    [],
  );
  const filteredRelations = useMemo(
    () =>
      filterRelationsBySourceLayers(
        typeFilteredRelations,
        graphData.persons,
        enabledSourceLayers,
      ),
    [enabledSourceLayers, typeFilteredRelations],
  );
  const neighborhood = useMemo(
    () =>
      selectNeighborhood(
        filteredRelations,
        selectedPersonId,
        depth,
        allFormalPersonIds,
      ),
    [depth, filteredRelations, selectedPersonId],
  );
  const visiblePersonIds = useMemo(() => {
    const ids = new Set<string>();
    neighborhood.personIds.forEach((personId) => {
      if (explorationPersonIds.has(personId)) {
        ids.add(personId);
      }
    });
    if (
      selectedPersonId &&
      explorationPersonIds.has(selectedPersonId) &&
      depth !== 'all'
    ) {
      ids.add(selectedPersonId);
    }
    return ids;
  }, [depth, explorationPersonIds, neighborhood.personIds, selectedPersonId]);
  const visiblePersons = useMemo(
    () =>
      graphData.persons.filter((person) => visiblePersonIds.has(person.id)),
    [visiblePersonIds],
  );
  const visibleRelations = useMemo(
    () =>
      neighborhood.relations.filter(
        (relation) =>
          visiblePersonIds.has(relation.sourcePersonId) &&
          visiblePersonIds.has(relation.targetPersonId),
      ),
    [neighborhood.relations, visiblePersonIds],
  );
  const visibleSourceIds = useMemo(
    () =>
      new Set(
        [
          ...visibleRelations.flatMap((relation) => relation.sourceIds),
          ...visiblePersons.flatMap((person) => person.sourceIds),
        ],
      ),
    [visiblePersons, visibleRelations],
  );
  const visibleSources = useMemo(
    () =>
      graphData.sources.filter((source) => visibleSourceIds.has(source.id)),
    [visibleSourceIds],
  );

  const selectPerson = useCallback((personId: string) => {
    setExplorationPersonIds((current) => {
      if (current.has(personId)) {
        return current;
      }
      return new Set(current).add(personId);
    });
    setSelectedPersonId(personId);
    setSelectedRelationId(null);
    setDetailMode('record');
  }, []);
  const selectRelation = useCallback((relationId: string) => {
    setSelectedRelationId(relationId);
    setDetailMode('record');
  }, []);

  const commitVisibility = useCallback(
    (next: Set<string>) => {
      setVisibilityHistory((current) => [
        ...current,
        [...explorationPersonIds],
      ]);
      setExplorationPersonIds(next);
    },
    [explorationPersonIds],
  );

  const directNeighborIds = useCallback(
    (personId: string) => {
      const ids = new Set([personId]);
      filteredRelations.forEach((relation) => {
        if (relation.sourcePersonId === personId) {
          ids.add(relation.targetPersonId);
        }
        if (relation.targetPersonId === personId) {
          ids.add(relation.sourcePersonId);
        }
      });
      return ids;
    },
    [filteredRelations],
  );

  const showVisualFaction = useCallback(
    (visualFaction: VisualFaction) => {
      const next = new Set(
        graphData.persons
          .filter(
            (person) => getFactionColorKey(person) === visualFaction,
          )
          .map((person) => person.id),
      );
      commitVisibility(next);
      setSelectedPersonId(visualFactionFocus[visualFaction]);
      setSelectedRelationId(null);
      setDepth('all');
      setDetailMode('record');
    },
    [commitVisibility],
  );

  const toggleExpand = useCallback(
    (personId: string) => {
      const next = new Set(explorationPersonIds);
      if (!expandedPersonIds.has(personId)) {
        directNeighborIds(personId).forEach((id) => next.add(id));
        setExpandedPersonIds((current) => new Set(current).add(personId));
      } else {
        directNeighborIds(personId).forEach((neighborId) => {
          if (
            neighborId === personId ||
            neighborId === corePersonId ||
            lockedPersonIds.has(neighborId)
          ) {
            return;
          }
          const connectedElsewhere = filteredRelations.some(
            (relation) =>
              (relation.sourcePersonId === neighborId &&
                relation.targetPersonId !== personId &&
                next.has(relation.targetPersonId)) ||
              (relation.targetPersonId === neighborId &&
                relation.sourcePersonId !== personId &&
                next.has(relation.sourcePersonId)),
          );
          if (!connectedElsewhere) {
            next.delete(neighborId);
          }
        });
        setExpandedPersonIds((current) => {
          const updated = new Set(current);
          updated.delete(personId);
          return updated;
        });
      }
      commitVisibility(next);
    },
    [
      directNeighborIds,
      expandedPersonIds,
      explorationPersonIds,
      filteredRelations,
      lockedPersonIds,
      commitVisibility,
    ],
  );

  const toggleType = (type: RelationType) => {
    setEnabledTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const toggleSourceLayer = (layer: SourceLayerKey) => {
    const enabling = !enabledSourceLayers.has(layer);
    setEnabledSourceLayers((current) => {
      const next = new Set(current);
      if (enabling) {
        next.add(layer);
      } else {
        next.delete(layer);
      }
      return next;
    });
  };

  const runPathQuery = () => {
    const result = findShortestRelationshipPath(
      filteredRelations,
      pathStartId,
      pathEndId,
    );
    setPathResult(result);
    if (result) {
      const next = new Set(explorationPersonIds);
      result.personIds.forEach((personId) => next.add(personId));
      if (next.size !== explorationPersonIds.size) {
        commitVisibility(next);
      }
    }
    setDetailMode('path');
    setSelectedRelationId(null);
  };

  const selectedPerson =
    graphData.persons.find((person) => person.id === selectedPersonId) ?? null;
  const selectedRelation =
    graphData.relations.find(
      (relation) => relation.id === selectedRelationId,
    ) ?? null;
  const highlightedRelationIds = useMemo(
    () =>
      new Set(
        detailMode === 'path' && pathResult
          ? pathResult.relations.map((relation) => relation.id)
          : [],
      ),
    [detailMode, pathResult],
  );

  const hideSelectedPerson = () => {
    if (!selectedPersonId) {
      return;
    }
    const next = new Set(explorationPersonIds);
    next.delete(selectedPersonId);
    commitVisibility(next);
    const fallback =
      graphData.persons.find((person) => next.has(person.id))?.id ?? null;
    setSelectedPersonId(fallback);
  };

  const keepSelectedBranch = () => {
    if (!selectedPersonId) {
      return;
    }
    commitVisibility(directNeighborIds(selectedPersonId));
    setDepth('all');
  };

  const goBack = () => {
    const previous = visibilityHistory.at(-1);
    if (!previous) {
      return;
    }
    setExplorationPersonIds(new Set(previous));
    setVisibilityHistory((current) => current.slice(0, -1));
  };

  const resetToCore = () => {
    commitVisibility(new Set(initialCorePersonIds));
    setSelectedPersonId(corePersonId);
    setSelectedRelationId(null);
    setDepth('all');
    setDetailMode('record');
  };

  const showCompleteNetwork = () => {
    commitVisibility(new Set(allFormalPersonIds));
    setDepth('all');
  };

  const toggleSelectedLock = () => {
    if (!selectedPersonId) {
      return;
    }
    setLockedPersonIds((current) => {
      const next = new Set(current);
      if (next.has(selectedPersonId)) {
        next.delete(selectedPersonId);
      } else {
        next.add(selectedPersonId);
      }
      return next;
    });
  };

  return (
    <section className="home-dashboard" aria-label="人物关系图谱工作区">
      <GraphControls
        persons={graphData.persons}
        query={query}
        searchResults={searchResults}
        enabledTypes={enabledTypes}
        depth={depth}
        enabledSourceLayers={enabledSourceLayers}
        sourceLayerCounts={sourceLayerCounts}
        visualFactionCounts={visualFactionCounts}
        pathStartId={pathStartId}
        pathEndId={pathEndId}
        onQueryChange={setQuery}
        onSelectPerson={selectPerson}
        onToggleType={toggleType}
        onDepthChange={setDepth}
        onSourceLayerToggle={toggleSourceLayer}
        onShowVisualFaction={showVisualFaction}
        onPathStartChange={setPathStartId}
        onPathEndChange={setPathEndId}
        onRunPathQuery={runPathQuery}
      />
      <div className="dashboard-content">
        <section className="dashboard-top">
          <div className="dashboard-intro">
            <h1>三国主要人物关系图谱</h1>
            <p>
              前端已加载 {graphData.persons.length}{' '}
              位历史或文学层人物；首次进入即可在完整地图中浏览。
              连线只保留亲属、婚姻、收养与宗族关系，传闻与文学关系以虚线分层展示，
              不用政治或战争关系增加画面密度。
            </p>
          </div>
          <GraphSummary
            personCount={visiblePersons.length}
            relationCount={visibleRelations.length}
            sourceCount={visibleSources.length}
            onOpenSources={() => setDetailMode('sources')}
          />
        </section>
        <div className="dashboard-lower">
          <RelationshipGraph
            persons={visiblePersons}
            relations={visibleRelations}
            selectedPersonId={selectedPersonId}
            selectedRelationId={selectedRelationId}
            lockedPersonIds={lockedPersonIds}
            highlightedRelationIds={highlightedRelationIds}
            onSelectPerson={selectPerson}
            onSelectRelation={selectRelation}
            onToggleExpand={toggleExpand}
          />
          <GraphGuide />
          {detailMode === 'sources' ? (
            <SourceCatalogPanel
              sources={visibleSources}
              relations={visibleRelations}
              persons={graphData.persons}
              onSelectRelation={selectRelation}
              onClose={() => setDetailMode('record')}
            />
          ) : detailMode === 'path' ? (
            <PathResultPanel
              path={pathResult}
              persons={graphData.persons}
              startPersonId={pathStartId}
              endPersonId={pathEndId}
              onSelectRelation={selectRelation}
              onClose={() => setDetailMode('record')}
            />
          ) : (
            <PersonPanel
              selectedPerson={selectedRelation ? null : selectedPerson}
              selectedRelation={selectedRelation}
              persons={graphData.persons}
              relations={graphData.relations}
              sources={graphData.sources}
              actions={
                selectedPerson
                  ? {
                      isLocked: lockedPersonIds.has(selectedPerson.id),
                      canGoBack: visibilityHistory.length > 0,
                      onToggleExpand: () => toggleExpand(selectedPerson.id),
                      onToggleLock: toggleSelectedLock,
                      onHide: hideSelectedPerson,
                      onKeepBranch: keepSelectedBranch,
                      onGoBack: goBack,
                      onResetCore: resetToCore,
                      onShowCompleteNetwork: showCompleteNetwork,
                    }
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}
