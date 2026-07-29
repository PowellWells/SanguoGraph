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
};
const positionNodes = vi.fn();
const fitGraph = vi.fn();
const graphInstance = {
  destroy: destroyGraph,
  on: vi.fn(),
  elements: () => ({ unselect: vi.fn() }),
  nodes: () => ({ positions: positionNodes }),
  getElementById: () => graphElement,
  animate: vi.fn(),
  resize: vi.fn(),
  fit: fitGraph,
  zoom: vi.fn(() => 1),
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
  it('renders the verified Cao family graph and keeps candidates off by default', async () => {
    renderRoute('/');

    expect(
      screen.getByRole('heading', {
        name: '从史料出发，看见曹操核心家庭的关系',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'aria-label',
      '曹操核心家庭人物关系图谱',
    );
    expect(
      screen.getByRole('checkbox', { name: '显示 Wikidata 候选线索' }),
    ).not.toBeChecked();
    const summary = screen.getByLabelText('图谱数据摘要');
    expect(within(summary).getByText('15')).toBeInTheDocument();
    expect(within(summary).getByText('23')).toBeInTheDocument();
    expect(within(summary).getByText('6')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '适应画布' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '曹操' })).toBeInTheDocument();
    await waitFor(() => expect(createGraph).toHaveBeenCalledOnce());
  });

  it('searches by a traditional alias and selects the result', () => {
    renderRoute('/');
    fireEvent.change(screen.getByRole('searchbox', { name: '人物搜索' }), {
      target: { value: '曹沖' },
    });
    fireEvent.click(screen.getByRole('button', { name: /曹冲/ }));

    expect(screen.getByRole('heading', { name: '曹冲' })).toBeInTheDocument();
  });

  it('degrades safely when candidate loading fails', async () => {
    loadCandidateGraphMock.mockRejectedValue(
      new Error('离线测试：候选文件不可用'),
    );
    renderRoute('/');
    fireEvent.click(
      screen.getByRole('checkbox', { name: '显示 Wikidata 候选线索' }),
    );

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('离线测试：候选文件不可用');
    expect(screen.getByTestId('relationship-graph')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '曹操' })).toBeInTheDocument();
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
      screen.getByRole('heading', { name: '关于 SanguoGraph', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('如何阅读')).toBeInTheDocument();
  });
});
