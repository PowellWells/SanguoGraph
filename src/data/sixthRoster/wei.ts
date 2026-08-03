import type { SixthRosterManifestEntry } from './manifest';
import { sixthRosterManifest } from './manifest';

export const sixthWeiRoster: readonly SixthRosterManifestEntry[] =
  sixthRosterManifest.filter((entry) => entry.visualFaction === 'wei');
