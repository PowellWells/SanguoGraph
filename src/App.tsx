import { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { SourcesPage } from './pages/SourcesPage';

export type AppRoute = '/' | '/sources' | '/about';

function readHashRoute(): AppRoute {
  const path = window.location.hash.slice(1);

  if (path === '/sources' || path === '/about') {
    return path;
  }

  return '/';
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(readHashRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(readHashRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const page =
    route === '/sources' ? (
      <SourcesPage />
    ) : route === '/about' ? (
      <AboutPage />
    ) : (
      <HomePage />
    );

  return (
    <div
      className={`app-shell route-${route === '/' ? 'home' : route.slice(1)}`}
    >
      <Header currentRoute={route} />
      <main className="main-content">{page}</main>
      <footer className="site-footer">
        <p>三国人物关系谱 · SanguoGraph · 开源项目</p>
        <p>代码 MIT · 数据许可待定</p>
      </footer>
    </div>
  );
}
