# Company Blog 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/components/CompanyBlogPage.tsx` (목록 — Featured 단건 + 리스트 다건, 실데이터 연동 완료)
> - `fo/src/app/company/blog/detail/[id]/page.tsx` (상세 — id 기반 동적 라우트, 실데이터 연동 완료. 고정 경로 `blog/detail/page.tsx`는 삭제됨)
> - `fo/src/app/company/data/blogData.ts` (신규 — fetchApi 조회/가공 헬퍼)
> - `fo/src/app/company/components/CompanyArticleDetail.tsx` (공용 컴포넌트 — press/articles/events와 공유, 직접 태깅 대상 아님. prev/next를 optional로 변경)
> - 참고(정적 폴백 이미지로 일부 유지): `fo/src/app/company/data/blogListContent.ts`, `fo/src/app/company/data/blogDetailContent.ts`
> 상태: 구현 완료 (QA 검증 완료, 비차단 이슈 2건 — 8절 참고)

## 1. data-slug
- 값: `blog-data` (목록 Featured / 목록 리스트 / 상세 전부 동일 slug 재사용 — 별도 분리 없음)
- 다건 여부: 혼합 — Featured **단건**(정렬된 목록의 1번째 글) / 리스트 **다건(배열)** / 상세 **단건**(id 기반 조회)

## 2. data-slugKey 매핑

> ✅ **2026-07-14 갱신**: 아래 표의 "실제 accessor" 열은 STEP4 시점(수동 언랩)에 확인한 원본 중첩 경로를 기록한 것이다. 이후 `fo/src/lib/pageData.ts`에 bo `flattenPageDataItem`을 포팅해 `blogData.ts`/상세 페이지가 전부 이걸 거치도록 리팩터링했다(8절 참고). `blogForm`/`seo`/`_rel` 섹션 간 키 충돌이 없어 `flattenPageDataItem(item)` 결과에서는 아래 표의 slugKey 이름을 접두어 없이 그대로 flat 접근할 수 있다(예: `row.title`, `row.category`, `row.hashtag`). "실제 accessor" 열은 원본 저장 위치 참고용으로 남겨둔다.

### 2-1. 목록 — Featured 영역 (단건, `CompanyBlogPage.tsx`)

```html
<Link
  href="/company/blog/detail"
  className="company-blog-featured__card"
  data-slug="blog-data"
  data-slugKey="id"
  data-slugKey-attr="href"
>
  <div className="company-blog-featured__image">
    <img data-slugKey="image" data-slugKey-attr="src" />
  </div>
  <div className="company-blog-featured__content">
    <p className="company-blog-featured__category" data-slugKey="category"></p>
    <h2 className="company-blog-featured__title" data-slugKey="title"></h2>
    <p className="company-blog-featured__desc" data-slugKey="description"></p>
    <p className="company-blog-featured__date" data-slugKey="date"></p>
    <div className="company-blog-featured__tags" data-slugKey="tags">
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
    <Link data-slugKey="id" data-slugKey-attr="href">
      <img data-slugKey="image" data-slugKey-attr="src" />
    </Link>
    <Link data-slugKey="id" data-slugKey-attr="href">
      <p data-slugKey="category"></p>
      <h3 data-slugKey="title"></h3>
      <p data-slugKey="description"></p>
      <p data-slugKey="date"></p>
      <div data-slugKey="tags">
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
  <div data-slugKey="content">
    <!-- 문단/불릿/본문이미지/후속문단을 하나로 묶은 리치텍스트 HTML -->
  </div>
  <div data-slugKey="tags">
    <!-- tags.map(tag => ...) -->
  </div>
</div>
```

| slugKey | 실제 accessor(dataJson 중첩 경로) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| content | `blogForm.content` | string(HTML, 리치텍스트) | 텍스트(`innerHTML`) | ✅ 실데이터로 검증됨 — 이미 에디터가 생성한 리치텍스트 HTML 단일 필드로 저장되어 있어, 설계 의도(문단/불릿/이미지 통합)와 정확히 일치. 현재 코드는 `blogDetailParagraphs`/`blogDetailBullets`/`blogDetailContentImage`/`blogDetailTailParagraphs`로 낱개 관리 중이나 STEP6에서 이 하나의 HTML로 교체 |
| tags | `blogForm.hashtag` | string(콤마구분) | 텍스트(반복 `div`) | `split(',').map(trim)` 필요 |

### 2-4. 마크업 태깅 불가 — STEP6(FE 개발)에서 fetchApi로 props 직접 교체 처리 대상

아래 필드는 `CompanyArticleDetail`(press/articles/events와 공유하는 공용 컴포넌트) 내부에서 렌더되어 상세 페이지 호출부의 DOM에 노출되지 않으므로 `data-slug`/`data-slugKey` 마크업 태깅이 불가능하다. STEP6에서 `fetchApi`로 조회한 값을 `CompanyArticleDetail`의 props로 직접 전달하는 방식으로 처리한다.

| 필드 | 현재 전달 방식 | 비고 |
|---|---|---|
| category | `CompanyArticleDetail`의 `category` prop | 공용 컴포넌트 내부 렌더 |
| title | `CompanyArticleDetail`의 `title` prop | 공용 컴포넌트 내부 렌더 |
| date | `CompanyArticleDetail`의 `date` prop | 공용 컴포넌트 내부 렌더 |
| heroImage | `CompanyArticleDetail`의 `heroImage` prop | 공용 컴포넌트 내부 렌더 |
| pager(prev/next: id·title) | `CompanyArticleDetail`의 `prev`/`next` prop | 공용 컴포넌트 내부의 `<nav>`이며, slug 래퍼(`<article>`) **바깥**의 형제 요소라 wrapper 태깅도 불가. prev/next는 "현재 글 자체의 필드"가 아니라 "정렬 순서상 인접 레코드로의 링크"인 관계형 데이터임 |

## 3. API 확인 (최종 체크 — STEP4 완료, 실제 API 호출로 재검증됨)
- 신규 API 필요 여부: **불필요** — 기존 FO 공개 API 3종(`FoPageDataController`/`FoCodeController`/`FoPageFileController`)으로 목록·상세·카테고리 라벨·이미지 전부 처리 가능
- `blog-data` slug는 bo `slug_registry`에 등록되어 있고, `page_data`에 실데이터 10건 존재 확인됨(`GET /api/v1/fo/page-data/blog-data` 직접 호출로 재검증, `totalElements: 10`)
- 목록: `GET /api/v1/fo/page-data/blog-data?page=0&size=10` (`FoPageDataController` → `PageDataService.search()` 재사용, 비로그인 permitAll 확인)
- 상세(단건): 별도 getById 없음 → `GET /api/v1/fo/page-data/blog-data?eq_id={id}` 로 처리(top-level `id` 정확일치)
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
9. pager(prev/next 인접 레코드): 기존 API에 인접조회 로직 없음 — **Option A(BE 변경 없음, FE가 이미 가진 정렬된 10건 목록에서 현재 id의 index로 prev/next 계산) 권장**. Option B(신규 LAG/LEAD 쿼리, 상세 1회 호출로 pager까지 동봉)는 신규 SQL이 필요해 더 무거움.
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

## 8. 비차단(non-blocking) 알려진 이슈 — 코드 수정 없이 종료
1. **레거시 스키마 레코드 5건 목록 공백**(id 1290/1283/1172/1171/1011, 939는 필드 자체 없음) — 구(舊) 필드명(`blogTitle`/`blogImage`/`blogContent`/`blogHashtag`/`blogPubDttm`/`blogCategory`)으로 저장된 과거 테스트 데이터라 현재 `blogForm.{title|image|content|hashtag|publishDttm|category}` 스키마로 값을 못 읽어 목록에서 제목/카테고리/날짜/태그가 공백으로 표시됨(id 링크는 정상). **FE에 구스키마 호환 코드를 추가하지 않기로 함** — 오래된 테스트 데이터를 위한 영구적 이중 스키마 유지비용이 더 크다고 판단. 해당 레코드를 BO 관리자 화면에서 현재 폼으로 다시 저장하면 자동 해결됨(데이터 정리 필요, 코드 변경 아님).
2. **이미지 전부 404(FILE_NOT_FOUND)**: `blogForm.image`가 가리키는 `page-files/{id}`(231/216 등) 실체가 로컬 환경에 없음 — 로컬 DB 시드 데이터에 대응하는 실제 업로드 파일이 없는 로컬 개발 환경 이슈로, FE/BE 코드 문제 아님.
