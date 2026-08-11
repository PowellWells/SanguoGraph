import type { HistoricalSource, Person, Relation } from '../../domain';
import type { ReactNode } from 'react';
import {
  certaintyLabels,
  decisionStatusLabels,
  disputeStatusLabels,
  evidenceBasisLabels,
  getPerspectiveRelationLabel,
  getRelationClaim,
  relationDirectionLabel,
  relationOriginLabels,
  relationTypeLabels,
  reviewStatusLabels,
} from '../../services/relationPresentation';
import { EvidencePanel } from '../source/EvidencePanel';

export interface PersonPanelActions {
  isLocked: boolean;
  canGoBack: boolean;
  onToggleExpand: () => void;
  onToggleLock: () => void;
  onHide: () => void;
  onKeepBranch: () => void;
  onGoBack: () => void;
  onResetCore: () => void;
  onShowCompleteNetwork: () => void;
}

interface PersonPanelProps {
  selectedPerson: Person | null;
  selectedRelation: Relation | null;
  persons: Person[];
  relations: Relation[];
  sources: HistoricalSource[];
  actions?: PersonPanelActions;
}

function DetailFrame({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <aside className="panel-card person-panel" aria-labelledby="detail-title">
      <header className="panel-titlebar">
        <h2 id="detail-title">
          <span aria-hidden="true">▣</span>
          {title}
        </h2>
        <span aria-hidden="true">⌃</span>
      </header>
      <div className="panel-scroll-body detail-body">{children}</div>
    </aside>
  );
}

function years(person: Person): string {
  if (person.birthYear === null && person.deathYear === null) {
    return '生卒年不详';
  }
  return `${person.birthYear ?? '？'}—${person.deathYear ?? '？'}`;
}

function importBatchLabel(person: Person): string {
  const labels = {
    1: '第一批导入',
    2: '第二批导入',
    3: '第三批导入',
    4: '第四批导入',
    5: '第五批导入',
    6: '第六批全量导入',
    7: '第七批遗漏审计',
  } as const;
  return labels[person.importBatch];
}

export function PersonPanel({
  selectedPerson,
  selectedRelation,
  persons,
  relations,
  sources,
  actions,
}: PersonPanelProps) {
  const peopleById = new Map(persons.map((person) => [person.id, person]));
  const sourcesById = new Map(sources.map((source) => [source.id, source]));

  if (selectedRelation) {
    const from = peopleById.get(selectedRelation.sourcePersonId);
    const to = peopleById.get(selectedRelation.targetPersonId);
    const evidence = selectedRelation.sourceIds
      .map((id) => sourcesById.get(id))
      .filter((source): source is HistoricalSource => source !== undefined);
    const claim = getRelationClaim(selectedRelation, persons);
    const opposingEvidence = claim.opposingSourceIds
      .map((id) => sourcesById.get(id))
      .filter((source): source is HistoricalSource => source !== undefined);

    return (
      <DetailFrame title="关系档案">
        <h3 className="relation-title">
          {from?.name}{' '}
          {selectedRelation.type === 'spouse_of' ||
          selectedRelation.type === 'clan_relative_of'
            ? '—'
            : '→'}{' '}
          {to?.name}
        </h3>
        <p className="relation-qualifier">{claim.relationshipQualifier}</p>
        <dl className="detail-metadata">
          <div>
            <dt>关系类型</dt>
            <dd>{relationTypeLabels[selectedRelation.type]}</dd>
          </div>
          <div>
            <dt>关系方向</dt>
            <dd>{relationDirectionLabel(selectedRelation)}</dd>
          </div>
          <div>
            <dt>大致时期</dt>
            <dd>{claim.periodLabel}</dd>
          </div>
          <div>
            <dt>证据方式</dt>
            <dd>{evidenceBasisLabels[claim.evidenceBasis]}</dd>
          </div>
          <div>
            <dt>录入方式</dt>
            <dd>{relationOriginLabels[selectedRelation.origin]}</dd>
          </div>
          <div>
            <dt>可信度</dt>
            <dd>{certaintyLabels[selectedRelation.certainty]}</dd>
          </div>
          <div>
            <dt>争议情况</dt>
            <dd>{disputeStatusLabels[claim.disputeStatus]}</dd>
          </div>
          <div>
            <dt>数据状态</dt>
            <dd>{decisionStatusLabels[claim.decisionStatus]}</dd>
          </div>
          <div>
            <dt>核验状态</dt>
            <dd>{reviewStatusLabels[selectedRelation.reviewStatus]}</dd>
          </div>
        </dl>
        {selectedRelation.origin === 'candidate' && (
          <p className="candidate-warning">此边是 Wikidata 候选线索，未经过正史核验。</p>
        )}
        <section className="relation-interpretation">
          <h3 className="detail-subtitle">现代解释</h3>
          <p>{claim.modernInterpretation}</p>
          {selectedRelation.note && <p className="detail-note">{selectedRelation.note}</p>}
        </section>
        <h3 className="detail-subtitle">当前采用结论</h3>
        <p className="detail-description">
          {claim.relationshipQualifier}；当前判断为
          {certaintyLabels[selectedRelation.certainty]}。
        </p>
        <h3 className="detail-subtitle">支持该关系的证据</h3>
        <EvidencePanel sources={evidence} />
        <h3 className="detail-subtitle">反对或质疑证据</h3>
        {opposingEvidence.length > 0 ? (
          <EvidencePanel sources={opposingEvidence} />
        ) : (
          <p className="detail-note">
            当前数据未登记反对材料；这不代表学界不存在其他观点。
          </p>
        )}
        <h3 className="detail-subtitle">不同学者观点</h3>
        {claim.scholarlyViews.length > 0 ? (
          <ul className="scholarly-view-list">
            {claim.scholarlyViews.map((view) => <li key={view}>{view}</li>)}
          </ul>
        ) : (
          <p className="detail-note">
            当前数据尚未录入可定位的现代学术观点。
          </p>
        )}
      </DetailFrame>
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
      <DetailFrame title="人物档案">
        <h3 className="relation-title">{selectedPerson.name}</h3>
        <p className="person-years">
          {selectedPerson.courtesyName && `字${selectedPerson.courtesyName} · `}
          {years(selectedPerson)}
        </p>
        <p className="detail-note">录入批次：{importBatchLabel(selectedPerson)}</p>
        <p className="detail-description">{selectedPerson.description}</p>
        {selectedPerson.otherNames.length > 0 && (
          <p className="detail-note">别名：{selectedPerson.otherNames.join('、')}</p>
        )}
        <h3 className="detail-subtitle">亲属关系</h3>
        <ul className="kin-list">
          {kin.map(({ relation, other }) => (
            <li key={relation.id}>
              <span>
                {getPerspectiveRelationLabel(
                  relation,
                  selectedPerson,
                  other,
                )}
              </span>
              <strong>{other?.name ?? '未知人物'}</strong>
              {relation.origin === 'candidate' && <small>候选</small>}
            </li>
          ))}
        </ul>
        {actions && (
          <div className="person-actions" aria-label="人物图谱操作">
            <h3 className="detail-subtitle">探索此人物</h3>
            <div className="action-grid">
              <button type="button" onClick={actions.onToggleExpand}>
                展开／收起直接关系
              </button>
              <button type="button" onClick={actions.onToggleLock}>
                {actions.isLocked ? '解除位置锁定' : '锁定节点位置'}
              </button>
              <button type="button" onClick={actions.onHide}>
                隐藏此人物
              </button>
              <button type="button" onClick={actions.onKeepBranch}>
                仅保留此人物与直接亲属
              </button>
              <button
                type="button"
                onClick={actions.onGoBack}
                disabled={!actions.canGoBack}
              >
                返回上一步
              </button>
              <button type="button" onClick={actions.onResetCore}>
                重置为核心人物
              </button>
              <button type="button" onClick={actions.onShowCompleteNetwork}>
                查看完整关系网
              </button>
            </div>
            <p className="detail-note">
              也可以双击画布中的人物节点，展开或收起其直接关系。
            </p>
          </div>
        )}
      </DetailFrame>
    );
  }

  return (
    <DetailFrame title="人物档案">
      <div className="person-placeholder">
        <span aria-hidden="true">人</span>
        <p>选择人物或关系后查看亲属与史料证据。</p>
      </div>
    </DetailFrame>
  );
}
