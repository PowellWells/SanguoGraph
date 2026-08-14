import { describe, expect, it } from 'vitest';
import { createFeedbackIssueUrl } from './feedbackLinks';

describe('feedback issue links', () => {
  it('opens the structured correction form with stable entity context', () => {
    const url = new URL(
      createFeedbackIssueUrl('correction', {
        kind: 'person',
        id: 'person:sg:cao_jie_empress',
        label: '曹节',
      }),
    );

    expect(url.origin).toBe('https://github.com');
    expect(url.pathname).toBe('/PowellWells/SanguoGraph/issues/new');
    expect(url.searchParams.get('template')).toBe('01-data-correction.yml');
    expect(url.searchParams.get('entity')).toBe('person:sg:cao_jie_empress');
    expect(url.searchParams.get('permalink')).toBe(
      '#/person/cao_jie_empress',
    );
  });

  it('opens the source-suggestion form without requiring an entity', () => {
    const url = new URL(createFeedbackIssueUrl('source-suggestion'));

    expect(url.searchParams.get('template')).toBe(
      '02-source-suggestion.yml',
    );
    expect(url.searchParams.has('entity')).toBe(false);
  });
});
