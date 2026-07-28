# Product 목록(통합검색 All 탭) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/search/components/SearchAllTabContent.tsx` (Product 섹션 131~144줄, 탭 라벨/카운트 64~81줄)
> - `fo/src/app/search/components/SearchProductCard.tsx` (Product 카드)
> - `fo/src/data/search/searchAllContent.ts` (`searchAllProducts`/`searchAllTabs` 정적 목업)
>
> 상태: 설계중

## 1. data-slug
- 값: **없음(N/A)** — 개별 제품 데이터 자체는 `product-data`(PageData) 소스에서 나오지만, 이 섹션은 카테고리/그룹 조회가 아니라 "키워드 매칭 + 랭킹" 검색 결과이므로 `fetchData(slug/where/orderBy, evalConditionExpr)`로 표현되는 단순 슬러그 조회가 아니다. `data-slug-repeat`/`data-slug-item`/`data-slugKey` 마크업 태깅 대상이 아니며, slug 값을 임의로 짓지 않는다.
- 다건 여부: 다건(배열), row limit 4

## 2. data-slugKey 매핑
해당 없음(N/A) — slug 기반 매핑 대상이 아니다. STEP6에서 신규 검색 API 결과를 현재 `searchAllProducts.map(...)` 자리에 그대로 연동하는 방식(마크업/CSS 변경 없음)이며, 카드가 실제로 쓰는 필드는 아래 5번의 6개(`href`/`image`/`category`/`highlight`/`title`/`description`)다.

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **신규 필요**
- 사유(fo 코드 기준 확인 — bo-api 실측은 STEP4에서 fo-be-analyzer가 재확인): 기존 제품 관련 API는 전부 카테고리/그룹 기준 조회이며(`FoProductGroupService.getProductGroups`, `FoCategoryController`의 `/categories/{id}/products`·`/lv2`), "키워드 매칭 + 매칭순위 정렬" 개념의 검색 API가 확인되지 않음.
- 제안 엔드포인트(예시, 확정 아님 — STEP4에서 fo-be-analyzer가 정식 설계): `GET /api/v1/fo/search/products?q={keyword}&limit=4`

## 4. 조회 조건
- where(필터 조건식): 키워드 매칭(대상 필드 확인 필요) + "Lv3 채널 기준"(의미 확인 필요, 아래 6번 참고)
- row limit(단건 / 다건 개수): 4
- orderBy(정렬 필드 + ASC/DESC): 1) 키워드 매칭 순(산정 기준 확인 필요) 2) update_date DESC(실체 확인 필요)
- 2차 정렬(tie-breaker): 확인 필요 — 통상 id이나 미확정

## 5. 샘플 응답 데이터
확정된 API 응답 없음. 현재 정적 목업(`searchAllContent.ts`의 `searchAllProducts`) 필드 구조만 참고용으로 표시 — 실제 검색 API 응답 필드와 다를 수 있음(추정):
```json
[
  {
    "id": "sp-1",
    "href": "/product/metasol-ms",
    "image": "/img/devices-systems/product/product_metasol_ms.png",
    "category": "DC Device",
    "highlight": "DC Miniature Circuit Breaker",
    "title": "Metasol MS",
    "description": "Metasol Contactor & Overload Relay"
  }
]
```
`SearchProductCard.tsx`가 실제로 렌더링에 사용하는 필드는 `href`(Link 이동), `image`, `category`(경로 라벨), `highlight`(경로 텍스트), `title`, `description` 6개.

## 6. 비고

### 중요 — STEP1+2 분석 결과와 실제 코드 불일치 발견(코드 직접 확인)
STEP1+2 산출 보고서에는 "⑦카드: 키워드 일치 텍스트 굵게(`renderSearchTextHighlight`)"라고 돼 있으나, 실제 `fo/src/app/search/components/SearchProductCard.tsx` 코드를 Read/Grep으로 직접 확인한 결과 `renderSearchTextHighlight`/`renderInlineTextHighlight`/`renderTitleTextHighlight` 계열 함수 호출이 전혀 없다. 해당 강조 함수는 `SearchDocumentsCard.tsx`, `SearchPageListItem.tsx`, `SearchMediaListItem.tsx` 3개 파일에서만 사용 중이며, `SearchProductCard.tsx`는 `category`/`highlight`/`title`/`description`을 전부 plain text로만 렌더링한다(굵게 처리 마크업 없음). → "키워드 일치 텍스트 굵게" 요구사항이 Product 카드 퍼블리싱에는 반영돼 있지 않은 상태로 보이며, 이 부분은 단정하지 않고 아래 확인 필요 목록에 포함한다.

Hover 밑줄은 CSS로 확인됨 — `fo/src/assets/css/search.css` 458~552줄, `.search_all__product:hover .search_all__product-tit { color: var(--color-primary); text-decoration: underline; }`. 이 부분은 STEP1+2 분석과 일치.

⑤Explore 링크: 클릭 시 `searchSectionExploreLinks.products`(`/products-systems/explore-all`)로 이동(`SearchAllTabContent.tsx` 40행 `Link href={exploreHref}`, 136행 `exploreHref={searchSectionExploreLinks.products}`). 상단 탭 자체를 "Products" 탭으로 전환시키는 동작은 현재 코드상 없음(단순 페이지 이동 링크) — STEP1+2 보고서의 "상단 Products 탭 선택 상태로 이동"이라는 설명과 실제 동작(다른 페이지로 이동)이 일치하는지 확인 필요.

㉑ 탭 카운트: 현재 `searchAllTabs`(`searchAllContent.ts` 39~45행)에 `all: 99`, `products: 60`, `documents: 20`, `media: 10`, `pages: 16`이 전부 하드코딩. 렌더 로직(`SearchAllTabContent.tsx` 67행)은 `all` 탭만 `${tab.count}+`로, 나머지는 `String(tab.count)`로 표시. 99+ 임계값·표기 로직은 fo 어디에도 존재하지 않음(재사용 가능한 기존 로직 없음, `MainInfo.tsx`/`MarketsStats.tsx`의 "+" 표기는 카운트업 통계용으로 별개 용도).

### 미해결 확인 필요 항목
1. "Lv3 채널 기준"의 정확한 의미 — (a) 검색 대상 제품을 Lv3 카테고리 매핑으로 한정하는 것인지 (b) 매칭 텍스트 필드를 Lv3 명칭으로 쓰는 것인지 불명확.
2. 키워드 매칭 대상 필드(product_name/product_description 등)와 매칭 순위 산정 기준(제목 우선 등).
3. "update_date"의 실체 — `page_data.updated_at` 컬럼인지, product-data `dataJson` 내부 별도 수정일 필드인지.
4. tie-breaker(1차 정렬값 동일 시 기준) — 통상 id이나 확인 필요.
5. 카드 표시 필드 매핑 — `category`/`highlight`/`title`/`description`/`image`/`href`를 검색 API 응답의 무엇으로 채울지. 특히 `href`는 "Lv3 제품 상세" 라우팅 규칙 확인 필요(현재 목업 `href`가 `/product/...`, `/products-category/...`로 제각각).
6. "키워드 일치 텍스트 굵게" 강조 처리를 카드에 실제로 추가 반영할지 여부 — 위 불일치 참고, 반영한다면 `renderSearchTextHighlight` 계열 함수 재사용(신규 강조 로직 별도 작성 금지) 대상인지 확인 필요.
7. ⑤Explore 링크 동작이 "다른 페이지(explore-all)로 이동"인지 "탭 전환"인지 확인 필요.
8. 탭 카운트 99+ 임계값(99인지)과 표기 형식("99+"인지) — 신규 표기 로직 구현이 필요한지 확인 필요.
9. Product 섹션 결과 0건 시 처리 우선순위(7번 참고) — 가이드 5절(컨테이너 유지) vs 기획서(Product 영역 미표시) 확인 필요.

## 7. 데이터 없음(빈 값/매칭 0건) 시 동작 — 필수 기재
- STEP1+2에서 전달받은 기획서 내용: 결과 0건이면 "해당 영역 미표시".
- 이는 `fo-data-binding-가이드.md` 5절 원칙(섹션 전체 조건부 숨김 금지 — 컨테이너/제목·Explore는 유지하고 내부 항목만 있는 만큼 표시)과 상충 가능성이 있다. 어느 쪽을 따를지 임의로 단정하지 않으며, 사용자 확인 필요(위 확인 필요 항목 9).
- ㉑Product 탭 카운트: 검색 결과 total이 0이어도 탭 라벨 자체는 유지하되, 카운트 숫자 표시(0 vs 다른 처리)는 확인 필요.
