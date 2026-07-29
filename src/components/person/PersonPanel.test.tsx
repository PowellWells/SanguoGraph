import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PersonPanel } from './PersonPanel';
import { graphData } from '../../data';

describe('PersonPanel', () => {
  it('shows a person profile and kin relations', () => {
    const person = graphData.persons.find(
      (item) => item.id === 'person:sg:cao_pi',
    );
    if (!person) {
      throw new Error('测试人物不存在。');
    }
    render(
      <PersonPanel
        selectedPerson={person}
        selectedRelation={null}
        persons={graphData.persons}
        relations={graphData.relations}
        sources={graphData.sources}
      />,
    );

    expect(screen.getByRole('heading', { name: '曹丕' })).toBeInTheDocument();
    expect(screen.getByText(/字子桓/)).toBeInTheDocument();
    expect(screen.getByText('卞夫人')).toBeInTheDocument();
  });

  it('shows relation status, quotation and source link', () => {
    const relation = graphData.relations.find(
      (item) => item.id === 'relation:sg:cao_song_father_cao_cao',
    );
    if (!relation) {
      throw new Error('测试关系不存在。');
    }
    render(
      <PersonPanel
        selectedPerson={null}
        selectedRelation={relation}
        persons={graphData.persons}
        relations={graphData.relations}
        sources={graphData.sources}
      />,
    );

    expect(screen.getByRole('heading', { name: '曹嵩 → 曹操' })).toBeInTheDocument();
    expect(screen.getByText('父子')).toBeInTheDocument();
    expect(screen.getByText('史料直接记载')).toBeInTheDocument();
    expect(screen.getAllByText('已确认')).toHaveLength(2);
    expect(screen.getByText('当前未登记反对材料')).toBeInTheDocument();
    expect(screen.getByText(/已录史料将曹嵩记为曹操之父/)).toBeInTheDocument();
    expect(screen.getByText(/养子嵩嗣/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看原文' })).toHaveAttribute(
      'href',
      'https://zh.wikisource.org/wiki/三國志/卷01',
    );
  });
});
