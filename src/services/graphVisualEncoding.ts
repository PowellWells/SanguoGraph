import type { EvidenceBasis, Person, Relation } from '../domain';

export type FactionColorKey = 'wei' | 'shu' | 'wu' | 'other';

export function getFactionColorKey(person: Person): FactionColorKey {
  if (
    person.factions.some((faction) =>
      ['曹魏', '曹魏政权', '魏国'].some((name) => faction.includes(name)),
    )
  ) {
    return 'wei';
  }
  if (
    person.factions.some((faction) =>
      ['蜀汉', '蜀國', '蜀国'].some((name) => faction.includes(name)),
    )
  ) {
    return 'shu';
  }
  if (
    person.factions.some((faction) =>
      ['孙吴', '孫吳', '东吴', '東吳', '吴国', '吳國'].some((name) =>
        faction.includes(name),
      ),
    )
  ) {
    return 'wu';
  }
  return 'other';
}

export function isConfirmedPerson(person: Person): boolean {
  return (
    person.historicity === 'historical' &&
    person.reviewStatus === 'verified' &&
    person.sourceIds.length > 0
  );
}

export function isConfirmedRelation(relation: Relation): boolean {
  return (
    relation.origin === 'recorded' &&
    relation.certainty === 'confirmed' &&
    relation.reviewStatus === 'verified'
  );
}

export function getPersonGraphClasses(
  person: Person,
  isLocked: boolean,
): string {
  const classes = [
    'person',
    person.gender,
    `faction-${getFactionColorKey(person)}`,
    isConfirmedPerson(person) ? 'person-confirmed' : 'person-pending',
  ];
  if (person.id === 'person:sg:cao_cao') {
    classes.push('core');
  }
  if (isLocked) {
    classes.push('locked');
  }
  return classes.join(' ');
}

export function getRelationGraphClasses(
  relation: Relation,
  evidenceBasis: EvidenceBasis,
  isHighlighted: boolean,
): string {
  const classes = [
    relation.type,
    relation.origin,
    evidenceBasis,
    isConfirmedRelation(relation)
      ? 'relation-confirmed'
      : 'relation-pending',
  ];
  if (isHighlighted) {
    classes.push('path-highlight');
  }
  return classes.join(' ');
}
