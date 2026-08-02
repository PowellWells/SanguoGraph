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
    expect(screen.getByText('录入批次：第一批导入')).toBeInTheDocument();
    expect(screen.getByText('卞夫人')).toBeInTheDocument();
  });

  it('identifies a person from the second import batch', () => {
    const person = graphData.persons.find(
      (item) => item.id === 'person:sg:liu_bei',
    );
    if (!person) {
      throw new Error('第二批测试人物不存在。');
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

    expect(screen.getByRole('heading', { name: '刘备' })).toBeInTheDocument();
    expect(screen.getByText('录入批次：第二批导入')).toBeInTheDocument();
  });

  it('identifies a person from the third family import batch', () => {
    const person = graphData.persons.find(
      (item) => item.id === 'person:sg:zhang_chunhua',
    );
    if (!person) {
      throw new Error('第三批测试人物不存在。');
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

    expect(screen.getByRole('heading', { name: '张春华' })).toBeInTheDocument();
    expect(screen.getByText('录入批次：第三批导入')).toBeInTheDocument();
  });

  it('identifies a person from the fourth Wei-family import batch', () => {
    const person = graphData.persons.find(
      (item) => item.id === 'person:sg:xiahou_ba',
    );
    if (!person) {
      throw new Error('第四批测试人物不存在。');
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

    expect(screen.getByRole('heading', { name: '夏侯霸' })).toBeInTheDocument();
    expect(screen.getByText('录入批次：第四批导入')).toBeInTheDocument();
    expect(screen.getByText('夏侯渊')).toBeInTheDocument();
  });

  it('keeps literary family claims visibly separate from history', () => {
    const relation = graphData.relations.find(
      (item) => item.id === 'relation:sg:lv_bu_spouse_diaochan_literature',
    );
    if (!relation) {
      throw new Error('文学关系测试数据不存在。');
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

    expect(screen.getByRole('heading', { name: '吕布 — 貂蝉' })).toBeInTheDocument();
    expect(screen.getByText('文学关系')).toBeInTheDocument();
    expect(screen.getAllByText('待核验')).not.toHaveLength(0);
    expect(screen.getByText(/只存在于《三国演义》叙事/)).toBeInTheDocument();
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

  it('shows an undirected, precisely qualified clan relation', () => {
    const relation = graphData.relations.find(
      (item) => item.id === 'relation:sg:cao_shuang_clan_xiahou_xuan',
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

    expect(
      screen.getByRole('heading', { name: '曹爽 — 夏侯玄' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('无方向；双方存在宗族或姻亲关系'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('姑表亲；夏侯玄为曹爽姑母之子'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/姑表亲；夏侯玄为曹爽姑母之子；当前判断为/),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/玄，爽之姑子也/)).toHaveLength(2);
    expect(screen.getByRole('link', { name: '查看原文' })).toHaveAttribute(
      'href',
      'https://zh.wikisource.org/wiki/三國志/卷09',
    );
  });
});
