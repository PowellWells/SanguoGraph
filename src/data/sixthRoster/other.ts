import type { SixthRosterManifestEntry } from './manifest';
import { sixthRosterManifest } from './manifest';

export const sixthOtherRoster: readonly SixthRosterManifestEntry[] =
  sixthRosterManifest.filter((entry) => entry.visualFaction === 'other');
