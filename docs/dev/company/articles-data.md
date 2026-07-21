# Company Articles 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/articles/page.tsx` (목록 — 현재 `<CompanyFeedPage variant="articles" />` 한 줄뿐, 완전 정적. press와 동일하게 실데이터 연동 시 자체 데이터 페칭 페이지로 교체 필요)
> - `fo/src/app/company/components/CompanyFeedFeatured.tsx` / `CompanyFeedListGrid.tsx` / `CompanyFeedListSection.tsx` / `CompanyFeedListToolbar.tsx` (공용 컴포넌트 — press와 완전히 동일하게 재사용, variant="articles"로 그대로 동작. 수정 불필요, 이미 `CompanyFeedVariant = "press" | "articles"`로 타입 지원됨)
> - `fo/src/app/company/articles/detail/[id]/page.tsx` (상세 — **신규 생성 필요**, articles는 상세 라우트 자체가 없음)
> - `fo/src/app/company/components/CompanyArticleDetail.tsx` (공용 컴포넌트 — 이미 `"articles"` variant 지원됨, 직접 태깅 대상 아님)
> - `fo/src/app/company/data/articlesData.ts` (신규 — pressData.ts를 그대로 이식, BE 로직 100% 동일하므로 category 로직 제외한 구조도 press와 동일)
> - 참고(정적 폴백 데이터, 실연동 전): `fo/src/app/company/data/articlesListContent.ts` — 폴백 이미지(`hero.png`, `list_01.png`~`list_09.png`)는 그대로 재사용
> 상태: 구현 완료(BE 변경 없음, press/blog용 범용 로직 재사용). `tsc` 통과, API 레벨 검증 완료. 실데이터 게시상태 조건 만족 0건이라 화면은 현재 빈 목록으로 보임(6-2 참고, 코드 문제 아님) — 사용자가 BO에서 테스트 데이터 추가 후 재확인 예정 / **정렬 A-Z/Z-A 확장 설계중(2026-07-21, 승인 대기 — 8절 참고)** / **상세조회·pager(이전글/다음글) 성능개선 설계중(2026-07-21, 승인 대기 — 9절 참고)**

## 1. data-slug
- 값: `articles-data` (BO에 이미 등록된 slug, 목록 Featured / 목록 리스트 / 상세 전부 동일 slug 재사용)
- 다건 여부: 혼합 — Featured **단건**(정렬된 목록의 1번째 글) / 리스트 **다건(배열)** / 상세 **단건**(id 기반 조회)

## 2. data-slugkey 매핑

> ⚠️ press-data와 동일하게 **category 필드 자체가 없다**(`articlesForm`에 category 키 없음, 실제 API 응답으로 확인). description도 별도 필드 없이 `seo.metaDescription` 재사용(press/blog와 공통 결론, blog-data.md 6-10 참고).

### 2-1. 상세 — 본문 (단건, 신규 `articles/detail/[id]/page.tsx`)
| slugKey | dataJson 필드(실제 accessor) | 타입 | 설명 |
|---|---|---|---|
| content | `articlesForm.content` | string(HTML, 리치텍스트) | 실데이터로 필드명 확인됨(id 1304/1303 등). press와 동일하게 영상은 별도 필드 없이 content HTML 내 iframe으로 통합(전례 재사용, 별도 확인 불필요) |

### 2-2. 마크업 태깅 불가 — fetchApi로 props 직접 주입 대상 (press와 완전히 동일 목록)
| 영역 | 필드 | dataJson 필드(accessor) | 비고 |
|---|---|---|---|
| Featured/리스트 | id | `id`(top-level) | id 기반 동적 라우트로 신규 생성 |
| Featured/리스트 | image | `articlesForm.image[0]` | `/api/v1/fo/page-files/{id}` |
| Featured/리스트 | title | `articlesForm.title` | |
| Featured(단건만) | description | `seo.metaDescription` | 리스트에는 description 없음(press와 동일, `CompanyFeedListItem` 타입에 필드 자체 없음) |
| Featured/리스트 | date | `articlesForm.publishDttm` | |
| 상세 | title/date/heroImage/pager | `CompanyArticleDetail`의 각 prop | 공용 컴포넌트 내부 렌더(press-data.md 2-2와 동일 사유). **(2026-07-21 갱신)** pager(prev/next) 값의 조회 방식이 신규 인접글 전용 엔드포인트(9절)로 변경됨 — 기존 FE index 계산 방식(Option A)은 폐기 |

## 3. API 확인
- 신규 API/BE 로직 필요 여부: **불필요** — press-data와 완전히 동일한 기존 FO API 재사용(`FoPageDataController`→`PageDataService.search()`), 이번에 press/blog에 추가한 `month_`/`year_`/`title|content`/`condexpr_` 전부 slug 무관 범용 로직이라 추가 개발 없이 그대로 사용 가능
- 목록: `GET /api/v1/fo/page-data/articles-data?page=0&size=10&condexpr_status=...&condval_status=게시`
- 상세(단건): `GET /api/v1/fo/page-data/articles-data?eq_id={id}&condexpr_status=...&condval_status=게시`. **⚠️ 2026-07-21 갱신**: 상세 전용 성능개선 엔드포인트(신규, 9절)로 대체 예정 — 상세 설계는 9절 참고
- 이미지: `GET /api/v1/fo/page-files/{fileId}`

## 4. 조회 조건 (press-data.md 4절과 완전히 동일 — category만 없음)
- where: `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시` (게시상태 — `publishDttm`은 이미 지난 날짜여야 노출되므로 `<=`, press-data.md 9-A와 동일)
- 검색: `title|content=검색어` (press-data.md 9-B)
- 정렬: `sort=createdAt,desc|asc` (press-data.md 9-C)
- 월/연도 필터: `month_publishDttm=01~12`, `year_publishDttm=YYYY`(옵션 2026/2025 하드코딩, press와 동일) (press-data.md 9-D/D-2)
- row limit: 리스트 `size=10` 페이지네이션 / Featured는 목록 1번째 재사용 / 상세는 `eq_id` 단건
- orderBy: 기본 `created_at DESC`(파라미터 없음)

## 5. 샘플 응답 데이터 (실제 API 호출 결과, `GET /api/v1/fo/page-data/articles-data?size=9`)

```json
{
  "content": [
    {
      "id": 1351,
      "templateSlug": "articles-detail",
      "dataJson": {
        "id": 1351,
        "seo": { "slug": "...", "metaTitle": "...", "metaDescription": "qwe123124123" },
        "productList": [1346],
        "articlesForm": {
          "image": [230], "title": "...", "views": "9",
          "content": "<p>qwe123124123</p>", "markets": "002",
          "isVisible": "002", "publishDttm": "2026-07-08"
        }
      },
      "createdAt": "2026-07-08T04:41:28.021279Z"
    }
  ],
  "totalElements": 9
}
```

FE 바인딩 참조 경로: `content[i].id` / `content[i].dataJson.articlesForm.{title|content|publishDttm|isVisible|image[0]}` / `content[i].dataJson.seo.metaDescription`.

## 6. 비고
1. **알려진 데이터 상태(코드 버그 아님)**: articles-data 전체 9건 중 신규 스키마(`articlesForm.{title,content,...}`) 일치는 3건(1351/1304/1303)뿐이고, 나머지 6건은 구 스키마(`articlesTitle`/`articlesImage`/`articlesPubDttm` 등, id 1170/1164/1150/1143/1009/936). press/blog와 동일 원칙으로 **FE 레거시 호환 코드 추가하지 않음**.
2. **현재 실데이터로는 공개 목록이 0건으로 나올 수 있음**: 신규 스키마 3건 중 1351은 `isVisible=002`(비공개), 1304/1303은 `publishDttm`이 각각 2026-07-08/07-06으로 오늘(2026-07-14)보다 과거라 A(게시상태) 조건상 전부 "미게시" 판정됨. **코드 문제 아님** — press/blog 때와 동일하게 BO 관리자 화면에서 `publishDttm`을 오늘 이후로 재저장하면 해결되는 데이터 이슈. QA 시 이 상태를 알고 진행 필요.
3. Featured/리스트 공용 컴포넌트(`CompanyFeedFeatured`/`CompanyFeedListGrid`/`CompanyFeedListSection`/`CompanyFeedListToolbar`)는 press 작업 때 이미 `variant` prop 기반으로 범용화되어 있어 **컴포넌트 수정 없이 `variant="articles"`만 넘기면 그대로 동작**. Featured/리스트 폴백 이미지도 이미 `/img/company/articles/{hero,list_01~09}.png` 존재 확인.
4. 상세 페이지는 press와 동일하게 `articles/detail/[id]/page.tsx` 신규 생성, 구 고정 경로(`articles/detail/page.tsx`, 현재 미존재이므로 삭제 대상 없음)는 처음부터 동적 라우트로 시작.

## 7. STEP별 진행 이력
| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1~4 | 호출자(직접 분석, press-data.md 선례 재사용) | 2026-07-14 | 실제 API 호출로 articlesForm 구조/신구 스키마 비율/공개 게시 데이터 상태 확인. BE 신규 개발 불필요 확정(press/blog용으로 만든 범용 필터 로직 그대로 재사용) |
| STEP3.5(성능개선) | fo-dev-doc-writer | 2026-07-21 | 상세 페이지 진입 3~4초 지연 문제 해결을 위해 상세조회/pager를 Option B(신규 BE 엔드포인트 2개)로 재설계 — 상세 단건 `GET /api/v1/fo/page-data/articles-data/{id}`, 인접글 `GET /api/v1/fo/page-data/articles-data/{id}/adjacent`. 기존 Option A(FE index 계산) 폐기 결정 문서화(상태: 설계중, 승인 대기, 9절 참고) |

## 8. 정렬 확장 — A-Z / Z-A (2026-07-21 신규 스코프, 설계중·승인 대기)
- 정렬 옵션: 기존 Latest/Oldest(2종, press-data.md 9-C와 공유) → **Latest/Oldest/A-Z/Z-A(4종)**로 확장
  - Latest: 기존 유지(파라미터 생략) / Oldest: 기존 유지(`sort=createdAt,asc`)
  - A-Z: `sort=articles.title,asc` / Z-A: `sort=articles.title,desc`
- title 정렬 경로: `articles.title` — `PageDataService`의 `sort` dot-notation 규칙(`<래퍼키>.title` → `ORDER BY data_json->'<래퍼키>'->>'title'`)에 따라 확정. dev DB 실측(bare 래퍼 + title 구조)으로 확인됨(STEP1)
- ⚠️ 참고: 위 2~6절의 articles 필드 accessor는 `articlesForm.xxx`(폼 래퍼)로 기록돼 있다. title 정렬 경로가 `articles`(bare 래퍼) 기준이라는 이 STEP1 사실과의 표기 정리는 press-data.md 9-C-2와 동일하게 **STEP3에서 함께 확인 필요**
- Featured 처리: 정렬된 목록의 1번째 글을 상단 Featured로 올리고 리스트에서 제외하는 기존 로직은 변경 없이 유지 — A-Z 정렬 시 알파벳상 가장 앞선 글이 Featured가 되는 것을 허용하며 별도 고정/예외 처리는 두지 않음
- FE sort 상태 타입: `"latest" | "oldest"` → `"latest" | "oldest" | "az" | "za"`로 확장 필요
- FE 대상: `CompanyFeedListToolbar.tsx`(press와 공유하는 공용 컴포넌트)의 정렬 `GuideSelect` MenuItem에 A-Z/Z-A 옵션 추가(라벨 "A-Z"/"Z-A"). press-data.md의 동일 절(9-C-2)과 컴포넌트를 공유하므로 UI 변경은 1곳에서 이뤄지며 두 slug(press-data/articles-data) 모두에 반영됨
- API 확인: **기존 활용 가능(잠정) — 확인 필요/검증 예정.** press-data와 완전히 동일한 BE 범용 `sort` 로직 재사용이라 별도 재검증 없이 press-data.md의 판정을 따르되, 코드/실호출 기반 최종 검증은 **STEP3(fo-be-analyzer)에서 확인 예정** — 신규 BE 개발 필요 여부는 그 결과에 따라 확정

### 승인 이력
| 일자 | 내용 |
|---|---|
| 2026-07-21 | 정렬 A-Z/Z-A 확장(8절) STEP1~2 설계 확정, fo-dev-doc-writer가 문서화(상태: 설계중, 승인 대기). press-data.md와 동일 공용 컴포넌트(`CompanyFeedListToolbar`) 변경이라 두 문서에 동시 반영. API 확인은 "기존 활용 가능(잠정)"이나 최종 검증은 STEP3(fo-be-analyzer) 예정 — `#개발` 승인 전까지 개발 착수 없음 |

## 9. 상세 조회 성능 개선 — pager Option B 채택 (2026-07-21, STEP3 확정·승인 대기)

### 배경
BLOG/PRESS/ARTICLE/EVENT 공통으로 상세 페이지 진입 시 3~4초 지연이 발생하는 문제가 확인됐다(blog-data.md 10절과 동일 배경). articles도 상세 페이지(`fo/src/app/company/articles/detail/[id]/page.tsx`)가 `fetchArticlesDetail(id)`와 `fetchArticlesList({page:0})`(pager 계산용 목록 최대 10건 재조회)를 병렬 호출한 뒤, 목록 배열에서 현재 id의 index를 찾아 앞/뒤 요소를 prev/next로 쓰는 방식(Option A)을 그대로 쓰고 있다. 상세 진입마다 목록 전체 조회 비용이 추가로 들고, 현재 글이 최신 10건(page:0) 목록 밖에 있으면 prev/next가 항상 비는 버그도 동일하게 갖고 있다.

### 채택 설계 — 상세/인접 분리 신규 엔드포인트 2개
blog-data.md 10절과 동일한 설계(Option B)를 articles-data slug에도 동일하게 적용한다.

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

### 화면(articles-data) 파라미터
| 항목 | 값 |
|---|---|
| slug | `articles-data` |
| 상세 게이트(where) | `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시` (4절과 동일 조건식) |
| 인접 sortField | `createdAt` |
| 인접 titleField | `articles.title` (dot-notation bare 래퍼 — 8절에서 이미 title 정렬 경로로 확정된 표기와 동일) |
| 인접 스코프 게이트 | `condexpr_status=isVisible=001,publishDttm<=today()?'게시':'미게시'&condval_status=게시` (상세와 동일) |

### 재사용되는 기존 BE 로직
`PageDataService`의 `appendWhereConditions` / `bindSearchParams` / `buildJsonPath` / `isValidSegments` / `toAuditColumn` / `mapRowToResponse`를 그대로 재사용. 신규로 추가되는 코드는 `FoPageDataController`의 상세·인접 GET 엔드포인트 2개와 `PageDataService`의 `findPublicDetail` / `findAdjacent` 메서드 2개뿐이며, blog/press/events와 공용 구현(slug 무관 제네릭)이다. `SecurityConfig`의 `/api/v1/fo/**` permitAll 설정이 신규 엔드포인트도 자동으로 커버한다.

### API 확인 (최종 체크)
- 신규 API 필요 여부: **신규 필요** — 상세 단건 GET 1개 + 인접글 GET 1개, 총 2개(blog-data와 공용 구현이라 slug별 추가 개발은 아님)
- 제안 엔드포인트: `GET /api/v1/fo/page-data/articles-data/{id}`, `GET /api/v1/fo/page-data/articles-data/{id}/adjacent?sortField=createdAt&titleField=articles.title`
- bo `SlugRegistry`/`PageData` 상의 실제 라우팅 등록 여부는 이번 STEP에서 직접 검증하지 않음 — **확인 필요**(bo 관리자 화면에서 확인 요청)

### FE 반영 범위 (참고, 개발 착수는 `#개발` 승인 이후)
`fo/src/app/company/articles/detail/[id]/page.tsx`의 `fetchArticlesList({page:0})` 호출을 제거하고 신규 인접글 엔드포인트 호출로 교체 필요(STEP6 범위). 이번 STEP3.5에서는 설계 확정·문서화까지만 진행한다.

### 승인 이력
| 일자 | 내용 |
|---|---|
| 2026-07-21 | 상세 페이지 진입 지연 문제 해결을 위해 pager Option B(신규 엔드포인트 2개) STEP1~3 설계 확정, fo-dev-doc-writer가 문서화(상태: 설계중, 승인 대기). blog-data.md와 동일 공용 구현이라 여러 문서에 동시 반영. API 확인 "신규 필요"로 확정 — `#개발` 승인 전까지 개발 착수 없음 |
