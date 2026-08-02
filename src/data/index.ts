import personsJson from './persons.json';
import relationsJson from './relations.json';
import sourcesJson from './sources.json';
import type { GraphData } from '../services/dataValidator';
import type { HistoricalSource, Person, Relation } from '../domain';
import { majorPersons } from './majorPersons';
import { majorSources } from './majorSources';
import { familyPersons } from './familyPersons';
import { familyRelations } from './familyRelations';
import { familySources } from './familySources';
import { fourthFamilyPersons } from './fourthFamilyPersons';
import { fourthFamilyRelations } from './fourthFamilyRelations';
import { fourthFamilySources } from './fourthFamilySources';

export const graphData: GraphData = {
  persons: [
    ...(personsJson as Person[]),
    ...majorPersons,
    ...familyPersons,
    ...fourthFamilyPersons,
  ],
  relations: [
    ...(relationsJson as Relation[]),
    ...familyRelations,
    ...fourthFamilyRelations,
  ],
  sources: [
    ...(sourcesJson as HistoricalSource[]),
    ...majorSources,
    ...familySources,
    ...fourthFamilySources,
  ],
};
