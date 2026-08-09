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
import { fifthFamilyPersons } from './fifthFamilyPersons';
import { fifthFamilyRelations } from './fifthFamilyRelations';
import { fifthFamilySources } from './fifthFamilySources';
import { sixthRosterPersons } from './sixthRoster';
import { majorWeiRelationshipRelations } from './majorWeiRelationshipRelations';
import { majorWeiRelationshipSources } from './majorWeiRelationshipSources';
import { majorWuRelationshipRelations } from './majorWuRelationshipRelations';
import { majorWuRelationshipSources } from './majorWuRelationshipSources';

export const graphData: GraphData = {
  persons: [
    ...(personsJson as Person[]),
    ...majorPersons,
    ...familyPersons,
    ...fourthFamilyPersons,
    ...fifthFamilyPersons,
    ...sixthRosterPersons,
  ],
  relations: [
    ...(relationsJson as Relation[]),
    ...familyRelations,
    ...fourthFamilyRelations,
    ...fifthFamilyRelations,
    ...majorWeiRelationshipRelations,
    ...majorWuRelationshipRelations,
  ],
  sources: [
    ...(sourcesJson as HistoricalSource[]),
    ...majorSources,
    ...familySources,
    ...fourthFamilySources,
    ...fifthFamilySources,
    ...majorWeiRelationshipSources,
    ...majorWuRelationshipSources,
  ],
};
