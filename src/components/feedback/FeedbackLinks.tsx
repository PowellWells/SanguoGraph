import {
  createFeedbackIssueUrl,
  type FeedbackTarget,
} from '../../services/feedbackLinks';

interface FeedbackLinksProps {
  target?: FeedbackTarget;
  compact?: boolean;
}

export function FeedbackLinks({ target, compact = false }: FeedbackLinksProps) {
  return (
    <div className={`feedback-links${compact ? ' feedback-links-compact' : ''}`}>
      <div>
        <a
          href={createFeedbackIssueUrl('correction', target)}
          target="_blank"
          rel="noreferrer"
        >
          报告数据问题
        </a>
        <a
          href={createFeedbackIssueUrl('source-suggestion', target)}
          target="_blank"
          rel="noreferrer"
        >
          补充史料来源
        </a>
      </div>
      {!compact && (
        <p>需联网打开 GitHub；提交只进入人工审校队列，不会自动修改正式图谱。</p>
      )}
    </div>
  );
}
