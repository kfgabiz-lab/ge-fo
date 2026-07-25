# Category Insights (LV1 카테고리 랜딩 — Highlights: Lv1 기준 맵핑 게시글) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/DevicesPageFooter.tsx` (`HighlightNewsSection`, `variant="markets"`, `title="Highlights"`, `sectionId="devices-highlights"`)
> - `fo/src/components/content/HighlightNewsSection.tsx` (프레젠테이션 전용, items를 그대로 렌더)
> - 사용 페이지: `fo/src/app/()/products-category/[slug]/page.tsx` (`<DevicesPageFooter />` 호출, 현재 `highlightItems` 미전달)
> 상태: 완료 (2026-07-26 — STEP4~6 개발 및 QA 검증 완료. 573 카테고리 실측 3건: press 2125/2101, articles 1887 — publish_dttm DESC/id DESC 정렬·LIMIT 3 정상 동작 확인)

기획서 13번(Highlights: Lv1 기준 맵핑 게시글) 요건을 반영하는 작업 단위 문서. `category-data-lv1.md`(Lv1 하위 노출가능 Lv2/제품 스펙)와 짝을 이루며, Lv1에 노출 가능한 제품에 실제로 맵핑된 press/blog/articles 게시글만 "Highlights"에 노출하도록 조회를 확장한다.

## 1. data-slug

이 문서는 신규 마크업 태깅이 아니라 **신규 조회 API 설계**(제품상세 Insights와 동일 패턴을 카테고리 단위로 확장) 문서다.

- 대상 slug(다건, 기존 등록 slug 재사용): `press-data`, `blog-data`, `articles-data`
- 다건 여부: 다건 — 3개 slug 통합 후 최신 3건

## 2. data-slugKey 매핑

N/A. `HighlightNewsSection`은 서버(page.tsx/데이터 헬퍼)에서 이미 매핑 완료된 `HighlightNewsItem[]`을 props로 받아 그대로 렌더하는 순수 프레젠테이션 컴포넌트다(코드 확인 완료 — `HighlightNewsSection.tsx`에 data-slug/data-slugkey 속성 없음). main("Catch up on the latest news")·markets("Highlights")가 이미 동일 정책으로 별도 태깅 없이 `fetchMainHighlightNews`/`fetchMarketHighlightNews` 결과를 그대로 주입하고 있으며, 이번 카테고리 버전도 동일 정책을 따른다.

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **신규 필요**
  - 근거: 조회 조건이 (a) 3개 slug 통합, (b) "노출가능 제품 id 집합"과 각 글의 `product_list` 배열 교집합(다건 대 다건 매칭)까지 요구해 단일 slug 제네릭 조회(`PageDataService.search()`)로는 표현 불가. 기존 제품상세 Insights(`findProductInsights`)도 동일 이유로 이미 전용 네이티브 쿼리 메서드로 구현돼 있다(`PageDataService.java:469`, `data_json->'product_list' @> to_jsonb(:productId)`).
- (신규 필요 시) 제안 엔드포인트: `GET /api/v1/fo/categories/{categoryId}/insights`
- 비고: 기존 `GET /api/v1/fo/products/{productId}/insights`(`FoProductController`, `findProductInsights`)는 그대로 유지 — 변경 없음. 신규 엔드포인트는 이 기존 구현과 **응답 DTO(`ProductInsightRowResponse`)를 그대로 공유**하는 것을 전제로 설계한다(6번 참고).

## 4. 조회 조건

- 대상 data_slug: `press-data`, `blog-data`, `articles-data`
- 제품 집합: `category-data-lv1.md` 4절에서 확정한 "노출가능 Lv2"에 매핑된 "노출가능 제품"(공개(`product.is_visible`='001') + 판매중(`product.order_status`='01')) id 집합, DISTINCT
- where(① ~ ④ 전부 AND, ④는 위 제품 집합과의 매칭):
  1. `data_slug IN ('press-data','blog-data','articles-data')`
  2. 각 글의 `is_visible`='001' (섹션 중첩 접근 — 기존 `findProductInsights`와 동일하게 `data_json->(replace(data_slug,'-data',''))->>'is_visible'`)
  3. `publish_dttm` <= 오늘(사이트 tz) — 기존 `findProductInsights`의 `resolveTodayParam(siteId)` 재사용 가능
  4. 최상위 **`product_list`**(⚠️ snake_case — 최초 조사에서 `productList`로 오기했으나 `dev_db_dump.sql` 실측 재검증 결과 정정됨. `productList`(camelCase)는 `currDltMgmt-detail`/커리큘럼 감사로그에서만 쓰이는 완전히 다른 slug의 필드이니 혼동 금지 — 아래 비고 참고) 배열이 위 "노출가능 제품" 집합과 교집합이 있음
- orderBy: `publish_dttm` 내림차순, 동률 시 `id` 내림차순(seq)
- row limit: 3
- 신규 엔드포인트: `GET /api/v1/fo/categories/{categoryId}/insights`

## 5. 샘플 응답 데이터

> 신규 엔드포인트라 실제 응답은 없음. 기존 `GET /api/v1/fo/products/{productId}/insights`가 반환하는 `ProductInsightRowResponse` 배열과 동일 shape일 것으로 **추정**(6번 재사용 전제).

```json
[
  {
    "id": 1570,
    "dataSlug": "press-data",
    "title": "form key value change test",
    "publishDttm": "2026-07-13",
    "image": "[253]"
  }
]
```

## 6. 비고

1. **응답 DTO 재사용**: 신규 엔드포인트의 응답 DTO는 기존 `ProductInsightRowResponse`(`bo-api/src/main/java/com/ge/bo/dto/ProductInsightRowResponse.java` — `id`/`dataSlug`/`title`/`publishDttm`/`image`) 그대로 재사용할 예정이다. FE 매핑 로직도 `fetchProductInsights`(`fo/src/data/highlightNews/highlightNewsData.ts:212`)의 `resolveInsightMeta`/이미지 파일ID 파싱/`formatNewsDate` 변환 로직을 그대로 재사용한다 — 신규 매핑 함수를 새로 만들지 않는다.
2. **`highlightItems` prop 통로는 이미 존재함(코드 확인 완료)**: `DevicesPageFooter.tsx`는 이미 `highlightItems?: HighlightNewsItem[]` optional prop을 받아, 주어지면 그 목록을 그대로 쓰고 없으면 `fetchMainHighlightNews()`(market 무관 전체 최신 3건)로 폴백하도록 구현돼 있다(제품상세 Insights가 이미 이 통로를 쓰고 있음). 따라서 이번 작업은 `DevicesPageFooter`에 신규 prop을 추가할 필요 없이, Lv1 `page.tsx`가 신규 `/insights` 엔드포인트 결과를 조회해 `highlightItems`로 전달하기만 하면 된다(Contact Us(12번)의 `CommonBanner04`와 달리 prop 통로 추가가 필요 없는 케이스).
3. **`product_list`(snake_case) vs `productList`(camelCase) 혼동 주의**: 기존 `findProductInsights`(`PageDataService.java:472,480`)가 실제로 쿼리하는 필드는 `data_json->'product_list'`(최상위, snake_case)다. `dev_db_dump.sql` 실측 재검증 결과, press-data/blog-data/articles-data 레코드는 전부 `product_list`(snake_case, 예: id=1570 press-data 행 `"product_list": [1569, 1532]`)를 쓰고, `productList`(camelCase)는 완전히 다른 slug인 `currDtlMgmt-data`(`currDltMgmt-detail` 템플릿, 커리큘럼/교육과정 관리용)에서만 등장한다(예: id=1106 행 `"productList":[1022]`). 최초 조사 단계의 `productList` 표기는 오기였으며 이번 STEP에서 정정했다.
4. **레거시 행 자동 제외(의도된 동작)**: `dev_db_dump.sql` 실측상 2026-07-13 이전 일부 press/articles 행은 `isVisible`/`publishDttm`/`productList`(camelCase) 등 다른 스펠링으로 저장돼 있는 경우가 확인된다(초기 스캐폴딩/템플릿 변경 이전 데이터로 추정). 신규 조건은 snake_case(`is_visible`/`publish_dttm`/`product_list`)만 조회하므로 이런 레거시 행은 조건 불충족으로 자동 제외된다 — 의도된 동작이며 데이터 정합성 문제로 취급하지 않는다.
5. **`HighlightNewsSection` 0건 시 섹션 자체 렌더 안 함(변경하지 않음)**: `HighlightNewsSection.tsx`는 `items.length === 0`이면 `return null`로 `<section>` 자체를 그리지 않는다(코드 확인 완료). 이는 `fo-data-binding-가이드.md` 5절의 일반 원칙("섹션 전체 조건부 숨김 금지")과 다른 예외 동작이지만, main/markets를 포함한 기존 화면들이 이미 이 동작에 의존하고 있어 이번 작업 범위에서 변경하지 않는다(7절 참고).

## 7. 데이터 없음(빈 값/매칭 0건) 시 동작 — 필수 기재

- **예외**: `HighlightNewsSection`은 매칭 0건(신규 `/insights` 응답이 빈 배열)이면 섹션 컨테이너 자체를 렌더링하지 않는다(`items.length === 0` → `return null`). 이는 기존에 이미 구현돼 운영 중인 동작이며, 이번 13번 요건 작업의 범위가 아니므로 그대로 유지한다. 일반 원칙(컨테이너 유지 + 항목만 있는 만큼 표시)의 예외 케이스로 명시적으로 기록해 둔다.

## 8. STEP별 진행 이력

| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1~2 | (세션 에이전트, 사용자 확정) | 2026-07-26 | 기획서 13번(Highlights) 요건 확인: 제품 집합은 `category-data-lv1.md`의 "노출가능 제품", where 4조건(data_slug/is_visible/publish_dttm/product_list 교집합), orderBy publish_dttm DESC(tie id DESC), limit 3, 신규 엔드포인트 `GET /api/v1/fo/categories/{categoryId}/insights` 확정. 최초 `productList` 표기를 `dev_db_dump.sql` 재검증으로 `product_list`(snake_case)로 정정 |
| STEP3 | fo-dev-doc-writer | 2026-07-26 | 작업 단위 문서 신규 작성(상태: 설계중). API 확인 "신규 필요" 명시, 응답 DTO(`ProductInsightRowResponse`)·FE 매핑 로직(`fetchProductInsights`) 재사용 전제 기록, `DevicesPageFooter`의 `highlightItems` prop 통로가 이미 존재함을 코드로 확인해 비고에 반영. **코드 변경 없음(문서만), 승인 대기** |
| STEP4 | fo-be-analyzer | 2026-07-26 | `PageDataService.findCategoryInsights` 설계 확정(`CATEGORY_LV2_CTE` 공유 + `product_list @> to_jsonb(vp.product_id)` EXISTS). dev DB psql 검증: categoryId 568/569/570/571 → 0건(정상, 맵핑 글 없음), 572 → 2건, 573 → 3건(LIMIT 3 실동작), 미래일자 글 정상 제외 |
| STEP5 | fo-be-builder | 2026-07-26 | `findCategoryInsights` 구현 + `FoCategoryController.getInsights` 연결. curl 검증: `/categories/573/insights` → press 2125/2101, articles 1887 (STEP4 psql 결과와 일치). 기존 `/products/{id}/insights` 회귀 정상 |
| STEP6 | fo-fe-builder | 2026-07-26 | `fetchCategoryInsights` 신규(`highlightNewsData.ts`), `fetchProductInsights`와 매핑 로직(`toHighlightNewsItems`) 공유 추출. `page.tsx`에서 `<DevicesPageFooter highlightItems={await fetchCategoryInsights(category.id)} />` 연결 |
| QA | fo-qa-validator | 2026-07-26 | 브라우저 실검증: 573 페이지 Highlights 3건이 API 응답과 id·순서 일치, 각 링크(press/articles detail) 클릭해 상세 페이지 제목까지 일치 확인. 568 페이지는 0건이라 `HighlightNewsSection` 미렌더(기존 동작대로 정상) |

**최종 상태: 완료.** `#완료` 처리됨.
