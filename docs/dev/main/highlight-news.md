# 메인/Markets 최신뉴스(Highlights) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/components/content/HighlightNewsSection.tsx` (공용 컴포넌트 — main/markets variant 공유, `items` prop만 다름)
> - `fo/src/data/highlightNews/highlightNewsData.ts` (실제 fetch 지점 — `fetchMainHighlightNews()` / `fetchMarketHighlightNews(marketCode)`)
> - `fo/src/data/highlightNews/index.ts` (재노출 배럴)
> - `fo/src/app/main/page.tsx` — `<HighlightNewsSection variant="main" title="Catch up on the latest news" sectionId="main-news" />`
> - `fo/src/app/markets/{data-center,power-grid,oil-gas-mining,public-infrastructure,industrial,commercial-residential}/page.tsx` — 6개 페이지 전부 `<HighlightNewsSection variant="markets" title="Highlights" sectionId="markets-highlights" />`
> - 데이터 원본: `press-data`/`blog-data`/`articles-data` (각각 `fo/docs/dev/company/{press,blog,articles}-data.md`에 개별 문서화되어 있음 — 이 문서는 그 세 slug를 **통합·재가공**하는 로직만 다룸)
> 상태: 개발완료 (2026-07-15, API 직접 호출 검증 완료 / 브라우저 UI 검증은 press 게시 데이터 1건 기준으로만 확인)

## 1. 개요

메인 페이지와 markets 6개 페이지의 "최신뉴스" 섹션은 동일한 UI 슬롯(3개 카드)을 쓰지만 데이터 범위가 다르다.

| 페이지 | 함수 | 범위 |
|---|---|---|
| `/main` | `fetchMainHighlightNews()` | press/blog/articles 게시중 항목 **전체 통합**, market 무관 |
| `/markets/{6개}` | `fetchMarketHighlightNews(marketCode)` | 위와 동일하되 각 항목의 `markets` 필드에 **해당 페이지 코드가 포함된 것만** |

둘 다 최종적으로 `publishDttm` 내림차순 상위 3건을 반환한다. 원래는(2026-07-14) markets 6페이지가 정적 하드코딩 데이터를 썼다가, 이후 market 구분 없는 `fetchMainHighlightNews()` 공용 재사용으로 1차 구현했으나, **market별로 관련 뉴스만 노출되어야 한다는 사용자 확인(2026-07-15)에 따라 market 코드 필터링으로 최종 수정**됐다(6번 비고 참고).

## 2. 병합 로직 (`highlightNewsData.ts`)

```ts
// 공통 내부 헬퍼 — main/market 양쪽이 공유(중복 로직 없음)
function mergeAndPickTopNews(pressRows, blogRows, articlesRows): HighlightNewsItem[]
// press/blog/articles 각 rows → toXCard 변환 → tag 리터럴 부여(Press/Blog/Articles)
// → id 접두(`press-{id}` 등, 카테고리 간 id 충돌 방지)
// → publishDttm 내림차순 정렬 → 상위 3건 slice
// → date를 "Mon DD, YYYY" 포맷으로 변환(formatNewsDate)
// → image 없으면 각 카테고리 기존 LIST_FALLBACK_IMAGE로 폴백

async function fetchHighlightNews(market?: string): Promise<HighlightNewsItem[]>
// Promise.all([fetchPressList({page:0, market}), fetchBlogList({page:0, market}), fetchArticlesList({page:0, market})])
// → mergeAndPickTopNews(...) → 실패 시 [](throw 금지, 섹션 자연 숨김)

export const fetchMainHighlightNews = () => fetchHighlightNews();          // market 무관
export const fetchMarketHighlightNews = (marketCode) => fetchHighlightNews(marketCode);
```

- `fetchPressList`/`fetchBlogList`/`fetchArticlesList`(각 `fo/src/app/company/data/{press,blog,articles}Data.ts`)는 기존 시그니처를 유지한 채 **옵션 `market?: string` 파라미터만 추가**됐다. 넘기면 `has_markets_markets={market}` 쿼리 파라미터가 붙는다(3번 참고).
- 게시 상태 조건(`condexpr_status=isVisible=001,publishDttm>=today()?'게시':'미게시'`)은 세 함수 안에 이미 있던 기존 로직 그대로 — 이번 작업에서 건드리지 않았다.
- size는 각 함수 기본값(10) 그대로 사용 — market 필터가 BE(SQL) 레벨에서 먼저 걸리므로, "최근 10건 중 필터링"이 아니라 "필터링된 결과 중 최근 10건"이라 오버페치/누락 문제가 없다.

## 3. Market 코드 필터링 — 신규 BE prefix `has_markets_{필드키}`

### 배경
`press-data`/`blog-data`(articles-data도 동일 구조로 추정, 2026-07-15 기준 데이터 0건이라 실증은 못함)의 `markets` 필드는 BO에서 다중선택으로 설정되며 **콤마구분 문자열(CSV)**로 저장된다. 예: `"001"`, `"001,002"`, `"002,003,004"`, `""`(빈값). 기존 `eq_`(정확일치)로는 다중값 CSV를 매칭할 수 없어 `PageDataService`에 신규 prefix를 추가했다.

### 스펙
- 파라미터: `has_markets_{필드키}={3자리코드}` (예: `has_markets_markets=001`)
- 값 검증: `[0-9]{3}` 형식만 통과(그 외는 조건 무시 — SQL Injection 방지)
- SQL 조건: 값을 콤마로 감싸서 토큰 정확 매칭 — `(',' || COALESCE(data_json->>'{필드키}','') || ',') LIKE '%,{코드},%'`. "001"이 "1001" 같은 부분값에 오매칭되지 않도록 함
- 최상위 + 1단계 중첩(`jsonb_each`) 동시 탐색 — `month_`/`year_`와 동일 패턴(`bo-api/.../PageDataService.java`의 `appendWhereConditions()`/`bindSearchParams()`, `has_markets_` 블록)
- market 코드 매핑(001~006)은 이 문서가 아니라 `fo/docs/dev/markets/faq-data.md` 4번 항목의 `MARKETS_FAQ_CODE` 정의를 그대로 재사용한다(중복 기술 안 함) — `fo/src/app/markets/data/marketsFaqData.ts`의 `MARKETS_FAQ_CODE` 상수

### 검증 (실데이터, 2026-07-15)
```
press has_markets_markets=001 → id=1551(markets="001"), id=1549(markets="001,002") 포함 / id=1557(markets="002,003,004") 제외
press has_markets_markets=002 → id=1557, id=1549 포함 / id=1551 제외
press has_markets_markets=004 → id=1557만
press has_markets_markets=005 → 0건
blog  has_markets_markets=001 → id=1560(markets="001,002,003"), id=1558(markets="001,002")
blog  has_markets_markets=004 → 0건
잘못된 코드 형식(01, 0011, abc) → 조건 무시, 전체 반환(안전하게 무시됨)
```

## 4. 샘플 응답

```json
// GET /api/v1/fo/page-data/press-data?page=0&size=10&has_markets_markets=001&condexpr_status=...&condval_status=게시
{
  "content": [
    { "id": 1551, "dataJson": { "pressForm": { "title": "ccc", "markets": "001", "publishDttm": "2026-07-24", "isVisible": "001" } } }
  ],
  "totalElements": 1
}
```

## 5. 비고
1. **2026-07-15 기준 markets 페이지가 대부분 0건으로 보이는 것은 필터 버그가 아니다.** 현재 게시중(`publishDttm>=today()`) 상태인 항목이 press id=1551(markets="001") 하나뿐이라, data-center(001) 페이지만 1건 노출되고 나머지 5개 페이지는 0건이다. market 필터 자체는 3번의 API 검증대로 코드별로 정확히 다른 집합을 반환한다.
2. articles-data는 2026-07-15 기준 전체 0건이라 `markets` 필드가 실제로 press/blog와 동일한 CSV 포맷인지 실데이터로 확인하지 못했다. articles에 데이터가 생기면 한 번 확인 필요(폼 구조 자체는 press와 동일하다고 이전에 확인된 바 있어 동일할 것으로 예상).
3. `HighlightNewsSection`은 `items.length === 0`이면 `null`을 반환해 섹션 자체가 숨겨진다 — 0건인 markets 페이지들은 현재 "Highlights" 섹션이 화면에 아예 안 보이는 상태(정상 동작).

## 6. STEP별 진행 이력
| 일자 | 내용 |
|---|---|
| 2026-07-14 | main 페이지 정적 하드코딩(`highlightNews/main.ts`) 확인 → 실데이터 연동 목표설정, `#전체진행` 승인 → `fetchMainHighlightNews()` 신규 구현(press/blog/articles 통합, publishDttm 최신 3건) |
| 2026-07-14 | pub(ls-publish)↔fo 브라우저 DOM 비교 검증(outerHTML 직접 대조, 클래스 구조 100% 일치 확인) |
| 2026-07-14 | markets 6페이지도 동일한 정적 하드코딩(`highlightNews/markets.ts`) 발견 → pub 디자인 원본이 6페이지 전부 동일 내용임을 확인하고 1차로 `fetchMainHighlightNews()` 그대로 재사용(market 무관)으로 구현 |
| 2026-07-15 | 사용자 확인: "market은 수정되야해 ... 각자 market 페이지에 최신순으로" → market코드별 필터링이 맞다고 정정. BE `has_markets_{필드키}` prefix 신규 추가(3번) + FE `fetchMarketHighlightNews`로 6페이지 교체, `mergeAndPickTopNews` 공통 헬퍼로 리팩토링(중복 제거) |
| 2026-07-15 | BE/FE 전부 커밋·푸시 완료 (`bo-api` `18f5c3f`, `fo` `07c1f4b`) |
