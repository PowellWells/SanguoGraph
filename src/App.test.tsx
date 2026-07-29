import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

const destroyGraph = vi.fn();
const createGraph = vi.fn(() => ({
  destroy: destroyGraph,
}));

vi.mock('cytoscape', () => ({
  default: createGraph,
}));

function renderRoute(route: string) {
  window.location.hash = route;
  return render(<App />);
}

beforeEach(() => {
  window.location.hash = '';
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('application routes', () => {
  it('renders the home workspace with an empty graph container', async () => {
    const { unmount } = renderRoute('/');

    expect(
      screen.getByRole('heading', {
        name: '从史料出发，重新看见三国人物之间的联系',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('relationship-graph')).toHaveAttribute(
      'aria-label',
      '空白人物关系图谱画布',
    );
    await waitFor(() => {
      expect(createGraph).toHaveBeenCalledOnce();
    });

    unmount();
    expect(destroyGraph).toHaveBeenCalledOnce();
  });

  it('renders the sources page', () => {
    renderRoute('/sources');

    expect(
      screen.getByRole('heading', { name: '史料说明', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('候选数据不等于史实')).toBeInTheDocument();
  });

  it('renders the about page', () => {
    renderRoute('/about');

    expect(
      screen.getByRole('heading', { name: '关于 SanguoGraph', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('项目边界')).toBeInTheDocument();
  });
});
