# Products & Systems 라우팅 개편 설계 (route-restructure)

> 상태: 개발완료
> 목적: 기존 `/products-systems/...` 폴더 기반 라우트를 seo.slug 기반 3계층 신규 동적 라우트로 전환.
> 범위: STEP1~STEP7 전체 완료. 기존 12개 폴더(`motor-control/`, `lv-automation/`, `variable-frequency-drive/`, `software/`)는 삭제됨. `explore-all/`만 유지.

## 1. 확정 티어 구조

| URL 티어 | 대상 | 해석(판별) 방식 |
|---|---|---|
| `/products-category/[slug]` | 1depth 카테고리 | `category-data`에서 `eq_seo.slug={slug} AND eq_category.depth=1` 단건 조회 → 히어로 + depth2 카드 |
| `/product-range/[slug]` | 2depth 카테고리 + 제품 | ① `category-data` `depth=2` 우선 조회 → 카테고리 리스트 / ② 없으면 `product-data`에서 seo.slug 조회 → 제품상세(제네릭) |
| `/product/[slug]` | 일반 3depth 제품 | `product-data`에서 seo.slug 조회 → 제품상세(제네릭). 없으면 `notFound()` |
| `/products-systems/explore-all` | 제품 sitemap | **변경 없음**(3계층 밖 독립 유지) |

## 2. 확정 결정사항 (사용자 승인)

1. **중복 slug 첫 건 렌더링**: VFD 6종(h100-plus/g100/is7/m100/s100/sp100)은 `product-data`에서 seo.slug가 LV(L01-15-xx)·Automation(L05-04-xx) 양쪽에 중복. 카테고리(L01-15/L05-04 "Variable Frequency Drive")도 동일하게 `variable-frequency-drive` slug 중복. 조회 시 `size=1`로 **첫 건만** 사용.
2. **explore-all URL 불변**: 기존 `/products-systems/explore-all` 그대로.
3. **seo.slug 미비 → 폴백 없음, 404**: slug 조회 0건이면 `notFound()`.
4. **제품상세는 예외 없이 완전 동적**: 특정 slug마다 다른 화면(레지스트리/기존 페이지 재사용)을 쓰지 않는다. 다운로드·Applications·Why·다른제품 등 DB에 없는 리치 섹션은 렌더하지 않으며(제네릭 템플릿 기본값으로 폴백), 데이터가 채워지면 코드 수정 없이 자동 반영된다. — 이 원칙 때문에 STEP4 초기에 만들었던 "slug→기존 상세페이지 재사용 레지스트리"는 폐기했다(6절 참고).

## 3. 컴포넌트 재사용 원칙

- `products-category/[slug]`: 데이터 구동 — `DevicesHero withProducts` + `DevicesMarkets`/`DevicesHelp`/`DevicesPageFooter`.
- `product-range/[slug]` 카테고리 분기: 데이터 구동 — `DevicesCategoryList`(layout split) + 공통 섹션.
- `product-range/[slug]` 제품 분기 · `product/[slug]`: **`GenericProductDetail`(신규, `components/product/GenericProductDetail.tsx`) 하나로 통일**. `fetchProductBySlug` → `buildHwProductDetail(slug, productTemplateDetail)`로 실데이터를 제네릭 템플릿에 병합해 `DevicesProductHero`+`DevicesProductFeaturesSection`+`DevicesProductLineup`(table="product-template")+`DevicesProductDownloads`+선택적 `DevicesProductVideo`를 렌더한다. slug별 분기·레지스트리 없음.
- 데이터 접근은 `productsSystemsData.ts`의 slug 기준 함수(`fetchCategoryBySlug`, `fetchProductBySlug`) 재사용. 기존 `fetchCategoryByCode`/`fetchCategoryChildren`/`fetchProductsByCodePrefix`/`fetchProductDetailBySlug`도 카테고리 카드·제품 그리드 조회에 그대로 쓰인다.

## 4. 폐기된 접근 — slug→기존 페이지 레지스트리

STEP4 초기 구현은 `productRouteRegistry.ts`에 HW 3종(h100-plus/metasol-ms/susol-ul-smart-mccb)·SW 4종(scada/xems/micro-grid/smart-factory) slug만 예외로 등록하고, 기존 12개 폴더의 `page.tsx`를 그대로 import해 재사용했다. 이는 **완전 동적이 아니라는 지적**을 받아 폐기했다: 레지스트리에 없는 slug는 데이터가 있어도 404였고, 기존 파일에 대한 import 의존성 때문에 STEP7(폴더 삭제) 시 신규 라우트도 함께 깨지는 문제가 있었다. `GenericProductDetail`로 교체하면서 이 파일은 삭제했고, 기존 폴더 삭제(STEP7)와도 완전히 독립적이 됐다.

## 5. BE 확인 결과

- `PageDataService.appendWhereConditions()`의 `eq_` 접두사가 **dot-notation 중첩 JSONB 정확일치**를 지원(예: `eq_seo.slug`, `eq_category.depth`). BE 신규/변경 불필요.

## 6. seo.slug 매핑 · 리다이렉트 (`next.config.ts`)

DB 데이터는 계속 보정되고 있어 이 표는 스냅샷이다 — 실제 최신 상태는 `next.config.ts`의 `redirects()`를 참고할 것.

| 구 URL | 신 URL 목적지 |
|---|---|
| /products-systems/motor-control | /products-category/lv-products-and-systems |
| /products-systems/motor-control/h100_plus | /product/h100-plus |
| /products-systems/motor-control/metasol-ms | /product/metasol-ms |
| /products-systems/motor-control/susol-ul-smart-mccb | /product/susol-ul-smart-mccb |
| /products-systems/software/scada | /product-range/scada |
| /products-systems/software/micro-grid | /product-range/micro-grid |
| /products-systems/software/smart-factory | /product-range/smart-factory |
| /products-systems/software/xems | /product-range/xems |
| /products-systems/software | /products-category/software |
| /products-systems/lv-automation | /product-range/variable-frequency-drive |
| /products-systems/variable-frequency-drive | /product-range/variable-frequency-drive(lv-automation과 동일 목적지 — 카테고리 slug 중복) |
| /products-systems/explore-all | (불변, 리다이렉트 없음) |

seo.slug가 아직 비어있는 카테고리/제품은 신규 URL 자체가 생성되지 않고, 리다이렉트 매핑도 없다. 데이터가 채워지면 `next.config.ts`에 매핑을 추가해야 한다(자동 반영 안 됨 — 수동 목록).

## 7. 링크 치환 (GNB·브레드크럼·검색 등)

`data/gnb/mega/devices.ts`, `data/gnb/navItems.ts`, `data/gnbExploreAllProducts.ts`, `data/breadcrumbConfig.ts`, `data/search/searchAllContent.ts`, `lib/navigation/crossSectionNav.ts`(`isDevicesProductDetailPath` 신규 URL 세그먼트 기준으로 재작성), markets 데이터 7파일, products-systems 바인딩 데이터 8파일. seo.slug 확정된 경로는 전부 신규 URL로 치환 완료.

## 8. data-slugkey 표기 통일

리포 전역 컨벤션(`data-slugKey`→`data-slugkey` 소문자)에 맞춰 products-systems 하위 15개 파일(41개 지점)도 함께 통일했다.

## 9. 남은 과제 (범위 밖, 참고용)

- product-data 리치 섹션(Downloads/Applications/Why/Highlights/Video/관련제품) — 대응 DB 필드 없음. 향후 필드 추가 시 `GenericProductDetail`/`buildHwProductDetail`이 자동으로 반영하도록 이미 설계돼 있다.
- VFD 카테고리(L01-15/L05-04)·product-data 다수 항목의 seo.slug 중복/미입력 — bo 콘텐츠 데이터 보정 진행 중(이 문서 범위 아님).
