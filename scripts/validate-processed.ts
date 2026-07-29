import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type { AnySchema } from 'ajv';

interface ProcessedPerson {
  id: string;
}

interface ProcessedRelation {
  id: string;
  source_id: string;
  target_id: string;
  verified: boolean;
}

interface ProcessedGraph {
  nodes: Array<{ id: string }>;
  links: ProcessedRelation[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseIntegrity(value: unknown): Record<string, string> {
  if (!isRecord(value)) {
    throw new Error('processed_integrity.json 必须是对象。');
  }
  const entries = Object.entries(value);
  if (
    entries.some(
      ([path, hash]) =>
        !path.startsWith('data/processed/') ||
        typeof hash !== 'string' ||
        !/^[A-F0-9]{64}$/.test(hash),
    )
  ) {
    throw new Error('processed_integrity.json 包含无效路径或 SHA-256。');
  }
  return Object.fromEntries(entries) as Record<string, string>;
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(resolve(path), 'utf8')) as unknown;
}

function asPersons(value: unknown): ProcessedPerson[] {
  if (
    !Array.isArray(value) ||
    !value.every((item) => isRecord(item) && typeof item.id === 'string')
  ) {
    throw new Error('processed persons 数据结构无效。');
  }
  return value as ProcessedPerson[];
}

function asRelations(value: unknown): ProcessedRelation[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === 'string' &&
        typeof item.source_id === 'string' &&
        typeof item.target_id === 'string' &&
        typeof item.verified === 'boolean',
    )
  ) {
    throw new Error('processed relations 数据结构无效。');
  }
  return value as ProcessedRelation[];
}

function asGraph(value: unknown): ProcessedGraph {
  if (
    !isRecord(value) ||
    !Array.isArray(value.nodes) ||
    !Array.isArray(value.links)
  ) {
    throw new Error('processed graph 数据结构无效。');
  }
  return {
    nodes: asPersons(value.nodes),
    links: asRelations(value.links),
  };
}

const integrity = parseIntegrity(
  await readJson('config/processed_integrity.json'),
);
const integrityErrors: string[] = [];

for (const [path, expected] of Object.entries(integrity)) {
  const content = await readFile(resolve(path));
  const actual = createHash('sha256').update(content).digest('hex').toUpperCase();
  if (actual !== expected) {
    integrityErrors.push(`${path}: 预期 ${expected}，实际 ${actual}`);
  }
}

const personsRaw = await readJson('data/processed/persons.json');
const relationsRaw = await readJson('data/processed/relations.json');
const graphRaw = await readJson('data/processed/graph.json');
const personSchema = await readJson('schemas/persons.schema.json');
const relationSchema = await readJson('schemas/relations.schema.json');

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validatePersons = ajv.compile(personSchema as AnySchema);
const validateRelations = ajv.compile(relationSchema as AnySchema);
const schemaErrors: string[] = [];

if (!validatePersons(personsRaw)) {
  schemaErrors.push(
    `persons.json: ${ajv.errorsText(validatePersons.errors, { separator: '; ' })}`,
  );
}
if (!validateRelations(relationsRaw)) {
  schemaErrors.push(
    `relations.json: ${ajv.errorsText(validateRelations.errors, { separator: '; ' })}`,
  );
}

const persons = asPersons(personsRaw);
const relations = asRelations(relationsRaw);
const graph = asGraph(graphRaw);
const personIds = new Set(persons.map((person) => person.id));
const referenceErrors: string[] = [];

for (const relation of relations) {
  if (!personIds.has(relation.source_id) || !personIds.has(relation.target_id)) {
    referenceErrors.push(`${relation.id}: 人物引用不完整。`);
  }
  if (relation.verified) {
    referenceErrors.push(`${relation.id}: Wikidata 候选不得标记为 verified。`);
  }
}

if (
  graph.nodes.length !== persons.length ||
  graph.links.length !== relations.length
) {
  referenceErrors.push('graph.json 与 persons/relations 数量不一致。');
}
if (
  graph.links.some(
    (relation) =>
      !personIds.has(relation.source_id) ||
      !personIds.has(relation.target_id) ||
      relation.verified,
  )
) {
  referenceErrors.push('graph.json 包含悬空引用或已核验候选。');
}

const errors = [...integrityErrors, ...schemaErrors, ...referenceErrors];
if (errors.length > 0) {
  console.error(`processed 数据校验失败，共 ${errors.length} 个问题：`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `processed 数据校验通过：${persons.length} 个人物，${relations.length} 条未核验候选；4 个文件哈希一致。`,
  );
}
