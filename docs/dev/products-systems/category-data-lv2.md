# Devices Category List (LV2 카테고리 랜딩 — 카테고리 인트로 + 제품 카드) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/DevicesCategoryList.tsx` (`layout="stacked"`/`layout="split"` 공용 — 인트로 단건 + 하위 제품 카드 목록 다건)
> - 사용 페이지: `fo/src/app/()/product-range/[slug]/page.tsx` — 2026-07-21 라우팅 개편(`route-restructure.md`)으로 기존 `lv-automation/page.tsx`(stacked)·`variable-frequency-drive/page.tsx`(split)에서 이관, seo.slug 기반 동적 라우트로 전환. **신규 라우트는 `layout="stacked"`만 호출**한다(`layout="split"` 분기는 컴포넌트 내부에는 남아있으나 현재 호출부 없음 — 데드 코드). ※2026-07-26 재검증: 과거 서술("split만 호출")이 실제 코드(`page.tsx:51`)와 반대로 잘못 적혀 있었음을 직접 확인해 정정
> 상태: 완료 (2026-07-26 — 기획서 product-lv2.png 요건 반영: 카드 목록 조회조건을 depth3 junction 기반으로 교체, STEP4~6 개발 및 QA 검증 완료)

## 1. data-slug

인트로(단건)와 카드 목록(다건)이 **서로 다른 slug**를 쓴다. 최초 설계(2026-07-16, STEP1~3)는 카드 목록도 `category-data`(depth2)로 추정했으나, STEP4 실제 구현 단계에서 카드가 하위 *카테고리*가 아니라 해당 카테고리에 속한 *제품*임이 확인되어 `product-data`로 정정됐다(소스 주석에 "STEP4 정정"으로 명시돼 있음, `DevicesCategoryList.tsx:102,147`).

- 인트로: `category-data` (단건, depth1 레코드)
- 카드 목록: `product-data` (다건, 해당 카테고리 소속 제품)

## 2. data-slugKey 매핑

```html
<!-- 인트로(단건, depth1) — stacked: .devices_category__header / split: .devices_category__intro-inner -->
<div className="devices_category__header" data-slug="category-data">
  <h1 className="devices_category__tit" data-slugkey="category.title">{intro.title}</h1>
  <p className="devices_category__desc" data-slugkey="device_systems.description">{intro.description}</p>
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
| device_systems.description (인트로, 단건) | device_systems.description | string | 텍스트(`p`) | LV2 카테고리 설명. 관리자가 "카테고리 설명"으로 입력하는 필드는 bo 템플릿 `category2-DeviceSystems`의 `device_systems.description`이다(`category.description`은 어떤 템플릿도 채우지 않으므로 사용하지 않는다) |
| product_info.image (카드, 다건) | product_info.image | array(파일ID) → string(url) | 속성(`img.src`) | 제품 카드 썸네일. `/api/v1/fo/page-files/{id}` 프록시 변환 |
| product.product_name (카드, 다건) | product.product_name | string | 텍스트(`h2`) | 제품명 |
| product_info.info_description (카드, 다건) | product_info.info_description | string | 텍스트(`p`) | 제품 설명 — lv1(`DevicesProducts.tsx`) 카드에는 없는 필드로, `DevicesCategoryList` 카드에만 존재 |

> `intro.parentLabel`/`intro.parentHref`(브레드크럼)와 카드의 `href`(제품상세 라우트)는 정적 라우팅/네비게이션 값이며 대응 필드 없음(정적 유지, 태그 없음).

## 3. API 확인

- 인트로: 신규 API 불필요 — `GET /api/v1/fo/page-data/category-data` 기존 `FoPageDataController`(`PageDataService.search()`) 재사용. `fetchCategoryBySlug`로 구현.
- 카드 목록: **신규 구현 완료** (2026-07-26, 기획서 product-lv2.png ④번 요건 반영) — 기존 `GET /api/v1/fo/categories/{id}/lv2`(`category-data-lv1.md`, Lv1 하위 Lv2 목록 전용)는 응답이 Lv2 목록이라 재사용 불가. `PageDataService.CATEGORY_LV2_CTE`와 동일 패턴의 신규 CTE(`CATEGORY_SELF_PRODUCT_CTE`, Lv2 id 자신을 anchor로 함)를 추가해 구현. 확정 엔드포인트: `GET /api/v1/fo/categories/{lv2Id}/products`(`FoCategoryController.java`), 서비스 `PageDataService.findCategoryProducts`, 응답 DTO `CategoryProductRowResponse(id, productName, image, infoDescription, slug)`. FE 진입점: `fetchCategoryLv2Products()`(`productsSystemsData.ts`).

## 4. 조회 조건

### 인트로 (단건, depth1)
- where: `eq_seo.slug={slug}` + `eq_category.depth=1` (`fetchCategoryBySlug(slug, {depth:1})`) — 최초 설계는 `category.code` 매핑을 썼으나, 신규 라우트는 URL 세그먼트를 그대로 `seo.slug`로 조회하므로 `category.code` 매핑 자체가 불필요해졌다(최초 설계의 미해결 항목 "lv-automation/variable-frequency-drive가 어느 category.code에 매핑되는지"는 질문 자체가 폐기됨)
- row limit: 단건(`size=1`)
- orderBy: 없음

### 카드 목록 (다건, product-data) — 2026-07-26 개정

- **변경 사유**: 기획서(product-lv2.png ④번) 요건 — "해당 Lv2 카테고리와의 맵핑 + 공개 + 판매중 + 관리자 지정 정렬순서". 기존 방식(아래 "폐기된 이전 조건")은 카테고리 맵핑이 아니라 product_code 접두사 매칭이라 요건과 불일치.
- where(①~②, AND):
  1. junction 존재: category-data depth3 레코드 중 `data_json->'product'->>'depth'='3'` AND `data_json->'product'->>'parentId'={Lv2 id}` (`CATEGORY_LV2_CTE`의 junction 조인 `j`와 동일 구조, `PageDataService.java:80-84`)
  2. 그 junction이 가리키는 product-data 레코드가 `product.is_visible='001'` **AND** `product.order_status='01'` (`PageDataService.java:89-90`과 동일 조건)
- row limit: 없음(전체)
- orderBy: junction 레코드 최상위 `sortOrder` 숫자 오름차순(NULLS LAST), 2차 `id ASC`
- 실측 검증 완료(2026-07-26): Lv2 id=585(EMPR) 밑 junction 4건이 sortOrder 1/2/3/4 = GMP/DMPi/IMP/MMP 순 — 기획서 목업 카드 순서와 정확히 일치. id=2044는 5건, id=604는 sortOrder 전부 NULL이라 id ASC로 정상 폴백(NULLS LAST 확인).
- ⑤~⑧(이미지/제품명/설명/클릭이동)은 별도 작업 불필요 — 위 2절 태깅은 이미 존재하며 변경 없음. `page.tsx:33-41`의 데이터 소스(제품 목록을 얻는 방법)만 교체하면 카드 렌더링은 그대로 동작.
- `product.order_status`가 NULL/빈 값인 제품은 `='01'` 조건 불충족으로 junction에서 자동 제외(3치논리, 의도된 동작 — `category-data-lv1.md`와 동일 원칙). 실데이터에 위반 사례가 없어 STEP4에서 `jsonb_set` 가상 치환으로 시뮬레이션 검증(정상 제외 확인).
- **구현 시 발견 사항(STEP5)**: 같은 제품이 한 Lv2 밑에 junction 레코드로 중복 연결될 수 있어(실데이터 0건이나 구조상 가능) `DISTINCT ON (p.id)`로 sortOrder 최선두 1건만 남기도록 구현.

#### 폐기된 이전 조건 (2026-07-21 ~ 2026-07-26, 참고용)
- where: `eq_product.is_visible=001` 후 FE에서 `product.product_code` 접두사(예: `L01-15-`) 클라이언트 필터(`fetchProductsByCodePrefix`)
- orderBy: `product.product_code` 오름차순(FE `localeCompare`)
- 폐기 사유: 카테고리 맵핑(depth3 junction)이 아니라 제품코드 문자열 접두사 매칭이었고, `order_status`(판매중 여부)도 필터하지 않았음 — 기획서 요건 불충족으로 위 개정 조건으로 대체

## 5. layout 사용 현황

`DevicesCategoryList` 컴포넌트 자체는 `layout="stacked"`/`layout="split"` 두 분기를 여전히 갖고 있지만, 신규 라우트(`/product-range/[slug]/page.tsx:51`)는 **`layout="stacked"`을 하드코딩해서 호출**하며 저장소 전체에 `layout="split"` 호출부가 없다(2026-07-26 grep 재확인 — `layout="stacked"|layout="split"` 검색 결과 `page.tsx:51` 1건만 매칭, 값은 `stacked`). ※과거(2026-07-21) 이 절은 반대로("split만 호출, stacked가 데드코드") 서술돼 있었으나 실제 코드와 어긋난 오기였음 — 2026-07-26 직접 코드 확인으로 정정. 삭제 여부는 이번 스코프 밖(UI 요구사항 변경 없이는 컴포넌트 삭제 보류).

## 6. 비고

1. `category-data`/`product-data` slug 둘 다 bo `slug_registry`에 `type=PAGE_DATA`, `is_active=true`로 등록 확인됨(2026-07-21 DB 직접 조회, `category-data` id=30/entity_id=7, `product-data` id=29/entity_id=10). `page_template.config_json` 방식이 아니라 Entity Builder(`slug_entity`/`slug_entity_field`) 방식으로 관리된다.
2. `product_info.image` 미입력 건은 화면 플레이스홀더로 폴백(정상, 개발 블로커 아님).
3. **⑮ Contact Us 배너(기획서 product-lv2.png) — 구현 완료**: 대상 `page.tsx:57` `<DevicesPageFooter bannerLinkHref="/support/contact-us" />`. `DevicesPageFooter`의 `bannerLinkHref?: string` optional prop은 Lv1 작업 때 추가된 것을 그대로 재사용(`category-data-lv1.md` 비고 참고). 신규 API/쿼리 없음. 브라우저 실클릭 검증 완료(`/support/contact-us`로 정상 이동).
4. **① 브레드크럼(기획서 1번) — 범위 제외, 코드 변경 불필요, QA로 최종 확인**: 전역 상단 브레드크럼(`HeaderBreadcrumb.tsx`)이 `fetchDevicesMegaMenu()`(bo-api `findDevicesTree`, `ORDER BY depth ASC, sortOrder ASC NULLS LAST, id ASC`) 기반으로 이미 동적 매칭 구현돼 있었음. Lv2가 여러 Lv1에 중복 매핑된 경우(실측: `variable-frequency-drive` slug가 id=587/parentId=568(sortOrder=1), id=607/parentId=572(sortOrder=5) 두 건 존재)에도 sortOrder 낮은 Lv1(568 "LV Products and Systems")이 자동으로 먼저 매칭되어 표시됨 — 데스크톱 뷰포트(1440px) 실브라우저로 확인 완료.
   - ⚠️ **QA 시 주의(이번 작업과 무관한 기존 사실)**: `.sub_breadcrumb`에 기존 CSS `@media (max-width: 1200px) { .sub_breadcrumb { display: none; } }` 규칙이 있어, 브라우저 뷰포트가 1200px 미만(기본 Playwright 뷰포트 등)이면 브레드크럼 자체가 안 보인다. 브레드크럼 관련 QA는 반드시 1200px 이상 데스크톱 뷰포트로 확인할 것 — 좁은 뷰포트에서의 "안 보임"은 버그가 아니라 기존 반응형 설계다.
5. **⑨ Design Awards 로고(기획서 9번) — 범위 제외**: ls-publish 원본 퍼블리싱에도 이 카드 마크업엔 배지 슬롯이 처음부터 없음(다른 화면 `DevicesProducts`/`MarketsProducts`/`DevicesProductOtherProducts`에만 원본부터 존재). 사용자 지시("퍼블리싱 그대로, CSS/태그 변경 금지")에 따라 이번 범위에서 제외.

## 7. STEP별 진행 이력

| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-16 | `DevicesCategoryList.tsx` stacked/split 두 레이아웃에 인트로 단건 태깅 완료. 카드 목록은 이 시점엔 category-data로 태깅(추후 STEP4에서 product-data로 정정) |
| STEP2 | fo-slug-analyzer | 2026-07-16 | where 구조 초안 확정. lv-automation/variable-frequency-drive의 category.code 값은 "확인 필요"로 보류 |
| STEP3 | fo-dev-doc-writer | 2026-07-16 | 작업 단위 문서 최초 작성 (상태: 설계중) |
| STEP4(정정) | (미기록, 소스 주석만 존재) | 2026-07-16~21 사이 | 카드 목록이 실제로는 product-data(제품)임을 확인, 코드 재작업(`DevicesCategoryList.tsx` 주석 "STEP4 정정") — 문서는 갱신 안 됨(누락) |
| 라우팅 개편 | (route-restructure.md 참고) | 2026-07-21 | `/product-range/[slug]` 동적 라우트로 통합, `category.code`→`seo.slug` 전환, stacked 호출부 소멸 |
| 재검증·문서 전면 재작성 | (심층분석) | 2026-07-21 | 소스 직접 대조로 문서-코드 완전 불일치 확인 후 본 문서 재작성(카드 slug/필드 정정, layout 현황 반영, slug_registry 확인 결과 반영) |
| 카테고리 설명 필드 정정 | fo-fe-builder | 2026-07-25 | 인트로 설명 slugKey를 `category.description` → `device_systems.description`으로 교체(stacked/split 두 분기 모두). 데이터 소스인 `fetchCategoryBySlug`도 동일 필드 참조로 교정, 폴백 없음(빈 값이면 빈 값 그대로 노출) |
| STEP1~2(기획서 반영) | (세션 에이전트, 사용자 확정) | 2026-07-26 | 기획서(product-lv2.png) 요건 확인: ④ 카드 목록 조회조건을 `CATEGORY_LV2_CTE`의 `visible_product` 메커니즘 재사용 방식(depth3 junction + is_visible/order_status)으로 확정, junction 최상위 sortOrder 오름차순(Lv2 id=585 EMPR 실측 검증). 신규 엔드포인트 `GET /api/v1/fo/categories/{lv2Id}/products` 확정. ⑮ Contact Us는 `bannerLinkHref` prop 전달만 필요함을 확인. ① 브레드크럼(HeaderBreadcrumb 기존 로직으로 이미 충족)·⑨ Design Awards(원본 퍼블리싱에 슬롯 없음)는 범위 제외 확정 |
| STEP3(기획서 반영) | fo-dev-doc-writer + 세션 에이전트 | 2026-07-26 | §3/§4 카드 목록 조건 개정(구 조건은 "폐기된 이전 조건"으로 보존), §5 layout 서술 오류(stacked/split 반대로 기재) 정정, §6에 ⑮①⑨ 비고 추가. 최초 별도 파일(`category-lv2-products.md`)로 작성됐다가 이 문서와의 중복 발견 후 병합 확정(사용자 승인) — 별도 파일은 삭제 |
| STEP4(기획서 반영) | fo-be-analyzer | 2026-07-26 | `CATEGORY_SELF_PRODUCT_CTE` 설계, junction 조인 psql 검증(585→4건, 2044→5건, 604 NULL sortOrder→id ASC 폴백), 위반 사례 없어 `jsonb_set` 시뮬레이션으로 네거티브 케이스 검증. 엔드포인트 `GET /{lv2Id}/products` 확정 |
| STEP5(기획서 반영) | fo-be-builder | 2026-07-26 | `CategoryProductRowResponse` DTO, `PageDataService.findCategoryProducts`, `FoCategoryController.getProducts` 구현(`DISTINCT ON (p.id)`로 중복 junction 방어 추가). curl 검증 STEP4 psql 결과와 일치. 기존 `/{categoryId}/lv2`·`/{categoryId}/insights`(Lv1용) 8080/8081 A/B 비교로 응답 완전 일치(회귀 없음) 확인 |
| STEP6(기획서 반영) | fo-fe-builder | 2026-07-26 | `page.tsx` 데이터 소스를 `fetchProductsByCodePrefix` → `fetchCategoryLv2Products()`로 교체, `bannerLinkHref`/`highlightItems` prop 전달 추가. `DevicesCategoryList.tsx`는 주석만 갱신(마크업/CSS 무변경, git diff로 직접 확인). SSR HTML 대조로 587(6건)/2044(5건) 카드 순서·href 일치 확인 |
| QA(기획서 반영) | fo-qa-validator + 세션 에이전트 | 2026-07-26 | Playwright 실브라우저 검증: ④ 제품 카드(587/2044) 순서·href·이미지 정상, ⑮ Contact Us 클릭 이동 정상, ⑯ Highlights 2044에서 2건 렌더(587은 0건이라 섹션 미렌더, 정책대로 정상), ① 브레드크럼 데스크톱 뷰포트(1440px)에서 정상. QA 1차 결과의 "① 부분 FAIL"은 재추적 결과 테스트에 쓴 카테고리(id=2044, `is_visible=002`+존재하지 않는 `parentId=2040`)가 애초에 비공개 고아 데이터였던 것이 원인으로 확인, 실제 공개 데이터(id=574)로 재검증해 정상 동작 확정. 좁은 뷰포트(800px)에서 브레드크럼이 안 보이는 것은 기존 반응형 CSS(1200px 미만 숨김)에 의한 것으로 이번 작업과 무관 |
| 최종 상태 | — | 2026-07-26 | **완료.** 기획서(product-lv2.png) 16항목 중 실제 개발 필요 3항목(④⑮⑯) + QA전용 1항목(①) 전부 반영·검증 완료. ⑨는 범위 제외 확정. `#완료` 처리됨. |
