import { SourcePolicyNotice } from '../components/source/SourcePolicyNotice';
import { graphData } from '../data';

export function SourcesPage() {
  return (
    <article className="text-page">
      <header>
        <p className="eyebrow">Source policy</p>
        <h1>史料说明</h1>
        <p>
          SanguoGraph 将正史正文、注引材料和结构化候选分层保存，
          每条正式关系都可回到具体卷次。
        </p>
      </header>
      <SourcePolicyNotice />
      <section>
        <h2>本里程碑使用的史料</h2>
        <div className="source-catalog">
          {graphData.sources.map((source) => (
            <article key={source.id}>
              <h3>{source.reference}</h3>
              {source.quotation && <blockquote>“{source.quotation}”</blockquote>}
              <p>{source.note || '已人工定位卷次与短引文。'}</p>
              {source.url && (
                <a href={source.url} target="_blank" rel="noreferrer">
                  查看原文
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2>候选数据不等于史实</h2>
        <p>
          Wikidata、既有知识图谱和后世整理成果可以帮助发现线索，但不能替代对原始史料的人工核验。
          候选线索默认隐藏，也不能单独支撑 confirmed 关系。
        </p>
      </section>
    </article>
  );
}
