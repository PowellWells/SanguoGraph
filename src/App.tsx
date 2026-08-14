import { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { graphData } from './data';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { SourcesPage } from './pages/SourcesPage';
import { parseDeepLinkHash, type DeepLinkTarget } from './services/deepLinks';

export type AppPage = '/' | '/sources' | '/about';

interface AppRoute {
  page: AppPage;
  entity: DeepLinkTarget | null;
  invalidPath: string | null;
}

const personIds = new Set(graphData.persons.map(({ id }) => id));
const relationIds = new Set(graphData.relations.map(({ id }) => id));
const sourceIds = new Set(graphData.sources.map(({ id }) => id));

function entityExists(target: DeepLinkTarget): boolean {
  if (target.kind === 'person') {
    return personIds.has(target.id);
  }
  if (target.kind === 'relation') {
    return relationIds.has(target.id);
  }
  return sourceIds.has(target.id);
}

function readHashRoute(): AppRoute {
  const hash = window.location.hash;
  const deepLink = parseDeepLinkHash(hash);
  if (deepLink) {
    if (!entityExists(deepLink)) {
      return { page: '/', entity: null, invalidPath: hash.slice(1) };
    }
    return {
      page: deepLink.kind === 'source' ? '/sources' : '/',
      entity: deepLink,
      invalidPath: null,
    };
  }
  const path = hash.slice(1);

  if (path === '/sources' || path === '/about') {
    return { page: path, entity: null, invalidPath: null };
  }

  if (path === '' || path === '/') {
    return { page: '/', entity: null, invalidPath: null };
  }
  return { page: '/', entity: null, invalidPath: path };
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

  const page = route.invalidPath ? (
    <article className="text-page entity-not-found">
      <p className="eyebrow">Link unavailable</p>
      <h1>找不到这条档案</h1>
      <p>该永久链接不存在或已损坏。正式数据没有被修改。</p>
      <a href="#/">返回关系图谱</a>
    </article>
  ) : route.page === '/sources' ? (
    <SourcesPage
      focusedSourceId={route.entity?.kind === 'source' ? route.entity.id : null}
    />
  ) : route.page === '/about' ? (
    <AboutPage />
  ) : (
    <HomePage
      key={route.entity ? `${route.entity.kind}:${route.entity.id}` : 'home'}
      initialPersonId={route.entity?.kind === 'person' ? route.entity.id : null}
      initialRelationId={
        route.entity?.kind === 'relation' ? route.entity.id : null
      }
    />
  );

  return (
    <div
      className={`app-shell route-${
        route.invalidPath
          ? 'not-found'
          : route.page === '/'
            ? 'home'
            : route.page.slice(1)
      }`}
    >
      <Header currentRoute={route.page} />
      <main className="main-content">{page}</main>
      <footer className="site-footer">
        <p>三国人物关系谱 · SanguoGraph · 开源项目</p>
        <p>代码 MIT · 数据许可待定</p>
      </footer>
    </div>
  );
}
