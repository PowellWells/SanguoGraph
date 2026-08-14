import { createDeepLinkHash, type DeepLinkKind } from './deepLinks';

export type FeedbackIssueKind = 'correction' | 'source-suggestion';

export interface FeedbackTarget {
  kind: DeepLinkKind;
  id: string;
  label: string;
}

const issueBaseUrl =
  'https://github.com/PowellWells/SanguoGraph/issues/new';

const issueConfig: Readonly<
  Record<FeedbackIssueKind, { template: string; title: string }>
> = {
  correction: {
    template: '01-data-correction.yml',
    title: '[数据纠错]',
  },
  'source-suggestion': {
    template: '02-source-suggestion.yml',
    title: '[来源建议]',
  },
};

export function createFeedbackIssueUrl(
  issueKind: FeedbackIssueKind,
  target?: FeedbackTarget,
): string {
  const config = issueConfig[issueKind];
  const parameters = new URLSearchParams({ template: config.template });
  parameters.set(
    'title',
    target ? `${config.title} ${target.label}` : `${config.title} `,
  );
  if (target) {
    parameters.set('entity', target.id);
    parameters.set('permalink', createDeepLinkHash(target.kind, target.id));
  }
  return `${issueBaseUrl}?${parameters.toString()}`;
}
