import type { Person } from '../domain';

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('zh-CN').replace(/\s+/g, '');
}

export function searchPersons(persons: Person[], query: string): Person[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return persons;
  }

  return persons.filter((person) =>
    [
      person.name,
      person.courtesyName ?? '',
      ...person.otherNames,
    ].some((value) => normalize(value).includes(normalizedQuery)),
  );
}
