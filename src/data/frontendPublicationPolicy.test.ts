import { describe, expect, it } from 'vitest';
import { graphData } from './index';
import { sourceLayerOptions } from '../services/sourceLayers';

const forbiddenFrontendReference =
  /(?:wikipedia|wikisource|wikidata|wikimedia|维基百科|维基文库)/iu;

describe('frontend publication policy', () => {
  it('keeps public graph data free of blocked platform references', () => {
    expect(JSON.stringify(graphData)).not.toMatch(forbiddenFrontendReference);
    expect(
      graphData.persons.every(
        ({ externalIds }) => externalIds.wikidata === undefined,
      ),
    ).toBe(true);
  });

  it('does not expose the internal structured-candidate layer', () => {
    expect(
      sourceLayerOptions.some(({ key }) => key === 'structured_candidate'),
    ).toBe(false);
  });
});
