# Company Articles 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/articles/page.tsx` (목록 — 현재 `<CompanyFeedPage variant="articles" />` 한 줄뿐, 완전 정적. press와 동일하게 실데이터 연동 시 자체 데이터 페칭 페이지로 교체 필요)
> - `fo/src/app/company/components/CompanyFeedFeatured.tsx` / `CompanyFeedListGrid.tsx` / `CompanyFeedListSection.tsx` / `CompanyFeedListToolbar.tsx` (공용 컴포넌트 — press와 완전히 동일하게 재사용, variant="articles"로 그대로 동작. 수정 불필요, 이미 `CompanyFeedVariant = "press" | "articles"`로 타입 지원됨)
> - `fo/src/app/company/articles/detail/[id]/page.tsx` (상세 — **신규 생성 필요**, articles는 상세 라우트 자체가 없음)
> - `fo/src/app/company/components/CompanyArticleDetail.tsx` (공용 컴포넌트 — 이미 `"articles"` variant 지원됨, 직접 태깅 대상 아님)
> - `fo/src/app/company/data/articlesData.ts` (신규 — pressData.ts를 그대로 이식, BE 로직 100% 동일하므로 category 로직 제외한 구조도 press와 동일)
> - 참고(정적 폴백 데이터, 실연동 전): `fo/src/app/company/data/articlesListContent.ts` — 폴백 이미지(`hero.png`, `list_01.png`~`list_09.png`)는 그대로 재사용
> 상태: 구현 완료(BE 변경 없음, press/blog용 범용 로직 재사용). `tsc` 통과, API 레벨 검증 완료. 실데이터 게시상태 조건 만족 0건이라 화면은 현재 빈 목록으로 보임(6-2 참고, 코드 문제 아님) — 사용자가 BO에서 테스트 데이터 추가 후 재확인 예정

## 1. data-slug
- 값: `articles-data` (BO에 이미 등록된 slug, 목록 Featured / 목록 리스트 / 상세 전부 동일 slug 재사용)
- 다건 여부: 혼합 — Featured **단건**(정렬된 목록의 1번째 글) / 리스트 **다건(배열)** / 상세 **단건**(id 기반 조회)

## 2. data-slugKey 매핑

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
| 상세 | title/date/heroImage/pager | `CompanyArticleDetail`의 각 prop | 공용 컴포넌트 내부 렌더(press-data.md 2-2와 동일 사유) |

## 3. API 확인
- 신규 API/BE 로직 필요 여부: **불필요** — press-data와 완전히 동일한 기존 FO API 재사용(`FoPageDataController`→`PageDataService.search()`), 이번에 press/blog에 추가한 `month_`/`year_`/`title|content`/`condexpr_` 전부 slug 무관 범용 로직이라 추가 개발 없이 그대로 사용 가능
- 목록: `GET /api/v1/fo/page-data/articles-data?page=0&size=10&condexpr_status=...&condval_status=게시`
- 상세(단건): `GET /api/v1/fo/page-data/articles-data?eq_id={id}&condexpr_status=...&condval_status=게시`
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

