import { describe, expect, it } from 'vitest';
import {
  absoluteMinimumGraphZoom,
  ensureReadableGraphZoom,
  maximumGraphZoom,
  shouldShowAllRelationLabels,
  shouldUseGraphOverview,
} from './graphViewport';

describe('graph viewport policy', () => {
  it('keeps a large graph at a readable initial zoom', () => {
    expect(ensureReadableGraphZoom(0.31)).toBe(0.72);
    expect(ensureReadableGraphZoom(1.05)).toBe(1.05);
  });

  it('allows fit-to-canvas to find the true whole-graph zoom', () => {
    expect(absoluteMinimumGraphZoom).toBeLessThan(0.02);
    expect(maximumGraphZoom).toBe(2.4);
  });

  it('uses a simplified overview only at extreme whole-map zoom', () => {
    expect(shouldUseGraphOverview(0.119)).toBe(true);
    expect(shouldUseGraphOverview(0.12)).toBe(false);
  });

  it('shows all labels automatically only at close zoom', () => {
    expect(shouldShowAllRelationLabels(0.84, false)).toBe(false);
    expect(shouldShowAllRelationLabels(0.85, false)).toBe(true);
  });

  it('lets the toolbar force all relation labels at any zoom', () => {
    expect(shouldShowAllRelationLabels(0.2, true)).toBe(true);
  });
});
