import type { SixthRosterManifestEntry } from './manifest';
import { sixthRosterManifest } from './manifest';

export const sixthWuRoster: readonly SixthRosterManifestEntry[] =
  sixthRosterManifest.filter((entry) => entry.visualFaction === 'wu');
