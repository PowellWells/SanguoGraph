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
          Milestone 0 只建立前端、数据模式、自动校验和贡献规范。
          真实史料核验与曹操核心家庭关系图将在后续里程碑完成。
        </p>
      </section>
      <section>
        <h2>项目边界</h2>
        <p>
          当前版本没有后端、登录、在线编辑或 AI
          自动写入功能，也不会把程序推导结果伪装成史料直接记载。
        </p>
      </section>
    </article>
  );
}

