export function PersonPanel() {
  return (
    <aside className="panel-card person-panel" aria-labelledby="person-panel-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">人物档案</p>
          <h2 id="person-panel-title">人物详情</h2>
        </div>
      </div>
      <div className="person-placeholder">
        <span aria-hidden="true">人</span>
        <p>选择人物后，此处将显示生卒年、亲属关系和史料依据。</p>
      </div>
      <dl className="metadata-placeholder" aria-label="待显示的人物信息">
        <div>
          <dt>身份</dt>
          <dd>—</dd>
        </div>
        <div>
          <dt>关系</dt>
          <dd>—</dd>
        </div>
        <div>
          <dt>史料</dt>
          <dd>—</dd>
        </div>
      </dl>
    </aside>
  );
}

