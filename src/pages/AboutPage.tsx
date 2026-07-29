export function AboutPage() {
  return (
    <article className="text-page">
      <header>
        <p className="eyebrow">About the project</p>
        <h1>关于 SanguoGraph</h1>
        <p>
          这是一个处于早期阶段的开源数字人文项目，目标是建立可查询、可校正、
          可追溯证据的三国历史人物关系谱。
        </p>
      </header>
      <section>
        <h2>当前阶段</h2>
        <p>
          Milestone 1 收录曹操核心家庭15人，展示父母、夫妻与收养等基础关系。
          正式层只保存可定位史料的记录，外部结构化数据保持在默认隐藏的候选层。
        </p>
      </section>
      <section>
        <h2>项目边界</h2>
        <p>
          当前版本没有后端、登录、在线编辑或 AI
          自动写入功能，也不会把候选或程序推导结果伪装成史料直接记载。
        </p>
      </section>
      <section>
        <h2>如何阅读</h2>
        <p>
          选择节点查看人物亲属，选择连线查看核验状态与短引文。灰色虚线是
          Wikidata 候选线索，需要主动开启，且不参与正式史实认定。
        </p>
      </section>
    </article>
  );
}
