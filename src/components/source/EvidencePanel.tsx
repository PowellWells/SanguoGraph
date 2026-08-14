import type { HistoricalSource } from '../../domain';
import { createDeepLinkHash } from '../../services/deepLinks';

interface EvidencePanelProps {
  sources: HistoricalSource[];
}

export function EvidencePanel({ sources }: EvidencePanelProps) {
  if (sources.length === 0) {
    return <p className="detail-note">暂无可展示的正式史料。</p>;
  }

  return (
    <div className="evidence-list">
      {sources.map((source) => (
        <article key={source.id}>
          <h4>
            <a href={createDeepLinkHash('source', source.id)}>
              {source.reference}
            </a>
          </h4>
          <dl className="evidence-metadata">
            <div>
              <dt>作者</dt>
              <dd>{source.author ?? '未详'}</dd>
            </div>
            {source.commentator && (
              <div>
                <dt>注者</dt>
                <dd>{source.commentator}</dd>
              </div>
            )}
            <div>
              <dt>篇章</dt>
              <dd>{source.section}</dd>
            </div>
          </dl>
          {source.quotation && <blockquote>“{source.quotation}”</blockquote>}
          {source.note && <p>{source.note}</p>}
          {source.url && (
            <a href={source.url} target="_blank" rel="noreferrer">
              查看原文
            </a>
          )}
          {source.sourceType === 'structured_dataset' && (
            <p className="candidate-warning">未经过正史核验</p>
          )}
        </article>
      ))}
    </div>
  );
}
