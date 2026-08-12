import type { Plugin } from 'vite';

const forbiddenPublicSourceReference =
  /(?:wikipedia|wikisource|wikidata|wikimedia|维基百科|维基文库)/iu;
const forbiddenBundledReference =
  /(?:wikisource|wikidata|wikimedia|维基百科|维基文库)/iu;

export function findForbiddenBundledReference(
  content: string,
): string | null {
  return content.match(forbiddenBundledReference)?.[0] ?? null;
}

function isPublicFrontendSource(id: string): boolean {
  const normalizedId = id.replaceAll('\\', '/');
  return (
    !normalizedId.includes('.test.') &&
    ['/src/pages/', '/src/components/', '/src/data/'].some((directory) =>
      normalizedId.includes(directory),
    )
  );
}

function assetText(source: string | Uint8Array): string {
  return typeof source === 'string'
    ? source
    : Buffer.from(source).toString('utf8');
}

export function frontendPolicyGuard(): Plugin {
  return {
    name: 'frontend-policy-guard',
    enforce: 'post',
    transform(code, id) {
      if (!isPublicFrontendSource(id)) {
        return null;
      }
      const forbiddenReference =
        code.match(forbiddenPublicSourceReference)?.[0] ?? null;
      if (forbiddenReference) {
        throw new Error(
          `前端源码 ${id} 包含禁止发布的外部知识平台标识：${forbiddenReference}`,
        );
      }
      return null;
    },
    generateBundle(_options, bundle) {
      for (const [fileName, entry] of Object.entries(bundle)) {
        const content =
          entry.type === 'chunk' ? entry.code : assetText(entry.source);
        const forbiddenReference = findForbiddenBundledReference(content);
        if (forbiddenReference) {
          throw new Error(
            `前端产物 ${fileName} 包含禁止发布的外部知识平台标识：${forbiddenReference}`,
          );
        }
      }
    },
  };
}
