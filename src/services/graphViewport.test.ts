import { describe, expect, it } from 'vitest';
import {
  ensureReadableGraphZoom,
  shouldShowAllRelationLabels,
} from './graphViewport';

describe('graph viewport policy', () => {
  it('keeps a large graph at a readable initial zoom', () => {
    expect(ensureReadableGraphZoom(0.31)).toBe(0.72);
    expect(ensureReadableGraphZoom(1.05)).toBe(1.05);
  });

  it('shows all labels automatically only at close zoom', () => {
    expect(shouldShowAllRelationLabels(0.84, false)).toBe(false);
    expect(shouldShowAllRelationLabels(0.85, false)).toBe(true);
  });

  it('lets the toolbar force all relation labels at any zoom', () => {
    expect(shouldShowAllRelationLabels(0.2, true)).toBe(true);
  });
});
