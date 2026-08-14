import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

const destroyGraph = vi.fn();
const selectElement = vi.fn();
const graphElement = {
  select: selectElement,
  isNode: () => true,
  nonempty: () => true,
  lock: vi.fn(),
};
const positionNodes = vi.fn();
const forEachNode = vi.fn();
const fitGraph = vi.fn();
let currentMinimumZoom = 0.001;
const graphMinimumZoom = vi.fn((value?: number) => {
  if (value !== undefined) {
    currentMinimumZoom = value;
  }
  return currentMinimumZoom;
});
const graphMaximumZoom = vi.fn(() => 2.4);
const edgeCollection = {
  addClass: vi.fn(),
  removeClass: vi.fn(),
};
const nodeCollection = {
  positions: positionNodes,
  forEach: forEachNode,
  connectedEdges: () => edgeCollection,
  addClass: vi.fn(),
  removeClass: vi.fn(),
};
const graphInstance = {
  destroy: destroyGraph,
  on: vi.fn(),
  elements: () => ({ unselect: vi.fn() }),
  nodes: () => nodeCollection,
  edges: () => edgeCollection,
  getElementById: () => graphElement,
  animate: vi.fn(),
  resize: vi.fn(),
  fit: fitGraph,
  zoom: vi.fn(() => 1),
  minZoom: graphMinimumZoom,
  maxZoom: graphMaximumZoom,
  pan: vi.fn(() => ({ x: 0, y: 0 })),
  center: vi.fn(),
};
const createGraph = vi.fn(() => graphInstance);

vi.mock('cytoscape', () => ({
  default: createGraph,
}));

function renderRoute(route: string) {
  window.location.hash = route;
  return render(<App />);
}

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe('application routes and home interaction', () => {
  it('renders the verified major-person graph without an external candidate layer', async () => {
    renderRoute('/');

    expect(
      screen.getByRole('heading', {
        name: '三国主要人物关系图谱',
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'aria-label',
      '三国主要人物关系图谱',
    );
    expect(screen.queryByText('开放知识库候选')).not.toBeInTheDocument();
    const summary = screen.getByLabelText('图谱数据摘要');
    expect(within(summary).getByText('580')).toBeInTheDocument();
    expect(within(summary).getByText('358')).toBeInTheDocument();
    expect(within(summary).getByText('186')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '适应画布' }),
    ).toBeInTheDocument();
    const labelButton = screen.getByRole('button', {
      name: '显示全部关系标签',
    });
    expect(labelButton).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(labelButton);
    expect(
      screen.getByRole('button', { name: '恢复智能关系标签' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('heading', { name: '曹操 — 环夫人' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '图谱方法与阅读指南' }),
    ).toBeInTheDocument();
    await waitFor(() => expect(createGraph).toHaveBeenCalledOnce());
  }, 10_000);

  it('searches by a traditional alias and selects the result', () => {
    renderRoute('/');
    fireEvent.change(screen.getByRole('searchbox', { name: '人物搜索' }), {
      target: { value: '曹沖' },
    });
    fireEvent.click(screen.getByRole('button', { name: /曹冲/ }));

    expect(screen.getByRole('heading', { name: '曹冲' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#/person/cao_chong');
  });

  it('selects a fourth-batch Xiahou person already loaded in the complete graph', () => {
    renderRoute('/');
    fireEvent.change(screen.getByRole('searchbox', { name: '人物搜索' }), {
      target: { value: '夏侯霸' },
    });
    fireEvent.click(screen.getByRole('button', { name: /夏侯霸/ }));

    expect(
      screen.getByRole('heading', { name: '夏侯霸' }),
    ).toBeInTheDocument();
    expect(screen.getByText('录入批次：第四批导入')).toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '580',
    );
  });

  it('selects a fifth-batch Shu-family person already loaded in the complete graph', () => {
    renderRoute('/');
    fireEvent.change(screen.getByRole('searchbox', { name: '人物搜索' }), {
      target: { value: '刘谌' },
    });
    fireEvent.click(screen.getByRole('button', { name: /刘谌/ }));

    expect(screen.getByRole('heading', { name: '刘谌' })).toBeInTheDocument();
    expect(screen.getByText('录入批次：第五批导入')).toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '580',
    );
  });

  it('searches and opens a sixth-batch biographical person', () => {
    renderRoute('/');
    fireEvent.change(screen.getByRole('searchbox', { name: '人物搜索' }), {
      target: { value: '王蕃' },
    });
    fireEvent.click(screen.getByRole('button', { name: /王蕃/ }));

    expect(screen.getByRole('heading', { name: '王蕃' })).toBeInTheDocument();
    expect(
      screen.getByText('录入批次：第六批全量导入'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('《三国志》卷65列传或附传所载王蕃。'),
    ).toBeInTheDocument();
  });

  it('finds a major person while keeping the full family graph loaded', () => {
    renderRoute('/');
    fireEvent.change(screen.getByRole('searchbox', { name: '人物搜索' }), {
      target: { value: '刘备' },
    });
    const liuBeiResult = screen.getByText('刘备', { selector: 'strong' });
    const liuBeiButton = liuBeiResult.closest('button');
    if (!liuBeiButton) {
      throw new Error('刘备搜索结果缺少选择按钮。');
    }
    fireEvent.click(liuBeiButton);

    expect(screen.getByRole('heading', { name: '刘备' })).toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '580',
    );
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-relation-count',
      '358',
    );
  });

  it('can restore the complete fifth-batch family network', () => {
    renderRoute('/');
    fireEvent.click(screen.getByRole('button', { name: '返回核心人物' }));
    fireEvent.click(
      screen.getByRole('button', { name: '查看完整关系网' }),
    );

    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '580',
    );
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-relation-count',
      '358',
    );
  });

  it('browses a visual faction without creating faction relationship lines', () => {
    renderRoute('/');
    fireEvent.click(
      screen.getByRole('button', { name: /^蜀 122$/ }),
    );

    expect(screen.getByRole('heading', { name: '刘备' })).toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '122',
    );
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-relation-count',
      '62',
    );
  });

  it('does not expose an external candidate control in the public graph', () => {
    renderRoute('/');
    expect(screen.queryByText('开放知识库候选')).not.toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toBeInTheDocument();
  });

  it('opens the filtered source catalog from the live summary', () => {
    renderRoute('/');
    fireEvent.click(screen.getByRole('button', { name: '186 查看列表' }));

    expect(
      screen.getByRole('heading', { name: '史料记录（186）' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/这里只统计当前画布/)).toBeInTheDocument();
    const relationButton = screen.getByRole('button', {
      name: /曹操 — 环夫人/,
    });
    fireEvent.click(relationButton);
    expect(
      screen.getByRole('heading', { name: '曹操 — 环夫人' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('夫人；具体位序未见当前史料明确说明'),
    ).toBeInTheDocument();
    expect(screen.getByText('依据史料间接推定')).toBeInTheDocument();
  });

  it('supports hiding a person and returning to the previous graph state', () => {
    renderRoute('/');
    fireEvent.click(screen.getByRole('button', { name: '返回核心人物' }));
    fireEvent.click(screen.getByRole('button', { name: '隐藏此人物' }));

    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '579',
    );
    fireEvent.click(screen.getByRole('button', { name: '返回上一步' }));
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '580',
    );
  });

  it('queries a shortest relationship path under current filters', () => {
    renderRoute('/');
    fireEvent.click(screen.getByText('双人物关系查询'));
    fireEvent.change(screen.getByRole('combobox', { name: '人物 A' }), {
      target: { value: 'person:sg:cao_teng' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: '人物 B' }), {
      target: { value: 'person:sg:cao_pi' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: '查询关系' }),
    );

    expect(
      screen.getByRole('heading', { name: '曹腾 — 曹丕' }),
    ).toBeInTheDocument();
    expect(screen.getByText('共经过 3 条关系；点击任一关系查看完整证据。')).toBeInTheDocument();
  });

  it('searches the source browser by person and relation context', () => {
    renderRoute('/sources');
    expect(
      screen.getByRole('heading', { name: '史料浏览', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('候选数据不等于史实')).toBeInTheDocument();
    expect(screen.getByText('189 条结果')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: '检索史料' }), {
      target: { value: '曹节 刘协' },
    });

    expect(screen.getByText('1 条结果')).toBeInTheDocument();
    expect(
      screen.getByText('《后汉书》卷十下《皇后纪第十下·献穆曹皇后纪》'),
    ).toBeInTheDocument();
    expect(screen.getByText('人物定位引用（3）')).toBeInTheDocument();
    expect(screen.getByText('关系支持证据（6）')).toBeInTheDocument();
    expect(screen.getByText('关系反对证据（0）')).toBeInTheDocument();
    const personUsage = screen
      .getByRole('heading', { name: '人物定位引用（3）' })
      .closest('section');
    expect(personUsage).not.toBeNull();
    expect(within(personUsage!).getByRole('link', { name: '曹宪' })).toHaveAttribute(
      'href',
      '#/person/cao_xian',
    );
    expect(within(personUsage!).getByRole('link', { name: '曹节' })).toHaveAttribute(
      'href',
      '#/person/cao_jie_empress',
    );
  });

  it('opens a stable person deep link', () => {
    renderRoute('/person/cao_jie_empress');
    expect(
      screen.getByRole('heading', { name: '曹节', level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '此人物的永久链接' })).toHaveAttribute(
      'href',
      '#/person/cao_jie_empress',
    );
    const correctionLink = screen.getByRole('link', {
      name: '报告数据问题',
    });
    const correctionUrl = new URL(correctionLink.getAttribute('href') ?? '');
    expect(correctionUrl.searchParams.get('template')).toBe(
      '01-data-correction.yml',
    );
    expect(correctionUrl.searchParams.get('entity')).toBe(
      'person:sg:cao_jie_empress',
    );
  });

  it('opens a stable relation deep link', () => {
    renderRoute('/relation/round_06_cao_jie_empress_spouse_liu_xie');
    expect(
      screen.getByRole('heading', { name: '曹节 — 刘协', level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '此关系的永久链接' })).toHaveAttribute(
      'href',
      '#/relation/round_06_cao_jie_empress_spouse_liu_xie',
    );
  });

  it('opens a focused source deep link and connects it back to graph entities', () => {
    renderRoute('/source/round_06_hhs_10b_cao_daughters');

    expect(screen.getByText('正在查看永久链接指定的史料')).toBeInTheDocument();
    expect(screen.getByText('1 条结果')).toBeInTheDocument();
    expect(screen.queryByRole('searchbox', { name: '检索史料' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '此史料的永久链接' })).toHaveAttribute(
      'href',
      '#/source/round_06_hhs_10b_cao_daughters',
    );
    expect(screen.getByRole('link', { name: '曹节' })).toHaveAttribute(
      'href',
      '#/person/cao_jie_empress',
    );
    const sourceSuggestionLink = screen.getByRole('link', {
      name: '补充史料来源',
    });
    const sourceSuggestionUrl = new URL(
      sourceSuggestionLink.getAttribute('href') ?? '',
    );
    expect(sourceSuggestionUrl.searchParams.get('template')).toBe(
      '02-source-suggestion.yml',
    );
    expect(sourceSuggestionUrl.searchParams.get('entity')).toBe(
      'source:sg:round_06_hhs_10b_cao_daughters',
    );
  });

  it('shows a clear not-found page for an invalid deep link', () => {
    renderRoute('/person/not-a-real-person');

    expect(
      screen.getByRole('heading', { name: '找不到这条档案', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回关系图谱' })).toHaveAttribute(
      'href',
      '#/',
    );
  });

  it('renders the v1.0 about page with the approved data license', () => {
    renderRoute('/about');
    expect(
      screen.getByRole('heading', { name: '关于 三国人物关系谱 · SanguoGraph', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('如何阅读')).toBeInTheDocument();
    expect(screen.getByText('纠错与来源建议')).toBeInTheDocument();
    expect(screen.getByText('许可证边界')).toBeInTheDocument();
    expect(screen.getByText(/当前稳定版为 v1\.0/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CC BY 4.0' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by/4.0/',
    );
    expect(screen.getByText(/数据来源：三国人物关系谱/)).toBeInTheDocument();
    expect(screen.getByText('代码 MIT · 正式数据 CC BY 4.0')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '报告数据问题' })).toHaveAttribute(
      'target',
      '_blank',
    );
  });
});
