import { describe, expect, it } from 'vitest';
import { graphData } from '../data';
import { searchPersons } from './personSearch';

describe('searchPersons', () => {
  it.each([
    ['曹冲', '曹冲'],
    ['曹沖', '曹冲'],
    ['仓舒', '曹冲'],
    ['倉舒', '曹冲'],
    ['魏文帝', '曹丕'],
    ['孟德', '曹操'],
    ['caocao', '曹操'],
    ['liubei', '刘备'],
    ['sunquan', '孙权'],
    ['政治家', '曹操'],
  ])('matches %s by names, courtesy names or aliases', (query, expected) => {
    expect(searchPersons(graphData.persons, query)[0]?.name).toBe(expected);
  });
});
