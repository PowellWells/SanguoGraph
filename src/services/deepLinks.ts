export type DeepLinkKind = 'person' | 'relation' | 'source';

export interface DeepLinkTarget {
  kind: DeepLinkKind;
  id: string;
}

const idPrefixes: Readonly<Record<DeepLinkKind, string>> = {
  person: 'person:sg:',
  relation: 'relation:sg:',
  source: 'source:sg:',
};

export function createDeepLinkHash(kind: DeepLinkKind, id: string): string {
  const prefix = idPrefixes[kind];
  const stableKey = id.startsWith(prefix) ? id.slice(prefix.length) : id;
  return `#/${kind}/${encodeURIComponent(stableKey)}`;
}

export function parseDeepLinkHash(hash: string): DeepLinkTarget | null {
  const match = /^#\/(person|relation|source)\/([^/]+)$/.exec(hash);
  if (!match) {
    return null;
  }
  const kind = match[1] as DeepLinkKind;
  try {
    const stableKey = decodeURIComponent(match[2] ?? '').trim();
    if (!stableKey) {
      return null;
    }
    return { kind, id: `${idPrefixes[kind]}${stableKey}` };
  } catch {
    return null;
  }
}

export function replaceCurrentDeepLink(kind: DeepLinkKind, id: string): void {
  window.history.replaceState(null, '', createDeepLinkHash(kind, id));
}
