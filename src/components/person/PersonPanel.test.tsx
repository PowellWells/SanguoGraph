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

  it('shows Cao Zhen relations from Cao Zhen\'s point of view', () => {
    const person = graphData.persons.find(
      (item) => item.id === 'person:sg:cao_zhen',
    );
    if (!person) {
      throw new Error('曹真测试人物不存在。');
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

    expect(screen.getAllByText('儿子')).toHaveLength(6);
    expect(screen.getByText('养父')).toBeInTheDocument();
    expect(screen.getByText('宗族长辈')).toBeInTheDocument();
    expect(screen.getByText('弟弟')).toBeInTheDocument();
    expect(screen.queryByText('父亲')).not.toBeInTheDocument();
  });

  it('shows Cao Zhen as Cao Shuang\'s father', () => {
    const person = graphData.persons.find(
      (item) => item.id === 'person:sg:cao_shuang',
    );
    if (!person) {
      throw new Error('曹爽测试人物不存在。');
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

    expect(screen.getByText('父亲')).toBeInTheDocument();
    expect(screen.getByText('曹真')).toBeInTheDocument();
    expect(screen.getByText('姑表亲')).toBeInTheDocument();
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

  it('identifies a person from the fifth Shu-family import batch', () => {
    const person = graphData.persons.find(
      (item) => item.id === 'person:sg:liu_chen',
    );
    if (!person) {
      throw new Error('第五批测试人物不存在。');
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

    expect(screen.getByRole('heading', { name: '刘谌' })).toBeInTheDocument();
    expect(screen.getByText('录入批次：第五批导入')).toBeInTheDocument();
    expect(screen.getByText('刘禅')).toBeInTheDocument();
  });

  it('identifies a person from the sixth complete-roster batch', () => {
    const person = graphData.persons.find(
      (item) => item.importBatch === 6 && item.name === '王蕃',
    );
    if (!person) {
      throw new Error('第六批测试人物不存在。');
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

    expect(screen.getByRole('heading', { name: '王蕃' })).toBeInTheDocument();
    expect(
      screen.getByText('录入批次：第六批全量导入'),
    ).toBeInTheDocument();
    expect(screen.getByText(/《三国志》卷65/)).toBeInTheDocument();
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

  it('shows relation status and quotation without a blocked source link', () => {
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
    expect(screen.queryByRole('link', { name: '查看原文' })).not.toBeInTheDocument();
  });

  it('shows Empress Zhen\'s earlier marriage to Yuan Xi with direct evidence', () => {
    const relation = graphData.relations.find(
      (item) => item.id === 'relation:sg:yuan_xi_spouse_empress_zhen',
    );
    if (!relation) {
      throw new Error('袁熙与甄氏婚姻关系测试数据不存在。');
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
      screen.getByRole('heading', { name: '袁熙 — 甄皇后' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/建安中，袁绍为中子熙纳之/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '查看原文' })).not.toBeInTheDocument();
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
    expect(screen.queryByRole('link', { name: '查看原文' })).not.toBeInTheDocument();
  });
});
