import type { HistoricalSource } from '../../domain';

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
          <h4>{source.reference}</h4>
          {source.quotation && <blockquote>“{source.quotation}”</blockquote>}
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
