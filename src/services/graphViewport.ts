export const readableMinimumGraphZoom = 0.72;
export const coreReturnGraphZoom = 0.85;
export const relationLabelZoomThreshold = 0.85;

export function ensureReadableGraphZoom(fittedZoom: number): number {
  return Math.max(readableMinimumGraphZoom, fittedZoom);
}

export function shouldShowAllRelationLabels(
  zoom: number,
  forceAllLabels: boolean,
): boolean {
  return forceAllLabels || zoom >= relationLabelZoomThreshold;
}
