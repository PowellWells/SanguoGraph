# 三国人物关系谱 · SanguoGraph

[简体中文](README.zh-CN.md) · [English](README.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md)

![三国人物关系谱 · SanguoGraph のカバー](docs/assets/readme-cover.png)

> **オンラインで試す：**[人物関係グラフを開く](https://powellwells.github.io/SanguoGraph/)

三国人物关系谱 · SanguoGraph v1.0 は、出典を追跡できる史料を核にした、三国時代の歴史人物関係ナレッジグラフの安定版です。正式レイヤーには魏・蜀・呉・後漢末の集団に属する歴史人物または明示的に文学レイヤーに属する人物を 580 人収録し、検証済み記録、表示用勢力、文学的主張、内部研究候補を分離して扱います。

## オフラインで直接開く

リポジトリ直下の [`index.html`](index.html) をダブルクリックすると、ローカルブラウザーで完全なグラフを利用できます。ファイルは自動的に [`offline/index.html`](offline/index.html) を開きます。オフラインファイルにはスタイル、アプリケーションコード、正式データが埋め込まれているため、Node.js、ローカルサーバー、インターネット接続は不要です。

メンテナーは次のコマンドでオフラインファイルを再生成・検証できます。

```powershell
npm run build:offline
npm run validate:offline
```

## 現在のマイルストーン

- 7 回のインポートにまたがる、ローカルに同定された 580 人（`person:sg:*`）。
- 政治・戦争のエッジを含まない、父・母・配偶者・養親・宗族に関する 358 件の記録済み関係。
- 初回表示時に 580 人の正式人物をすべてフロントエンド地図へ読み込み、対象関係がない人物も独立ノードとして表示。
- 『三国志』本文と裴松之注への検証可能な出典参照。
- 検索、関係フィルター、全体・1 ホップ・2 ホップ表示を備えた Cytoscape.js グラフ。
- 衝突のない間隔、分岐をまたぐエッジのルーティング、読みやすいフォーカスズーム、全体表示を備えた決定的な放射状家系レイアウト。
- 遠距離ズームで表示を整理し、グラフツールバーから常時表示できるスマートな関係ラベル。
- 方向、時期、限定条件、根拠、解釈、確実性、異論、判断、レビュー状態を含む関係ドシエ。
- ノードの展開・折りたたみ、固定、非表示、分岐の分離、取り消し、リセット。
- フィルターに連動する出典数と操作可能な出典カタログ。
- 単一の混在した信頼レイヤーではなく、独立した出典体系フィルター。
- 文脈・ピンイン照合を伴う曖昧性解消検索と、二人物間の最短経路。
- 外部候補データは内部研究専用で、公開ビルドには含めません。
- デスクトップとモバイルに対応したレイアウト。

内部研究で用いる外部識別子はプロジェクトの主キーではなく、`confirmed` 関係の根拠にもできません。

## 史料ポリシー

- 正史、注引史料、文学、構造化候補の主張を分離します。
- `certainty` は主張自体を、`reviewStatus` は編集上のレビューを示します。
- `confirmed` 関係は `verified` であり、構造化データセット以外の歴史資料を少なくとも 1 件引用しなければなりません。
- 候補またはプログラム由来の関係を正式な関係 JSON に書き込みません。
- 引用文と出典を捏造しません。

[主要人物の対象範囲](docs/MAJOR_PERSON_SCOPE.md)、[史料ポリシー](docs/SOURCE_POLICY.md)、[データスキーマ](docs/DATA_SCHEMA.md) を参照してください。

## ローカル開発

Node.js 18.18 以上と npm が必要です。

```powershell
npm install
npm run dev
```

完全な品質チェックは次のとおりです。

```powershell
npm run lint
npm run test
npm run validate:data
npm run validate:processed
npm run validate:release
npm run build
npm run build:offline
npm run validate:offline
npm audit --omit=dev
```

本番 Vite の base path は `/SanguoGraph/` です。ナビゲーションにはハッシュルートを用いるため、GitHub Pages 上でもページ再読み込みにサーバー側の書き換えは不要です。

## 候補データパイプライン

コミット済みの `data/processed` レイヤーには、99 人と Wikidata 由来で未検証の候補関係 738 件が含まれますが、メンテナーの内部研究専用です。通常のウェブビルドと単一ファイルのオフラインビルドはいずれも候補レイヤーを読み込まず、埋め込みません。

再現可能な Python パイプラインと出典・ライセンス登録簿は、[Candidate data pipeline](docs/CANDIDATE_PIPELINE.md) に記載しています。CI は処理済みファイルを JSON Schema と固定 SHA-256 値で検証しますが、Wikidata をダウンロードしません。

## ライセンス

ソースコードは [MIT License](LICENSE) で利用できます。SanguoGraph がライセンス権限を持つ正式な構造化歴史データは [CC BY 4.0](LICENSE-DATA) で提供されます。再利用・再配布時には「三国人物关系谱 · SanguoGraph」と表示し、ライセンスへのリンクと変更の有無を示してください。史料の引用、第三者資料、内部研究候補はこのデータライセンスの対象外です。
