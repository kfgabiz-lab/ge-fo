# Devices Product Detail (제품상세, 3depth 완전 동적) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/product/GenericProductDetail.tsx` — 제품상세 조립 컴포넌트(HW/SW 구분 없이 slug 하나로 통일)
> - `fo/src/app/()/products-systems/data/hwProductDetail.ts` — `buildHwProductDetail()`, 실데이터를 정적 템플릿 기본값에 병합
> - `fo/src/app/()/products-systems/components/product/DevicesProductHero.tsx` (히어로+스펙, 단건)
> - `fo/src/components/content/DevicesProductFeaturesSection.tsx` (Key Features, `sectionId` 미지정 시 기본값 `product-key-feature`)
> - `fo/src/app/()/products-systems/components/product/DevicesProductLineup.tsx` (`table="product-template"`로 호출 — **product-data 대응 필드 없는 정적 컴포넌트**, MMS-32/63/100 스펙표 하드코딩)
> - 사용 페이지: `fo/src/app/()/product/[slug]/page.tsx`, `fo/src/app/()/product-range/[slug]/page.tsx`(제품 폴백 분기) — 둘 다 `<GenericProductDetail slug={slug} />` 렌더
> 상태: 개발완료 (2026-07-21 전면 재작성 — 2026-07-16 설계 당시 전제였던 "slug→기존 페이지 레지스트리·SW 전용 컴포넌트 8종" 구조가 라우팅 개편으로 폐기되고 `GenericProductDetail` 단일 컴포넌트로 통일됨에 따라 재작성. 관련 죽은 코드 삭제 완료)

## 1. 아키텍처 — HW/SW 구분 없이 단일 컴포넌트

2026-07-16 최초 설계는 HW 제품(`DevicesProductHero`)과 SW 제품 4종(`DevicesHvdcHero`/`Overview`, `DevicesMicroGridHero`/`Overview`, `DevicesSmartFactoryHero`/`Overview`, `DevicesXemsHero`/`Overview`)이 각각 다른 컴포넌트·라우트(`motor-control/{slug}`, `software/{slug}`)를 쓴다고 전제했다. `route-restructure.md`(2026-07-21)의 라우팅 개편으로 이 폴더 구조 자체가 삭제됐고, 제품상세는 예외 없이 `GenericProductDetail` 하나로 통일됐다(`route-restructure.md` §2-4 "제품상세는 예외 없이 완전 동적"). SW 전용 컴포넌트 8개와 이들을 소비하던 `mapSwProductData()`는 라우팅 개편 이후 실제로 아무 곳에서도 import되지 않는 죽은 코드였고, 2026-07-21 정밀분석에서 확인 후 **전부 삭제**했다.

```
/product/[slug], /product-range/[slug](제품 폴백)
  → GenericProductDetail({ slug })
    → buildHwProductDetail(slug, productTemplateDetail)   // 실데이터 병합
      → fetchProductDetailBySlug(slug)                     // product-data 단건 조회(eq_seo.slug)
      → mapHwProductData(row)                              // 필드 추출
    → DevicesProductHero + DevicesProductFeaturesSection + DevicesProductLineup(정적)
      + DevicesProductDownloads + DevicesProductVideo(있으면) + DevicesMarkets + DevicesHelp
      + DevicesPageFooter(FAQ)
```

## 2. data-slug

- 값: `product-data`
- 다건 여부: 단건(제품 1건 row) — 관련제품(다건) 기능은 3번 참고(현재 미구현)

## 3. data-slugKey 매핑 (실 코드 기준, `buildHwProductDetail`이 병합하는 5개 필드만 실데이터)

```html
<!-- DevicesProductHero.tsx -->
<section data-slug="product-data">
  <img data-slugkey="product_info.image" data-slugkey-attr="src" />
  <h1 data-slugkey="product.product_name">{series}</h1>
  <p data-slugkey="product.product_description">{description}</p>
  <dl>
    <!-- specs는 배열이 아니라 product_spec의 가변 개수(실측 3개) 인덱스매핑 -->
    <dt data-slugkey="product_spec.spec1_title"></dt><dd data-slugkey="product_spec.spec1_content"></dd>
    ...
  </dl>
</section>

<!-- DevicesProductFeaturesSection.tsx (sectionId 기본값 "product-key-feature") -->
<section data-slug="product-data">
  <h3 data-slugkey="key_feature1.key1_title"></h3><p data-slugkey="key_feature1.key1_content"></p>
  ... (key_feature1~4)
</section>
```

| slugKey | dataJson 필드 | 타입 | 설명 |
|---|---|---|---|
| product.product_name | product.product_name | string | 히어로 메인 제목(series) |
| product.product_description | product.product_description | string | 제품 설명 |
| product_info.image | product_info.image | array(파일ID)→url | 히어로 이미지, `/api/v1/fo/page-files/{id}` 프록시 |
| product_spec.spec{1~3}_title/content | product_spec.spec{N}_* | string | HW 스펙, 값 비면 정적 기본값 폴백 |
| key_feature{1~4}.key{N}_title/content | key_feature{N}.key{N}_* | string | Key Features 카드, 값 비면 정적 기본값 폴백 |

`buildHwProductDetail`이 실데이터로 덮어쓰는 필드는 **series/description/image/specs/keyFeatures 5개뿐**이다. `productTemplateDetail`(정적, `productDetailContent.ts`)의 나머지 필드 — `downloads`, `youtubeVideoId`, `configuratorHref` 등 — 는 이번 스코프에서 실데이터 연동 대상이 아니며 정적 값 그대로 렌더된다(설계상 정상, 5번 비고).

## 4. API 확인

신규 API 불필요 — 기존 `FoPageDataController`(`PageDataService.search()`) 재사용. `product-data` slug는 bo `slug_registry`에 `type=PAGE_DATA`, `is_active=true`로 등록 확인됨(id=29, entity_id=10, 2026-07-21 DB 직접 조회).

## 5. 조회 조건

- where: `eq_seo.slug={slug}` — 제품 route 폴더명과 DB `seo.slug` 표기 불일치 우려가 최초 설계에 있었으나, 신규 라우트는 URL 세그먼트를 그대로 `seo.slug` 조회에 쓰므로(정적 매핑표 없음) 해당 우려가 구조적으로 해소됨
- row limit: 단건(`size=1`) — VFD 6종처럼 seo.slug가 중복되는 경우 첫 건만 사용(`route-restructure.md` §2-1, 사용자 승인 정책)
- orderBy: 없음(단건)

## 6. 관련제품(Other Products) — 미구현, `_fetchedRel5`/`_fetchedRel6`와는 무관

2026-07-16 최초 설계는 관련제품이 product-data의 `_fetchedRel5`/`_fetchedRel6` 관계 필드로 채워질 거라 **추정**했다. 2026-07-21 `slug_relation` 테이블(`docs/ge_guide/builder/02.builder_data_process.md` §0-5) 직접 조회로 실제 정의를 확인한 결과, 이 추정은 **틀렸다**:

| id | master→slave | slave_filter | relation_dir | fetch_fields | category_depth | 설명(DB) |
|---|---|---|---|---|---|---|
| 5 | product-data → category-data | depth=3 | FETCH | category.title | 1 | 제품 조회 시 **대분류** 노출 |
| 6 | product-data → category-data | depth=3 | FETCH | category.title | 2 | 제품 조회 시 **중분류** 노출 |

즉 `_fetchedRel5`/`_fetchedRel6`는 관련제품 목록이 아니라 **현재 제품이 속한 대분류/중분류 카테고리 이름(브레드크럼 표시용 문자열)** 이다. `category-data` slug 안에는 depth=3의 "연결 레코드"(`{"product":{"id":"1698","depth":"3","parentId":"595","product_name":"..."}}` 형태, depth1/2의 `category.*` 레코드와 다른 shape)가 별도로 존재하며, 이 연결 레코드를 거쳐 대분류/중분류 이름을 끌어온다.

관련제품(다른 제품과의 연관) 기능은 이 메커니즘으로 구현할 수 없다 — 하려면 `slug_relation`에 `product-data`→`product-data`(같은 카테고리의 다른 제품 등) 신규 관계를 별도로 등록해야 한다. 이걸 렌더하던 `DevicesProductOtherProducts.tsx`는 애초에 `GenericProductDetail`에서 호출되지 않는(고아) 컴포넌트였고, 2026-07-21 죽은 코드 정리 시 삭제했다.

## 7. `DevicesProductLineup` — product-data와 무관한 정적 컴포넌트

`GenericProductDetail.tsx:43-47`가 `table="product-template"`로 호출하며, 이 값은 동적 테이블 생성 로직(`resolveLineupTables`)을 우회해 하드코딩된 `ProductTemplateLineupTable()`(MMS-32/63/100 스펙표)을 그대로 렌더한다. `data-slug`/`data-slugkey` 속성이 전혀 없는 순수 정적 컴포넌트이며, product-data 대응 필드가 없어 이번 문서의 바인딩 대상이 아니다(최초 설계도 이 컴포넌트를 언급하지 않았고, 이는 타당했다).

## 8. 삭제된 죽은 코드 (2026-07-21)

라우팅 개편 이후 실제로 어디서도 import되지 않는 것을 grep으로 확인 후 삭제:
- `DevicesHvdcHero.tsx`, `DevicesHvdcOverview.tsx`
- `DevicesMicroGridHero.tsx`, `DevicesMicroGridOverview.tsx`
- `DevicesSmartFactoryHero.tsx`, `DevicesSmartFactoryOverview.tsx`
- `DevicesXemsHero.tsx`, `DevicesXemsOverview.tsx`
- `DevicesProductOtherProducts.tsx`
- `mapSwProductData()`(`productsSystemsData.ts`) — 위 SW 컴포넌트 전용 매퍼, 짝을 이루는 컴포넌트가 전부 삭제되며 함께 제거

## 9. 비고

1. `product_info.image` 미입력 건은 화면 플레이스홀더로 폴백(정상, 개발 블로커 아님).
2. HW `susol-ul-smart-mccb` 등 일부 제품이 `DevicesProductLineup`에서 전용 하드코딩 테이블(`susol-frame`/`metasol-ms`/`h100-plus`)을 쓰는지, `product-template` 공용 테이블을 쓰는지는 `table` prop 값에 따라 갈리며 이번 문서 범위 밖(정적 렌더링 로직).
3. 관련제품(6번) 기능 자체를 새로 만들지 여부는 이번 스코프 밖 — 별도 기능개발 건으로 취급한다.

## 10. STEP별 진행 이력

| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1~3 | fo-slug-analyzer / fo-dev-doc-writer | 2026-07-16 | HW/SW 개별 컴포넌트 구조 전제로 최초 문서 작성(상태: 설계중). API 확인 "확인 필요", `_fetchedRel5/6`을 관련제품 관계로 추정 |
| 라우팅 개편 | (route-restructure.md 참고) | 2026-07-21 | `GenericProductDetail` 단일 컴포넌트로 통일, HW/SW 개별 라우트·컴포넌트 전제 붕괴(문서 갱신 누락) |
| 재검증·전면 재작성 | (심층분석 + `slug_relation` DB 조회) | 2026-07-21 | `GenericProductDetail`/`buildHwProductDetail` 실제 조립 구조로 재작성, `_fetchedRel5/6` 실제 의미(대분류/중분류) 확정 및 오류 정정, 죽은 코드 8+1개 삭제 |
