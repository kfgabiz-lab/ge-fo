# Devices Product Detail (제품상세, 3depth 완전 동적) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/product/GenericProductDetail.tsx` — 제품상세 조립 컴포넌트(HW/SW 구분 없이 slug 하나로 통일)
> - `fo/src/app/()/products-systems/data/hwProductDetail.ts` — `buildHwProductDetail()`, 실데이터를 정적 템플릿 기본값에 병합
> - `fo/src/app/()/products-systems/data/productsSystemsData.ts` — `fetchProductDetailBySlug`/`mapHwProductData`(product-data 단건), `fetchProductFaqItems`(faq-data 제품별 목록, 10-4)
> - `fo/src/app/()/products-systems/components/product/DevicesProductHero.tsx` (히어로+스펙, 단건)
> - `fo/src/components/content/DevicesProductFeaturesSection.tsx` (Key Features, `sectionId` 미지정 시 기본값 `product-key-feature`)
> - `fo/src/app/()/products-systems/components/product/DevicesProductLineup.tsx` (`table="product-template"`로 호출 — **product-data 대응 필드 없는 정적 컴포넌트**, MMS-32/63/100 스펙표 하드코딩)
> - `fo/src/app/()/products-systems/components/product/DevicesProductVideo.tsx` (Video 섹션, `youtubeVideoId` 있을 때만 렌더 — 10-1)
> - `fo/src/app/()/products-systems/components/product/DevicesProductDownloads.tsx` (Downloads 섹션 — 10-5)
> - `fo/src/app/()/products-systems/components/DevicesPageFooter.tsx` (`faqItems` prop 있으면 하단 FAQ 렌더 — 10-4)
> - `fo/src/lib/youtubeEmbed.ts` (`getYoutubeIdFromUrl` — 기존 공통함수, 10-1)
> - 사용 페이지: `fo/src/app/()/product/[slug]/page.tsx`, `fo/src/app/()/product-range/[slug]/page.tsx`(제품 폴백 분기) — 둘 다 `<GenericProductDetail slug={slug} />` 렌더
> 상태: 개발완료(1차 베이스라인 — series/description/image/specs/keyFeatures 5필드) + **Video/Configurator/FAQ(제품별) 확장 반영됨(2026-07-21, 코드 확인 완료)** + Downloads 카운트 표시 수정/Other Products 죽은 네비 제거는 **설계 승인됨(전체진행) — 코드 미반영, 진행 중**(10번 참고)

## 1. 아키텍처 — HW/SW 구분 없이 단일 컴포넌트

2026-07-16 최초 설계는 HW 제품(`DevicesProductHero`)과 SW 제품 4종(`DevicesHvdcHero`/`Overview`, `DevicesMicroGridHero`/`Overview`, `DevicesSmartFactoryHero`/`Overview`, `DevicesXemsHero`/`Overview`)이 각각 다른 컴포넌트·라우트(`motor-control/{slug}`, `software/{slug}`)를 쓴다고 전제했다. `route-restructure.md`(2026-07-21)의 라우팅 개편으로 이 폴더 구조 자체가 삭제됐고, 제품상세는 예외 없이 `GenericProductDetail` 하나로 통일됐다(`route-restructure.md` §2-4 "제품상세는 예외 없이 완전 동적"). SW 전용 컴포넌트 8개와 이들을 소비하던 `mapSwProductData()`는 라우팅 개편 이후 실제로 아무 곳에서도 import되지 않는 죽은 코드였고, 2026-07-21 정밀분석에서 확인 후 **전부 삭제**했다.

```
/product/[slug], /product-range/[slug](제품 폴백)
  → GenericProductDetail({ slug })
    → buildHwProductDetail(slug, productTemplateDetail)   // { detail, productId } 반환
      → fetchProductDetailBySlug(slug)                     // product-data 단건 조회(eq_seo.slug)
      → mapHwProductData(row)                              // 필드 추출(series/desc/image/specs/keyFeatures/video/connectPortal)
    → fetchProductFaqItems(productId)                       // faq-data 제품별 목록(10-4), 0건이면 정적 폴백
    → DevicesProductHero + DevicesProductFeaturesSection + DevicesProductLineup(정적)
      + DevicesProductDownloads(items=[], 10-5) + DevicesProductVideo(youtubeVideoId 있을 때만, 10-1)
      + DevicesMarkets + DevicesHelp
      + DevicesPageFooter(faqItems)
```

## 2. data-slug

- 값: `product-data`
- 다건 여부: 단건(제품 1건 row) — 관련제품(다건) 기능은 6번 참고(현재 미구현). FAQ(다건)는 별개 slug `faq-data`이며 10-4/`faq-data-product.md` 참고.

## 3. data-slugKey 매핑 (실 코드 기준)

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
| product_etc.video | product_etc.video | string(YouTube watch URL 전체) | Video 섹션 소스. FE에서 `getYoutubeIdFromUrl`로 id만 추출해 `detail.youtubeVideoId`에 대입(10-1) |
| product_etc.connect_portal | product_etc.connect_portal | string(URL) | Configurator CTA 링크(`detail.configuratorHref`), 변환 없이 그대로 사용(10-2) |

`buildHwProductDetail`이 실데이터로 덮어쓰는 필드는 **series/description/image/specs/keyFeatures/youtubeVideoId/configuratorHref 7개**다(2026-07-21 확장 반영, 코드 확인 완료 — `hwProductDetail.ts`). `productTemplateDetail`(정적, `productDetailContent.ts`)의 나머지 필드 — `downloads`, `otherProducts` 등 — 는 이번 스코프에서도 실데이터 연동 대상이 아니며 정적 값 그대로 렌더된다(10-5/10-6, 설계상 정상).

## 4. API 확인

신규 API 불필요 — 기존 `FoPageDataController`(`PageDataService.search()`) 재사용. `product-data` slug는 bo `slug_registry`에 `type=PAGE_DATA`, `is_active=true`로 등록 확인됨(id=29, entity_id=10, 2026-07-21 DB 직접 조회). 10-4(FAQ 제품별)도 같은 컨트롤러를 where 조합만 다르게 재사용하며 신규 API가 필요하지 않다(`faq-data` slug 자체는 `faq-data.md`(markets) STEP4에서 이미 등록 확인됨, id=108).

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

관련제품(다른 제품과의 연관) 기능은 이 메커니즘으로 구현할 수 없다 — 하려면 `slug_relation`에 `product-data`→`product-data`(같은 카테고리의 다른 제품 등) 신규 관계를 별도로 등록해야 한다. 이걸 렌더하던 `DevicesProductOtherProducts.tsx`는 애초에 `GenericProductDetail`에서 호출되지 않는(고아) 컴포넌트였고, 2026-07-21 죽은 코드 정리 시 삭제했다. 이 섹션에 대응하는 네비게이션 항목(`product-other`)도 죽은 앵커이며 10-6에서 제거를 다룬다.

## 7. `DevicesProductLineup` — product-data와 무관한 정적 컴포넌트

`GenericProductDetail.tsx`가 `table="product-template"`로 호출하며, 이 값은 동적 테이블 생성 로직(`resolveLineupTables`)을 우회해 하드코딩된 `ProductTemplateLineupTable()`(MMS-32/63/100 스펙표)을 그대로 렌더한다. `data-slug`/`data-slugkey` 속성이 전혀 없는 순수 정적 컴포넌트이며, product-data 대응 필드가 없어 이번 문서의 바인딩 대상이 아니다(최초 설계도 이 컴포넌트를 언급하지 않았고, 이는 타당했다). 2026-07-21 확장 검토(10-3)에서도 이 결론은 재확인됐다 — `product_etc.line_up` 필드가 있긴 하나 editor(HTML blob) 타입이라 정형 스펙표(컬럼 구조)로 바로 쓸 수 없다.

## 8. 삭제된 죽은 코드 (2026-07-21)

라우팅 개편 이후 실제로 어디서도 import되지 않는 것을 grep으로 확인 후 삭제:
- `DevicesHvdcHero.tsx`, `DevicesHvdcOverview.tsx`
- `DevicesMicroGridHero.tsx`, `DevicesMicroGridOverview.tsx`
- `DevicesSmartFactoryHero.tsx`, `DevicesSmartFactoryOverview.tsx`
- `DevicesXemsHero.tsx`, `DevicesXemsOverview.tsx`
- `DevicesProductOtherProducts.tsx`
- `mapSwProductData()`(`productsSystemsData.ts`) — 위 SW 컴포넌트 전용 매퍼, 짝을 이루는 컴포넌트가 전부 삭제되며 함께 제거

## 9. 비고 (1차 베이스라인)

1. `product_info.image` 미입력 건은 화면 플레이스홀더로 폴백(정상, 개발 블로커 아님).
2. HW `susol-ul-smart-mccb` 등 일부 제품이 `DevicesProductLineup`에서 전용 하드코딩 테이블(`susol-frame`/`metasol-ms`/`h100-plus`)을 쓰는지, `product-template` 공용 테이블을 쓰는지는 `table` prop 값에 따라 갈리며 이번 문서 범위 밖(정적 렌더링 로직).
3. 관련제품(6번) 기능 자체를 새로 만들지 여부는 이번 스코프 밖 — 별도 기능개발 건으로 취급한다.

## 10. 확장 바인딩 설계 — Video / Configurator / Lineup / FAQ(제품별) / Downloads / 죽은 네비 정리 (승인됨·전체진행, 2026-07-21)

이번 확장은 사용자가 `#전체진행`으로 STEP0~3 판단을 위임한 건으로, 상태를 **승인됨(전체진행)**으로 기록한다. 항목별로 코드 반영 여부가 다르므로(10-1/10-2/10-4는 이미 반영, 10-5/10-6은 설계만 확정) 아래 표로 구분한다.

| 항목 | 설계 상태 | 코드 반영 상태(2026-07-21 직접 확인) |
|---|---|---|
| 10-1 Video | 확정 | **반영됨** — `hwProductDetail.ts` |
| 10-2 Configurator | 확정 | **반영됨** — `hwProductDetail.ts` |
| 10-3 Lineup | 확정(정적 유지) | 해당 없음(변경 없음) |
| 10-4 FAQ(제품별) | 확정(⚠️ 사용자 지시와 다른 방식 — 하단 참고) | **반영됨** — `productsSystemsData.ts`(`fetchProductFaqItems`), `GenericProductDetail.tsx` |
| 10-5 Downloads | 확정(카운트만 0 표시, 목록은 추후) | **부분 반영** — `items={[]}` 전달은 반영됨. 가짜 카운트 `2,658` 텍스트는 `DevicesProductDownloads.tsx:15` `DOWNLOADS_TOTAL_RESULTS`에 **아직 하드코딩 그대로** — 미반영 |
| 10-6 Other Products 죽은 네비 제거 | 확정 | **미반영** — `productDetailContent.ts:600` `productDetailNavItems`에 `{ id: "product-other", label: "Other Products" }` **아직 존재** |

### 10-1. Video

- 필드: `product_etc.video` — 전체 YouTube watch URL(예: `https://www.youtube.com/watch?v=...`).
- 근거: STEP0에서 확인한 bo `page_template` id=19 `config_json`의 `fieldKey:"video"` input, 실데이터 3건 테스트값(실서비스 데이터 전수는 아님).
- 변환: FE에서 URL 전체를 그대로 쓰지 않고 `getYoutubeIdFromUrl()`로 videoId만 추출해 `detail.youtubeVideoId`에 대입한다. **이 함수는 신규 작성이 아니라 `fo/src/lib/youtubeEmbed.ts`에 이미 있던 기존 공통함수**다(company Press/Blog 상세 등에서 쓰는 `getYoutubeEmbedSrc`와 같은 파일). 최초 목표설정 대화에서 "신규 순수함수"로 전달됐던 부분은 코드 직접 확인 결과 사실이 아니라 정정한다.
- 빈값/URL 파싱 실패(`getYoutubeIdFromUrl`이 빈 문자열 반환) 시 정적 기본값(`base.youtubeVideoId`)으로 폴백 — `hwProductDetail.ts:37` `getYoutubeIdFromUrl(data.video) || base.youtubeVideoId`.
- `GenericProductDetail.tsx`는 `detail.youtubeVideoId`가 있을 때만 `DevicesProductVideo`를 렌더(기존 동작 그대로, 변경 없음).

### 10-2. Configurator

- 필드: `product_etc.connect_portal` — 전체 URL. 값 변환 없이 그대로 `detail.configuratorHref`에 대입(`hwProductDetail.ts:39` `data.connectPortal || base.configuratorHref`).
- 근거: bo `page_template` id=19 config의 `fieldKey:"connect_portal"` input.
- 빈값이면 정적 기본값(`base.configuratorHref`, 템플릿 공용 Configurator 링크)으로 폴백.
- 소비처: `DevicesProductLineup`의 `configuratorHref`/`configuratorExternal` prop(Lineup 섹션 하단 Configurator 안내 링크) — Lineup 자체(7번/10-3)는 정적이지만 이 CTA 링크만 동적이다.

### 10-3. Lineup — 정적 유지 재확인

`product_etc.line_up` 필드가 product-data에 존재하긴 하나 **editor 타입(HTML blob)** 이라 현재 `DevicesProductLineup`이 요구하는 정형 컬럼 스키마(`ProductLineupRow`/`ProductFrameLineup` — Rated Current/Interrupting/Standard 등 고정 컬럼)와 구조적으로 호환되지 않는다. "라인업 테이블용 필드가 없으면 정적 유지, 임의 slug·필드 생성 금지" 원칙에 따라 **이번 확장에서도 정적 유지**로 확정했다(7번과 동일 결론, 근거만 추가 확인).

### 10-4. FAQ(제품별) — faq-data 재사용, 필터 방식은 사용자 지시와 다름

**⚠️ 크리티컬: 사용자가 목표설정 단계에서 "product type(P/A)으로 필터"를 지시했으나, faq-data 스키마상 이 방식은 불가능하다고 판단해 다른 방식으로 확정했다.**

- faq-data(`faq.*` 콘텐츠 키, `faq-data.md` 참고)에는 **product type 단위 필터용 필드가 없다** — bo `faq-detail`/`faq-list` 템플릿(`page_template` id=87/86) config에 `product_type`류 필드가 존재하지 않는다.
- 대신 faq-data에 이미 있는 `product`(개별 제품 id, FK 성격 필드)로 필터한다: `eq_product={product-data _id}`. 즉 "제품 타입(P/A) 단위"가 아니라 "개별 제품 1건 단위"로 좁혀진다 — 지시받은 필터 단위와 다르다.
- where 조합(신규): `eq_main_category=001`(faq-data 대분류 코드 — `faq-data.md`의 markets 사용(`002`)과 다른 코드값, "Products & Systems") + `eq_product={productId}` + `eq_is_visible=001`, `sort=id,asc`, `size=100`.
- 엔드포인트는 신규가 아니다 — `GET /api/v1/fo/page-data/faq-data`(기존, `faq-data.md` STEP4에서 이미 확인된 컨트롤러) 재사용, where 파라미터 조합만 다르다.
- 구현: `productsSystemsData.ts`의 `fetchProductFaqItems(productId)` — 공통 `fetchData` 유틸(`@/lib/pageDataApi`) + `flattenPageDataItem`(`@/lib/pageData`)로 markets FAQ와 동일한 패턴을 따른다(콘텐츠 키 이름에 의존하지 않음, `faq-data.md` §3의 공통 규칙 재사용). `row.question`/`row.answer`를 그대로 매핑.
- 0건이면 `productTemplateFaqItems`(정적) 폴백 — `GenericProductDetail.tsx`: `faqItems.length > 0 ? faqItems : productTemplateFaqItems`.
- **실유효 데이터 현재 0건** — BO에 `main_category=001`(Products & Systems) + 개별 `product` id로 등록된 FAQ가 아직 없다(사용자 재입력 필요). 이는 **데이터 과제이며 코드 블로커가 아니다**.
- **미검증/확인 필요**: `eq_product` 조회 시 faq-data의 `product` 필드 저장 타입(문자열 vs 숫자)이 product-data `_id`(숫자)와 JSONB 매칭에서 정확히 일치하는지는 실측 curl로 아직 검증되지 않았다. BO에 유효 레코드가 등록된 뒤 fo-fe-builder가 실제 curl 검증으로 확정해야 한다.

### 10-5. Downloads — 이번 스코프는 카운트만, 목록 바인딩은 추후

- 이번 스코프는 **"Showing X-Y of 2,658 results"의 가짜 하드코딩 카운트(`DOWNLOADS_TOTAL_RESULTS = 2658`, `DevicesProductDownloads.tsx:15`)를 제거하고 0으로 표시하는 것까지만**이다. `GenericProductDetail.tsx`에서 `<DevicesProductDownloads items={[]} />`로 정적 템플릿 다운로드 데이터를 더 이상 실결과인 것처럼 노출하지 않도록 이미 바꿔뒀다(`items` prop은 반영 완료).
- **실제 다운로드 목록의 데이터바인딩(product-data 또는 별도 slug에서 파일 목록을 가져와 렌더)은 이번 스코프가 아니다.** product-data에 다운로드 목록에 대응하는 필드가 있는지부터 STEP0 재확인 후 별도로 설계해야 한다.
- 코드 상태(2026-07-21 확인): `items={[]}`는 반영됐지만 `DOWNLOADS_TOTAL_RESULTS`는 여전히 `2658`로 하드코딩돼 있어 카운트 텍스트는 아직 가짜 값을 그대로 보여준다. `#개발` 진행 시 이 상수를 `items.length` 기준(현재는 0)으로 바꾸는 작업이 남아 있다.

### 10-6. Other Products 죽은 네비 제거

`productDetailNavItems`(`productDetailContent.ts`)의 `{ id: "product-other", label: "Other Products" }` 항목은 대응하는 섹션이 없다 — `DevicesProductOtherProducts.tsx`는 8번에서 이미 삭제됐고 `GenericProductDetail.tsx`는 `#product-other` id를 가진 요소를 렌더하지 않는다. 클릭하면 스크롤 타깃이 없는 죽은 앵커이므로 제거가 확정됐다. 2026-07-21 확인 시점 기준 **코드에는 아직 남아 있다**(제거 미반영).

### 10-7. Expert / Tech Hub 배너

`CommonBanner02`(`variant="expert"`)·`DevicesProductLineup`의 Configurator 배너 등은 이번 확장 대상이 아니며 기존 정적/부분동적(10-2의 `configuratorHref`만 동적) 상태를 그대로 유지한다.

## 11. STEP별 진행 이력

| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1~3 | fo-slug-analyzer / fo-dev-doc-writer | 2026-07-16 | HW/SW 개별 컴포넌트 구조 전제로 최초 문서 작성(상태: 설계중). API 확인 "확인 필요", `_fetchedRel5/6`을 관련제품 관계로 추정 |
| 라우팅 개편 | (route-restructure.md 참고) | 2026-07-21 | `GenericProductDetail` 단일 컴포넌트로 통일, HW/SW 개별 라우트·컴포넌트 전제 붕괴(문서 갱신 누락) |
| 재검증·전면 재작성 | (심층분석 + `slug_relation` DB 조회) | 2026-07-21 | `GenericProductDetail`/`buildHwProductDetail` 실제 조립 구조로 재작성, `_fetchedRel5/6` 실제 의미(대분류/중분류) 확정 및 오류 정정, 죽은 코드 8+1개 삭제 |
| STEP0~2(확장) | fo-slug-analyzer / fo-fe-builder | 2026-07-21 | Video(`product_etc.video`)/Configurator(`product_etc.connect_portal`) 필드 스키마 확인(bo page_template id=19), FAQ는 faq-data `product` 필드 필터 방식으로 재설계(사용자 지시였던 product type 필터는 스키마상 불가 판단), Downloads/Other-Products-nav 정리 지점 확정. `#전체진행`으로 판단 위임 승인 |
| STEP3(확장) | fo-dev-doc-writer | 2026-07-21 | 본 문서 10번 섹션 작성(상태: 승인됨·전체진행). 작성 시점에 STEP4/5(FE 구현)가 이미 병행 진행 중이었음을 코드 직접 확인 후 반영 — Video/Configurator/FAQ는 코드 반영 확인, Downloads 카운트 수정·Other Products 네비 제거는 미반영으로 정정 기록. `faq-data.md`(markets)와 필드 코드값(`main_category`)이 다름을 교차 확인(001=Products & Systems, faq-data.md의 002=Markets와 대비) |
| 별도 문서 | fo-dev-doc-writer | 2026-07-21 | FAQ(제품별) 상세는 `fo-data-binding-가이드.md` 파일명 규칙(재사용 slug 구분자)에 따라 `faq-data-product.md`로 분리 작성 |
