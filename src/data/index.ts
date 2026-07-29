import personsJson from './persons.json';
import relationsJson from './relations.json';
import sourcesJson from './sources.json';
import type { GraphData } from '../services/dataValidator';
import type { HistoricalSource, Person, Relation } from '../domain';

export const graphData: GraphData = {
  persons: personsJson as Person[],
  relations: relationsJson as Relation[],
  sources: sourcesJson as HistoricalSource[],
};

