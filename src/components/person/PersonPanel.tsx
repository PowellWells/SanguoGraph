import type { HistoricalSource, Person, Relation } from '../../domain';
import { EvidencePanel } from '../source/EvidencePanel';

const relationLabels = {
  father_of: '父亲',
  mother_of: '母亲',
  spouse_of: '夫妻',
  adoptive_father_of: '养父',
  adoptive_mother_of: '养母',
  clan_relative_of: '宗族',
} as const;

interface PersonPanelProps {
  selectedPerson: Person | null;
  selectedRelation: Relation | null;
  persons: Person[];
  relations: Relation[];
  sources: HistoricalSource[];
}

function years(person: Person): string {
  if (person.birthYear === null && person.deathYear === null) {
    return '生卒年不详';
  }
  return `${person.birthYear ?? '？'}—${person.deathYear ?? '？'}`;
}

export function PersonPanel({
  selectedPerson,
  selectedRelation,
  persons,
  relations,
  sources,
}: PersonPanelProps) {
  const peopleById = new Map(persons.map((person) => [person.id, person]));
  const sourcesById = new Map(sources.map((source) => [source.id, source]));

  if (selectedRelation) {
    const from = peopleById.get(selectedRelation.sourcePersonId);
    const to = peopleById.get(selectedRelation.targetPersonId);
    const evidence = selectedRelation.sourceIds
      .map((id) => sourcesById.get(id))
      .filter((source): source is HistoricalSource => source !== undefined);

    return (
      <aside className="panel-card person-panel" aria-labelledby="detail-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">关系证据</p>
            <h2 id="detail-title">{from?.name} — {to?.name}</h2>
          </div>
        </div>
        <dl className="detail-metadata">
          <div><dt>类型</dt><dd>{relationLabels[selectedRelation.type]}</dd></div>
          <div><dt>来源层</dt><dd>{selectedRelation.origin}</dd></div>
          <div><dt>可信度</dt><dd>{selectedRelation.certainty}</dd></div>
          <div><dt>核验</dt><dd>{selectedRelation.reviewStatus}</dd></div>
        </dl>
        {selectedRelation.origin === 'candidate' && (
          <p className="candidate-warning">此边是 Wikidata 候选线索，未经过正史核验。</p>
        )}
        <EvidencePanel sources={evidence} />
      </aside>
    );
  }

  if (selectedPerson) {
    const kin = relations
      .filter(
        (relation) =>
          relation.sourcePersonId === selectedPerson.id ||
          relation.targetPersonId === selectedPerson.id,
      )
      .map((relation) => {
        const otherId =
          relation.sourcePersonId === selectedPerson.id
            ? relation.targetPersonId
            : relation.sourcePersonId;
        return { relation, other: peopleById.get(otherId) };
      });

    return (
      <aside className="panel-card person-panel" aria-labelledby="detail-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">人物档案</p>
            <h2 id="detail-title">{selectedPerson.name}</h2>
          </div>
        </div>
        <p className="person-years">
          {selectedPerson.courtesyName && `字${selectedPerson.courtesyName} · `}
          {years(selectedPerson)}
        </p>
        <p className="detail-description">{selectedPerson.description}</p>
        {selectedPerson.otherNames.length > 0 && (
          <p className="detail-note">别名：{selectedPerson.otherNames.join('、')}</p>
        )}
        <h3 className="detail-subtitle">亲属关系</h3>
        <ul className="kin-list">
          {kin.map(({ relation, other }) => (
            <li key={relation.id}>
              <span>{relationLabels[relation.type]}</span>
              <strong>{other?.name ?? '未知人物'}</strong>
              {relation.origin === 'candidate' && <small>候选</small>}
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  return (
    <aside className="panel-card person-panel" aria-labelledby="detail-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">人物档案</p>
          <h2 id="detail-title">详情</h2>
        </div>
      </div>
      <div className="person-placeholder">
        <span aria-hidden="true">人</span>
        <p>选择人物或关系后查看亲属与史料证据。</p>
      </div>
    </aside>
  );
}
