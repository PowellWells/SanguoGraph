import type { Person } from '../domain';

function normalize(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('zh-CN')
    .replace(/[\s·._-]+/g, '');
}

const pinyinAliases: Readonly<Record<string, readonly string[]>> = {
  'person:sg:cao_teng': ['caoteng', 'jixing'],
  'person:sg:cao_song': ['caosong'],
  'person:sg:cao_cao': ['caocao', 'mengde'],
  'person:sg:lady_ding': ['dingfuren', 'dingshi'],
  'person:sg:empress_bian': ['bianfuren', 'bianhuanghou', 'bianshi'],
  'person:sg:lady_liu': ['liufuren', 'liushi'],
  'person:sg:lady_huan': ['huanfuren', 'huanshi'],
  'person:sg:cao_ang': ['caoang', 'zixiu'],
  'person:sg:cao_pi': ['caopi', 'zihuan'],
  'person:sg:cao_zhang': ['caozhang', 'ziwen'],
  'person:sg:cao_zhi': ['caozhi', 'zijian'],
  'person:sg:cao_xiong': ['caoxiong'],
  'person:sg:cao_chong': ['caochong', 'cangshu'],
  'person:sg:cao_ju': ['caoju'],
  'person:sg:cao_yu': ['caoyu'],
};

function isSubsequence(query: string, value: string): boolean {
  if (query.length < 2) {
    return false;
  }
  let cursor = 0;
  for (const character of value) {
    if (character === query[cursor]) {
      cursor += 1;
      if (cursor === query.length) {
        return true;
      }
    }
  }
  return false;
}

export function searchPersons(persons: Person[], query: string): Person[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return persons;
  }

  return persons
    .map((person) => {
      const primaryValues = [
        person.name,
        person.courtesyName ?? '',
        ...person.otherNames,
        ...(pinyinAliases[person.id] ?? []),
      ].map(normalize);
      const contextualValues = [
        person.clan ?? '',
        ...person.factions,
        person.description,
      ].map(normalize);
      const exactIndex = primaryValues.findIndex(
        (value) => value === normalizedQuery,
      );
      const primaryIncludes = primaryValues.some((value) =>
        value.includes(normalizedQuery),
      );
      const contextualIncludes = contextualValues.some((value) =>
        value.includes(normalizedQuery),
      );
      const fuzzyMatch = [...primaryValues, ...contextualValues].some((value) =>
        isSubsequence(normalizedQuery, value),
      );
      const score =
        exactIndex >= 0
          ? exactIndex
          : primaryIncludes
            ? 20
            : contextualIncludes
              ? 40
              : fuzzyMatch
                ? 60
                : null;
      return { person, score };
    })
    .filter(
      (result): result is { person: Person; score: number } =>
        result.score !== null,
    )
    .sort((left, right) => left.score - right.score)
    .map(({ person }) => person);
}
