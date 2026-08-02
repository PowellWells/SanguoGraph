export const readableMinimumGraphZoom = 0.72;
export const coreReturnGraphZoom = 0.85;
export const relationLabelZoomThreshold = 0.85;
export const overviewGraphZoomThreshold = 0.12;
export const absoluteMinimumGraphZoom = 0.001;
export const maximumGraphZoom = 2.4;

export function ensureReadableGraphZoom(fittedZoom: number): number {
  return Math.max(readableMinimumGraphZoom, fittedZoom);
}

export function shouldShowAllRelationLabels(
  zoom: number,
  forceAllLabels: boolean,
): boolean {
  return forceAllLabels || zoom >= relationLabelZoomThreshold;
}

export function shouldUseGraphOverview(zoom: number): boolean {
  return zoom < overviewGraphZoomThreshold;
}
