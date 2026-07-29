import { useCallback, useMemo, useState } from 'react';
import { GraphControls } from '../components/graph/GraphControls';
import { RelationshipGraph } from '../components/graph/RelationshipGraph';
import { PersonPanel } from '../components/person/PersonPanel';
import { graphData } from '../data';
import type {
  HistoricalSource,
  Relation,
  RelationType,
} from '../domain';
import { loadCandidateGraph } from '../services/candidateDataLoader';
import {
  filterRelations,
  selectNeighborhood,
  type NeighborhoodDepth,
} from '../services/graphSelectors';
import { searchPersons } from '../services/personSearch';

const initialTypes = new Set<RelationType>([
  'father_of',
  'mother_of',
  'spouse_of',
  'adoptive_father_of',
  'adoptive_mother_of',
]);

export function HomePage() {
  const [query, setQuery] = useState('');
  const [enabledTypes, setEnabledTypes] = useState(initialTypes);
  const [depth, setDepth] = useState<NeighborhoodDepth>('all');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(
    'person:sg:cao_cao',
  );
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(
    null,
  );
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidateRelations, setCandidateRelations] = useState<Relation[]>([]);
  const [candidateSources, setCandidateSources] = useState<HistoricalSource[]>(
    [],
  );
  const [candidateStatus, setCandidateStatus] = useState<
    'idle' | 'loading' | 'loaded' | 'error'
  >('idle');
  const [candidateError, setCandidateError] = useState<string | null>(null);

  const searchResults = useMemo(
    () => searchPersons(graphData.persons, query),
    [query],
  );
  const combinedRelations = useMemo(
    () => [
      ...graphData.relations,
      ...(showCandidates ? candidateRelations : []),
    ],
    [candidateRelations, showCandidates],
  );
  const filteredRelations = useMemo(
    () => filterRelations(combinedRelations, enabledTypes),
    [combinedRelations, enabledTypes],
  );
  const neighborhood = useMemo(
    () => selectNeighborhood(filteredRelations, selectedPersonId, depth),
    [depth, filteredRelations, selectedPersonId],
  );
  const visiblePersons = useMemo(
    () =>
      graphData.persons.filter((person) =>
        neighborhood.personIds.has(person.id),
      ),
    [neighborhood.personIds],
  );
  const visibleSources = useMemo(
    () => [...graphData.sources, ...candidateSources],
    [candidateSources],
  );

  const selectPerson = useCallback((personId: string) => {
    setSelectedPersonId(personId);
    setSelectedRelationId(null);
  }, []);
  const selectRelation = useCallback((relationId: string) => {
    setSelectedRelationId(relationId);
  }, []);

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

  const toggleCandidates = async (enabled: boolean) => {
    setShowCandidates(enabled);
    setCandidateError(null);
    if (!enabled || candidateStatus === 'loaded') {
      if (!enabled && selectedRelationId?.includes(':candidate_')) {
        setSelectedRelationId(null);
      }
      return;
    }

    setCandidateStatus('loading');
    try {
      const candidates = await loadCandidateGraph(graphData.persons);
      setCandidateRelations(candidates.relations);
      setCandidateSources(candidates.sources);
      setCandidateStatus('loaded');
    } catch (error) {
      setCandidateStatus('error');
      setCandidateError(
        error instanceof Error ? error.message : '候选数据加载失败。',
      );
    }
  };

  const selectedPerson =
    graphData.persons.find((person) => person.id === selectedPersonId) ?? null;
  const selectedRelation =
    combinedRelations.find(
      (relation) => relation.id === selectedRelationId,
    ) ?? null;

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">可追溯史料 · 分层表达 · 开放协作</p>
        <h1>从史料出发，看见曹操核心家庭的关系</h1>
        <p>
          当前图谱收录15名人物。默认只展示已核验关系；Wikidata
          只作为可选择、默认隐藏的发现线索。
        </p>
      </section>
      <section className="workspace" aria-label="人物关系图谱工作区">
        <GraphControls
          query={query}
          searchResults={searchResults}
          enabledTypes={enabledTypes}
          depth={depth}
          showCandidates={showCandidates}
          candidateStatus={candidateStatus}
          candidateError={candidateError}
          onQueryChange={setQuery}
          onSelectPerson={selectPerson}
          onToggleType={toggleType}
          onDepthChange={setDepth}
          onCandidateToggle={(enabled) => void toggleCandidates(enabled)}
        />
        <RelationshipGraph
          persons={visiblePersons}
          relations={neighborhood.relations}
          selectedPersonId={selectedPersonId}
          selectedRelationId={selectedRelationId}
          onSelectPerson={selectPerson}
          onSelectRelation={selectRelation}
        />
        <PersonPanel
          selectedPerson={selectedRelation ? null : selectedPerson}
          selectedRelation={selectedRelation}
          persons={graphData.persons}
          relations={combinedRelations}
          sources={visibleSources}
        />
      </section>
    </>
  );
}
