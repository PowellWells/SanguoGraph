export function GraphControls() {
  return (
    <aside className="panel-card controls-panel" aria-labelledby="controls-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">浏览条件</p>
          <h2 id="controls-title">筛选关系</h2>
        </div>
      </div>
      <label htmlFor="person-search">人物搜索</label>
      <input
        id="person-search"
        type="search"
        placeholder="将在 Milestone 1 开放"
        disabled
      />
      <fieldset disabled>
        <legend>关系类型</legend>
        <label>
          <input type="checkbox" defaultChecked />
          父母子女
        </label>
        <label>
          <input type="checkbox" defaultChecked />
          夫妻
        </label>
        <label>
          <input type="checkbox" defaultChecked />
          收养
        </label>
        <label>
          <input type="checkbox" defaultChecked />
          宗族
        </label>
      </fieldset>
      <p className="panel-note">
        控件暂为界面占位，不会修改当前空白图谱。
      </p>
    </aside>
  );
}

