import { graphData } from '../data';
import { FeedbackLinks } from '../components/feedback/FeedbackLinks';

export function AboutPage() {
  const personCount = graphData.persons.length;
  const relationCount = graphData.relations.length;
  return (
    <article className="text-page">
      <header>
        <p className="eyebrow">About the project</p>
        <h1>关于 三国人物关系谱 · SanguoGraph</h1>
        <p>
          这是一个处于早期阶段的开源数字人文项目，目标是建立可查询、可校正、
          可追溯证据的三国历史人物关系谱。
        </p>
      </header>
      <section>
        <h2>当前阶段</h2>
        <p>
          当前正式层收录{personCount}名历史或文学层人物，并保存{relationCount}条父母、夫妻、收养与
          宗族关系。全部{personCount}位人物首次进入即加载到完整地图；文学与传闻关系以
          虚线分层显示，没有这六类关系线的人物仍作为独立节点显示。外部结构化
          候选只保留在内部研究流程，不进入前端成品。
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
          选择节点查看人物亲属和探索操作；选择连线打开关系档案，查看关系方向、
          身份限定、时期、证据方式、现代解释、争议与核验状态。双击节点可逐层
          展开或收起，史料数字可打开当前筛选对应的来源清单。
        </p>
      </section>
      <section>
        <h2>分层与查询</h2>
        <p>
          正史直接记载、正史间接推定、其他古代史料、现代研究、文学作品、
          编辑者推断分别开关。当前没有数据的来源层会明确显示为
          0；外部候选线索不进入前端，也不参与正式史实认定。双人物查询只在
          当前{personCount}人和当前筛选条件内计算最短路径；没有正式关系路径时会明确返回
          未找到，而不会自动补造政治或事件关系。
        </p>
      </section>
      <section id="feedback">
        <h2>纠错与来源建议</h2>
        <p>
          人物、关系和史料档案旁均提供带实体 ID 与永久链接的反馈入口。请说明当前
          内容、建议修改以及可复核的书名、卷篇或研究出处。所有提交先进入人工审校
          队列；只有完成身份、证据、史料层和授权边界核验后，才可能修改正式数据。
        </p>
        <FeedbackLinks />
      </section>
      <section id="data-license">
        <h2>许可证边界</h2>
        <p>
          项目软件代码采用 MIT License。项目整理的历史数据尚未授予独立开放数据
          许可证；史料短摘录和第三方材料继续遵循各自来源权利，不因进入仓库而自动
          改用 MIT 或 CC0。正式发布前必须完成独立数据许可证决定和兼容性复核。
        </p>
      </section>
    </article>
  );
}
