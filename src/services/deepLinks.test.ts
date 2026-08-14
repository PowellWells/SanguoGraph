import { describe, expect, it } from 'vitest';
import { createDeepLinkHash, parseDeepLinkHash } from './deepLinks';

describe('deep links', () => {
  it('creates concise stable hashes from project-local ids', () => {
    expect(createDeepLinkHash('person', 'person:sg:cao_jie_empress')).toBe(
      '#/person/cao_jie_empress',
    );
    expect(
      createDeepLinkHash(
        'source',
        'source:sg:round_06_hhs_10b_cao_daughters',
      ),
    ).toBe('#/source/round_06_hhs_10b_cao_daughters');
  });

  it('restores canonical ids and rejects malformed routes', () => {
    expect(parseDeepLinkHash('#/relation/cao_cao_spouse_lady_huan')).toEqual({
      kind: 'relation',
      id: 'relation:sg:cao_cao_spouse_lady_huan',
    });
    expect(parseDeepLinkHash('#/person/')).toBeNull();
    expect(parseDeepLinkHash('#/unknown/cao_cao')).toBeNull();
  });
});
