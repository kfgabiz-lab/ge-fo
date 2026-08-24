# Company 상세 페이지(articles/blog/press/events) SEO 메타데이터 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/articles/[id]/[slug]/page.tsx`
> - `fo/src/app/company/blog/[id]/[slug]/page.tsx`
> - `fo/src/app/company/press/[id]/[slug]/page.tsx`
> - `fo/src/app/company/events/[id]/[slug]/page.tsx`
> - (공통 헬퍼) `fo/src/lib/pageDataSeo.ts`
> 상태: 개발완료 (문서 작성 시점 실제 코드 상태 기준 — 하단 "6. 비고" 참고)
> ⚠️ 라우트 경로는 이후 별도 작업(FO 콘텐츠 상세 URL을 `{id}/{slug}` 2세그먼트로 전환)으로 `detail/[id]` → `[id]/[slug]`로 바뀌었다(2026-08-24). 본 문서의 SEO 메타데이터 설계 자체(필드 매핑/조회조건/공통헬퍼)는 그 작업의 영향을 받지 않아 변경 없음 — 경로 표기만 최신화했다.

## ⚠️ 연동 방식 — data-slug/data-slugKey DOM 마크업 태깅이 아님
이 작업 단위는 화면에 표시되는 콘텐츠를 `data-slug`/`data-slugKey` 속성으로 JSX에 태깅해 클라이언트 렌더 트리에 값을 바인딩하는 일반적인 FO 데이터 바인딩 방식이 아니다. Next.js의 `generateMetadata` 서버 함수에서 page_data를 조회해 `<head>`(title/description/OG/Twitter)에 값을 넣는 방식이며, DOM에 `data-slug`/`data-slugKey` 속성을 추가하지 않는다.

## 1. 대상 slug (4개, 단건)
| 라우트 | data-slug | where 상수 | 다건 여부 |
|---|---|---|---|
| `articles/[id]/[slug]` | `articles-data` | `ARTICLES_STATUS_WHERE` (`@/app/company/data/articlesData`) | 단건 |
| `blog/[id]/[slug]` | `blog-data` | `BLOG_STATUS_WHERE` (`@/app/company/data/blogData`) | 단건 |
| `press/[id]/[slug]` | `press-data` | `PRESS_STATUS_WHERE` (`@/app/company/data/pressData`) | 단건 |
| `events/[id]/[slug]` | `events-data` | `eventsDetailQuery(id, { preview })` (`@/app/company/data/eventsData`) — 내부적으로 `EVENTS_VISIBLE_WHERE` 사용 | 단건 |

## 2. 필드 매핑 (dataJson → Metadata, DOM data-slugKey 아님)
| dataJson 필드(flatten 기준) | Metadata 필드 | 타입 | 설명 |
|---|---|---|---|
| `seo.meta_title` | `title`, `openGraph.title`, `twitter.title` | string | 값 없으면 빈 문자열 `""` 그대로 반환 |
| `seo.meta_description` | `description`, `openGraph.description`, `twitter.description` | string | 값 없으면 빈 문자열 `""` 그대로 반환 |

- 공통 헬퍼: `fo/src/lib/pageDataSeo.ts`의 `buildPageDataSeoMetadata(params: { slug: string; id: string | number; where?: Record<string,string> }): Promise<Metadata>`
- 내부 처리: 공통함수 `fetchData`(`fo/src/lib/pageDataApi.ts`)로 PK 단건 조회 → `flattenPageDataItem`(`fo/src/lib/pageData.ts`)로 평탄화 → `row["seo.meta_title"]`/`row["seo.meta_description"]` 추출
- 라우트별 전용 SEO 함수는 신규로 만들지 않는다(product의 `fetchProductSeoBySlug`처럼 4개를 각각 만드는 방식 미채택). 4개 라우트 모두 이 공통 헬퍼 하나를 호출한다.
- OG/Twitter 범위: title/description만 채운다. `product/[id]/[slug]/page.tsx` 패턴과 동일. training(`buildOgMetadata`)이 채우는 images/card 등 풀세트는 채택하지 않는다.

## 3. API 확인 (최종 체크)
- 신규 API 필요 여부: **기존 활용 가능** (신규 API 불필요)
- 참고 엔드포인트: `GET /api/v1/fo/page-data/{slug}/{id}` — 응답 `dataJson.seo`에 `meta_title`/`meta_description`이 이미 포함되어 내려온다. bo-api(BE) 변경 없음.

## 4. 조회 조건
- where(필터 조건식, evalConditionExpr 문법):
  - articles/blog/press 공통: `condexpr_status: "is_visible=001,publish_dttm<=now()?'게시':'미게시'"`, `condval_status: "게시"` (preview 모드일 때는 `{}`로 무조건 통과)
  - events: `condexpr_status`/`condval_status` 동일(`EVENTS_VISIBLE_WHERE`). generateMetadata는 상세 조회 조건만 쓰고, 인접글(이전/다음) 전용 `EVENTS_PAST_WHERE`는 적용하지 않는다(본문 fetch와 동일 조건).
- row limit(단건/다건 개수): 단건 — URL 경로의 `id`로 PK 직접 조회(`/page-data/{slug}/{id}`), 목록 조회 아님
- orderBy: 해당없음 — PK 단건조회이므로 정렬 불필요
- 2차 정렬(tie-breaker): 해당없음(위와 동일 사유)
- preview 분기: 각 라우트 generateMetadata에서 기존 공통함수 `isPreviewActive(slug, id)`(`fo/src/lib/previewMode.ts`)를 호출해 preview면 `where: {}`, 아니면 위 status where를 적용

## 5. 샘플 응답 데이터
> 아래는 코드(`buildPageDataSeoMetadata`)가 참조하는 필드 **구조**이며, 실제 meta_title/meta_description 문자열 값은 이 문서 작성 시점에 직접 조회해 확인한 것이 아니다(추정 아님 — 구조는 코드로 확인됨, 값 자체만 미확인).

```json
{
  "id": 123,
  "dataJson": {
    "seo": {
      "meta_title": "예시: 기사 제목 | LS ELECTRIC",
      "meta_description": "예시: 기사 요약 설명"
    }
  }
}
```

`flattenPageDataItem` 적용 후 `row["seo.meta_title"]`, `row["seo.meta_description"]`로 접근한다.

## 6. 비고
- **`fo/docs/dev/` 디렉터리는 이 문서 작성 이전까지 디스크에 존재하지 않았다(git 추적 대상도 아니었음).** `fo/docs/fo-data-binding.md`(71/73/77행)는 `fo/docs/dev/company/blog-data.md`, `press-data.md`, `events-data.md`를 "승인됨" 상태로 참고 문서인 것처럼 링크하고 있으나, 실제로는 해당 파일들이 없다(articles-data 행도 "구현완료 — 작업단위 문서 없음"으로 기재되어 있음). 이 문서(`detail-seo-metadata.md`)가 `fo/docs/dev/` 하위 최초 파일이다. 기존 링크 4건이 가리키는 문서(blog/press/events/articles의 본문 콘텐츠 바인딩 자체에 대한 설계 문서)는 이 SEO 메타데이터 작업과는 별개 항목이며, 이번 작업에서 신규로 작성하지 않았다.
- **상태를 "개발완료"로 기재한 근거**: 이 문서 작성 중 대상 파일 4개(`.../page.tsx`)와 공통 헬퍼(`fo/src/lib/pageDataSeo.ts`)를 직접 Read로 확인한 결과, 4개 라우트 모두 이미 `generateMetadata`를 export하고 있고 `buildPageDataSeoMetadata`를 호출하며, 이 문서에 기술된 설계(공통 헬퍼 1개, 빈값 그대로 반환, title/description만 OG/Twitter 채움, preview 분기)와 정확히 일치했다. 애초 지시는 "상태: 승인됨"이었으나, 실제 코드 상태를 그대로 반영해야 한다는 원칙에 따라 "개발완료"로 기재한다. 이 상태 판단(설계 문서 작성 시점에 이미 코드가 존재하는 상황)이 맞는지는 fo-orchestrator/사용자 확인이 필요하다.
- **확인 필요 — Request Memoization 실측 미완료**: generateMetadata와 페이지 컴포넌트가 각각 `buildPageDataSeoMetadata`/`fetchData`로 같은 PK 상세 엔드포인트를 호출한다(동일 URL). `fo/src/lib/pageDataSeo.ts`는 React `cache()`로 감싸져 있지 않고, `fo/src/lib/api.ts`의 `fetchApi`는 표준 fetch에 `cache: "no-store"`를 기본 적용한다. Next.js Request Memoization이 이 구성에서 실제로 요청을 1회로 합쳐주는지, 아니면 2회 호출되는지는 코드만으로 확정할 수 없어 **실제 네트워크 요청 횟수 실측이 필요**하다(설계상 정해둔 것은 "2회로 확인되면 헬퍼를 `cache()`로 감싼다"는 조건부 대응뿐, 실측 결과에 따른 코드 변경 여부는 별도 확인 필요).
- 데이터 실존 확인 결과(page_data 직접 조회, 사용자 제공): articles-detail 22건 중 21건, blog-detail 25건 중 19건, press-detail 27건 중 25건, events-detail 17건 중 16건에 seo 값 존재. 나머지(총 10건)는 빈 값 → "7. 데이터 없음 시 동작"의 빈 문자열 반환 정책 적용 대상.
- 빈 SEO값 폴백 정책은 product 라우트(`fo/src/app/()/product/[id]/[slug]/page.tsx`, `toProductSeoRow`)와 동일하게 **빈 문자열 그대로 반환**하며, layout.tsx의 기본 title("LS ELECTRIC | Smart Energy Global Leader")로 폴백시키지 않는다(training의 `buildCourseMetadata`가 `{}`를 반환해 layout 기본값으로 폴백시키는 방식은 이번 작업에서 미채택).
- 검증 계획(문서화 대상 — 이번 STEP에서 실행하지 않음): fo(3002) 4개 상세 페이지에서 `<title>`/`<meta name="description">`/`og:title`/`og:description` 실반영 확인, 빈 SEO값 레코드에서 빈 문자열 처리 확인, preview 모드 동작 확인, 네트워크 요청 횟수 실측.

## 7. 데이터 없음(빈 값/매칭 0건) 시 동작
- `<head>` 메타데이터이므로 DOM 컨테이너 개념 자체가 없다. `seo.meta_title`/`seo.meta_description`이 비어 있으면 `title`/`description`/`openGraph.*`/`twitter.*`를 빈 문자열 `""`로 반환한다(layout.tsx 사이트 공통 기본값으로 폴백하지 않음).
- PK 조회 자체가 where(게시 상태) 조건에 안 걸려 매칭 0건이 되는 경우(비공개 레코드를 preview 없이 접근하는 등)는 본문 렌더링과 동일하게 기존 `fetchData`의 404 처리(`notFound()`)를 따른다 — 이 문서가 다루는 SEO 메타데이터 자체의 별도 정책이 아니라 기존 상세 페이지 공통 동작이다.
