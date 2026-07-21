# FO-RULE

> 상태: 초안 — 계속 다듬는 중 (최종 확정 아님)
> 대상: FO(북미 홈페이지) 개발 전체를 아우르는 상위 규칙 문서.

---

## FO 실행명령어 분류

`.claude/CLAUDE.md`의 빌더 분류(0-1~0-5)와 동일한 체계로, FO 작업은 아래 3개 실행명령어로 분류한다. 셋 다 진입점은 `fo-orchestrator`이며, 명령어 없이 임의로 작업을 시작하지 않는다.

| 실행명령어 | 대상 | 상세 STEP 근거 문서 |
|---|---|---|
| `#FO소스머지` | PUB(ls-publish) → FO 소스 이관. 공통컴포넌트/공통함수/공통로직 적극 사용(억지 공통화 금지, 서브에이전트들의 합리적인 합의로 도출) | `fo/docs/fo-data-binding-가이드.md` STEP 0-0(fo-page-analyzer)→0-1(fo-page-migrator)→0-2(fo-common-refactor) |
| `#FO데이터바인딩` | data-slug/data-slugkey를 사용한 PageData 데이터 바인딩. 아래 "대상: slug 기반 화면 개발" 절 참고 | 본 문서 STEP1~6 |
| `#FO화면개발수정` | slug 아닌 개념(GNB 메뉴 등 일반 API) FO 화면 개발/수정 | `docs/ge_guide/fo/fo-api연동가이드.md` 5장 STEP1~3 |

`#FO소스머지`의 공통화(STEP0-2) 판단은 LLM 육안 검토만으로는 반복 패턴을 놓칠 수 있어, `fo/`에 설치된 `jscpd`(`npm run dup-check`)로 중복 코드를 수치 근거로 먼저 확인한 뒤 `fo-common-refactor`가 최종 판단한다. 수치가 높다고 억지로 묶지 않는다(핵심 원칙 그대로 유지).

---

## 대상: slug 기반 화면 개발 (`#FO데이터바인딩`)

bo "홈페이지관리"에서 관리하는 **PageData**(slug로 식별)를 fo 화면에 바인딩하는 작업 전체를 다룬다.

```
bo 홈페이지관리에서 콘텐츠 입력
        ↓
   PageData 저장 (slug로 식별, dataJson: { 섹션: { 필드: 값 } })
        ↓
   fo 컴포넌트의 data-slug/data-slugkey가 그 slug·필드를 가리킴
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
| STEP 1 | 마크업 태깅 — 대상 tsx 분석해서 `data-slug`/`data-slugkey`(+ 속성 바인딩 시 `data-slugkey-attr`) 실제 JSX에 추가 | `fo-slug-analyzer` |
| STEP 2 | 조회 조건 확인 — where(evalConditionExpr 문법), row limit, orderBy+정렬방향, 2차 정렬(tie-breaker) | `fo-slug-analyzer` |
| STEP 3 | 작업 단위 문서 작성 — `fo/docs/dev/{섹션}/{파일}.md`, "API 확인"(신규/기존) 필수 체크, 승인 대기 | `fo-dev-doc-writer` |
| STEP 4 | BO/BO-API 분석·설계 — 기존 API/서비스/엔티티로 처리 가능한지 판단, 신규 필요 시 재사용 범위·쿼리(where/orderBy/limit)·엔드포인트 설계 | `fo-be-analyzer` |
| STEP 5 | BE 개발 — STEP4 설계대로 bo-api(Java/Spring) 실제 구현, 재사용 가능한 서비스 로직은 새로 안 만듦 | `fo-be-builder` |
| STEP 6 | FE 개발 — STEP5 결과(실제 엔드포인트/응답) 기반 fo `fetchApi` 연동 + data-slug/data-slugkey 마크업 바인딩, `fo-api연동가이드.md` 체크리스트 준수 | `fo-fe-builder` |
| 검증 | fo(3002) 브라우저에서 실제 데이터 반영 확인 (data-slugkey 값, where/orderBy/limit 동작) | `fo-qa-validator` |
| (수시) | 위 문서들 간 정합성 점검 — STEP 충돌, 경로 표기, 예시/실제 파일 혼재, 미검증 단정 여부 | `fo-doc-consistency-reviewer` |

전체 조율/진입점: `fo-orchestrator`

---

## 핵심 원칙

1. **임의 결정 금지** — data-slug/data-slugkey 이름, where/orderBy 값, 문서 구조 등 확실하지 않은 것은 먼저 채우지 말고 그 즉시 질문한다.
2. **미검증 사실 단정 금지** — bo `SlugRegistry`/`PageData` 실존 여부처럼 직접 확인 불가능한 것은 "확인 필요"로 명시한다.
3. **orderBy 없이 다건 매칭 결과 확정 금지** — where 조건에 여러 행이 매칭될 수 있으면 반드시 정렬 기준(+ 필요 시 2차 정렬)을 명시한다.
4. **예시 문서와 실제 작업 문서 분리** — 템플릿 예시는 `fo/docs/dev/_examples/`에만 둔다.
5. **data-slug 값은 에이전트가 짓지 않는다** — slug 값은 사용자(또는 bo Slug 레지스트리에 이미 등록된 값)가 지정하는 것이며, 어떤 에이전트도 임의로 slug명을 짓거나 후보를 확정처럼 제시하지 않는다. 값이 없으면 TODO로 비워둔다.
6. **STEP4(bo 실데이터 확인)를 앞당겨라** — slug 값이 이미 정해져 있다면, STEP1~3(마크업 태깅·문서화)에 들어가기 전에 STEP4에서 하는 확인(bo Slug 레지스트리에 그 slug가 실제 등록돼 있는지, 실제 dataJson 필드 구조가 무엇인지)을 먼저 스팟체크한다. 이 확인을 STEP4까지 미루면, STEP1~3에서 만든 마크업·문서가 실제 bo 데이터 모델과 달라 통째로 재작업될 수 있다(예: slug 철자가 등록값과 다르거나, 설계한 리치 콘텐츠 구조와 실제 bo 데이터가 단순 목록형이라 안 맞는 경우).
7. **FO 공개 API엔 단건조회(getById)가 없다** — `FoPageDataController`는 목록검색(search)만 제공한다. 글 1건 조회나 인접 레코드(이전/다음)가 필요할 때 `eq_id`로 목록 API를 재사용하지 말 것(PK 인덱스 미사용, 게시 상태 게이트 별도 처리 필요). 전용 단건/인접 엔드포인트를 신설한다 — 구현 예시: `PageDataService.findPublicDetail/findAdjacent`, `FoPageDataController`의 `GET /page-data/{slug}/{id}`, `GET /page-data/{slug}/{id}/adjacent` (company/blog 등 참고).

---

## 진행 상태 (예시)

| 대상 | 문서 | 상태 |
|---|---|---|
| Main Visual(공지 섹션) | `fo/docs/dev/main/main-visual.md` | 설계중 — `banner-data` slug 실존 확인 대기 |
