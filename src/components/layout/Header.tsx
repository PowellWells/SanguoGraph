import type { AppRoute } from '../../App';

const navigation = [
  { to: '/', label: '关系图谱' },
  { to: '/sources', label: '史料说明' },
  { to: '/about', label: '关于项目' },
] as const;

interface HeaderProps {
  currentRoute: AppRoute;
}

export function Header({ currentRoute }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#/" aria-label="返回 SanguoGraph 首页">
        <span className="brand-mark" aria-hidden="true">
          谱
        </span>
        <span>
          <strong>SanguoGraph</strong>
          <small>三国人物关系谱</small>
        </span>
      </a>
      <nav aria-label="主导航">
        {navigation.map((item) => (
          <a
            key={item.to}
            href={`#${item.to}`}
            className={currentRoute === item.to ? 'active' : undefined}
            aria-current={currentRoute === item.to ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
