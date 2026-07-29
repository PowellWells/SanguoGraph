import { SourcePolicyNotice } from '../components/source/SourcePolicyNotice';

export function SourcesPage() {
  return (
    <article className="text-page">
      <header>
        <p className="eyebrow">Source policy</p>
        <h1>史料说明</h1>
        <p>
          SanguoGraph
          将正史正文、注引材料和文学叙事分层保存，不把不同性质的材料混为一谈。
        </p>
      </header>
      <SourcePolicyNotice />
      <section>
        <h2>证据优先</h2>
        <p>
          标记为“正史确认”的关系必须附有可核查的史料记录。没有出处的关系只能作为待复核候选，
          不能进入确认层。
        </p>
      </section>
      <section>
        <h2>候选数据不等于史实</h2>
        <p>
          Wikidata、既有知识图谱和后世整理成果可以帮助发现线索，但不能替代对原始史料的人工核验。
        </p>
      </section>
    </article>
  );
}

