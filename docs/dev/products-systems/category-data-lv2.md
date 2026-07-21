# Devices Category List (LV2 카테고리 랜딩 — 카테고리 인트로 + 제품 카드) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/DevicesCategoryList.tsx` (`layout="stacked"`/`layout="split"` 공용 — 인트로 단건 + 하위 제품 카드 목록 다건)
> - 사용 페이지: `fo/src/app/()/product-range/[slug]/page.tsx` — 2026-07-21 라우팅 개편(`route-restructure.md`)으로 기존 `lv-automation/page.tsx`(stacked)·`variable-frequency-drive/page.tsx`(split)에서 이관, seo.slug 기반 동적 라우트로 전환. **신규 라우트는 `layout="split"`만 호출**한다(`layout="stacked"` 분기는 컴포넌트 내부에는 남아있으나 현재 호출부 없음 — 데드 코드)
> 상태: 개발완료 (2026-07-21 전면 재작성 — 카드 목록 데이터 소스 정정, category.code → seo.slug 전환 반영)

## 1. data-slug

인트로(단건)와 카드 목록(다건)이 **서로 다른 slug**를 쓴다. 최초 설계(2026-07-16, STEP1~3)는 카드 목록도 `category-data`(depth2)로 추정했으나, STEP4 실제 구현 단계에서 카드가 하위 *카테고리*가 아니라 해당 카테고리에 속한 *제품*임이 확인되어 `product-data`로 정정됐다(소스 주석에 "STEP4 정정"으로 명시돼 있음, `DevicesCategoryList.tsx:102,147`).

- 인트로: `category-data` (단건, depth1 레코드)
- 카드 목록: `product-data` (다건, 해당 카테고리 소속 제품)

## 2. data-slugKey 매핑

```html
<!-- 인트로(단건, depth1) — stacked: .devices_category__header / split: .devices_category__intro-inner -->
<div className="devices_category__header" data-slug="category-data">
  <h1 className="devices_category__tit" data-slugkey="category.title">{intro.title}</h1>
  <p className="devices_category__desc" data-slugkey="category.description">{intro.description}</p>
</div>

<!-- 카드 목록(다건, product-data) — stacked: .devices_category__grid / split: .devices_category__list-inner -->
<div className="devices_category__grid" data-slug="product-data" data-slug-repeat="true">
  <div data-slug-item> <!-- stacked: CategoryProductCardStacked / split: CategoryProductCard -->
    <img data-slugkey="product_info.image" data-slugkey-attr="src" />
    <h2 data-slugkey="product.product_name">...</h2>
    <p data-slugkey="product_info.info_description">...</p>
  </div>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| category.title (인트로, 단건) | category.title | string | 텍스트(`h1`) | LV2 상위 카테고리명 (depth1 레코드) |
| category.description (인트로, 단건) | category.description | string | 텍스트(`p`) | LV2 상위 카테고리 설명 (depth1 레코드) |
| product_info.image (카드, 다건) | product_info.image | array(파일ID) → string(url) | 속성(`img.src`) | 제품 카드 썸네일. `/api/v1/fo/page-files/{id}` 프록시 변환 |
| product.product_name (카드, 다건) | product.product_name | string | 텍스트(`h2`) | 제품명 |
| product_info.info_description (카드, 다건) | product_info.info_description | string | 텍스트(`p`) | 제품 설명 — lv1(`DevicesProducts.tsx`) 카드에는 없는 필드로, `DevicesCategoryList` 카드에만 존재 |

> `intro.parentLabel`/`intro.parentHref`(브레드크럼)와 카드의 `href`(제품상세 라우트)는 정적 라우팅/네비게이션 값이며 대응 필드 없음(정적 유지, 태그 없음).

## 3. API 확인

신규 API 불필요 — `GET /api/v1/fo/page-data/category-data`(인트로), `GET /api/v1/fo/page-data/product-data`(카드) 둘 다 기존 `FoPageDataController`(`PageDataService.search()`) 재사용. `productsSystemsData.ts`의 `fetchCategoryBySlug`(인트로)·`fetchProductsByCodePrefix`(카드) 함수로 구현.

## 4. 조회 조건

### 인트로 (단건, depth1)
- where: `eq_seo.slug={slug}` + `eq_category.depth=1` (`fetchCategoryBySlug(slug, {depth:1})`) — 최초 설계는 `category.code` 매핑을 썼으나, 신규 라우트는 URL 세그먼트를 그대로 `seo.slug`로 조회하므로 `category.code` 매핑 자체가 불필요해졌다(최초 설계의 미해결 항목 "lv-automation/variable-frequency-drive가 어느 category.code에 매핑되는지"는 질문 자체가 폐기됨)
- row limit: 단건(`size=1`)
- orderBy: 없음

### 카드 목록 (다건, product-data)
- where: `eq_product.is_visible=001` 후 FE에서 `product.product_code` 접두사(예: `L01-15-`) 클라이언트 필터(`fetchProductsByCodePrefix`, `eq_`는 LIKE 미지원이라 서버 필터 불가)
- row limit: `unpaged=true`(BE 신규 파라미터, 2026-07-21) — 공개 제품 전체(67건, 2026-07-21 실측) 중 접두사 매칭분
- orderBy: `product.product_code` 오름차순(FE `localeCompare`)
- 2차 정렬(tie-breaker): 불필요(product_code가 유일값)

## 5. layout 사용 현황

`DevicesCategoryList` 컴포넌트 자체는 `layout="stacked"`/`layout="split"` 두 분기를 여전히 갖고 있지만, 신규 라우트(`/product-range/[slug]/page.tsx:51`)는 `layout="split"`을 하드코딩해서 호출하며 저장소 전체에 `layout="stacked"` 호출부가 없다(2026-07-21 grep 확인). 과거에는 `lv-automation/page.tsx`가 stacked, `variable-frequency-drive/page.tsx`가 split을 썼으나, 두 페이지가 동일한 동적 라우트로 통합되며 stacked 분기가 데드 코드로 남았다. 삭제 여부는 이번 스코프 밖(UI 요구사항 변경 없이는 컴포넌트 삭제 보류).

## 6. 비고

1. `category-data`/`product-data` slug 둘 다 bo `slug_registry`에 `type=PAGE_DATA`, `is_active=true`로 등록 확인됨(2026-07-21 DB 직접 조회, `category-data` id=30/entity_id=7, `product-data` id=29/entity_id=10). `page_template.config_json` 방식이 아니라 Entity Builder(`slug_entity`/`slug_entity_field`) 방식으로 관리된다.
2. `product_info.image` 미입력 건은 화면 플레이스홀더로 폴백(정상, 개발 블로커 아님).

## 7. STEP별 진행 이력

| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-16 | `DevicesCategoryList.tsx` stacked/split 두 레이아웃에 인트로 단건 태깅 완료. 카드 목록은 이 시점엔 category-data로 태깅(추후 STEP4에서 product-data로 정정) |
| STEP2 | fo-slug-analyzer | 2026-07-16 | where 구조 초안 확정. lv-automation/variable-frequency-drive의 category.code 값은 "확인 필요"로 보류 |
| STEP3 | fo-dev-doc-writer | 2026-07-16 | 작업 단위 문서 최초 작성 (상태: 설계중) |
| STEP4(정정) | (미기록, 소스 주석만 존재) | 2026-07-16~21 사이 | 카드 목록이 실제로는 product-data(제품)임을 확인, 코드 재작업(`DevicesCategoryList.tsx` 주석 "STEP4 정정") — 문서는 갱신 안 됨(누락) |
| 라우팅 개편 | (route-restructure.md 참고) | 2026-07-21 | `/product-range/[slug]` 동적 라우트로 통합, `category.code`→`seo.slug` 전환, stacked 호출부 소멸 |
| 재검증·문서 전면 재작성 | (심층분석) | 2026-07-21 | 소스 직접 대조로 문서-코드 완전 불일치 확인 후 본 문서 재작성(카드 slug/필드 정정, layout 현황 반영, slug_registry 확인 결과 반영) |
