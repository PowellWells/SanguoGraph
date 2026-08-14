# 三国人物关系谱 · SanguoGraph

[简体中文](README.zh-CN.md) · [English](README.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md)

![삼국 인물 관계보 · SanguoGraph 표지](docs/assets/readme-cover.png)

> **온라인으로 체험하기:** [인물 관계 그래프 열기](https://powellwells.github.io/SanguoGraph/)

삼국 인물 관계보 · SanguoGraph v1.0은 추적 가능한 사료를 중심으로 구축한 삼국 시대 역사 인물 관계 지식 그래프의 안정 버전입니다. 정식 레이어에는 위·촉·오·후한 말 집단에 속한 역사 인물 또는 문학 레이어로 명시된 인물 580명이 포함되며, 검증된 기록, 표시용 세력, 문학적 주장, 내부 연구 후보를 분리해 관리합니다.

## 오프라인으로 바로 열기

저장소 루트의 [`index.html`](index.html)을 두 번 클릭하면 로컬 브라우저에서 전체 그래프를 사용할 수 있습니다. 이 파일은 자동으로 [`offline/index.html`](offline/index.html)을 엽니다. 오프라인 파일에는 스타일, 애플리케이션 코드, 정식 데이터가 포함되어 있으므로 Node.js, 로컬 서버 또는 인터넷 연결이 필요하지 않습니다.

유지 관리자는 다음 명령으로 오프라인 파일을 다시 만들고 검증할 수 있습니다.

```powershell
npm run build:offline
npm run validate:offline
```

## 현재 마일스톤

- 7개 가져오기 단계에 걸친 로컬 식별 인물 580명(`person:sg:*`).
- 정치 또는 전쟁 간선을 포함하지 않는 부·모·배우자·양친·종족 관계 358건.
- 첫 진입 시 정식 인물 580명을 모두 프런트엔드 지도에 불러오며, 현재 범위의 관계가 없는 인물도 독립 노드로 표시.
- 『삼국지』와 배송지 주석으로 추적 가능한 인용.
- 검색, 관계 필터, 전체·1홉·2홉 보기를 제공하는 Cytoscape.js 그래프.
- 충돌 없는 간격, 분기 간선 경로 지정, 읽기 쉬운 포커스 확대, 전체 지도 맞춤을 갖춘 결정적 방사형 가족 분기 레이아웃.
- 멀리 축소했을 때 화면을 정리하고 그래프 도구 모음에서 강제로 표시할 수 있는 스마트 관계 라벨.
- 방향, 시기, 자격 조건, 증거 근거, 해석, 확실성, 이견, 결정, 검토 상태를 포함하는 관계 기록.
- 노드 펼치기·접기, 고정, 숨기기, 분기 분리, 실행 취소, 초기화.
- 필터에 따라 바뀌는 출전 수와 조작 가능한 출전 카탈로그.
- 하나로 섞인 신뢰 레이어가 아닌 독립적인 출전 체계 필터.
- 문맥 및 병음 일치를 활용한 동명이인 구분 검색과 두 인물 사이의 최단 경로.
- 외부 후보 데이터는 내부 연구 전용이며 공개 빌드에 포함하지 않음.
- 데스크톱과 모바일에 대응하는 레이아웃.

내부 연구용 외부 식별자는 프로젝트의 기본 키가 아니며, `confirmed` 관계의 근거가 될 수 없습니다.

## 사료 정책

- 정사, 주석 사료, 문학, 구조화 후보의 주장을 분리합니다.
- `certainty`는 주장 자체를, `reviewStatus`는 편집 검토 상태를 나타냅니다.
- `confirmed` 관계는 `verified`여야 하며 구조화 데이터셋이 아닌 역사 사료를 최소 한 건 인용해야 합니다.
- 후보 또는 프로그램에서 도출한 관계는 정식 관계 JSON에 기록하지 않습니다.
- 인용문과 출전을 만들어 내지 않습니다.

[주요 인물 범위](docs/MAJOR_PERSON_SCOPE.md), [사료 정책](docs/SOURCE_POLICY.md), [데이터 스키마](docs/DATA_SCHEMA.md)를 참고하세요.

## 로컬 개발

Node.js 18.18 이상과 npm이 필요합니다.

```powershell
npm install
npm run dev
```

전체 품질 검사는 다음과 같습니다.

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

프로덕션 Vite base path는 `/SanguoGraph/`입니다. 탐색에는 해시 라우트를 사용하므로 GitHub Pages에서 새로 고침할 때 서버 재작성 규칙이 필요하지 않습니다.

## 후보 데이터 파이프라인

커밋된 `data/processed` 레이어에는 99명과 Wikidata에서 파생된 미검증 후보 관계 738건이 들어 있지만 유지 관리자의 내부 연구 전용입니다. 일반 웹 빌드와 단일 파일 오프라인 빌드는 후보 레이어를 불러오거나 포함하지 않습니다.

재현 가능한 Python 파이프라인과 출처·라이선스 등록부는 [Candidate data pipeline](docs/CANDIDATE_PIPELINE.md)에 문서화되어 있습니다. CI는 처리된 파일을 JSON Schema와 고정 SHA-256 값으로 검증하며 Wikidata를 다시 내려받지 않습니다.

## 라이선스

소스 코드는 [MIT License](LICENSE)로 제공됩니다. SanguoGraph가 라이선스할 권한이 있는 정식 구조화 역사 데이터는 [CC BY 4.0](LICENSE-DATA)으로 제공됩니다. 재사용하거나 재배포할 때에는 “三国人物关系谱 · SanguoGraph”를 표시하고 라이선스 링크와 변경 여부를 밝혀야 합니다. 사료 인용문, 제3자 자료 및 내부 연구 후보는 이 데이터 라이선스 범위에 포함되지 않습니다.
