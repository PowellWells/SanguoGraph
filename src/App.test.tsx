import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

const { loadCandidateGraphMock } = vi.hoisted(() => ({
  loadCandidateGraphMock: vi.fn(),
}));

vi.mock('./services/candidateDataLoader', () => ({
  loadCandidateGraph: loadCandidateGraphMock,
}));

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

beforeEach(() => {
  window.location.hash = '';
  loadCandidateGraphMock.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe('application routes and home interaction', () => {
  it('renders the verified major-person graph and keeps candidates off by default', async () => {
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
    expect(
      screen.getByRole('checkbox', { name: '开放知识库候选' }),
    ).not.toBeChecked();
    const summary = screen.getByLabelText('图谱数据摘要');
    expect(within(summary).getByText('537')).toBeInTheDocument();
    expect(within(summary).getByText('184')).toBeInTheDocument();
    expect(within(summary).getByText('106')).toBeInTheDocument();
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
      '537',
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
      '537',
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
      '537',
    );
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-relation-count',
      '184',
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
      '537',
    );
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-relation-count',
      '184',
    );
  });

  it('browses a visual faction without creating faction relationship lines', () => {
    renderRoute('/');
    fireEvent.click(
      screen.getByRole('button', { name: /^蜀 119$/ }),
    );

    expect(screen.getByRole('heading', { name: '刘备' })).toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '119',
    );
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-relation-count',
      '55',
    );
  });

  it('degrades safely when candidate loading fails', async () => {
    loadCandidateGraphMock.mockRejectedValue(
      new Error('离线测试：候选文件不可用'),
    );
    renderRoute('/');
    fireEvent.click(
      screen.getByRole('checkbox', { name: '开放知识库候选' }),
    );

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('离线测试：候选文件不可用');
    expect(screen.getByTestId('relationship-graph')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '曹操 — 环夫人' }),
    ).toBeInTheDocument();
  }, 10_000);

  it('opens the filtered source catalog from the live summary', () => {
    renderRoute('/');
    fireEvent.click(screen.getByRole('button', { name: '106 查看列表' }));

    expect(
      screen.getByRole('heading', { name: '史料记录（106）' }),
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
      '536',
    );
    fireEvent.click(screen.getByRole('button', { name: '返回上一步' }));
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'data-node-count',
      '537',
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

  it('renders the sources page with the source catalog', () => {
    renderRoute('/sources');
    expect(
      screen.getByRole('heading', { name: '史料说明', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('候选数据不等于史实')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: '《三国志》卷一《魏书一·武帝纪》',
      }),
    ).toBeInTheDocument();
  });

  it('renders the Milestone 1 about page', () => {
    renderRoute('/about');
    expect(
      screen.getByRole('heading', { name: '关于 三国人物关系谱 · SanguoGraph', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('如何阅读')).toBeInTheDocument();
  });
});
