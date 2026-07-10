# FO-RULE

> 상태: 초안 — 계속 다듬는 중 (최종 확정 아님)
> 대상: FO(북미 홈페이지) 개발 전체를 아우르는 상위 규칙 문서. 아래는 그중 **slug 기반 화면 개발** 부분.

---

## 대상: slug 기반 화면 개발

bo "홈페이지관리"에서 관리하는 **PageData**(slug로 식별)를 fo 화면에 바인딩하는 작업 전체를 다룬다.

```
bo 홈페이지관리에서 콘텐츠 입력
        ↓
   PageData 저장 (slug로 식별, dataJson: { 섹션: { 필드: 값 } })
        ↓
   fo 컴포넌트의 data-slug/data-slugKey가 그 slug·필드를 가리킴
        ↓
   fo-fe-builder가 bo-api를 호출해 실제 값 렌더링
```

---

## 참고 문서

| 문서 | 역할 |
|---|---|
| `fo/docs/fo-data-binding.md` | 작업 목록 — fo 전체 tsx 파일 + slug 매핑표 |
| `fo/docs/fo-data-binding-가이드.md` | 마크업 태깅 규칙(단건/다건/속성바인딩) + 조회조건 규칙(where/orderBy/limit) + 작업 단위 문서 템플릿 |
| `docs/ge_guide/fo/fo-api연동가이드.md` | API 연동 공통 규칙 — 프록시 방식, 공통함수(`fetchApi`), 환경변수 |

---

## STEP 구성 및 담당 에이전트

| STEP | 내용 | 담당 에이전트 |
|---|---|---|
| STEP 1 | 마크업 태깅 — 대상 tsx 분석해서 `data-slug`/`data-slugKey`(+ 속성 바인딩 시 `data-slugKey-attr`) 실제 JSX에 추가 | `fo-slug-analyzer` |
| STEP 2 | 조회 조건 확인 — where(evalConditionExpr 문법), row limit, orderBy+정렬방향, 2차 정렬(tie-breaker) | `fo-slug-analyzer` |
| STEP 3 | 작업 단위 문서 작성 — `fo/docs/dev/{섹션}/{파일}.md`, "API 확인"(신규/기존) 필수 체크, 승인 대기 | `fo-dev-doc-writer` |
| STEP 4 | BO/BO-API 분석·설계 — 기존 API/서비스/엔티티로 처리 가능한지 판단, 신규 필요 시 재사용 범위·쿼리(where/orderBy/limit)·엔드포인트 설계 | `fo-be-analyzer` |
| STEP 5 | BE 개발 — STEP4 설계대로 bo-api(Java/Spring) 실제 구현, 재사용 가능한 서비스 로직은 새로 안 만듦 | `fo-be-builder` |
| STEP 6 | FE 개발 — STEP5 결과(실제 엔드포인트/응답) 기반 fo `fetchApi` 연동 + data-slug/data-slugKey 마크업 바인딩, `fo-api연동가이드.md` 체크리스트 준수 | `fo-fe-builder` |
| 검증 | fo(3002) 브라우저에서 실제 데이터 반영 확인 (data-slugKey 값, where/orderBy/limit 동작) | `fo-qa-validator` |
| (수시) | 위 문서들 간 정합성 점검 — STEP 충돌, 경로 표기, 예시/실제 파일 혼재, 미검증 단정 여부 | `fo-doc-consistency-reviewer` |

전체 조율/진입점: `fo-orchestrator`

---

## 핵심 원칙

1. **임의 결정 금지** — data-slug/data-slugKey 이름, where/orderBy 값, 문서 구조 등 확실하지 않은 것은 먼저 채우지 말고 그 즉시 질문한다.
2. **미검증 사실 단정 금지** — bo `SlugRegistry`/`PageData` 실존 여부처럼 직접 확인 불가능한 것은 "확인 필요"로 명시한다.
3. **orderBy 없이 다건 매칭 결과 확정 금지** — where 조건에 여러 행이 매칭될 수 있으면 반드시 정렬 기준(+ 필요 시 2차 정렬)을 명시한다.
4. **예시 문서와 실제 작업 문서 분리** — 템플릿 예시는 `fo/docs/dev/_examples/`에만 둔다.
5. **data-slug 값은 에이전트가 짓지 않는다** — slug 값은 사용자(또는 bo Slug 레지스트리에 이미 등록된 값)가 지정하는 것이며, 어떤 에이전트도 임의로 slug명을 짓거나 후보를 확정처럼 제시하지 않는다. 값이 없으면 TODO로 비워둔다.

---

## 진행 상태 (예시)

| 대상 | 문서 | 상태 |
|---|---|---|
| Main Visual(공지 섹션) | `fo/docs/dev/main/main-visual.md` | 설계중 — `banner-data` slug 실존 확인 대기 |
