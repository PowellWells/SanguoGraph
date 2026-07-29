import { GraphControls } from '../components/graph/GraphControls';
import { RelationshipGraph } from '../components/graph/RelationshipGraph';
import { PersonPanel } from '../components/person/PersonPanel';

export function HomePage() {
  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">可追溯史料 · 分层表达 · 开放协作</p>
        <h1>从史料出发，重新看见三国人物之间的联系</h1>
        <p>
          SanguoGraph
          以正史为基础整理人物亲属关系，并保留每一条关系的证据和核验状态。
        </p>
      </section>
      <section className="workspace" aria-label="人物关系图谱工作区">
        <GraphControls />
        <RelationshipGraph />
        <PersonPanel />
      </section>
    </>
  );
}

