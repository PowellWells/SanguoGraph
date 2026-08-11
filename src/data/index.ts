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
import { majorShuOtherRelationshipRelations } from './majorShuOtherRelationshipRelations';
import { majorShuOtherRelationshipSources } from './majorShuOtherRelationshipSources';
import { sixthRosterRelationshipBatchOneRelations } from './sixthRosterRelationshipBatchOneRelations';
import { sixthRosterRelationshipBatchOneSources } from './sixthRosterRelationshipBatchOneSources';
import { seventhSourceAuditBatchOnePersons } from './seventhSourceAuditBatchOnePersons';
import { seventhSourceAuditBatchOneRelations } from './seventhSourceAuditBatchOneRelations';
import { seventhSourceAuditBatchOneSources } from './seventhSourceAuditBatchOneSources';
import { seventhSourceAuditBatchTwoPersons } from './seventhSourceAuditBatchTwoPersons';
import { seventhSourceAuditBatchTwoRelations } from './seventhSourceAuditBatchTwoRelations';
import { seventhSourceAuditBatchTwoSources } from './seventhSourceAuditBatchTwoSources';
import { majorRosterSecondPassRelations } from './majorRosterSecondPassRelations';
import { majorRosterSecondPassSources } from './majorRosterSecondPassSources';

export const graphData: GraphData = {
  persons: [
    ...(personsJson as Person[]),
    ...majorPersons,
    ...familyPersons,
    ...fourthFamilyPersons,
    ...fifthFamilyPersons,
    ...sixthRosterPersons,
    ...seventhSourceAuditBatchOnePersons,
    ...seventhSourceAuditBatchTwoPersons,
  ],
  relations: [
    ...(relationsJson as Relation[]),
    ...familyRelations,
    ...fourthFamilyRelations,
    ...fifthFamilyRelations,
    ...majorWeiRelationshipRelations,
    ...majorWuRelationshipRelations,
    ...majorShuOtherRelationshipRelations,
    ...sixthRosterRelationshipBatchOneRelations,
    ...seventhSourceAuditBatchOneRelations,
    ...seventhSourceAuditBatchTwoRelations,
    ...majorRosterSecondPassRelations,
  ],
  sources: [
    ...(sourcesJson as HistoricalSource[]),
    ...majorSources,
    ...familySources,
    ...fourthFamilySources,
    ...fifthFamilySources,
    ...majorWeiRelationshipSources,
    ...majorWuRelationshipSources,
    ...majorShuOtherRelationshipSources,
    ...sixthRosterRelationshipBatchOneSources,
    ...seventhSourceAuditBatchOneSources,
    ...seventhSourceAuditBatchTwoSources,
    ...majorRosterSecondPassSources,
  ],
};
