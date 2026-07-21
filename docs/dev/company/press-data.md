# Company Press 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/press/page.tsx` (목록 — 현재 `<CompanyFeedPage variant="press" />` 한 줄뿐. Press/Articles 완전 공용 컴포넌트라 반복/필드 렌더 지점 자체가 없어 마크업 태깅 불가)
> - `fo/src/app/company/components/CompanyFeedPage.tsx` / `CompanyFeedFeatured.tsx` / `CompanyFeedListSection.tsx` / `CompanyFeedListGrid.tsx` (공용 컴포넌트 — press/articles와 공유, 직접 태깅 대상 아님. Featured·리스트 필드는 STEP6에서 fetchApi 결과를 props로 직접 주입)
> - `fo/src/app/company/press/detail/page.tsx` (상세 — `data-slug="press-data"` + `data-slugkey="content"` 태깅 완료, STEP1)
> - `fo/src/app/company/components/CompanyArticleDetail.tsx` (공용 컴포넌트 — blog/press/events/articles가 공유, 직접 태깅 대상 아님)
> - 참고(정적 폴백 데이터, 실연동 전): `fo/src/app/company/data/pressListContent.ts`, `fo/src/app/company/data/pressDetailContent.ts`
> 상태: 구현 완료 (QA 검증 완료, 비차단 이슈는 blog-data와 동일 — 8절 참고) / 필터·검색·정렬·월/연도 확장 구현+API 검증 완료(2026-07-14, 브라우저 UI 검증은 미완 — 9절 참고) / **정렬 A-Z/Z-A 확장 설계중(2026-07-21, 승인 대기 — 9절 C-2 참고)** / **Featured 독립조회+목록 제외조건+Month·Year 옵션 조정: 구현·검증 완료(2026-07-21, 브라우저 실검증 완료 — 10절 참고)** / **상세조회·pager(이전글/다음글) 성능개선 설계중(2026-07-21, 승인 대기 — 11절 참고)**

## 1. data-slug
- 값: `press-data` (목록 Featured / 목록 리스트 / 상세 전부 동일 slug 재사용 — 별도 분리 없음)
- 다건 여부: 혼합 — Featured **단건**(2026-07-21부터 독립 조회로 변경 — 목록 리스트와 별개로 `publish_dttm` DESC 정렬 1건을 직접 조회. 기존 "정렬된 목록의 1번째 글 재사용" 방식은 폐기, 10절 참고) / 리스트 **다건(배열)** / 상세 **단건**(id 기반 조회)

## 2. data-slugkey 매핑

> ⚠️ press-data는 blog-data와 달리 **category 필드 자체가 없다**(`press/page.tsx` 및 `CompanyArticleDetail`의 `CompanyArticleDetailPressProps` 타입 확인 결과 press variant는 `category?: never` — 코드 레벨에서 category를 아예 받지 않도록 막혀 있음). 아래 매핑에도 category는 등장하지 않는다.

### 2-1. 상세 — 본문 (단건, `press/detail/page.tsx`, ✅ STEP1 마크업 태깅 완료)

```html
<!-- data-slug: press-data (목록·상세 통합 slug). 상세 본문은 리치텍스트 HTML 단일 필드 content로 태깅 -->
<div className={articleDetailClass("body")} data-slug="press-data">
  <div data-slugkey="content">
    <!-- 문단/영상(iframe 포함) 전체를 하나로 묶은 리치텍스트 HTML -->
  </div>
</div>
```

| slugKey | dataJson 필드(추정 accessor) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| content | `pressForm.content` | string(HTML, 리치텍스트) | 텍스트(`innerHTML`) | ✅ 실데이터(최신 스키마 2건)로 필드명 확인됨. 기존에는 `pressDetailYoutube` + `DevicesProductVideoPlayer`(`afterHero` prop)로 영상을 별도 필드로 관리했으나, 이번 결정으로 **폐기** — 영상은 content 리치텍스트 HTML 안에 이미 포함된 iframe으로 통합 처리(사용자 승인 완료). STEP6에서 `afterHero`/`pressDetailYoutube` 참조 제거 필요 |

### 2-2. 마크업 태깅 불가 — STEP6(FE 개발)에서 fetchApi로 props 직접 교체 처리 대상

아래 필드는 전부 공용 컴포넌트(`CompanyFeedFeatured`/`CompanyFeedListGrid`/`CompanyArticleDetail`) 내부에서 렌더되며, 호출부(`press/page.tsx`, `press/detail/page.tsx`)의 DOM에는 노출되지 않아 `data-slug`/`data-slugkey` 마크업 태깅이 불가능하다(STEP1에서 확인). STEP6에서 `fetchApi`로 조회한 값을 각 공용 컴포넌트의 props로 직접 전달하는 방식으로 처리한다.

| 영역 | 필드 | 현재 전달 방식 | dataJson 필드(추정 accessor) | 비고 |
|---|---|---|---|---|
| Featured(단건) | id | `CompanyFeedFeatured`의 `href` prop(현재 정적 `/company/press/detail` 고정) | `id`(top-level) | id 기반 동적 라우트로 변경 필요(6번 비고 참고, STEP6 범위) |
| Featured(단건) | image | `CompanyFeedFeatured`의 `image` prop | `pressForm.image[0]` | `/api/v1/fo/page-files/{id}`로 렌더 예상(STEP4 확인 필요) |
| Featured(단건) | title | `CompanyFeedFeatured`의 `title` prop | `pressForm.title` | |
| Featured(단건) | description | `CompanyFeedFeatured`의 `description` prop | `seo.metaDescription` | pressForm에 별도 description 필드 없음 — blog-data.md STEP4에서 press-data 샘플도 함께 확인해 동일 설계임을 이미 검증(seo 메타 설명 재사용) |
| Featured(단건) | date | `CompanyFeedFeatured`의 `date` prop | `press.publish_dttm` | STEP4(fo-be-analyzer, 2026-07-21) Featured 정렬 작업 중 실측 정정 — 컨테이너는 `pressForm`이 아니라 `press`, 필드는 snake_case `publish_dttm`이다(기존 문서의 `pressForm.publishDttm` 표기는 오탈자). dot-path `sort=press.publish_dttm,desc`로 확인 |
| 리스트(다건) | id | `CompanyFeedListGrid`의 `Link[href]`(현재 `detailHref` 고정값 `/company/press/detail`, item.id 미반영) | `id`(top-level) | id 기반 동적 라우트로 변경 필요(6번 비고 참고) |
| 리스트(다건) | image | `CompanyFeedListGrid`의 `item.image` | `pressForm.image[0]` | |
| 리스트(다건) | title | `CompanyFeedListGrid`의 `item.title` | `pressForm.title` | |
| 리스트(다건) | date | `CompanyFeedListGrid`의 `item.date` | `press.publish_dttm` | 리스트에는 description 없음(`CompanyFeedListItem` 타입에 description 필드 자체가 없음, 코드 확인 완료). STEP4(2026-07-21) 실측 정정 — 컨테이너 `press`, snake_case `publish_dttm`(기존 `pressForm.publishDttm` 표기는 오탈자, Featured와 동일 필드 공유) |
| 상세 | title | `CompanyArticleDetail`의 `title` prop | `pressForm.title` | |
| 상세 | date | `CompanyArticleDetail`의 `date` prop | `press.publish_dttm` | press variant는 `date` 단독 표기(blog/articles의 category+date 헤더와 다름, `detailMeta`(venue/dates)는 타입상 옵션이지만 현재 미사용). Featured/리스트와 동일 필드를 재사용하므로 STEP4(2026-07-21) 정정을 동일하게 반영(컨테이너 `press`, snake_case `publish_dttm`) |
| 상세 | heroImage | `CompanyArticleDetail`의 `heroImage` prop | `pressForm.image[0]` | ✅ 별도 heroImage 필드 없음(14건 전부 확인) — 리스트/Featured와 동일 필드 재사용 확정 |
| 상세 | pager(prev/next: id·title) | `CompanyArticleDetail`의 `prev`/`next` prop | (관계형, 별도 필드 아님) | 공용 컴포넌트 내부의 `<nav>`이며 slug 래퍼(`<div data-slug>`) 바깥의 형제 요소라 wrapper 태깅도 불가. "현재 글 자체의 필드"가 아니라 "정렬 순서상 인접 레코드로의 링크"인 관계형 데이터임(blog-data.md와 동일 사유). **(2026-07-21 갱신)** prev/next 값의 조회 방식이 신규 인접글 전용 엔드포인트(10절)로 변경됨 — 기존 FE index 계산 방식(Option A)은 폐기 |

## 3. API 확인 (최종 체크 — STEP4 완료, 실제 API 호출로 재검증됨)
- 신규 API 필요 여부: **불필요** — blog-data와 동일하게 기존 FO 공개 API로 전부 처리 가능
- 목록: `GET /api/v1/fo/page-data/press-data?page=0&size=10&eq_pressForm.isVisible=001` (`FoPageDataController` → `PageDataService.search()` 재사용) — 실제 호출로 8건 반환 확인(전체 14건 중 공개 8건)
- 상세(단건): `GET /api/v1/fo/page-data/press-data?eq_id={id}&eq_pressForm.isVisible=001` — `eq_id=1541` 호출로 1건 정확 반환 확인. **⚠️ 2026-07-21 갱신**: 상세 전용 성능개선 엔드포인트(신규, 10절)로 대체 예정 — 상세 설계는 10절 참고
- 이미지: `GET /api/v1/fo/page-files/{fileId}` (`FoPageFileController` 재사용, blog-data와 동일)
- `flattenPageDataItem`(`fo/src/lib/pageData.ts`) 그대로 재사용 — `pressForm`/`seo` 섹션 간 키 충돌 없어 flat 병합 정상 확인

## 4. 조회 조건

> ⚠️ 2026-07-21 변경 사항(Featured 독립조회, 목록 제외조건 `ne_id`, 목록 row limit 9)은 **10절** 참고. 아래 값은 ~2026-07-14 기준 확정 값이며 9절(A~D-2) 필터 확장분까지 반영된 상태다.

- where(필터 조건식): `eq_pressForm.isVisible=001`(공개글만 고정) — 실제 API 호출로 동작 검증 완료(14건 중 8건 반환)
  - ⚠️ blog-data와의 차이: **category 필터 없음.** press-data 폼에는 category 필드 자체가 존재하지 않음(2번 항목 상단 확인 사항 참고)
- row limit(단건 / 다건 개수): 리스트(다건) — `size=10` 페이지네이션(blog-data와 통일, BE가 강제하지 않고 FE 파라미터로 결정) / Featured는 정렬된 목록의 1번째 글을 그대로 재사용(단건, 별도 selection 관리 없음) / 상세는 `eq_id={id}` 단건조회 — 실제 API로 검증 완료
- orderBy(정렬 필드 + ASC/DESC): 생성일 DESC — 파라미터 없이 `PageDataService` 기본값, 실제 응답 순서(1541→1350→1316...)로 검증 완료
- 2차 정렬(tie-breaker): **불필요** — 실데이터 14건의 `created_at`이 마이크로초까지 전부 고유해 tie 발생 불가 확인(blog-data와 동일 결론)

## 5. 샘플 응답 데이터

> ✅ 아래는 **실제 API 호출 결과**(`GET /api/v1/fo/page-data/press-data?size=20&eq_pressForm.isVisible=001`, STEP4에서 재검증)를 옮긴 것 — 추정 아님.

```json
{
  "content": [
    {
      "id": 1541,
      "templateSlug": "press-detail",
      "dataJson": {
        "id": 1541,
        "seo": { "slug": "validation-check", "metaTitle": "Validation check", "metaDescription": "qwecczxczxczxczxc" },
        "pressForm": {
          "image": [242],
          "title": "Validation check",
          "views": "8",
          "content": "<p>qwecczxczxczxczxc</p>",
          "markets": "001",
          "isVisible": "001",
          "publishDttm": "2026-07-10"
        },
        "productList": [1532, 1531]
      },
      "createdAt": "2026-07-10T01:32:55.428547Z",
      "updatedAt": "2026-07-10T01:32:58.647566Z"
    }
  ],
  "totalElements": 8,
  "page": 0,
  "size": 20
}
```

> ⚠️ 위 JSON은 2026-07-14 캡처 당시 원본 그대로이며 `pressForm.publishDttm`으로 기록되어 있으나, STEP4(fo-be-analyzer, 2026-07-21) Featured 정렬 작업에서 재검증한 결과 실제 저장/정렬 기준 필드는 `press.publish_dttm`(컨테이너 `press`, snake_case)임이 확인됐다. 원본 캡처 JSON은 수정하지 않고 그대로 남기되, 아래 FE 참조 경로는 정정된 표기를 따른다.

FE 바인딩 시 참조 경로: `content[i].id` / `content[i].dataJson.pressForm.{title|content|isVisible|image[0]}` / `content[i].dataJson.press.publish_dttm`(STEP4(2026-07-21) 실측 정정 — 컨테이너는 `pressForm`이 아니라 `press`, snake_case `publish_dttm`. 기존 `pressForm.publishDttm` 표기는 오탈자) / `content[i].dataJson.seo.metaDescription`(description 대체). `category`/`tags`/`heroImage` 전용 필드는 press-data에 없음.

## 6. 비고
1. `CompanyFeedFeatured`/`CompanyFeedListGrid`/`CompanyArticleDetail`은 press뿐 아니라 articles(및 blog·events)와 공유하는 공용 컴포넌트라 직접 `data-slug` 태깅 대상이 아니다. 관련 필드는 STEP6에서 fetchApi 결과를 props로 직접 주입하는 방식으로 처리(2-2 참고).
2. 상세 페이지 이동 링크(Featured/리스트)와 상세 페이지 자체 라우트가 모두 현재 정적 고정 경로(`/company/press/detail`)다. id 기반 동적 라우트(예: `/company/press/detail/[id]` 등, 실제 경로 규칙은 STEP6에서 결정)로 변경이 필요하며, blog-data.md에서 동일하게 처리된 사례를 참고할 수 있다.
3. **알려진 데이터 상태(코드 버그 아님)**: press-data 전체 14건 중 신규 스키마(`pressForm.{image,title,content,publishDttm,...}`) 일치는 3건(id 1541/1350/1316)이나, 그중 1316은 `isVisible=002`(비공개)라 공개 목록(`eq_pressForm.isVisible=001`, 8건)에는 **2건(1541, 1350)만** 신규 스키마로 노출된다. 나머지 6건(공개 8건 기준)은 필드명이 제각각(`pressImage`/`pressTitle`/`pressPubDttm`/`pressPublishDttm` 등)이다. **FE에 레거시 스키마 호환 코드를 추가하지 않기로 이미 결정됨**(blog-data.md 8절 1항과 동일 원칙 — 오래된 테스트 데이터를 위한 영구적 이중 스키마 유지비용이 더 크다고 판단). 사용자가 BO 관리자 화면에서 해당 레코드를 현재 폼으로 재저장하면 자동 해결되며, 이는 데이터 정리 작업이지 코드 변경 사항이 아니다.
4. `markets`, `productList` 필드는 pressForm에 존재하는 것으로 보이나(최신 스키마 2건 기준) 현재 어떤 화면에도 렌더링되지 않는다 — 이번 스코프 밖(참고만 기록, 별도 slugKey 매핑 없음).
5. Month/Year/검색/정렬 툴바(`CompanyFeedListToolbar`)는 현재도 완전히 비연동 정적 UI이며, 이번 스코프에도 포함하지 않는다(건드리지 않음). (⚠️ 이 문장은 2026-07-14 시점 기준 — 이후 9절/10절에서 순차적으로 연동 스코프에 포함됨)
6. 영상 처리 방식 변경: 기존 `pressDetailYoutube` + `DevicesProductVideoPlayer`(`afterHero` prop) 별도 필드 방식을 폐기하고, `content` 리치텍스트 HTML 안에 이미 포함된 iframe으로 통합 처리하기로 결정(사용자 승인 완료, 2-1 참고). STEP6에서 `press/detail/page.tsx`의 `afterHero`/`pressDetailYoutube` import 제거 필요.
7. `pressDetailContent.ts`의 `pressDetailMeta`(venue/dates)는 `CompanyArticleDetail`의 press variant가 타입상 `detailMeta`를 옵션으로 허용하나 현재 `press/detail/page.tsx`에서 실제로 전달되지 않는 미사용 상수다 — 이번 스코프에서 다루지 않음.
8. ✅ **heroImage 소스 — 해결됨**: 별도 필드 없음, `pressForm.image[0]` 재사용 확정(STEP4 실데이터 확인).
9. ✅ **row limit — 해결됨**: `size=10`으로 blog-data와 통일(BE 미강제, FE 파라미터 결정). (⚠️ 2026-07-21부터 목록 row limit이 9로 변경 — 10절 참고)
10. ✅ **2차 정렬(tie-breaker) — 해결됨**: 불필요(실데이터 `created_at` 전부 고유, STEP4 확인).
11. **로컬 환경 이미지 404(코드 문제 아님)**: `page-files/{id}` 실호출 시 로컬에 404 — `file-storage: local` 프로필인데 실제 업로드 파일(`C:/uploads`)이 로컬에 없어서 발생. blog-data에서도 동일 현상 확인됨 — 이 개발 PC 공통 환경 이슈이며 엔드포인트/FE 코드는 정상.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-14 | `press/detail/page.tsx`에 `data-slug="press-data"` + `data-slugkey="content"` 태깅 완료(리치텍스트 HTML 단일 필드, 영상 iframe 통합 포함 결정). `press/page.tsx`는 `CompanyFeedPage` 공용 컴포넌트 한 줄뿐이라 마크업 태깅 지점 자체가 없음을 확인 — Featured/리스트(id/image/title/description/date)와 상세 title/date/heroImage/pager는 태깅 불가로 STEP6 props 주입 대상 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-14 | where(`isVisible=001` 고정, category 필터 없음 확인 — press-data엔 category 필드 자체 없음), orderBy(생성일 DESC 기본값), row limit(Featured=정렬목록 1번째 / 리스트=다건 페이지네이션, 정확한 개수는 STEP4 확인 필요 / 상세=id 단건) 확정. 실데이터 14건 중 최신 스키마 일치 2건, 레거시 필드명 변형 12건 발견 — FE 레거시 호환 코드 미추가 결정(사용자 승인) |
| STEP3 | fo-dev-doc-writer | 2026-07-14 | 작업 단위 문서 작성(상태: 설계중). API 확인 결과 "확인 필요"로 명시, 샘플 응답 데이터는 "추정"으로 명시, heroImage 소스/row limit/tie-breaker 등 미해결 항목 6번 비고에 기록 |
| STEP4 | fo-be-analyzer | 2026-07-14 | 신규 BE 불필요 확인(기존 FO API 3종 재사용). 실제 API 호출로 재검증(공개 8건, isVisible 필터·id 단건조회·created_at DESC 정렬 전부 실증). heroImage=image[0] 재사용 확정, tie-breaker 불필요 확정, row limit 10 확정. 로컬 이미지 404는 환경 이슈(코드 아님)로 확인 |
| STEP6 | fo-fe-builder | 2026-07-14 | 실데이터 연동 완료. `pressData.ts` 신설(blogData.ts 이식, category/hashtag 로직 제외), `press/page.tsx`(공용 CompanyFeedFeatured/ListSection에 실데이터 props 주입) + 신규 `press/detail/[id]/page.tsx` 작성. `pressDetailYoutube`/`DevicesProductVideoPlayer`/`afterHero` 제거(영상은 content HTML 내 iframe으로 통합). `CompanyArticleDetail`의 미사용 `afterHero` prop 제거, `CompanyFeedListItem.href?`/`CompanyFeedListSection.onPageChange?` optional 필드 추가(articles 하위호환 유지, articles 코드는 미변경). `tsc --noEmit` 통과 |
| QA | 호출자(Playwright 직접 검증) | 2026-07-14 | pub↔fo 목록/상세 스크린샷 비교 + accessibility snapshot 확인. Featured+리스트 7건 렌더(신규 스키마 3건 정상, 레거시 5건은 알려진 데이터 이슈로 텍스트 공백+폴백 이미지), 상세 title/date/content/pager(최신글이라 PREV 없음, NEXT만 정상) 전부 설계대로 동작 확인. Featured 이미지 미노출은 blog와 동일한 로컬 `page-files` 404(환경 이슈) |
| STEP1 | fo-slug-analyzer | 2026-07-21 | Featured 독립조회 전환(목록과 별개로 `publish_dttm` DESC 1건), 목록 제외조건(Featured id를 목록에서 항상 제외), Month 필터 옵션 축소(Jun~Oct 5개), Year 필터 옵션 동적화(2017~현재) — 사용자와 다회 확인을 거쳐 대상·범위 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-21 | where/orderBy/row limit 확정: Featured=`publish_dttm DESC` 단건, 게시상태 조건만 적용(search/sort/month/year 미적용) / 목록=기존 검색·정렬·월·연도 필터 유지 + Featured id 제외(`ne_id`) + `size=9` / Month·Year 드롭다운 옵션 범위 사용자 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-21 | 10절 신설(상태: 설계중). API 확인 결과 명시 — Featured 독립조회는 기존 엔드포인트 파라미터만 다르게 재사용(신규 API 불필요), 목록 제외조건(`ne_id`)은 PageDataService에 not-equal 파라미터가 없어 **신규 API 필요**로 확정, Month/Year 옵션은 FE 전용(BE 변경 없음) |
| STEP4 | fo-be-analyzer | 2026-07-21 | Featured 정렬(publish_dttm 하위키 확인, dot-path `sort=press.publish_dttm,desc`로 해결, BE 정렬로직 변경 불필요), 실저장 필드명 snake `press.publish_dttm`(신규 스키마) 확정, `ne_id` 설계 확정(eq_ 미러링 아닌 최상위 전용 NULL-safe `IS DISTINCT FROM`), 툴바 옵션 props 주입 방식 확정 |
| STEP5 | fo-be-builder | 2026-07-21 | `PageDataService.java`에 `ne_` 접두사 신규 구현(appendWhereConditions/bindSearchParams 2곳, eq_ 블록 직후). 실제 API 호출로 제외동작+회귀(eq_/month_/year_/타slug) 전부 검증 완료 |
| STEP6 | fo-fe-builder | 2026-07-21 | `PRESS_LIST_SIZE` 9로 변경, `fetchPressFeatured()` 신설(전역 최신 1건, 필터 무관), `fetchPressList`에 `excludeId`→`ne_id` 연동, 클라이언트 수동 제외필터 제거(BE로 대체), `CompanyFeedListToolbar`를 monthOptions/yearOptions props 주입 구조로 리팩터(press 2017~/articles 2025~ 동적 연도, Month 공통 Jun~Oct 5개) |
| QA | fo-qa-validator | 2026-07-21 | 브라우저 실검증 9개 항목 전부 통과(Featured 전역고정, 목록 제외, 9개 페이징, Month 5개, Year 2017~2026, articles Year 2025~2026, 콘솔에러 없음) |
| STEP3.5(성능개선) | fo-dev-doc-writer | 2026-07-21 | 상세 페이지 진입 3~4초 지연 문제 해결을 위해 상세조회/pager를 Option B(신규 BE 엔드포인트 2개)로 재설계 — 상세 단건 `GET /api/v1/fo/page-data/press-data/{id}`, 인접글 `GET /api/v1/fo/page-data/press-data/{id}/adjacent`. 기존 Option A(FE index 계산) 폐기 결정 문서화(상태: 설계중, 승인 대기, 11절 참고) |

## 9. 필터·검색·정렬 확장 (2026-07-14 신규 스코프, 설계 확정·승인 완료·개발 완료)

### 배경
`/bo/admin/widget/press-list` 관리자 화면을 Playwright로 직접 조작해 네트워크 요청을 실측한 결과, BO의 "게시상태" 판정식(`isVisible=001,publishDttm>=today()?'게시':'미게시'`)이 FO where 조건에는 반영되어 있지 않음을 확인(4절의 `eq_pressForm.isVisible=001`만 있고 `publishDttm` 조건 없음). 이 문제를 계기로 FO 툴바(검색·정렬)와 BO 위젯 검색 필드(`press-list`/`blog-list` templateJson) 전체를 재분석했다.

### A. 게시상태 조건 수정 (버그 픽스)
- 기존 where `eq_pressForm.isVisible=001`을 **BO와 동일한 조건식으로 교체**: `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시`
- ⚠️ 방향 확정: `publishDttm`은 "게시 시작일시"이며, **이미 지난(과거) 날짜여야 노출**된다. 조건은 `publishDttm<=today()`(작거나 같음)이 맞다(blog-data.md 9-A와 동일 사유).
- `PageDataService.appendWhereConditions()`의 `condexpr_`/`condval_` 처리(기존 기능, BO 위젯 검색 필드가 이미 사용 중)를 그대로 재사용 — **BE 변경 없음**. isVisible=001 조건이 이 식 안에 포함되어 있어 별도 `eq_` 파라미터 불필요.
- 실측 검증: BO `press-list`/`blog-list` 위젯에서 "게시상태=게시"로 검색 시 위 파라미터가 실제로 전송되는 것을 네트워크 요청으로 확인(2026-07-14).

### B. 검색 — 제목 + 본문
- 파라미터: `title|content=검색어` (`pressForm.title`/`pressForm.content`가 아니라 접두어 없는 단순 키 — `PageDataService`가 최상위 1단계 중첩 object까지 자동 탐색하는 `|` OR-ILIKE 기능(기존 기능, 1152~1171행)을 그대로 재사용)
- **BE 변경 없음** — 라이브 API 실측으로 검증 완료: `title|content=aaaaa` 호출 시 title에는 없고 content에만 있는 문자열로 정상 매칭되는 것을 확인(2026-07-14).
- FE 대상: `CompanyFeedListToolbar.tsx`의 검색 `TextField`(현재 `value`/`onChange`/제출 핸들러 전혀 없는 장식 UI) — press variant에 한해 연동. articles variant는 이번 스코프 아님(사용자 확인 필요 시 별도 진행).

### C. 정렬 — Latest / Oldest
- 파라미터: `sort=createdAt,desc`(Latest) / `sort=createdAt,asc`(Oldest)
- `PageDataService`의 기존 `sort` 파라미터(감사 컬럼 매핑) 재사용 — **BE 변경 없음**
- FE 대상: `CompanyFeedListToolbar.tsx`의 정렬 `GuideSelect`(현재 `defaultValue="Latest"`만 있고 `onChange` 없음) — press variant 연동

### C-2. 정렬 확장 — A-Z / Z-A (2026-07-21 신규 스코프, 설계중·승인 대기)
- 정렬 옵션: 기존 Latest/Oldest(2종) → **Latest/Oldest/A-Z/Z-A(4종)**로 확장
  - Latest: 기존 유지(파라미터 생략) / Oldest: 기존 유지(`sort=createdAt,asc`)
  - A-Z: `sort=press.title,asc` / Z-A: `sort=press.title,desc`
- title 정렬 경로: `press.title` — `PageDataService`의 `sort` dot-notation 규칙(`<래퍼키>.title` → `ORDER BY data_json->'<래퍼키>'->>'title'`)에 따라 확정. dev DB 실측(bare 래퍼 + title 구조)으로 확인됨(STEP1)
- ⚠️ 참고: 위 2~9절에는 press 필드 accessor가 `pressForm.xxx`(폼 래퍼)로 기록돼 있다. blog-data.md에서는 실제 FE 코드(`blogData.ts`)가 이미 `blogForm` 대신 `blog`(bare 래퍼)로 카테고리 필터를 호출 중임을 코드로 확인했다 — press-data.ts에는 아직 title/래퍼 기반 필터·정렬 코드가 없어 동일한 대조 확인은 못 했으나, title 정렬 경로가 `press.title`이라는 이 STEP1 사실과 `pressForm.title` 표기가 병존하는 점은 **STEP3에서 함께 정리 필요**
- Featured 처리: 정렬된 목록의 1번째 글을 상단 Featured로 올리고 리스트에서 제외하는 기존 로직은 변경 없이 유지 — A-Z 정렬 시 알파벳상 가장 앞선 글이 Featured가 되는 것을 허용하며 별도 고정/예외 처리는 두지 않음
- FE sort 상태 타입: `"latest" | "oldest"` → `"latest" | "oldest" | "az" | "za"`로 확장 필요
- FE 대상: `CompanyFeedListToolbar.tsx`의 정렬 `GuideSelect` MenuItem에 A-Z/Z-A 옵션 추가(라벨 "A-Z"/"Z-A"). 이 컴포넌트는 press/articles가 공유하므로 이번 변경은 두 slug(press-data/articles-data) 모두에 동시 반영됨(articles-data.md 해당 절 참고)
- API 확인: **기존 활용 가능(잠정) — 확인 필요/검증 예정.** `PageDataService`의 `sort` 파라미터가 dot-notation 중첩 JSON 정렬(`buildJsonPath`, SQL Injection 검증 포함)을 이미 범용 지원하므로 title 정렬(`press.title,asc|desc`)도 기존 엔드포인트(`GET /api/v1/fo/page-data/press-data`)로 처리 가능할 것으로 판단되나, 코드/실호출 기반 최종 검증(및 위 `press` vs `pressForm` 표기 정리)은 **STEP3(fo-be-analyzer)에서 확인 예정** — 신규 BE 개발 필요 여부는 그 결과에 따라 확정

### D. 게시월 필터 (신규 BE 로직 — 연도 무관, 월만 비교)
- 파라미터: `month_publishDttm=07` 형식(월 2자리, `01`~`12`) — **점(dot) 없는 단순 키**. B(검색)의 `title|content`와 동일한 이유로, `pressForm.publishDttm`처럼 점 표기를 쓰면 별도의 "dot notation 직접 경로" 코드 경로(최상위+중첩 자동탐색 없음)를 타게 되어 재사용이 안 됨. 단순 키로 보내야 최상위/1단계 중첩(`pressForm`) 양쪽에서 `publishDttm` 키를 자동 탐색하는 기존 패턴을 그대로 재사용할 수 있음
- **BE 신규 추가 필요**: `appendWhereConditions()`에 `month_` 접두사 분기 신설. 기존 `_from`/`_to`/`drs_`가 쓰는 `regexp_replace(값, '[^0-9]', '', 'g')`로 숫자만 추출한 뒤(`YYYYMMDD`), 5~6번째 자리(월 2자리)만 `substring`으로 잘라 비교. 최상위 + 1단계 중첩(`pressForm`) 동시 탐색은 기존 `_from`/`_to` 패턴과 동일하게 OR EXISTS로 구현
- **구현 완료·검증 완료(2026-07-14)**: `appendWhereConditions()`/`bindSearchParams()`에 `month_` 분기 추가, `month_publishDttm=07` 실호출로 7월 5건 전체 매칭·`=08` 0건(음성 케이스) 확인

### D-2. 게시연도 필터 (2026-07-14 스코프 확장 — Month와 별도로 Year도 필터링 추가)
- 파라미터: `year_publishDttm=2026` 형식(4자리) — D와 동일하게 점 없는 단순 키, 최상위+1단계 중첩 자동탐색 재사용
- **BE 신규 추가 필요**: `month_`와 완전히 동일한 패턴의 `year_` 접두사 분기. `regexp_replace`로 숫자만 추출 후 앞 4자리(연도)만 `substring`으로 비교
- Year 드롭다운 옵션(`2026`/`2025`)은 하드코딩 그대로 유지(사용자 확인 완료) — 실제 데이터 연도 범위를 동적으로 조회하는 기능은 이번 스코프 아님. (⚠️ 이 문장은 2026-07-14 시점 기준 — 2026-07-21부터 동적 생성으로 재변경, 10-H 참고)
- **구현 완료·검증 완료(2026-07-14)**: `year_publishDttm=2026` → 전체 매칭(5건), `=2025` → 0건(음성 케이스, 실데이터가 전부 2026년) 확인
- FE 대상: `CompanyFeedListToolbar.tsx`의 Month `GuideSelect` — 현재 `January`/`February`/`March` 3개만 하드코딩된 것을 **1~12월(Jan~Dec) 전체로 확장**, 값은 `01`~`12`로 전송. Year 드롭다운은 이번 스코프에 포함하지 않음(기존 정적 상태 유지). (⚠️ Month 옵션은 2026-07-21부터 Jun~Oct 5개로 재축소, 10-G 참고)

### 승인 이력
| 일자 | 내용 |
|---|---|
| 2026-07-14 | A+B+C+D(월만) 스코프로 사용자 승인 완료(`#승인`). 개발(STEP6 FE 연동 + BE `month_` 추가) 착수 대기 |
| 2026-07-14 | `#개발` 승인 → BE(`month_` 분기)+FE(툴바 연동) 구현 완료. `bo-api` 재기동 후 A/B/C/D 전부 API 직접 호출로 검증 완료 |
| 2026-07-14 | 사용자가 Year 필터도 추가 요청 → D-2(연도 필터) 신규 승인, BE `year_` 분기 구현+검증 완료 |
| 2026-07-21 | 정렬 A-Z/Z-A 확장(C-2) STEP1~2 설계 확정, fo-dev-doc-writer가 문서화(상태: 설계중, 승인 대기). articles-data.md와 동일 공용 컴포넌트(`CompanyFeedListToolbar`) 변경이라 두 문서에 동시 반영. API 확인은 "기존 활용 가능(잠정)"이나 최종 검증은 STEP3(fo-be-analyzer) 예정 — `#개발` 승인 전까지 개발 착수 없음 |

## 10. Featured 독립조회 + 목록 제외조건 + Month/Year 옵션 조정 (2026-07-21 신규 스코프, 구현·검증 완료)

### 배경
9절 개발 완료 이후 추가로, Featured(최신글)와 목록(페이징 영역)이 서로 겹치지 않도록 하고(현재는 목록 첫 페이지에 Featured 글이 중복 노출됨) Month/Year 필터 옵션 범위를 실데이터 상황에 맞게 조정하기로 사용자와 STEP1·STEP2에서 확정했다.

### E. Featured(최신글) — 독립 조회로 변경
- 기준: `publish_dttm` DESC(게시일 기준) 정렬 — 사용자 확정
- where: 게시상태 조건만 적용(9-A와 동일 — `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시`)
- row limit: **1건**
- search/sort/month/year 등 목록 툴바 파라미터는 **전혀 적용하지 않음** — 필터와 무관하게 항상 전역 최신 1건 고정
- FE: 신규 함수 `fetchPressFeatured()` 필요. 기존처럼 목록 조회 결과의 `rows[0]`을 Featured로 재사용하던 방식은 **폐기**
- API: 신규 엔드포인트 불필요 — 기존 `/api/v1/fo/page-data/press-data`를 파라미터만 다르게(정렬=`publish_dttm` DESC, `size=1`, 목록 전용 필터 미포함) 재사용 가능
- **구현 완료(STEP6, 2026-07-21)**: `fetchPressFeatured()` 신설(전역 최신 1건, 필터 무관 확인), 브라우저 실검증 통과

### F. 목록(페이징 영역) — 제외 조건 추가
- row limit: `size=9`(기존 10 → 9)
- where 신규 조건: Featured로 뽑힌 글의 id를 목록에서 항상 제외 — `ne_id={featuredId}`
- 기존 검색(B)/정렬(C)/월(D)/연도(D-2) 필터는 그대로 유지, `ne_id` 조건만 추가
- **API 확인: 신규 API 필요** — 현재 `PageDataService.appendWhereConditions()`에는 `eq_`/`has_markets_`/`condexpr_`/`month_`/`year_` 접두사만 있고 not-equal(부정 일치) 파라미터가 없음(코드 확인 완료). `ne_` 접두사 분기 신설이 필요했으며, STEP4(fo-be-analyzer, 2026-07-21)에서 설계 확정(eq_ 미러링이 아닌 최상위 전용 NULL-safe `IS DISTINCT FROM`) 후 STEP5(fo-be-builder, 2026-07-21)에서 `PageDataService.java`의 `appendWhereConditions()`/`bindSearchParams()` 2곳(eq_ 블록 직후)에 신규 구현 완료. 제외 동작 + 회귀(eq_/month_/year_/타slug) 전부 실제 API 호출로 검증 완료
- **구현 완료(STEP6, 2026-07-21)**: `fetchPressList`에 `excludeId`→`ne_id` 연동, 클라이언트 수동 제외필터 제거(BE로 대체)

### G. Month 필터 옵션 축소
- 기존(9-D-2): Jan~Dec **12개** → 변경: **Jun~Oct 5개만 노출**
- 값 전송 형식(`01`~`12` 2자리)은 기존 그대로 유지, 노출되는 옵션 목록만 축소
- API: 기존 `month_publishDttm` 파라미터 그대로 사용 — **BE 변경 없음**(FE 옵션 목록만 조정)
- **구현 완료(STEP6, 2026-07-21)**: `CompanyFeedListToolbar`를 `monthOptions`/`yearOptions` props 주입 구조로 리팩터, Month는 press/articles 공통 Jun~Oct 5개

### H. Year 필터 옵션 동적화
- 기존(9-D-2): `2025`/`2026` 하드코딩 2개 → 변경: **2017년부터 현재 연도까지 동적 생성**
- 연도가 바뀌어도(예: 2027년 진입) 코드 수정 없이 최신 연도까지 자동으로 옵션이 늘어나야 함(FE 로직으로 현재 연도 계산 후 range 생성)
- API: 기존 `year_publishDttm` 파라미터 그대로 사용 — **BE 변경 없음**(FE 옵션 생성 로직만 추가)
- **구현 완료(STEP6, 2026-07-21)**: `yearOptions` props로 press는 2017~현재 동적 연도 연결(articles는 2025~현재, articles-data.md 8절 참고)

### API 확인 요약 (E~H 통합)
| 항목 | 신규 API 필요 여부 | 비고 |
|---|---|---|
| E. Featured 독립조회 | 불필요 | 기존 엔드포인트 파라미터만 다르게 재사용, STEP6 구현 완료 |
| F. 목록 제외조건(`ne_id`) | **신규 필요** | STEP4에서 설계 확정, STEP5(`PageDataService.java`)에서 구현·검증 완료 |
| G. Month 옵션 축소 | 불필요 | FE 옵션 목록 조정만, 기존 `month_` 파라미터 재사용, STEP6 구현 완료 |
| H. Year 옵션 동적화 | 불필요 | FE 옵션 생성 로직만 추가, 기존 `year_` 파라미터 재사용, STEP6 구현 완료 |

### 승인 이력
| 일자 | 내용 |
|---|---|
| 2026-07-21 | STEP1(대상 확정)·STEP2(where/orderBy/row limit 확정) 사용자와 다회 확인 거쳐 완료. STEP3(본 문서화) 진행 |
| 2026-07-21 | STEP3 문서화 승인 → `#개발` 지시로 STEP4(fo-be-analyzer)~STEP6(fo-fe-builder) 개발 진행. `ne_` 접두사 신규 구현, `fetchPressFeatured()` 신설, `CompanyFeedListToolbar` props 주입 구조 리팩터 전부 완료. QA(fo-qa-validator) 브라우저 실검증 9개 항목 전부 통과 — 상태: **구현·검증 완료** |

## 11. 상세 조회 성능 개선 — pager Option B 채택 (2026-07-21, STEP3 확정·승인 대기)

### 배경
BLOG/PRESS/ARTICLE/EVENT 공통으로 상세 페이지 진입 시 3~4초 지연이 발생하는 문제가 확인됐다(blog-data.md 10절과 동일 배경). press도 상세 페이지(`fo/src/app/company/press/detail/[id]/page.tsx`)가 `fetchPressDetail(id)`와 `fetchPressList({page:0})`(pager 계산용 목록 최대 10건 재조회)를 병렬 호출한 뒤, 목록 배열에서 현재 id의 index를 찾아 앞/뒤 요소를 prev/next로 쓰는 방식(Option A)을 그대로 쓰고 있다. 상세 진입마다 목록 전체 조회 비용이 추가로 들고, 현재 글이 최신 10건(page:0) 목록 밖에 있으면 prev/next가 항상 비는 버그도 동일하게 갖고 있다.

### 채택 설계 — 상세/인접 분리 신규 엔드포인트 2개
blog-data.md 10절과 동일한 설계(Option B)를 press-data slug에도 동일하게 적용한다.

**1) 상세 단건**: `GET /api/v1/fo/page-data/{slug}/{id}` (+ 상태 게이트 파라미터는 query, `X-Site-Id` 헤더는 optional)
- PK 실컬럼 `id=:id`(인덱스 사용) + 화면별 게시 상태 WHERE를 함께 걸어 1행만 조회. COUNT/FETCH관계/사용자명조회 생략(경량).
- 게시 게이트를 상세에도 반드시 함께 걸어, 비공개/예약글 URL 직접접근 시 노출되는 회귀를 차단한다.
- 응답은 기존 `search()` 응답의 `content[0]`과 동일한 `PageDataResponse` 1건 형태 — FE `flattenPageDataItem`은 무변경.
- 못 찾거나 게이트 탈락 시 404 → FE `notFound()`.

**2) 인접글(prev/next, 제네릭)**: `GET /api/v1/fo/page-data/{slug}/{id}/adjacent?sortField=...&titleField=...` (+ 상태/스코프 게이트 파라미터, `X-Site-Id` 헤더 optional)
- 현재 레코드의 정렬키 값을 서브쿼리로 조회한 뒤 (정렬키, id) 튜플 비교로 prev/next 각각 `LIMIT 1` 조회.
  - prev = 정렬키가 현재보다 큰 것 중 최근접(`ORDER BY 정렬키 ASC, id ASC LIMIT 1`)
  - next = 정렬키가 현재보다 작은 것 중 최근접(`ORDER BY 정렬키 DESC, id DESC LIMIT 1`)
- 응답: `{ prev: {id, title} | null, next: {id, title} | null }`
- 기존 "최신 10건(page:0) 재조회 후 FE index 계산" 방식을 완전히 대체 — 목록 10건 밖 과거글 pager 누락 버그도 이 방식으로 함께 해결된다.

### 화면(press-data) 파라미터
| 항목 | 값 |
|---|---|
| slug | `press-data` |
| 상세 게이트(where) | `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시` (9-A와 동일 조건식) |
| 인접 sortField | `createdAt` |
| 인접 titleField | `press.title` (dot-notation bare 래퍼 — 9-C-2에서 이미 실코드로 확인된 표기와 동일) |
| 인접 스코프 게이트 | `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시` (상세와 동일) |

### 재사용되는 기존 BE 로직
`PageDataService`의 `appendWhereConditions` / `bindSearchParams` / `buildJsonPath` / `isValidSegments` / `toAuditColumn` / `mapRowToResponse`를 그대로 재사용. 신규로 추가되는 코드는 `FoPageDataController`의 상세·인접 GET 엔드포인트 2개와 `PageDataService`의 `findPublicDetail` / `findAdjacent` 메서드 2개뿐이며, blog/articles/events와 공용 구현(slug 무관 제네릭)이다. `SecurityConfig`의 `/api/v1/fo/**` permitAll 설정이 신규 엔드포인트도 자동으로 커버한다.

### API 확인 (최종 체크)
- 신규 API 필요 여부: **신규 필요** — 상세 단건 GET 1개 + 인접글 GET 1개, 총 2개(blog-data와 공용 구현이라 slug별 추가 개발은 아님)
- 제안 엔드포인트: `GET /api/v1/fo/page-data/press-data/{id}`, `GET /api/v1/fo/page-data/press-data/{id}/adjacent?sortField=createdAt&titleField=press.title`
- bo `SlugRegistry`/`PageData` 상의 실제 라우팅 등록 여부는 이번 STEP에서 직접 검증하지 않음 — **확인 필요**(bo 관리자 화면에서 확인 요청)

### FE 반영 범위 (참고, 개발 착수는 `#개발` 승인 이후)
`fo/src/app/company/press/detail/[id]/page.tsx`의 `fetchPressList({page:0})` 호출을 제거하고 신규 인접글 엔드포인트 호출로 교체 필요(STEP6 범위). 이번 STEP3.5에서는 설계 확정·문서화까지만 진행한다.

### 승인 이력
| 일자 | 내용 |
|---|---|
| 2026-07-21 | 상세 페이지 진입 지연 문제 해결을 위해 pager Option B(신규 엔드포인트 2개) STEP1~3 설계 확정, fo-dev-doc-writer가 문서화(상태: 설계중, 승인 대기). blog-data.md와 동일 공용 구현이라 두 문서에 동시 반영. API 확인 "신규 필요"로 확정 — `#개발` 승인 전까지 개발 착수 없음 |
