# Company Blog 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/components/CompanyBlogPage.tsx` (목록 — Featured 단건 + 리스트 다건, 실데이터 연동 완료)
> - `fo/src/app/company/blog/detail/[id]/page.tsx` (상세 — id 기반 동적 라우트, 실데이터 연동 완료. 고정 경로 `blog/detail/page.tsx`는 삭제됨)
> - `fo/src/app/company/data/blogData.ts` (신규 — fetchApi 조회/가공 헬퍼)
> - `fo/src/app/company/components/CompanyArticleDetail.tsx` (공용 컴포넌트 — press/articles/events와 공유, 직접 태깅 대상 아님. prev/next를 optional로 변경)
> - 참고(정적 폴백 이미지로 일부 유지): `fo/src/app/company/data/blogListContent.ts`, `fo/src/app/company/data/blogDetailContent.ts`
> 상태: 구현 완료 (QA 검증 완료, 비차단 이슈 2건 — 8절 참고) / **필터·검색·정렬·월/연도 확장 구현+API 검증 완료(2026-07-14, 브라우저 UI 검증은 미완 — 9절 참고)** / **정렬 A-Z/Z-A 확장 설계중(2026-07-21, 승인 대기 — 9절 C-2 참고)** / **상세조회·pager(이전글/다음글) 성능개선 설계중(2026-07-21, 승인 대기 — 10절 참고)**

## 1. data-slug
- 값: `blog-data` (목록 Featured / 목록 리스트 / 상세 전부 동일 slug 재사용 — 별도 분리 없음)
- 다건 여부: 혼합 — Featured **단건**(정렬된 목록의 1번째 글) / 리스트 **다건(배열)** / 상세 **단건**(id 기반 조회)

## 2. data-slugkey 매핑

> ✅ **2026-07-14 갱신**: 아래 표의 "실제 accessor" 열은 STEP4 시점(수동 언랩)에 확인한 원본 중첩 경로를 기록한 것이다. 이후 `fo/src/lib/pageData.ts`에 bo `flattenPageDataItem`을 포팅해 `blogData.ts`/상세 페이지가 전부 이걸 거치도록 리팩터링했다(8절 참고). `blogForm`/`seo`/`_rel` 섹션 간 키 충돌이 없어 `flattenPageDataItem(item)` 결과에서는 아래 표의 slugKey 이름을 접두어 없이 그대로 flat 접근할 수 있다(예: `row.title`, `row.category`, `row.hashtag`). "실제 accessor" 열은 원본 저장 위치 참고용으로 남겨둔다.

### 2-1. 목록 — Featured 영역 (단건, `CompanyBlogPage.tsx`)

```html
<Link
  href="/company/blog/detail"
  className="company-blog-featured__card"
  data-slug="blog-data"
  data-slugkey="id"
  data-slugkey-attr="href"
>
  <div className="company-blog-featured__image">
    <img data-slugkey="image" data-slugkey-attr="src" />
  </div>
  <div className="company-blog-featured__content">
    <p className="company-blog-featured__category" data-slugkey="category"></p>
    <h2 className="company-blog-featured__title" data-slugkey="title"></h2>
    <p className="company-blog-featured__desc" data-slugkey="description"></p>
    <p className="company-blog-featured__date" data-slugkey="date"></p>
    <div className="company-blog-featured__tags" data-slugkey="tags">
      <!-- tags.map(tag => ...) -->
    </div>
  </div>
</Link>
```

> ⚠️ STEP4에서 실제 API 응답(`curl /api/v1/fo/page-data/blog-data`)으로 재검증한 결과, 아래 "실제 accessor"가 진짜 경로/타입입니다. `search()` 응답은 flatten되지 않고 `blogForm` 하위에 중첩된 그대로 내려옵니다.

| slugKey | 실제 accessor(dataJson 중첩 경로) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| id | `id`(top-level) | number | 속성(`Link[href]`) | 상세 페이지 이동 링크. 현재 `/company/blog/detail` 고정 경로라 id 파라미터 포함 동적 라우트로 변경 필요(6.비고 참고, STEP6 범위) |
| image | `blogForm.image[0]` | number[](미디어ID 배열) | 속성(`img[src]`) | `/api/v1/fo/page-files/{id}`로 렌더 |
| category | `blogForm.category` | string(코드, 예 "001") | 텍스트(`p`) | 코드값 — `GET /api/v1/fo/codes/BLOGCATEGORY`로 라벨 변환 필요 |
| title | `blogForm.title` | string | 텍스트(`h2`) | 제목 |
| description | `seo.metaDescription` | string | 텍스트(`p`) | blogForm에 없음 — seo 메타 설명을 재사용(6-10 참고) |
| date | `blogForm.publishDttm` | string(date, "YYYY-MM-DD") | 텍스트(`p`) | 게시일. 필드명이 date가 아니라 publishDttm |
| tags | `blogForm.hashtag` | string(콤마구분, 배열 아님) | 텍스트(반복 `div`) | 예: `"Moto, Automation"` → FE에서 `split(',').map(trim)` 필요. ls-publish 원본 디자인에 이미 존재 |

### 2-2. 목록 — 리스트 영역 (다건, `CompanyBlogPage.tsx`)

```html
<ul data-slug="blog-data" data-slug-repeat="true">
  <li data-slug-item>
    <Link data-slugkey="id" data-slugkey-attr="href">
      <img data-slugkey="image" data-slugkey-attr="src" />
    </Link>
    <Link data-slugkey="id" data-slugkey-attr="href">
      <p data-slugkey="category"></p>
      <h3 data-slugkey="title"></h3>
      <p data-slugkey="description"></p>
      <p data-slugkey="date"></p>
      <div data-slugkey="tags">
        <!-- tags.map(tag => ...) -->
      </div>
    </Link>
  </li>
</ul>
```

| slugKey | 실제 accessor(dataJson 중첩 경로) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| id | `id`(top-level) | number | 속성(`Link[href]`, 이미지 링크·콘텐츠 링크 2곳에 동일 slugKey 사용) | 상세 페이지 이동 링크 |
| image | `blogForm.image[0]` | number[](미디어ID 배열) | 속성(`img[src]`) | `/api/v1/fo/page-files/{id}`로 렌더 |
| category | `blogForm.category` | string(코드) | 텍스트(`p`) | 코드값 — BLOGCATEGORY 코드그룹으로 라벨 변환 필요 |
| title | `blogForm.title` | string | 텍스트(`h3`) | 제목 |
| description | `seo.metaDescription` | string | 텍스트(`p`) | blogForm에 없음 — seo 메타 설명을 재사용(6-10 참고) |
| date | `blogForm.publishDttm` | string(date) | 텍스트(`p`) | 게시일 |
| tags | `blogForm.hashtag` | string(콤마구분) | 텍스트(반복 `BlogTag`) | `split(',').map(trim)` 필요 |

### 2-3. 상세 영역 (단건, `blog/detail/page.tsx`)

```html
<div data-slug="blog-data">
  <div data-slugkey="content">
    <!-- 문단/불릿/본문이미지/후속문단을 하나로 묶은 리치텍스트 HTML -->
  </div>
  <div data-slugkey="tags">
    <!-- tags.map(tag => ...) -->
  </div>
</div>
```

| slugKey | 실제 accessor(dataJson 중첩 경로) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| content | `blogForm.content` | string(HTML, 리치텍스트) | 텍스트(`innerHTML`) | ✅ 실데이터로 검증됨 — 이미 에디터가 생성한 리치텍스트 HTML 단일 필드로 저장되어 있어, 설계 의도(문단/불릿/이미지 통합)와 정확히 일치. 현재 코드는 `blogDetailParagraphs`/`blogDetailBullets`/`blogDetailContentImage`/`blogDetailTailParagraphs`로 낱개 관리 중이나 STEP6에서 이 하나의 HTML로 교체 |
| tags | `blogForm.hashtag` | string(콤마구분) | 텍스트(반복 `div`) | `split(',').map(trim)` 필요 |

### 2-4. 마크업 태깅 불가 — STEP6(FE 개발)에서 fetchApi로 props 직접 교체 처리 대상

아래 필드는 `CompanyArticleDetail`(press/articles/events와 공유하는 공용 컴포넌트) 내부에서 렌더되어 상세 페이지 호출부의 DOM에 노출되지 않으므로 `data-slug`/`data-slugkey` 마크업 태깅이 불가능하다. STEP6에서 `fetchApi`로 조회한 값을 `CompanyArticleDetail`의 props로 직접 전달하는 방식으로 처리한다.

| 필드 | 현재 전달 방식 | 비고 |
|---|---|---|
| category | `CompanyArticleDetail`의 `category` prop | 공용 컴포넌트 내부 렌더 |
| title | `CompanyArticleDetail`의 `title` prop | 공용 컴포넌트 내부 렌더 |
| date | `CompanyArticleDetail`의 `date` prop | 공용 컴포넌트 내부 렌더 |
| heroImage | `CompanyArticleDetail`의 `heroImage` prop | 공용 컴포넌트 내부 렌더 |
| pager(prev/next: id·title) | `CompanyArticleDetail`의 `prev`/`next` prop | 공용 컴포넌트 내부의 `<nav>`이며, slug 래퍼(`<article>`) **바깥**의 형제 요소라 wrapper 태깅도 불가. prev/next는 "현재 글 자체의 필드"가 아니라 "정렬 순서상 인접 레코드로의 링크"인 관계형 데이터임. **(2026-07-21 갱신)** prev/next 값의 조회 방식이 신규 인접글 전용 엔드포인트(10절)로 변경됨 — 기존 FE index 계산 방식(Option A)은 폐기 |

## 3. API 확인 (최종 체크 — STEP4 완료, 실제 API 호출로 재검증됨)
- 신규 API 필요 여부: **불필요** — 기존 FO 공개 API 3종(`FoPageDataController`/`FoCodeController`/`FoPageFileController`)으로 목록·상세·카테고리 라벨·이미지 전부 처리 가능
- `blog-data` slug는 bo `slug_registry`에 등록되어 있고, `page_data`에 실데이터 10건 존재 확인됨(`GET /api/v1/fo/page-data/blog-data` 직접 호출로 재검증, `totalElements: 10`)
- 목록: `GET /api/v1/fo/page-data/blog-data?page=0&size=10` (`FoPageDataController` → `PageDataService.search()` 재사용, 비로그인 permitAll 확인)
- 상세(단건): 별도 getById 없음 → `GET /api/v1/fo/page-data/blog-data?eq_id={id}` 로 처리(top-level `id` 정확일치). **⚠️ 2026-07-21 갱신**: 상세 전용 성능개선 엔드포인트(신규, 10절)로 대체 예정 — 상세 설계는 10절 참고
- 카테고리 라벨: `GET /api/v1/fo/codes/BLOGCATEGORY` (`FoCodeController` 재사용)
- 이미지: `GET /api/v1/fo/page-files/{fileId}` (`FoPageFileController` 재사용)

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)
- where(필터 조건식): `eq_blogForm.category={코드}` (카테고리 탭 선택 시) + `eq_blogForm.isVisible=001`(항상 고정 — 공개글만, 6-11 참고) (`PageDataService`의 dot-notation eq_ 정확일치, 실제 API로 검증됨)
- row limit(단건 / 다건 개수): 다건(리스트) — `size=10` 페이지네이션 / Featured는 정렬된 목록의 1번째 글을 그대로 사용(단건, 별도 selection 관리 없음) / 상세는 `eq_id={id}` 단건조회
- orderBy(정렬 필드 + ASC/DESC): `PageDataService` 기본값 `created_at DESC` — 파라미터 없이 요건 충족(실제 10건 API 응답으로 정렬 검증됨)
- 2차 정렬(tie-breaker): 실데이터 10건의 `created_at`이 전부 마이크로초까지 상이해 실질적으로 tie 발생 불가 확인됨 — **BE 변경 없이 현행 유지 권장(아래 6-9 참고, 사용자 확인 필요)**
- ⚠️ **미확정(사용자 확인 필요)**: `isVisible`(노출여부 코드) 필터 — FO 공개 목록에 비노출 글이 섞여 나올 수 있음. `eq_blogForm.isVisible={노출코드}` 추가 여부와 노출 코드값 확인 필요

## 5. 샘플 응답 데이터

> ✅ 아래는 **실제 API 호출 결과**(`GET /api/v1/fo/page-data/blog-data?size=2`, STEP4에서 재검증)를 그대로 옮긴 것 — 추정 아님. `search()` 응답은 flatten되지 않고 `blogForm` 하위에 중첩된 그대로 내려온다.

```json
{
  "content": [
    {
      "id": 1352,
      "templateSlug": "blog-detail",
      "dataJson": {
        "id": 1352,
        "seo": { "slug": "...", "metaTitle": "...", "metaDescription": "..." },
        "_rel": { "product-data": [{ "id": 1345 }] },
        "blogForm": {
          "image": [231],
          "title": "...",
          "views": "10",
          "content": "<p>...</p>",
          "hashtag": "Moto, Automation",
          "markets": "002",
          "category": "001",
          "isVisible": "001",
          "publishDttm": "2026-07-08"
        }
      },
      "createdAt": "2026-07-08T04:43:26.661345Z",
      "updatedAt": "2026-07-08T04:43:31.067982Z"
    }
  ],
  "totalElements": 10,
  "totalPages": 5,
  "page": 0,
  "size": 2
}
```

FE 바인딩 시 참조 경로: `content[i].id` / `content[i].dataJson.blogForm.{title|content|hashtag|category|publishDttm|isVisible|image[0]}`. `description` 필드는 존재하지 않음(4./6. 참고).

## 6. 비고
1. `CompanyArticleDetail.tsx`는 blog뿐 아니라 press/articles/events가 공유하는 공용 컴포넌트라 직접 `data-slug` 태깅 대상이 아니다. category/title/date/heroImage/pager는 STEP6에서 fetchApi 결과를 props로 직접 주입하는 방식으로 처리(2-4 참고).
2. pager(prevId/prevTitle/nextId/nextTitle)는 "현재 글의 필드"가 아니라 "정렬 순서상 인접 레코드로의 링크"라는 관계형 데이터이며, DOM 구조상으로도 slug 래퍼 바깥의 형제 요소라 마크업 태깅이 근본적으로 불가능하다.
3. 상세 페이지 라우트는 현재 `/company/blog/detail` 고정 경로다. id 기반 동적 라우트(예: `/company/blog/detail/[id]` 등, 실제 경로 규칙은 STEP6에서 결정)로 변경이 필요하며, 목록(Featured/리스트) 카드의 상세 이동 링크도 이 id 기반 동적 링크를 사용해야 한다.
4. ✅ `content` 필드는 STEP4 실제 API 검증 결과 이미 리치텍스트 HTML 단일 필드(`blogForm.content`)로 저장되어 있어, 설계와 실제 구조가 일치함.
5. `blogListContent.ts`, `blogDetailContent.ts`는 현재 정적 더미 데이터이며 실 데이터 연동 완료 후 제거 예정 — 이번 문서에서는 필드 구조 참고용으로만 사용.
6. `tags`는 해시태그 필드(`blogForm.hashtag`, 콤마구분 문자열)로, Featured/리스트/상세 전부 slug 관리 대상에 포함된다(ls-publish 원본 디자인에 이미 존재하므로 스코프 포함 확정). 배열이 아니므로 FE에서 `split(',')` 처리 필요.
7. where(category)는 `eq_blogForm.category={코드}` (BLOGCATEGORY 코드그룹)로 확정. 목록 화면 카테고리 탭이 코드값을 넘기도록 STEP6에서 구현.
8. tie-breaker(id): 실데이터 10건 전부 `created_at`이 마이크로초 단위까지 고유해 tie가 실질적으로 발생하지 않음 확인됨 — **Option A(BE 변경 없음, 현행 유지) 권장**. Option B(서비스 기본 정렬에 `, id DESC` 안정정렬 추가)는 저위험이나 불필요.
9. pager(prev/next 인접 레코드): ~~기존 API에 인접조회 로직 없음 — Option A(BE 변경 없음, FE가 이미 가진 정렬된 10건 목록에서 현재 id의 index로 prev/next 계산) 권장~~ → **2026-07-21 STEP3 확정으로 Option B 채택.** 상세 페이지 진입 3~4초 지연 문제(목록 재조회 비용) 및 목록 10건 밖 과거글 pager 누락 버그를 함께 해결하기 위해 상세/인접 분리 신규 엔드포인트를 신설한다. 상세 설계는 10절 참고.
10. ✅ **description 필드 — 해결됨**: `press-data`/`articles-data`(이미 등록된 동일 계열 slug) 실데이터도 확인한 결과, blog/press/articles 3종 모두 폼에 별도 description 필드가 없는 것이 공통 설계임을 확인. 대신 모든 레코드에 `dataJson.seo.metaDescription`(짧은 설명 텍스트)이 존재 — 이를 목록 카드 description으로 재사용하기로 결정. accessor: `dataJson.seo.metaDescription`.
11. ✅ **isVisible 노출 필터 — 해결됨**: `GET /api/v1/fo/codes/VISIBILITY` 실제 조회 결과 `001=공개`, `002=비공개`. `articles-data` 샘플에서 실제 `isVisible:"002"`(비공개) 레코드를 확인해 필터링이 실제로 필요함을 검증. **`eq_blogForm.isVisible=001`을 where에 추가해 공개 글만 노출**하기로 확정.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-14 | `CompanyBlogPage.tsx`(Featured 단건 + 리스트 다건)와 `blog/detail/page.tsx`(content/tags)에 `data-slug="blog-data"` 태깅 완료. category/title/date/heroImage/pager는 `CompanyArticleDetail` 공용 컴포넌트 내부라 마크업 태깅 불가 확인 |
| STEP2 | fo-slug-analyzer | 2026-07-14 | where(category), orderBy(생성일 DESC), tie-breaker(id, 방향 미확정), row limit(다건 10개 페이지네이션 / Featured는 목록 1번째 재사용 / 상세는 id 단건조회) 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-14 | 작업 단위 문서 작성 (상태: 설계중), API 확인 결과 "확인 필요"로 명시 |
| STEP4 | fo-be-analyzer | 2026-07-14 | 신규 BE 불필요 확인(기존 FO API 3종 재사용). 실제 API 호출로 재검증(`totalElements:10`, `blogForm` 래퍼, `hashtag` 콤마구분, `category`/`isVisible` 코드값, `publishDttm`). description 필드 부재·isVisible 노출필터 여부는 미확정으로 남김 |
| STEP5 | (해당 없음) | 2026-07-14 | STEP4 결론대로 신규 BE 개발 없음 — 확정만 하고 STEP6로 이동 |
| STEP6 | fo-fe-builder | 2026-07-14 | 실데이터 연동 완료. `blogData.ts` 신설, `CompanyBlogPage.tsx`/신규 `blog/detail/[id]/page.tsx` fetchApi 연동, 카테고리 필터·페이지네이션·해시태그 split·이미지/카테고리 라벨 변환·pager(FE index 계산) 구현. `tsc --noEmit` 통과. breadcrumbConfig에 id 라우트 정규식 매칭 추가(호출자 직접 수정) |
| QA | fo-qa-validator + 호출자 재검증 | 2026-07-14 | 노출필터·Featured 중복방지·카테고리 필터·프록시 경로 PASS. 상세 500은 최초 QA 시점엔 재현됐으나 **호출자가 fo dev 서버(Turbopack) 재기동 후 재확인한 결과 정상 200 — 코드 결함 아닌 stale 컴파일 워커 문제로 판명**. 비차단 이슈 2건은 8절 참고 |
| STEP9(리팩터) | 호출자 | 2026-07-14 | `fo-data-binding-가이드.md`의 "flatten 기준 필드명" 설명과 실제 fo API(nested 응답) 간 불일치를 사용자가 지적 → bo `utils.ts`의 `flattenPageDataItem`을 `fo/src/lib/pageData.ts`에 포팅. `blogData.ts`(`toBlogCard`)와 `blog/detail/[id]/page.tsx`(본문·pager)가 `blogForm.title` 수동 언랩 대신 `flattenPageDataItem(item)` 결과를 사용하도록 전면 교체. 같은 문제를 겪던 `mainVisualData.ts`(hero-data/banner-data×2)도 함께 리팩터링. tsc 통과, curl(main SSR)·Playwright(blog 목록/상세 CSR) 재검증으로 회귀 없음 확인 |
| STEP3.5(성능개선) | fo-dev-doc-writer | 2026-07-21 | 상세 페이지 진입 3~4초 지연 문제 해결을 위해 상세조회/pager를 Option B(신규 BE 엔드포인트 2개)로 재설계 — 상세 단건 `GET /api/v1/fo/page-data/blog-data/{id}`, 인접글 `GET /api/v1/fo/page-data/blog-data/{id}/adjacent`. 기존 Option A(FE index 계산) 폐기 결정 문서화(상태: 설계중, 승인 대기, 10절 참고) |

## 8. 비차단(non-blocking) 알려진 이슈 — 코드 수정 없이 종료
1. **레거시 스키마 레코드 5건 목록 공백**(id 1290/1283/1172/1171/1011, 939는 필드 자체 없음) — 구(舊) 필드명(`blogTitle`/`blogImage`/`blogContent`/`blogHashtag`/`blogPubDttm`/`blogCategory`)으로 저장된 과거 테스트 데이터라 현재 `blogForm.{title|image|content|hashtag|publishDttm|category}` 스키마로 값을 못 읽어 목록에서 제목/카테고리/날짜/태그가 공백으로 표시됨(id 링크는 정상). **FE에 구스키마 호환 코드를 추가하지 않기로 함** — 오래된 테스트 데이터를 위한 영구적 이중 스키마 유지비용이 더 크다고 판단. 해당 레코드를 BO 관리자 화면에서 현재 폼으로 다시 저장하면 자동 해결됨(데이터 정리 필요, 코드 변경 아님).
2. **이미지 전부 404(FILE_NOT_FOUND)**: `blogForm.image`가 가리키는 `page-files/{id}`(231/216 등) 실체가 로컬 환경에 없음 — 로컬 DB 시드 데이터에 대응하는 실제 업로드 파일이 없는 로컬 개발 환경 이슈로, FE/BE 코드 문제 아님.

## 9. 필터·검색·정렬 확장 (2026-07-14 신규 스코프, 설계 확정·승인 완료·개발 대기)

### 배경
press-data 작업 중 `/bo/admin/widget/press-list` 관리자 화면을 Playwright로 직접 조작해 네트워크 요청을 실측한 결과, BO의 "게시상태" 판정식(`isVisible=001,publishDttm>=today()?'게시':'미게시'`)이 FO where 조건에 반영되어 있지 않은 것을 발견. `/bo/admin/widget/blog-list` 위젯도 동일한 설정(`configJson`)으로 동일 이슈가 있음을 실측 확인. 이를 계기로 FO 툴바(검색·정렬)와 BO 위젯 검색 필드 전체를 재분석했다.

### A. 게시상태 조건 수정 (버그 픽스)
- 기존 where `eq_blogForm.isVisible=001`을 **BO와 동일한 조건식으로 교체**: `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시` (category 필터 `eq_blogForm.category={코드}`는 그대로 병행 유지)
- ⚠️ 방향 확정: `publishDttm`은 "게시 시작일시"이며, **이미 지난(과거) 날짜여야 노출**된다(미래 예약 게시일은 아직 미게시). 따라서 조건은 `publishDttm<=today()`(작거나 같음)이 맞다 — `>=`이면 반대로 아직 오지 않은 미래 글만 노출되는 오류가 된다.
- `PageDataService.appendWhereConditions()`의 `condexpr_`/`condval_` 처리(기존 기능, BO 위젯 검색 필드가 이미 사용 중)를 그대로 재사용 — **BE 변경 없음**. isVisible=001 조건이 이 식 안에 포함되어 있어 별도 `eq_isVisible` 파라미터 불필요.
- 실측 검증: BO `blog-list` 위젯에서 "게시상태=게시"로 검색 시 위 파라미터가 실제로 전송되는 것을 네트워크 요청으로 확인(2026-07-14).

### B. 검색 — 제목 + 본문
- 파라미터: `title|content=검색어` (`blogForm.title`/`blogForm.content`가 아니라 접두어 없는 단순 키 — `PageDataService`가 최상위 1단계 중첩 object까지 자동 탐색하는 `|` OR-ILIKE 기능(기존 기능, `appendWhereConditions` 1152~1171행)을 그대로 재사용)
- **BE 변경 없음** — press-data와 동일 로직이라 별도 재검증 없이 재사용(라이브 API 실측은 press-data에서 완료, 2026-07-14).
- FE 대상: `CompanyBlogListToolbar.tsx`의 검색 `TextField`(현재 `value`/`onChange`/제출 핸들러 전혀 없는 장식 UI) 연동

### C. 정렬 — Latest / Oldest
- 파라미터: `sort=createdAt,desc`(Latest) / `sort=createdAt,asc`(Oldest)
- `PageDataService`의 기존 `sort` 파라미터(감사 컬럼 매핑) 재사용 — **BE 변경 없음**
- FE 대상: `CompanyBlogListToolbar.tsx`의 정렬 `GuideSelect`(현재 `defaultValue="Latest"`만 있고 `onChange` 없음) 연동. 카테고리 필터는 이미 연동되어 있으므로 변경 없음.

### C-2. 정렬 확장 — A-Z / Z-A (2026-07-21 신규 스코프, 설계중·승인 대기)
- 정렬 옵션: 기존 Latest/Oldest(2종) → **Latest/Oldest/A-Z/Z-A(4종)**로 확장
  - Latest: 기존 유지(파라미터 생략, BE 기본 `created_at DESC`) / Oldest: 기존 유지(`sort=createdAt,asc`)
  - A-Z: `sort=blog.title,asc` / Z-A: `sort=blog.title,desc`
- title 정렬 경로: `blog.title` — `PageDataService`의 `sort` dot-notation 규칙(`<래퍼키>.title` → `ORDER BY data_json->'<래퍼키>'->>'title'`)에 따라 확정. dev DB 실측(bare 래퍼 + title 구조)으로 확인됨(STEP1)
- ⚠️ 참고: 위 2~9절에는 category/content 등 blog 필드 accessor가 `blogForm.xxx`(폼 래퍼)로 기록돼 있으나, 실제 `fo/src/app/company/data/blogData.ts:122`는 이미 `eq_blog.category`(`blog` bare 래퍼)로 카테고리 필터를 호출 중임을 코드로 확인(2026-07-21). title 정렬도 이와 동일하게 `blog.title` bare 래퍼 경로를 쓴다 — `blogForm` vs `blog` 표기 불일치는 기존 2~9절 문서 갱신 필요 여부와 함께 STEP3에서 정리
- Featured 처리: 정렬된 목록의 1번째 글을 상단 Featured로 올리고 리스트에서 제외하는 기존 로직(1절 참고)은 변경 없이 유지 — A-Z 정렬 시 알파벳상 가장 앞선 글이 Featured가 되는 것을 허용하며 별도 고정/예외 처리는 두지 않음
- FE sort 상태 타입: `"latest" | "oldest"` → `"latest" | "oldest" | "az" | "za"`로 확장 필요
- FE 대상: `CompanyBlogListToolbar.tsx`의 정렬 `GuideSelect` MenuItem에 A-Z/Z-A 옵션 추가(라벨 "A-Z"/"Z-A")
- API 확인: **기존 활용 가능(잠정) — 확인 필요/검증 예정.** `PageDataService`의 `sort` 파라미터가 dot-notation 중첩 JSON 정렬(`buildJsonPath`, SQL Injection 검증 포함)을 이미 범용 지원하므로 title 정렬(`blog.title,asc|desc`)도 기존 엔드포인트(`GET /api/v1/fo/page-data/blog-data`)로 처리 가능할 것으로 판단되나, 코드/실호출 기반 최종 검증(및 위 `blog` vs `blogForm` 표기 정리)은 **STEP3(fo-be-analyzer)에서 확인 예정** — 신규 BE 개발 필요 여부는 그 결과에 따라 확정

### D. 게시월 필터 (신규 BE 로직 — 연도 무관, 월만 비교)
- 파라미터: `month_publishDttm=07` 형식(월 2자리, `01`~`12`) — **점(dot) 없는 단순 키**(press-data.md 9절 D 참고, `blogForm.publishDttm`처럼 점 표기하면 별도 코드 경로를 타서 최상위+중첩 자동탐색 재사용이 안 됨)
- **BE 신규 추가 필요**: press-data와 완전히 동일한 `month_` 접두사 분기를 `appendWhereConditions()`에 신설(공용 로직, press/blog 모두 이 하나의 분기로 처리됨 — slug별 분기 아님)
- FE 대상: `CompanyBlogListToolbar.tsx`에는 현재 Month/Year 필드 자체가 없음(카테고리+검색+정렬 3개뿐) — **Month `GuideSelect` 신규 추가** 완료(Jan~Dec 1~12월, 값 `01`~`12`)
- **구현 완료·검증 완료(2026-07-14)**: press-data와 동일 BE 로직 공유이므로 별도 재검증 없이 press-data.md 9절 D의 검증 결과 그대로 적용됨

### D-2. 게시연도 필터 (2026-07-14 스코프 확장)
- 파라미터: `year_publishDttm=2026` 형식(4자리), press-data.md 9절 D-2와 완전히 동일한 BE 로직(공용, slug별 분기 아님)
- FE 대상: `CompanyBlogListToolbar.tsx`에 **Year `GuideSelect` 신규 추가**(옵션 `2026`/`2025` 하드코딩, press 툴바와 동일 — 사용자 확인 완료)
- **구현 완료·검증 완료(2026-07-14)**: BE 공용 로직이라 press-data.md 9절 D-2 검증 결과 그대로 적용됨

### 승인 이력
| 일자 | 내용 |
|---|---|
| 2026-07-14 | A+B+C+D(월만) 스코프로 사용자 승인 완료(`#승인`). 개발(STEP6 FE 연동 + BE `month_` 추가) 착수 대기 |
| 2026-07-14 | `#개발` 승인 → BE(`month_` 분기)+FE(툴바 연동) 구현 완료. `bo-api` 재기동 후 A/B/C/D 전부 검증 완료(press-data와 BE 공용 로직) |
| 2026-07-14 | 사용자가 Year 필터도 추가 요청 → D-2(연도 필터) 신규 승인, BE `year_` 분기 구현+검증 완료 |
| 2026-07-21 | 정렬 A-Z/Z-A 확장(C-2) STEP1~2 설계 확정, fo-dev-doc-writer가 문서화(상태: 설계중, 승인 대기). API 확인은 "기존 활용 가능(잠정)"이나 최종 검증은 STEP3(fo-be-analyzer) 예정 — `#개발` 승인 전까지 개발 착수 없음 |

## 10. 상세 조회 성능 개선 — pager Option B 채택 (2026-07-21, STEP3 확정·승인 대기)

### 배경
BLOG/PRESS/ARTICLE/EVENT 공통으로 상세 페이지 진입 시 3~4초 지연이 발생하는 문제가 확인됐다. 원인은 상세 페이지(`fo/src/app/company/blog/detail/[id]/page.tsx`)가 `fetchBlogDetail(id)`(상세 단건)와 `fetchBlogList({page:0})`(pager 계산용 목록 최대 10건 재조회)를 매번 병렬 호출한 뒤, 목록 배열에서 현재 id의 index를 찾아 앞/뒤 요소를 prev/next로 쓰는 방식(Option A, 6절 항목 9)이었다. 이 방식은 상세 진입마다 목록 전체 조회 비용이 추가로 드는 데다, **현재 글이 최신 10건(page:0) 목록 밖(더 과거)에 있으면 prev/next가 항상 비어버리는 버그**도 갖고 있었다.

### 채택 설계 — 상세/인접 분리 신규 엔드포인트 2개
Option A를 폐기하고, 상세 단건 조회와 인접글(prev/next) 조회를 완전히 분리한 신규 FO 공개 엔드포인트 2개를 신설한다.

**1) 상세 단건**: `GET /api/v1/fo/page-data/{slug}/{id}` (+ 상태 게이트 파라미터는 query, `X-Site-Id` 헤더는 optional)
- PK 실컬럼 `id=:id`(인덱스 사용) + 화면별 게시 상태 WHERE를 함께 걸어 1행만 조회. 기존 `search()`가 매 호출마다 수행하는 COUNT 쿼리·FETCH 관계·사용자명 조회 등을 생략한 경량 조회.
- 게시 게이트를 상세에도 반드시 함께 걸어, 비공개/예약글 URL 직접접근 시 노출되는 회귀를 차단한다.
- 응답은 기존 `search()` 응답의 `content[0]`과 동일한 `PageDataResponse` 1건 형태 — FE `flattenPageDataItem`은 무변경.
- 못 찾거나 게이트 탈락 시 404 → FE `notFound()`.

**2) 인접글(prev/next, 제네릭)**: `GET /api/v1/fo/page-data/{slug}/{id}/adjacent?sortField=...&titleField=...` (+ 상태/스코프 게이트 파라미터, `X-Site-Id` 헤더 optional)
- 현재 레코드의 정렬키 값을 서브쿼리로 조회한 뒤 (정렬키, id) 튜플 비교로 prev/next 각각 `LIMIT 1` 조회.
  - prev = 정렬키가 현재보다 큰 것 중 최근접(`ORDER BY 정렬키 ASC, id ASC LIMIT 1`)
  - next = 정렬키가 현재보다 작은 것 중 최근접(`ORDER BY 정렬키 DESC, id DESC LIMIT 1`)
- 응답: `{ prev: {id, title} | null, next: {id, title} | null }`
- 기존 "최신 10건(page:0) 재조회 후 FE index 계산" 방식을 완전히 대체 — 목록 10건 밖 과거글 pager 누락 버그도 이 방식으로 함께 해결된다.

### 화면(blog-data) 파라미터
| 항목 | 값 |
|---|---|
| slug | `blog-data` |
| 상세 게이트(where) | `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시` (9-A와 동일 조건식) |
| 인접 sortField | `createdAt` |
| 인접 titleField | `blog.title` (dot-notation bare 래퍼 — 9-C-2에서 이미 실코드로 확인된 표기와 동일) |
| 인접 스코프 게이트 | `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시` (상세와 동일) |

### 재사용되는 기존 BE 로직
`PageDataService`의 `appendWhereConditions` / `bindSearchParams` / `buildJsonPath` / `isValidSegments` / `toAuditColumn` / `mapRowToResponse`를 그대로 재사용. 신규로 추가되는 코드는 `FoPageDataController`의 상세·인접 GET 엔드포인트 2개와 `PageDataService`의 `findPublicDetail` / `findAdjacent` 메서드 2개뿐이다. `SecurityConfig`의 `/api/v1/fo/**` permitAll 설정이 신규 엔드포인트도 자동으로 커버한다(별도 보안 설정 추가 불필요).

### API 확인 (최종 체크)
- 신규 API 필요 여부: **신규 필요** — 상세 단건 GET 1개 + 인접글 GET 1개, 총 2개
- 제안 엔드포인트: `GET /api/v1/fo/page-data/blog-data/{id}`, `GET /api/v1/fo/page-data/blog-data/{id}/adjacent?sortField=createdAt&titleField=blog.title`
- bo `SlugRegistry`/`PageData` 상의 실제 라우팅 등록 여부는 이번 STEP에서 직접 검증하지 않음 — **확인 필요**(bo 관리자 화면에서 확인 요청)

### FE 반영 범위 (참고, 개발 착수는 `#개발` 승인 이후)
`fo/src/app/company/blog/detail/[id]/page.tsx`의 `fetchBlogList({page:0})` 호출을 제거하고 신규 인접글 엔드포인트 호출로 교체 필요(STEP6 범위). 이번 STEP3.5에서는 설계 확정·문서화까지만 진행한다.

### 승인 이력
| 일자 | 내용 |
|---|---|
| 2026-07-21 | 상세 페이지 진입 지연 문제 해결을 위해 pager Option B(신규 엔드포인트 2개) STEP1~3 설계 확정, fo-dev-doc-writer가 문서화(상태: 설계중, 승인 대기). API 확인 "신규 필요"로 확정 — `#개발` 승인 전까지 개발 착수 없음 |
