import type { SixthRosterManifestEntry } from './manifest';
import { sixthRosterManifest } from './manifest';

export const sixthShuRoster: readonly SixthRosterManifestEntry[] =
  sixthRosterManifest.filter((entry) => entry.visualFaction === 'shu');
