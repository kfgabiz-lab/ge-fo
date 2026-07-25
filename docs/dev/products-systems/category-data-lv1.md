# Devices Hero + Products Grid (LV1 카테고리 랜딩) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/DevicesHero.tsx` (히어로 인트로, 단건 — `.devices_hero__inner`)
> - `fo/src/app/()/products-systems/components/DevicesProducts.tsx` (하위 카테고리 카드 그리드, 다건 — `.devices_products__grid`, `DevicesHero`가 `withProducts` prop으로 embedded 렌더도 겸함)
> - 사용 페이지: `fo/src/app/()/products-category/[slug]/page.tsx` (`<DevicesHero withProducts />`) — 2026-07-21 라우팅 개편(`route-restructure.md`)으로 기존 `motor-control/page.tsx`에서 이관, seo.slug 기반 동적 라우트로 전환. `generateMetadata`(SEO)는 5절 참고 — 현재 미구현(코드 확인 완료, 2026-07-26)
> 상태: 완료 (2026-07-26 — 기획서 요건 반영 STEP4~6 개발 및 QA 검증 완료. STEP4 BE 설계는 dev DB psql 실측으로 검증했고, STEP5 BE(`FoCategoryController`/`PageDataService.findCategoryLv2`/`findCategoryInsights`) 및 STEP6 FE(`page.tsx`/`productsSystemsData.ts`/`DevicesPageFooter.tsx`)는 curl·SSR·브라우저 QA로 실동작까지 확인함)

## 1. data-slug
- 값: `category-data`
- 다건 여부: 혼합 — 히어로 인트로(단건, category depth1 레코드) + 하위 카테고리 카드 목록(다건, category depth2 레코드). 같은 slug를 두 컨텍스트(단건/다건)에서 다른 where로 조회하는 케이스(가이드 1절 "동일 최상위 data-slug가 서로 다른 두 DOM 영역에 이중으로 붙는 경우"와 유사하되, 여기서는 depth가 달라 결과셋 자체가 다름).

## 2. data-slugKey 매핑

```html
<!-- DevicesHero.tsx: 히어로 인트로(단건, depth1) -->
<div className="devices_hero__inner" data-slug="category-data">
  <h1 className="devices_hero__tit" data-slugKey="category.title">{title}</h1>
  <p className="devices_hero__desc" data-slugKey="device_systems.description">{description}</p>
</div>

<!-- DevicesProducts.tsx: 하위 카테고리 카드 그리드(다건, depth2) -->
<div className="devices_products__grid" data-slug="category-data" data-slug-repeat="true">
  <Link data-slug-item>
    <img data-slugKey="device_systems.image" data-slugKey-attr="src" />
    <h3 data-slugKey="category.title">...</h3>
  </Link>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| category.title (히어로, 단건) | category.title | string | 텍스트(`h1.devices_hero__tit`) | LV1 카테고리명 (depth1 레코드) |
| device_systems.description (히어로, 단건) | device_systems.description | string | 텍스트(`p.devices_hero__desc`) | LV1 카테고리 설명 (depth1 레코드). 관리자가 "카테고리 설명"으로 입력하는 필드는 bo 템플릿 `category1-DeviceSystems`의 `device_systems.description`이다(`category.description`은 어떤 템플릿도 채우지 않으므로 사용하지 않는다) |
| device_systems.image (카드, 다건) | device_systems.image | array(파일ID) → string(url) | 속성(`img.src`) | 하위 카테고리 카드 썸네일. 파일ID 배열 → FE에서 `/api/v1/fo/page-files/{id}` 프록시로 변환. 현재 실측 0건 입력(플레이스홀더 폴백 필요, 정상) |
| category.title (카드, 다건) | category.title | string | 텍스트(`h3.tit`) | 하위 카테고리명 (depth2 레코드) |

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)

**혼합** — 히어로(단건)와 하위 Lv2 목록(다건)의 API 확인 결과가 다르다.

- 히어로(단건, depth1): 신규 API 불필요(기존 활용 가능) — `GET /api/v1/fo/page-data/category-data`(`FoPageDataController` / `PageDataService.search()`). 이번 개정에서 변경 없음.
- 하위 Lv2 목록(다건, depth2): **신규 필요**
  - 근거: 4절 확정 where 중 ④(depth3 junction을 경유해 product-data의 `is_visible`/`order_status`를 확인하는 EXISTS 조건)는 서로 다른 두 data-slug(category-data ↔ product-data) 레코드 간 조인이다. 기존 `PageDataService.search()`의 제네릭 where 빌더는 단일 slug 레코드 자신의 `data_json` 내부만 조회 대상으로 하므로(코드 확인: `PageDataService.java` where 빌더가 참조하는 EXISTS는 전부 `data_json` 내부 `jsonb_each` 순회용이지, 다른 슬러그 레코드와의 조인용이 아님) 이 조건을 표현할 수 없다. 숫자 `sortOrder` 오름차순(NULLS LAST) 정렬도 제네릭 `sort` 파라미터가 지원하지 않는다(TEXT 정렬만 지원, 기존에도 FE 정렬로 우회해온 이유).
  - `bo-api` 컨트롤러 목록을 grep한 결과 `/api/v1/fo/categories/*` 계열 엔드포인트는 아직 존재하지 않음(2026-07-26 확인).
- (기존 활용 가능 시) 참고 엔드포인트: 히어로만 — `GET /api/v1/fo/page-data/category-data`
- (신규 필요 시) 제안 엔드포인트: `GET /api/v1/fo/categories/{categoryId}/lv2` — Lv1 하위 노출가능 Lv2 목록 전용. 상세 구현(SQL/서비스 메서드/DTO)은 STEP4(`fo-be-analyzer`)에서 확정.
- 비고: `category-data` slug의 bo SlugRegistry 등록 여부는 이전 STEP과 동일하게 **확인 필요** 상태 유지(이번 STEP에서 재검증하지 않음).

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)

### 히어로 인트로 (단건, depth1)
- where: `category.depth=1 AND category.code={페이지 카테고리코드}` — motor-control 페이지는 카테고리 `L01`("LV Products and Systems")로 실측 확정(히어로 title 및 하위 14개 카드가 L01 depth2 children과 일치)
- row limit: 단건(1건)
- orderBy: 없음(단건이라 불필요)
- 2차 정렬(tie-breaker): 불필요

### 하위 Lv2 목록 (다건, depth2) — 2026-07-26 개정: where 4조건으로 확장

기존 문서는 `category.parentId={상위 depth1 rowId}` 단일조건(또는 `category.code LIKE` 대안)만 확정했으나, 기획서 요건 반영으로 "노출가능한" Lv2만 걸러내도록 아래 4조건 전체(AND)로 교체한다. 신규 전용 엔드포인트라 `category.code LIKE` 대안은 더 이상 필요 없다(단일조건으로 확정).

- where(① ~ ④ 전부 AND):
  1. `category.parentId` = Lv1 id (예: motor-control은 568)
  2. `category.depth` = `'2'`
  3. `category.is_visible` = `'001'`
  4. EXISTS: depth3 junction(product-data와 category-data를 잇는 연결 레코드, 필드는 `product.parentId` = 이 Lv2 id — `PageDataService.java`의 CATEGORY FETCH/FILTER 로직이 `"product.id" → "product.parentId"` 유도 패턴으로 실제 참조하는 필드, 임의 추정 아님) → 그 junction이 가리키는 product-data 레코드가 `product.is_visible`='001' **AND** `product.order_status`='01'
- orderBy: 최상위 `sortOrder` 숫자 오름차순(NULLS LAST) — `category` 섹션 밖의 최상위 필드(기존 버그 콜아웃 참고)
- 2차 정렬(tie-breaker): `id ASC`
- row limit: 없음(전체) — 전용 엔드포인트라 페이징 개념 자체를 두지 않는다.
- 신규 엔드포인트: `GET /api/v1/fo/categories/{categoryId}/lv2`

**비고(신규 스펙 관련)**
- 기존 `fetchCategoryChildren`(parentId 단일조건, `productsSystemsData.ts:84`)은 그대로 유지한다 — `fo/src/data/support/techHubData.ts:133`이 동일 함수를 계속 호출 중임을 코드로 확인(2026-07-26). Lv1 page(`products-category/[slug]/page.tsx`)만 신규 API 호출로 교체한다.
- `product.order_status`가 NULL이거나 빈 값인 제품은 `='01'` 조건을 만족하지 못해 EXISTS에서 제외된다(3치논리, 의도된 동작 — "판매중 아님/미설정"을 동일 취급).
- 제품 1건이 여러 Lv2에 매핑될 수 있으므로, "노출가능 Lv2 중 하나라도 조건을 통과하면 그 Lv2는 노출"이라는 OR 판정이다(제품 기준 AND, Lv2 기준으로는 사실상 OR로 동작).

**⚠️ 정렬 필드 접근 버그(2026-07-21 수정, 참고용 — 기존 `fetchCategoryChildren` 한정)**: `sortOrder`는 `category` 섹션 **밖**의 최상위 필드다(`dataJson: { category: {...}, sortOrder: N, device_systems: {...} }`, DB 실측 확인). `fetchCategoryChildren`(`productsSystemsData.ts`)이 과거 `row["category.sortOrder"] ?? row["category.sort_order"]`로 읽고 있었는데, `flattenPageDataItem`(`fo/src/lib/pageData.ts`)의 병합 규칙상 이 두 키는 항상 `undefined`가 되어 모든 카드의 sortOrder가 0으로 처리되고 있었다(사실상 id 순 정렬로만 동작). `row["sortOrder"]`(접두사 없음)로 수정했다. **신규 Lv2 API는 서버 측에서 직접 정렬하므로 이 클래스의 버그(필드 접근 경로 실수)가 재발하지 않도록 STEP4/6에서 동일 필드 위치(최상위, 섹션 밖)를 참고할 것.**

## 5. SEO 매핑 (신규 — 2026-07-26)

- 대상: `fo/src/app/()/products-category/[slug]/page.tsx`의 Next.js `generateMetadata` — 현재 파일에 `generateMetadata` export 자체가 없음(코드 확인 완료, 2026-07-26). 신규 추가 필요.
- 매핑: 히어로와 동일한 category-data depth1 레코드의 `seo.slug` / `seo.meta_title` / `seo.meta_description` → `generateMetadata`가 반환하는 `Metadata`의 `title`/`description`에 매핑.
- 값 없을 때 폴백: 없음(빈 채로) — 정적 기본 타이틀/설명으로 대체하지 않는다.
- 조회 방식: 별도 신규 API 호출이 아니라, 히어로 조회 시 이미 가져오는 category-data depth1 레코드(`fetchCategoryBySlug`)의 리턴 필드를 확장하는 문제에 가깝다 — 현재 `fetchCategoryBySlug`(`productsSystemsData.ts:42`)의 리턴 타입 `CategoryRow`에는 `seo.slug`만 있고 `seo.meta_title`/`seo.meta_description`은 없다(코드 확인 완료). 신규 API 필요 여부가 아니라 기존 함수의 리턴 타입/추출 필드 확장 여부이며, 최종 판단은 STEP4/6.
- ✅ 확인 완료(2026-07-26 재검증): `seo.meta_title`/`seo.meta_description`은 스네이크케이스가 맞다. `dev_db_dump.sql:15983` 실데이터에서 `"seo": {"slug": "form-key-value-change-test", "meta_title": "form key value change test", "meta_description": "form key value change test!!!!!"}`를 직접 확인했다(오타 아님, 실제 저장 필드).

## 6. 샘플 응답 데이터

> 실 데이터는 이번 STEP1~3 범위에서 직접 조회하지 않았음(STEP2 확정 정보로 전달받은 값 기준). 아래는 매핑 구조를 보여주기 위한 **추정** 예시.

```json
{
  "content": [
    {
      "id": 568,
      "dataJson": {
        "category": {
          "depth": 1,
          "code": "L01",
          "title": "LV Products and Systems"
        },
        "device_systems": {
          "description": "Explore our comprehensive lineup of UL-certified low voltage solutions."
        }
      }
    },
    {
      "id": 601,
      "dataJson": {
        "category": {
          "depth": 2,
          "code": "L01-07",
          "parentId": 568,
          "title": "Susol UL Smart MCCB",
          "sortOrder": 1
        },
        "device_systems": {
          "image": []
        }
      }
    }
  ]
}
```

## 7. 비고
1. `category-data` slug의 bo SlugRegistry 등록 여부 — **확인 필요**(직접 검증 안 함). bo 관리자 화면에서 확인 필요.
2. `device_systems.image` 현재 실측 미입력(0건) — 화면상 카드 썸네일이 플레이스홀더로 보이는 것은 설계상 정상이며 개발 블로커 아님.
3. depth1 히어로 레코드에는 이미지 필드가 없음(정상) — `DevicesHero.tsx`에 이미지 바인딩 없음.
4. 이번 문서는 motor-control(카테고리 `L01`) 케이스만 확정. lv-automation/variable-frequency-drive는 같은 컴포넌트 구조가 아니라 `DevicesCategoryList.tsx`를 쓰므로 별도 문서(`category-data-lv2.md`)로 분리했다.
5. 이번 범위 제외(정적 유지): `DevicesMarkets`, `DevicesHelp`, `DevicesPageFooter`는 category-data 대응 필드 없음(별도 컴포넌트/slug 대상, 이번 문서 범위 아님).
6. **(기획서 12번 — Contact Us, 구현 완료)** `DevicesPageFooter.tsx`가 렌더하는 `CommonBanner04`는 개정 전 `linkHref` prop을 전달받지 못해 항상 빈 href(`href=""`, 클릭 비활성)로 렌더됐다. STEP6에서 `DevicesPageFooterProps`에 optional prop `bannerLinkHref`를 신규 추가하고, Lv1 page(`products-category/[slug]/page.tsx`)에서만 `bannerLinkHref="/support/contact-us"`를 전달하도록 구현했다(다른 호출부는 prop 미전달 → `CommonBanner04` 기본값 `""` 그대로 유지, 영향 없음). QA에서 `/support/contact-us` 클릭 이동 확인 완료.
7. **(기획서 8번 — help-1 data-slug 게이팅)** `DevicesHelp.tsx`의 `connectPortalHref` truthy 게이팅은 이미 완료된 코드다(2026-07-25 — `product-data-detail.md` §10-8 참고, 코드 재확인 완료 2026-07-26): `connectPortalHref`가 truthy일 때만 help-1 카드에 `data-slug="product-data"`/`data-slugkey="product_etc.connect_portal"`이 부착된다(`DevicesHelp.tsx:66-71`). 다만 같은 문서(§10-3, 195행)에 **"`products-category/[slug]/page.tsx`는 단건 제품 데이터가 없는 목록 화면이라 `connectPortalHref`를 전달하지 않는다"는 결정이 이미 기록**돼 있다 — 즉 이 Lv1 페이지의 `DevicesHelp`는 항상 폴백 URL(`CONNECT_PORTAL_FALLBACK_HREF`)로 렌더되고 data-slug도 부착되지 않는 것이 현재 설계상 정상이며, 이번 작업 범위에서 변경 대상이 아니다.
8. **정적 폴백 제거(버그, 코드 확인 완료 2026-07-26)**: `products-category/[slug]/page.tsx` 29~37행이 `children.length > 0 ? children.map(...) : undefined`로 `products` prop을 만든다. `DevicesProducts.tsx`의 `items` prop 기본값이 `motorControlProducts`(정적 14개 카드, `motorControlContent.ts`)이기 때문에, 하위 Lv2가 실제로 0건이어도 `undefined`가 전달되는 순간 정적 목업 14개 카드가 그대로 노출되는 버그다. 확정 스펙: children이 0건이어도 `DevicesProducts`에 빈 배열(`[]`)을 전달해 그리드 컨테이너는 유지하되 카드 0개로 렌더한다(`fo-data-binding-가이드.md` 5절 "컨테이너 유지 + 항목만 있는 만큼 표시" 원칙과 일치).
9. 신규 Lv2 API 조건 ④에 쓰이는 `product.parentId`(depth3 junction 필드)는 `PageDataService.java`의 CATEGORY FETCH/FILTER 로직(`slaveKey` "product.id"→"product.parentId" 유도 패턴, 2698~2723행)에서 실제로 참조되는 필드임을 코드로 확인했다 — 임의 추정이 아니다.

## 8. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-16 | `DevicesHero.tsx`(`.devices_hero__inner`)에 `data-slug="category-data"` + `category.title`/`category.description` 단건 태깅, `DevicesProducts.tsx`(`.devices_products__grid`)에 `data-slug="category-data" data-slug-repeat`/`data-slug-item` + `device_systems.image`(attr src)/`category.title` 다건 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-16 | 히어로 where(`depth=1 AND code=L01`, motor-control 실측 확정) / 카드 where(`parentId=568` 또는 `code LIKE 'L01-%' AND depth=2`), orderBy `sortOrder ASC`, tie `id ASC` 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-16 | 작업 단위 문서 작성 (상태: 설계중). API 확인 결과 "확인 필요"로 명시 |
| 카테고리 설명 필드 정정 | fo-fe-builder | 2026-07-25 | 히어로 설명 slugKey를 `category.description` → `device_systems.description`으로 교체(bo 템플릿 `category1-DeviceSystems` 실제 입력 필드). `fetchCategoryBySlug`의 참조 필드도 동일 교정, 폴백 없음. 데드 코드 `fetchCategoryByCode`(+ 전용 헬퍼 `searchPageData`/`CategoryHero`) 삭제 |
| STEP3(개정) | fo-dev-doc-writer | 2026-07-26 | 기획서 요건 반영: 하위 Lv2 목록 where를 4조건(parentId + depth=2 + is_visible + EXISTS product 공개·판매중)으로 확장하고 신규 엔드포인트 `GET /api/v1/fo/categories/{categoryId}/lv2` 제안(API 확인 "신규 필요"로 갱신), SEO(`seo.meta_title`/`seo.meta_description` → `generateMetadata`) 신규 반영, 12번 Contact Us(`CommonBanner04` linkHref 주입)·8번 help-1 게이팅(이미 완료된 코드 확인)·정적 폴백 제거 버그(children 0건 시 `undefined` 대신 `[]`)를 비고에 반영. **코드 변경 없음(문서만), 승인 대기** |
| STEP4 | fo-be-analyzer | 2026-07-26 | `FoCategoryController` 신규(패키지/시그니처), `PageDataService`에 공유 CTE(`CATEGORY_LV2_CTE`) + `findCategoryLv2`/`findCategoryInsights` 설계, 신규 DTO `CategoryLv2RowResponse`(API-2는 기존 `ProductInsightRowResponse` 재사용) 확정. dev DB psql 직접 실행 검증: Lv1 568/569/570/571/572/573 → 13/7/2/8/4/4건, `order_status='99'` 음성 테스트로 EXISTS 실평가 확인 |
| STEP5 | fo-be-builder | 2026-07-26 | 설계 그대로 구현 — `FoCategoryController.java`, `CategoryLv2RowResponse.java` 신규, `PageDataService.java`에 상수+메서드 2개 추가. bo-api 재기동 후 curl 검증: `/categories/568/lv2` 13건, `/categories/573/insights` 3건(press 2125/2101, articles 1887) — STEP4 psql 결과와 일치. 기존 `/products/{id}/insights`, `/gnb/devices-tree` 회귀 정상 |
| STEP6 | fo-fe-builder | 2026-07-26 | `productsSystemsData.ts`(`fetchVisibleLv2Categories` 신규, `CategoryRow`에 metaTitle/metaDescription 추가, `fetchCategoryChildren`은 techHubData.ts용으로 유지), `highlightNewsData.ts`(`fetchCategoryInsights` 신규, `fetchProductInsights`와 매핑 로직 공유), `page.tsx`(`generateMetadata` 신규, Lv2 조회 교체, 정적 폴백 제거, `highlightItems`/`bannerLinkHref` 주입), `DevicesPageFooter.tsx`(`bannerLinkHref` optional prop 추가). `tsc --noEmit` 통과, SSR 실측: 568→카드13개, 573→카드4개+Highlights3건 |
| QA | fo-qa-validator | 2026-07-26 | 브라우저 실검증 10개 시나리오 전부 통과(카드목록/정렬/클릭이동/Contact Us/CTA3종/Highlights/SEO/정적폴백미노출/콘솔에러/hover회귀). 이미지 404는 로컬 파일 업로드 디스크 부재로 인한 기존 환경 이슈(코드 결함 아님, `press-data.md:120`에 동일 현상 기록됨)로 확정 |

**최종 상태: 완료.** 기획서(product-lv1.png) 13항목 전부 반영 확인. `#완료` 처리됨.
