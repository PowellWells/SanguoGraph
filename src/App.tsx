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
    <div className="app-shell">
      <Header currentRoute={route} />
      <main className="main-content">{page}</main>
      <footer className="site-footer">
        <p>Milestone 1.3 · 关系档案 · 节点探索 · 史料分层与路径查询</p>
      </footer>
    </div>
  );
}
