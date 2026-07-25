# Devices Product Detail (제품상세, 3depth 완전 동적) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/product/GenericProductDetail.tsx` — 제품상세 조립 컴포넌트(HW/SW 구분 없이 slug 하나로 통일)
> - `fo/src/app/()/products-systems/data/hwProductDetail.ts` — `buildHwProductDetail()`, 실데이터를 정적 템플릿 기본값에 병합
> - `fo/src/app/()/products-systems/data/productsSystemsData.ts` — `fetchProductDetailBySlug`/`mapHwProductData`(product-data 단건), `fetchProductFaqItems`(faq-data 제품별 목록, 10-4)
> - `fo/src/app/()/products-systems/components/product/DevicesProductHero.tsx` (히어로+스펙, 단건)
> - `fo/src/components/content/DevicesProductFeaturesSection.tsx` (Key Features, `sectionId` 미지정 시 기본값 `product-key-feature`)
> - ~~`fo/src/app/()/products-systems/components/product/DevicesProductLineup.tsx`~~ (삭제됨 2026-07-23 — Lineup을 `product_etc.line_up` 실데이터 바인딩으로 전환, 10-3 참고. 이제 Lineup 섹션은 `GenericProductDetail.tsx`에 인라인)
> - `fo/src/app/()/products-systems/components/product/DevicesProductVideo.tsx` (Video 섹션, `youtubeVideoId` 있을 때만 렌더 — 10-1)
> - `fo/src/app/()/products-systems/components/product/DevicesProductDownloads.tsx` (Downloads 섹션 — 10-5)
> - `fo/src/app/()/products-systems/components/DevicesPageFooter.tsx` (`faqItems` prop 있으면 하단 FAQ 렌더 — 10-4)
> - `fo/src/app/()/products-systems/components/DevicesHelp.tsx` (Help 섹션, `variant="overlay"`만 대상 — 10-8)
> - `fo/src/app/()/products-systems/components/product/SwProductDetail.tsx` (SW 4종 상세: scada/xems/micro-grid/smart-factory, `bindSwDetail()` — 10-8)
> - `fo/src/lib/youtubeEmbed.ts` (`getYoutubeIdFromUrl` — 기존 공통함수, 10-1)
> - 사용 페이지: `fo/src/app/()/product/[slug]/page.tsx`, `fo/src/app/()/product-range/[slug]/page.tsx`(제품 폴백 분기) — 둘 다 `<GenericProductDetail slug={slug} />` 렌더
> 상태: 개발완료(1차 베이스라인 — series/description/image/specs/keyFeatures 5필드) + **Video/Configurator/FAQ(제품별) 확장 반영됨(2026-07-21, 코드 확인 완료)** + Downloads 카운트 표시 수정/Other Products 죽은 네비 제거는 **설계 승인됨(전체진행) — 코드 미반영, 진행 중**(10번 참고) + Help 카드(Connect Portal) 링크 노출은 **설계 확정(2026-07-25, 외부창/빈값 정책 정정) — 코드 반영됨(2026-07-25)**(10-8 참고)

## 1. 아키텍처 — HW/SW 구분 없이 단일 컴포넌트

2026-07-16 최초 설계는 HW 제품(`DevicesProductHero`)과 SW 제품 4종(`DevicesHvdcHero`/`Overview`, `DevicesMicroGridHero`/`Overview`, `DevicesSmartFactoryHero`/`Overview`, `DevicesXemsHero`/`Overview`)이 각각 다른 컴포넌트·라우트(`motor-control/{slug}`, `software/{slug}`)를 쓴다고 전제했다. `route-restructure.md`(2026-07-21)의 라우팅 개편으로 이 폴더 구조 자체가 삭제됐고, 제품상세는 예외 없이 `GenericProductDetail` 하나로 통일됐다(`route-restructure.md` §2-4 "제품상세는 예외 없이 완전 동적"). SW 전용 컴포넌트 8개와 이들을 소비하던 `mapSwProductData()`는 라우팅 개편 이후 실제로 아무 곳에서도 import되지 않는 죽은 코드였고, 2026-07-21 정밀분석에서 확인 후 **전부 삭제**했다.

```
/product/[slug], /product-range/[slug](제품 폴백)
  → GenericProductDetail({ slug })
    → buildHwProductDetail(slug, productTemplateDetail)   // { detail, productId } 반환
      → fetchProductDetailBySlug(slug)                     // product-data 단건 조회(eq_seo.slug)
      → mapHwProductData(row)                              // 필드 추출(series/desc/image/specs/keyFeatures/video/connectPortal)
    → fetchProductFaqItems(productId)                       // faq-data 제품별 목록(10-4), 0건이면 정적 폴백
    → DevicesProductHero + DevicesProductFeaturesSection + Lineup 섹션(인라인, product_etc.line_up HTML — 10-3)
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
| product_etc.connect_portal | product_etc.connect_portal | string(URL) | Configurator CTA 링크(`detail.configuratorHref`), 변환 없이 그대로 사용(10-2). Help 카드(`help-1`) CTA 링크로도 동일 값 재노출(10-8) |

`buildHwProductDetail`이 실데이터로 덮어쓰는 필드는 **series/description/image/specs/keyFeatures/youtubeVideoId/configuratorHref 7개**다(2026-07-21 확장 반영, 코드 확인 완료 — `hwProductDetail.ts`). `productTemplateDetail`(정적, `productDetailContent.ts`)의 나머지 필드 — `downloads`, `otherProducts` 등 — 는 이번 스코프에서도 실데이터 연동 대상이 아니며 정적 값 그대로 렌더된다(10-5/10-6, 설계상 정상).

## 4. API 확인

신규 API 불필요 — 기존 `FoPageDataController`(`PageDataService.search()`) 재사용. `product-data` slug는 bo `slug_registry`에 `type=PAGE_DATA`, `is_active=true`로 등록 확인됨(id=29, entity_id=10, 2026-07-21 DB 직접 조회). 10-4(FAQ 제품별)도 같은 컨트롤러를 where 조합만 다르게 재사용하며 신규 API가 필요하지 않다(`faq-data` slug 자체는 `faq-data.md`(markets) STEP4에서 이미 등록 확인됨, id=108).

## 5. 조회 조건

- where: `eq_seo.slug={slug}` — 제품 route 폴더명과 DB `seo.slug` 표기 불일치 우려가 최초 설계에 있었으나, 신규 라우트는 URL 세그먼트를 그대로 `seo.slug` 조회에 쓰므로(정적 매핑표 없음) 해당 우려가 구조적으로 해소됨
- row limit: 단건(`size=1`) — VFD 6종처럼 seo.slug가 중복되는 경우 첫 건만 사용(`route-restructure.md` §2-1, 사용자 승인 정책)
- orderBy: 없음(단건)

## 6. 관련제품(Other Products) — ⚠️ 2026-07-25 구현됨(§12로 대체). `_fetchedRel5`/`_fetchedRel6`와는 무관

> **갱신(2026-07-25)**: 본 절은 "미구현·별도 기능개발 건"으로 기록돼 있었으나, category-data depth3 junction(GNB devices-tree) 기반으로 **실제 구현·검증 완료**되었다. 아래 §6 본문은 "왜 `_fetchedRel5/6`로는 안 되는지"의 배경 설명으로 유지하되, **실제 구현 방식·필드·파일은 §12를 참조**한다.

2026-07-16 최초 설계는 관련제품이 product-data의 `_fetchedRel5`/`_fetchedRel6` 관계 필드로 채워질 거라 **추정**했다. 2026-07-21 `slug_relation` 테이블(`docs/ge_guide/builder/02.builder_data_process.md` §0-5) 직접 조회로 실제 정의를 확인한 결과, 이 추정은 **틀렸다**:

| id | master→slave | slave_filter | relation_dir | fetch_fields | category_depth | 설명(DB) |
|---|---|---|---|---|---|---|
| 5 | product-data → category-data | depth=3 | FETCH | category.title | 1 | 제품 조회 시 **대분류** 노출 |
| 6 | product-data → category-data | depth=3 | FETCH | category.title | 2 | 제품 조회 시 **중분류** 노출 |

즉 `_fetchedRel5`/`_fetchedRel6`는 관련제품 목록이 아니라 **현재 제품이 속한 대분류/중분류 카테고리 이름(브레드크럼 표시용 문자열)** 이다. `category-data` slug 안에는 depth=3의 "연결 레코드"(`{"product":{"id":"1698","depth":"3","parentId":"595","product_name":"..."}}` 형태, depth1/2의 `category.*` 레코드와 다른 shape)가 별도로 존재하며, 이 연결 레코드를 거쳐 대분류/중분류 이름을 끌어온다.

관련제품(다른 제품과의 연관) 기능은 이 메커니즘으로 구현할 수 없다 — 하려면 `slug_relation`에 `product-data`→`product-data`(같은 카테고리의 다른 제품 등) 신규 관계를 별도로 등록해야 한다. 이걸 렌더하던 `DevicesProductOtherProducts.tsx`는 애초에 `GenericProductDetail`에서 호출되지 않는(고아) 컴포넌트였고, 2026-07-21 죽은 코드 정리 시 삭제했다. 이 섹션에 대응하는 네비게이션 항목(`product-other`)도 죽은 앵커이며 10-6에서 제거를 다룬다.

## 7. `DevicesProductLineup` — (삭제됨, 2026-07-23) Lineup은 실데이터 바인딩으로 전환

과거 `GenericProductDetail.tsx`는 `DevicesProductLineup`을 `table="product-template"`로 호출해 하드코딩된 MMS-32/63/100 스펙표를 정적 렌더했다(`data-slug`/`data-slugkey` 없는 순수 정적 컴포넌트). 2026-07-23 Lineup을 `product_etc.line_up`(리치텍스트 HTML) 실데이터 바인딩으로 전환하면서 이 컴포넌트는 더 이상 호출되지 않아 삭제했다. 상세는 10-3 참고.

## 8. 삭제된 죽은 코드 (2026-07-21)

라우팅 개편 이후 실제로 어디서도 import되지 않는 것을 grep으로 확인 후 삭제:
- `DevicesHvdcHero.tsx`, `DevicesHvdcOverview.tsx`
- `DevicesMicroGridHero.tsx`, `DevicesMicroGridOverview.tsx`
- `DevicesSmartFactoryHero.tsx`, `DevicesSmartFactoryOverview.tsx`
- `DevicesXemsHero.tsx`, `DevicesXemsOverview.tsx`
- `DevicesProductOtherProducts.tsx`
- `mapSwProductData()`(`productsSystemsData.ts`) — 위 SW 컴포넌트 전용 매퍼, 짝을 이루는 컴포넌트가 전부 삭제되며 함께 제거

## 9. 비고 (1차 베이스라인)

1. `product_info.image` 미입력 건은 화면 전용 플레이스홀더가 아니라 `src` 속성 자체가 비어 **브라우저 기본 깨진 이미지 아이콘**으로 표시된다(레이아웃은 유지됨, 개발 블로커 아님 — 2026-07-23 코드 재확인, "화면 플레이스홀더로 폴백" 기록 정정. `DevicesProductHero.tsx`).
2. HW `susol-ul-smart-mccb` 등 일부 제품이 `DevicesProductLineup`에서 전용 하드코딩 테이블(`susol-frame`/`metasol-ms`/`h100-plus`)을 쓰는지, `product-template` 공용 테이블을 쓰는지는 `table` prop 값에 따라 갈리며 이번 문서 범위 밖(정적 렌더링 로직).
3. 관련제품(6번) 기능 자체를 새로 만들지 여부는 이번 스코프 밖 — 별도 기능개발 건으로 취급한다.

## 10. 확장 바인딩 설계 — Video / Configurator / Lineup / FAQ(제품별) / Downloads / 죽은 네비 정리 (승인됨·전체진행, 2026-07-21)

이번 확장은 사용자가 `#전체진행`으로 STEP0~3 판단을 위임한 건으로, 상태를 **승인됨(전체진행)**으로 기록한다. 항목별로 코드 반영 여부가 다르므로(10-1/10-2/10-4는 이미 반영, 10-5/10-6은 설계만 확정) 아래 표로 구분한다.

| 항목 | 설계 상태 | 코드 반영 상태(2026-07-21 직접 확인) |
|---|---|---|
| 10-1 Video | 확정 | **반영됨** — `hwProductDetail.ts` |
| 10-2 Configurator | 확정 | **반영됨** — `hwProductDetail.ts` |
| 10-3 Lineup | 확정(실데이터 바인딩) | **반영됨(2026-07-23)** — `productsSystemsData.ts`/`hwProductDetail.ts`/`GenericProductDetail.tsx`(`product_etc.line_up` HTML 그대로 렌더) |
| 10-4 FAQ(제품별) | 확정(⚠️ 사용자 지시와 다른 방식 — 하단 참고) | **반영됨** — `productsSystemsData.ts`(`fetchProductFaqItems`), `GenericProductDetail.tsx` |
| 10-5 Downloads | 확정(카운트만 0 표시, 목록은 추후) | **부분 반영** — `items={[]}` 전달은 반영됨. 가짜 카운트 `2,658` 텍스트는 `DevicesProductDownloads.tsx:15` `DOWNLOADS_TOTAL_RESULTS`에 **아직 하드코딩 그대로** — 미반영 |
| 10-6 Other Products 죽은 네비 제거 | 확정 | **미반영** — `productDetailContent.ts:600` `productDetailNavItems`에 `{ id: "product-other", label: "Other Products" }` **아직 존재** |
| 10-8 Help 카드(Connect Portal) | 확정(정정, 2026-07-25) | **반영됨(2026-07-25)** — `DevicesHelp.tsx`에 `CONNECT_PORTAL_FALLBACK_HREF` 상수 신설, href는 `connectPortalHref || 폴백URL`, help-1에만 `target="_blank" rel="noopener noreferrer"` 및 data-slug/data-slugkey 부착. `hwProductDetail.ts`/`productDetailContent.ts`/`GenericProductDetail.tsx`/`SwProductDetail.tsx`는 이전 STEP5에서 이미 반영됨 |

### 10-1. Video

- 필드: `product_etc.video` — 전체 YouTube watch URL(예: `https://www.youtube.com/watch?v=...`).
- 근거: STEP0에서 확인한 bo `page_template` id=19 `config_json`의 `fieldKey:"video"` input, 실데이터 3건 테스트값(실서비스 데이터 전수는 아님).
- 변환: FE에서 URL 전체를 그대로 쓰지 않고 `getYoutubeIdFromUrl()`로 videoId만 추출해 `detail.youtubeVideoId`에 대입한다. **이 함수는 신규 작성이 아니라 `fo/src/lib/youtubeEmbed.ts`에 이미 있던 기존 공통함수**다(company Press/Blog 상세 등에서 쓰는 `getYoutubeEmbedSrc`와 같은 파일). 최초 목표설정 대화에서 "신규 순수함수"로 전달됐던 부분은 코드 직접 확인 결과 사실이 아니라 정정한다.
- ⚠️ **정정(2026-07-23 코드 재확인)**: 빈값/URL 파싱 실패 시 정적 기본값(`base.youtubeVideoId`)으로 폴백한다고 기록돼 있었으나, 실제 `hwProductDetail.ts`는 `youtubeVideoId: getYoutubeIdFromUrl(data.video)`이며 `|| base.youtubeVideoId` 폴백이 없다. 값이 없으면 빈 문자열이 그대로 전달된다.
- `DevicesProductVideo.tsx`는 `<section>`(제목 "Video") 컨테이너는 항상 렌더하고, 그 안의 실제 플레이어만 `youtubeVideoId`가 있을 때만 렌더한다(기존 동작 그대로, 변경 없음) — 섹션 자체가 사라지지는 않는다.

### 10-2. Configurator

- 필드: `product_etc.connect_portal` — 전체 URL. 값 변환 없이 그대로 `detail.configuratorHref`에 대입(`hwProductDetail.ts`: `configuratorHref: data.connectPortal`).
- 근거: bo `page_template` id=19 config의 `fieldKey:"connect_portal"` input.
- ⚠️ **정정(2026-07-23 코드 재확인)**: 빈값이면 정적 기본값(`base.configuratorHref`)으로 폴백한다고 기록돼 있었으나, 실제 코드에 `|| base.configuratorHref` 폴백이 없다. 값이 없으면 `href=""`(빈 링크)가 그대로 전달된다.
- 소비처: `GenericProductDetail.tsx` Lineup 섹션 하단 Configurator 안내 링크(`detail.configuratorHref`/`configuratorExternal`) — 10-3에서 Lineup 본문을 실데이터로 바인딩하면서 이 CTA도 같은 섹션 안에 인라인으로 유지된다(과거엔 `DevicesProductLineup` 컴포넌트가 prop으로 받았으나 그 컴포넌트는 삭제됨). 동일 값이 Help 카드(`help-1`) CTA로도 재노출된다(10-8).

### 10-3. Lineup — 실데이터 바인딩 완료(2026-07-23)

`product_etc.line_up` 필드는 **editor 타입(리치텍스트 HTML blob)** 이라 정형 컬럼 스키마(`ProductLineupRow`/`ProductFrameLineup` 등 고정 컬럼)로는 바로 쓸 수 없다. 당초 이를 근거로 "정적 유지"로 판단했으나(구 결론), HTML을 정형 표로 파싱할 필요 없이 **company Press 상세(리치텍스트 단일 필드 `content`를 `dangerouslySetInnerHTML`로 렌더)와 동일한 패턴**으로 그대로 바인딩할 수 있음을 확인, **실데이터 바인딩으로 확정·반영**했다.

- 필드: `product_etc.line_up` — bo 에디터로 저장된 리치텍스트 HTML(실제 예: `<table>...<tr><th><p>라인업1</p></th>...`).
- 추출: `mapHwProductData`가 `row["product_etc.line_up"]`을 `str()`로 읽어 `HwProductData.lineUp`에 담고, `buildHwProductDetail`이 폴백 없이 `detail.lineUp`으로 그대로 전달(빈 문자열이면 빈 문자열).
- ⚠️ **정정(2026-07-23 코드 재확인)**: `detail.lineUp`이 비어 있으면 섹션 자체를 렌더하지 않는다(null)고 기록돼 있었으나, 실제 `GenericProductDetail.tsx`엔 그런 조건문이 없다. `<section className="devices_product_lineup" id="product-lineup">`(제목 "Lineup" 포함) 컨테이너는 값 유무와 무관하게 항상 렌더되고, 그 안의 `data-slug="product-data"` / `data-slugkey="product_etc.line_up"` div만 `dangerouslySetInnerHTML`로 `detail.lineUp`을 그대로 꽂는다 — 값이 빈 문자열이면 그 div 내용만 비고 섹션/제목은 계속 노출된다(컨테이너 유지 정책에 부합).
- 섹션 하단 Configurator CTA(`Go to Configurator`)는 기존 UI 구조를 보존해 그대로 유지하되 링크만 실데이터(`detail.configuratorHref`, 10-2)를 쓴다.
- 정형 표를 하드코딩하던 정적 컴포넌트 `DevicesProductLineup.tsx`(및 전용 타입 `ProductLineupRow`/`ProductFrameLineup`/`ProductLineupTypeCell`/`ProductLineupVariant`, 정적 데이터 `sharedLineup`/`susolUlSmartMccbInterruptingLineup`, `ProductDetail`의 `lineup?`/`lineupVariant?`/`frameLineup?` 필드)은 더 이상 호출되지 않아 삭제·정리했다. `DevicesProductLineupGrid.tsx`는 `DevicesProductLineup`만 쓰던 컴포넌트라 삭제 후 고아 상태가 되었으나 이번 정리 범위에서 제외(별도 판단).

### 10-4. FAQ(제품별) — faq-data 재사용, 필터 방식은 사용자 지시와 다름

**⚠️ 크리티컬: 사용자가 목표설정 단계에서 "product type(P/A)으로 필터"를 지시했으나, faq-data 스키마상 이 방식은 불가능하다고 판단해 다른 방식으로 확정했다.**

- faq-data(`faq.*` 콘텐츠 키, `faq-data.md` 참고)에는 **product type 단위 필터용 필드가 없다** — bo `faq-detail`/`faq-list` 템플릿(`page_template` id=87/86) config에 `product_type`류 필드가 존재하지 않는다.
- 대신 faq-data에 이미 있는 `product`(개별 제품 id, FK 성격 필드)로 필터한다: `eq_product={product-data _id}`. 즉 "제품 타입(P/A) 단위"가 아니라 "개별 제품 1건 단위"로 좁혀진다 — 지시받은 필터 단위와 다르다.
- where 조합(신규): `eq_main_category=001`(faq-data 대분류 코드 — `faq-data.md`의 markets 사용(`002`)과 다른 코드값, "Products & Systems") + `eq_product={productId}` + `eq_is_visible=001`, `sort=id,asc`, `size=100`.
- 엔드포인트는 신규가 아니다 — `GET /api/v1/fo/page-data/faq-data`(기존, `faq-data.md` STEP4에서 이미 확인된 컨트롤러) 재사용, where 파라미터 조합만 다르다.
- 구현: `productsSystemsData.ts`의 `fetchProductFaqItems(productId)` — 공통 `fetchData` 유틸(`@/lib/pageDataApi`) + `flattenPageDataItem`(`@/lib/pageData`)로 markets FAQ와 동일한 패턴을 따른다(콘텐츠 키 이름에 의존하지 않음, `faq-data.md` §3의 공통 규칙 재사용). `row.question`/`row.answer`를 그대로 매핑.
- ⚠️ **정정(2026-07-23 코드 재확인)**: 0건이면 `productTemplateFaqItems`(정적)로 폴백한다고 기록돼 있었으나, 실제 `GenericProductDetail.tsx`는 `faqItems`를 그대로 `<DevicesPageFooter faqItems={faqItems} />`에 전달할 뿐 그런 삼항식이 없다. `DevicesPageFooter.tsx`도 `faqItems`가 빈 배열(`[]`, JS에서 truthy)이면 그대로 `<CommonFaq items={faqItems} />`를 렌더한다. 결과적으로 FAQ 섹션 제목/설명은 항상 노출되고, 그 안의 목록만 0건이면 빈 상태로 보인다 — 컨테이너는 유지되므로 정책상 허용되는 패턴이다(정적 폴백 콘텐츠 자체가 없을 뿐).
- **실유효 데이터 현재 0건(susol-ul-acb 등 대부분 제품)** — BO에 `main_category=001`(Products & Systems) + 개별 `product` id로 등록된 FAQ가 아직 없다(사용자 재입력 필요). 이는 **데이터 과제이며 코드 블로커가 아니다**. 2026-07-23 `product=1664`(susol-ul-acb) 기준 실측: `main_category=001` FAQ는 전체 1건뿐이고 그 `product` 값은 `"1526"`(다른 제품)이라 매칭 0건 — 쿼리 로직 문제가 아니라 데이터 미등록임을 확인.
- **미검증/확인 필요**: `eq_product` 조회 시 faq-data의 `product` 필드 저장 타입(문자열 vs 숫자)이 product-data `_id`(숫자)와 JSONB 매칭에서 정확히 일치하는지는 실측 curl로 아직 검증되지 않았다. BO에 유효 레코드가 등록된 뒤 fo-fe-builder가 실제 curl 검증으로 확정해야 한다.

### 10-5. Downloads — 이번 스코프는 카운트만, 목록 바인딩은 추후

- 이번 스코프는 **"Showing X-Y of 2,658 results"의 가짜 하드코딩 카운트(`DOWNLOADS_TOTAL_RESULTS = 2658`, `DevicesProductDownloads.tsx:15`)를 제거하고 0으로 표시하는 것까지만**이다. `GenericProductDetail.tsx`에서 `<DevicesProductDownloads items={[]} />`로 정적 템플릿 다운로드 데이터를 더 이상 실결과인 것처럼 노출하지 않도록 이미 바꿔뒀다(`items` prop은 반영 완료).
- **실제 다운로드 목록의 데이터바인딩(product-data 또는 별도 slug에서 파일 목록을 가져와 렌더)은 이번 스코프가 아니다.** product-data에 다운로드 목록에 대응하는 필드가 있는지부터 STEP0 재확인 후 별도로 설계해야 한다.
- 코드 상태(2026-07-21 확인): `items={[]}`는 반영됐지만 `DOWNLOADS_TOTAL_RESULTS`는 여전히 `2658`로 하드코딩돼 있어 카운트 텍스트는 아직 가짜 값을 그대로 보여준다. `#개발` 진행 시 이 상수를 `items.length` 기준(현재는 0)으로 바꾸는 작업이 남아 있다.

### 10-6. Other Products 죽은 네비 제거

`productDetailNavItems`(`productDetailContent.ts`)의 `{ id: "product-other", label: "Other Products" }` 항목은 대응하는 섹션이 없다 — `DevicesProductOtherProducts.tsx`는 8번에서 이미 삭제됐고 `GenericProductDetail.tsx`는 `#product-other` id를 가진 요소를 렌더하지 않는다. 클릭하면 스크롤 타깃이 없는 죽은 앵커이므로 제거가 확정됐다. 2026-07-21 확인 시점 기준 **코드에는 아직 남아 있다**(제거 미반영).

### 10-7. Expert / Tech Hub 배너

`CommonBanner02`(`variant="expert"`) 등 배너는 이번 확장 대상이 아니며 기존 정적/부분동적 상태를 그대로 유지한다(Configurator CTA는 10-2/10-3에서 `configuratorHref`만 동적).

### 10-8. Help 카드(Connect Portal) — 신규 필드 아님, 이미 추출된 `connectPortal` 값 노출 위치 추가(확정, 2026-07-25 / 외부창·빈값 정책 정정 2026-07-25)

- 필드: `product_etc.connect_portal` — **10-2 Configurator와 동일 필드**. `mapHwProductData()`(`productsSystemsData.ts:304`)가 이미 `connectPortal: str("product_etc.connect_portal")`로 추출하고 있고, 지금까지는 `hwProductDetail.ts:33`(`configuratorHref: data.connectPortal`)에서 `detail.configuratorHref`로만 흘려보냈다. 이번 확장은 **새 데이터 추출/매핑이 아니라 이미 있는 이 값을 한 곳(Help 카드) 더 노출**하는 것이다.
- 대상 컴포넌트: `DevicesHelp.tsx` — `variant="overlay"` 렌더 경로만 대상. `variant="default"`는 fo 내 실사용 호출부가 없어(grep 확인) 이번 스코프 제외.
- 대상 카드: `motorControlHelpCards`의 `help-1`("Go to Connect Portal")만. 현재 `href: ""`(정적 빈 문자열, `motorControlContent.ts:193`)로 고정돼 클릭해도 이동하지 않는다. `help-2`(Where to Buy)/`help-3`(Go to G-ICS)는 이번 스코프 제외.
- 설계:
  - `DevicesHelp.tsx`에 `connectPortalHref?: string` prop을 추가하고, `cards` 렌더 시 `id === "help-1"`인 카드만 `href`를 이 prop 값으로 override — prop이 비어 있으면 아래 빈 값 정책에 따라 `https://connect.ls-electric.com/`으로 폴백하고, `target="_blank" rel="noopener noreferrer"`도 함께 적용한다.
  - `GenericProductDetail.tsx`(HW 63종) 85행 `<DevicesHelp variant="overlay" sectionId="product-help" />` → `connectPortalHref={detail.connectPortal}` 전달. `hwProductDetail.ts` 33행(`configuratorHref: data.connectPortal,`) 옆에 `connectPortal: data.connectPortal,` 한 줄 추가(이미 만들어지는 값을 `detail`에 한 필드 더 노출). `ProductDetail` 타입(`productDetailContent.ts:70` `configuratorHref?: string` 옆)에 `connectPortal?: string` 추가 필요.
  - `SwProductDetail.tsx`(SW 4종: scada/xems/micro-grid/smart-factory) 161/225/289/358행 각 `<DevicesHelp>` 호출부에 `connectPortalHref={bind.connectPortal}` 전달. `bindSwDetail()`(101~111행)이 이미 `mapHwProductData(row)`로 `data.connectPortal`을 만들고 있으므로, 반환 객체에 `connectPortal: data?.connectPortal` 한 줄만 추가한다.
- 제외 대상(현행 유지): `products-category/[slug]/page.tsx`, `product-range/[slug]/page.tsx` — 제품 목록 화면이라 단건 제품 데이터(`detail`/`bind`)가 없음, `<DevicesHelp>` prop 미전달 유지.
- 빈 값 정책(2026-07-25 정정): `product_etc.connect_portal`이 비어 있으면 Connect Portal 메인 화면(`https://connect.ls-electric.com/`)으로 폴백한다 — 원 기획 스펙 "링크가 없는 경우, Connect Portal 메인 화면 새 창 이동"에 따름. `help-1` 카드는 항상 렌더되고 `href`도 항상 유효한 링크를 가진다(빈 문자열(`""`)로 남는 경우 없음). ~~기존 "현행 유지(href="" 그대로)" 서술은 스펙 대조 결과 오류였다.~~
- 외부창 처리(2026-07-25 정정): `target="_blank" rel="noopener noreferrer"`로 새 창 이동한다 — 원 기획 스펙 "Admin에 등록한 Connect Portal 링크로 새 창 이동"에 따름. ~~기존 "외부창 처리 없음" 서술은 스펙 대조 결과 오류였다.~~
- API/조회: 신규 API·신규 조회 없음. `product-data` 단건 조회(4번/5번)를 그대로 재사용 — `mapHwProductData`가 이미 값을 추출해두고 있어 조회 조건 변경도 없다.

## 11. STEP별 진행 이력

| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1~3 | fo-slug-analyzer / fo-dev-doc-writer | 2026-07-16 | HW/SW 개별 컴포넌트 구조 전제로 최초 문서 작성(상태: 설계중). API 확인 "확인 필요", `_fetchedRel5/6`을 관련제품 관계로 추정 |
| 라우팅 개편 | (route-restructure.md 참고) | 2026-07-21 | `GenericProductDetail` 단일 컴포넌트로 통일, HW/SW 개별 라우트·컴포넌트 전제 붕괴(문서 갱신 누락) |
| 재검증·전면 재작성 | (심층분석 + `slug_relation` DB 조회) | 2026-07-21 | `GenericProductDetail`/`buildHwProductDetail` 실제 조립 구조로 재작성, `_fetchedRel5/6` 실제 의미(대분류/중분류) 확정 및 오류 정정, 죽은 코드 8+1개 삭제 |
| STEP0~2(확장) | fo-slug-analyzer / fo-fe-builder | 2026-07-21 | Video(`product_etc.video`)/Configurator(`product_etc.connect_portal`) 필드 스키마 확인(bo page_template id=19), FAQ는 faq-data `product` 필드 필터 방식으로 재설계(사용자 지시였던 product type 필터는 스키마상 불가 판단), Downloads/Other-Products-nav 정리 지점 확정. `#전체진행`으로 판단 위임 승인 |
| STEP3(확장) | fo-dev-doc-writer | 2026-07-21 | 본 문서 10번 섹션 작성(상태: 승인됨·전체진행). 작성 시점에 STEP4/5(FE 구현)가 이미 병행 진행 중이었음을 코드 직접 확인 후 반영 — Video/Configurator/FAQ는 코드 반영 확인, Downloads 카운트 수정·Other Products 네비 제거는 미반영으로 정정 기록. `faq-data.md`(markets)와 필드 코드값(`main_category`)이 다름을 교차 확인(001=Products & Systems, faq-data.md의 002=Markets와 대비) |
| 별도 문서 | fo-dev-doc-writer | 2026-07-21 | FAQ(제품별) 상세는 `fo-data-binding-가이드.md` 파일명 규칙(재사용 slug 구분자)에 따라 `faq-data-product.md`로 분리 작성 |
| STEP6(Lineup) | fo-fe-builder | 2026-07-23 | 10-3 Lineup을 정적 유지에서 **실데이터 바인딩으로 전환** — `product_etc.line_up`(리치텍스트 HTML)을 `mapHwProductData.lineUp`→`buildHwProductDetail.lineUp`→`GenericProductDetail`이 `data-slug="product-data"`/`data-slugkey="product_etc.line_up"` + `dangerouslySetInnerHTML`로 렌더(Press 상세 패턴). 컨테이너는 항상 렌더, 값 없으면 내부만 빈 상태(아래 재확인 항목에서 정정). 정적 컴포넌트 `DevicesProductLineup.tsx` 및 전용 타입/정적 데이터(`ProductLineupRow`/`ProductFrameLineup`/`ProductLineupTypeCell`/`ProductLineupVariant`, `sharedLineup`/`susolUlSmartMccbInterruptingLineup`, `ProductDetail.lineup?`/`lineupVariant?`/`frameLineup?`) 삭제·정리. `DevicesProductLineupGrid.tsx`는 고아화됐으나 정리 범위 제외 |
| 실코드 재확인·정정 | (사용자 버그 신고 대응, 코드 직접 Read + SSR HTML 대조) | 2026-07-23 | `/product/susol-ul-vcb`(product_info/spec/key_feature/product_etc 미입력) 및 `/product/susol-ul-acb`(id=1664, 대부분 필드 입력됨이나 FAQ 0건) 실사례 조사 중, 10-1/10-2/10-3/10-4/9번 비고에 기록된 "정적 기본값 폴백"·"섹션 미노출" 서술이 실제 코드와 다름을 발견해 전면 정정. 실제로는 `youtubeVideoId`/`configuratorHref`에 `base` 폴백이 없고, Lineup/FAQ 섹션은 조건부로 숨겨지는 게 아니라 컨테이너(제목 등)는 항상 렌더되고 내부 콘텐츠만 빈 상태로 남는다 — 이 패턴(컨테이너 유지, 내부만 빈값)은 사용자와 합의된 정책상 허용 범위로 확정(전체 섹션을 조건부로 제거하는 것만 금지 대상) |
| STEP2(Help 카드) | fo-slug-analyzer / fo-dev-doc-writer | 2026-07-25 | Help 카드(`help-1`, "Go to Connect Portal") 링크를 `product_etc.connect_portal`(기존 필드, `mapHwProductData`가 이미 추출 중)로 노출하는 설계 확정(10-8). **"새 필드를 만든다"는 이전 표현은 오류** — 실제로는 이미 존재하는 `data.connectPortal` 값을 `detail.connectPortal`/`bind.connectPortal`로 한 곳 더 노출하는 것으로 정정. 대상은 `GenericProductDetail.tsx`(HW 63종)와 `SwProductDetail.tsx`(SW 4종)뿐, `products-category`/`product-range` 목록 화면은 제외. 상태: 설계 확정, 코드 미반영 |
| STEP2(Help 카드) 정정 | fo-slug-analyzer / fo-dev-doc-writer | 2026-07-25 | 사용자가 원 기획 스펙 문서(Lv3 보조설명/Overview/Applications/Tech Hub 비디오 배너/Connect Portal/FAQ 전체 포함)를 제시, 10-8절의 외부창 처리·빈 값 정책이 스펙과 다름을 지적하여 정정. 외부창: "없음" → `target="_blank" rel="noopener noreferrer"`(스펙: "Admin에 등록한 Connect Portal 링크로 새 창 이동"). 빈 값: "현행 유지(href="" 그대로)" → `https://connect.ls-electric.com/`로 폴백(스펙: "링크가 없는 경우, Connect Portal 메인 화면 새 창 이동"). 상태: 설계 확정(정정), 코드 미반영. 스펙에 있던 다른 항목(Tech Hub 비디오 배너 조건부 노출, Lv3 보조설명 등)은 이번 정정 대상 아님 — 별도 확인 필요 |
| STEP1~6(제품 담당/Insights) | fo-slug-analyzer / fo-dev-doc-writer / fo-be-builder / fo-fe-builder / fo-qa-validator | 2026-07-25 | 스펙 11~13(제품 담당 배너)/38(제품 맵핑 게시글 Insights) 구현·검증 완료(§13). FO 제네릭 where가 JSONB 배열 포함(`@>`)을 지원하지 않아 신규 `FoProductController`(manager-email=기존 findProductManagerEmail 노출, insights=신규 findProductInsights)로 서버 필터. 담당자 없으면 CommonBanner02에 `contactEmail=""`로 축약형(공용 컴포넌트 무수정). insights 필드가 섹션 중첩(press/blog/articles)이라 `data_json->(replace(data_slug,'-data',''))` 접근으로 정정. bo-api(local 프로파일) 재빌드·재기동 후 브라우저 검증 |
| STEP1~6(Other Products) | fo-slug-analyzer / fo-dev-doc-writer / fo-fe-builder / fo-qa-validator | 2026-07-25 | 스펙 31/32번 구현·검증 완료(§12). Other Products를 category-data depth3 junction(GNB `fetchDevicesTreeRows()`) 기반으로 동일 Lv2 제품 조회(자기 제외)해 `DevicesProductOtherProducts` 재배선, Design Awards 배지(`product.awards="01"`) 연결, `product-other` 네비 복원(10번 짝 규칙). tsc/SSR/브라우저 콘솔 0 검증. 스펙 8번(히어로 Design Awards 로고/문구)은 최초 보류였으나 사용자 확정(에셋 `badge_if_award_lg.png` 재사용, 문구 확정, 기존 배지 CSS 재사용)에 따라 같은 날 구현·검증 완료(§12-5) |

## 12. Other Products(31) / Design Awards 배지(32) — 구현 완료(2026-07-25)

§6에서 "미구현"으로 남았던 관련제품을, 사용자 지시(“Lv2는 category-data — GNB가 쓰는 그 메커니즘”)에 따라 **GNB devices 메가메뉴와 동일한 소스**로 구현했다. `product_code` 접두사 방식(과거 후보)은 폐기.

### 12-1. 데이터 소스 — category-data depth3 junction (GNB와 공유)

- 엔드포인트: `GET /api/v1/fo/gnb/devices-tree`(기존, **신규 API 없음**). FE 조회 유틸 `fetchDevicesTreeRows()`(`fo/src/data/gnb/devicesTree.ts`)를 GNB와 공유.
- 구조: category-data 레코드 중 **depth3 = 제품↔카테고리 junction**(`data_json.product = { id: <product-data PK>, depth:"3", parentId: <Lv2 카테고리 id> }`). BE(`PageDataService.findDevicesTree`)가 junction의 `product.id`로 product-data를 LEFT JOIN(`is_visible='001'`)해 표시정보(slug/name/info_description/image)를 붙여 내려준다.
- "동일 Lv2를 가지는 다른 제품" = 현재 제품의 junction `parentId`(들)을 구한 뒤, 그 `parentId`에 속한 다른 junction 제품을 모으면 된다(제품↔Lv2는 다대다 가능 — junction 레코드 복수 = Lv2 복수).

### 12-2. 구현 함수 — `fetchOtherProductsInSameLv2(currentProductId)` (`productsSystemsData.ts`)

- `fetchDevicesTreeRows()` 결과에서 depth3 행만 필터 → 현재 productId의 `parentId` 집합(myLv2) 수집 → myLv2에 속한 다른 depth3 제품을 **자기 자신 제외 + productId 중복 제거**해 `ProductOtherItem[]`로 매핑.
- 이미지: junction `productImage`("[123]" JSON 문자열)를 로컬 `resolveJunctionImage()`가 `JSON.parse` 후 기존 `resolveFirstImageUrl()` 재사용해 URL 변환(값 없으면 빈 문자열).
- **slug 없는 제품도 그대로 카드 노출**(href=""): 필터/비활성화하지 않는다(사용자 승인 정책). 실측: Lv2 "Molded Case Circuit Breaker"(parentId 575)의 `Susol UL MCCB(up to 1000V)`(id 1667)가 `seo.slug` 미입력 → href="" 카드로 노출됨(정상).
- 0건이면 빈 배열 → 호출부에서 섹션·네비 동반 숨김.

### 12-3. Design Awards 배지(32) — `product.awards`

- 필드: **`product.awards`**(flatten 경로, 실측 확정). 값 `"01"` = iF Design Awards, 빈 문자열 = 미수상. (실측상 `"01"` 보유 제품은 소수 — 1664/1703/1909.)
- ⚠️ devices-tree 응답에는 `awards`가 없다(name/desc/slug/image만 select) → `fetchProductAwardsMap()`이 **product-data를 1회 추가 조회**해 id→awards 맵을 만들어 보강한다(FE only, BE 무변경).
- 매핑: `badge: awardsMap.get(productId) === "01"` → `DevicesProductOtherProducts`의 기존 배지 슬롯(`getProductBadgeType` → `type1`, `ProductAwardBadge`, `/img/devices-systems/products/badge_if_award_sm.png`)이 노출. 검증: `/product/dfsdfsdf`(Lv2 2044)에서 수상 형제 `testtest`(1909)에 `type1` 배지 렌더 확인.

### 12-4. 렌더/네비 배선 (`GenericProductDetail.tsx`, `productDetailContent.ts`)

- `GenericProductDetail`이 `productId`로 `fetchOtherProductsInSameLv2`를 FAQ와 병렬 조회 → `showOtherProducts = otherProducts.length > 0`.
- 섹션은 Video와 Markets 사이에 `{showOtherProducts ? <DevicesProductOtherProducts items={otherProducts}/> : null}`로 렌더(`DevicesProductOtherProducts`는 SW 상세에서도 쓰는 공용 컴포넌트 재배선. 4개 이하면 [<,>] 미노출은 컴포넌트 기존 로직).
- 네비: `productDetailNavItems`에 `{ id:"product-other", label:"Other Products" }`를 Video와 Markets 사이에 복원. **10번 짝 규칙**대로 `visibleNavItems` 필터에 `product-other → showOtherProducts` 추가(섹션↔네비 항상 짝). SW 상세는 자체 navItems를 써서 영향 없음.
- 빈-src 방어: `DevicesProductOtherProducts`의 카드 `<img>`를 `src={item.image || undefined}`로(이미지 미입력 동적 제품의 `src=""`가 유발하던 브라우저 재다운로드 콘솔 에러 제거 — `DevicesProductHero`와 동일 패턴, 카드는 그대로 노출).

### 12-5. 스펙 8번(히어로 Design Awards 로고/문구) — 구현 완료(2026-07-25)

- 스펙: "Design Awards 체크 시 로고 및 대표이미지 하단에 문구 출력".
- 데이터: `product.awards === "01"`(§12-3과 동일 필드). `mapHwProductData`가 `awards`를 추출 → `HwProductData.awards` → `buildHwProductDetail`이 `ProductDetail.awards`로 전달(정적 템플릿은 미설정=undefined이라 미노출).
- 렌더(`DevicesProductHero.tsx`): 대표 이미지(`devices_product_hero__img`) 바로 아래에 `product.awards === "01"`일 때만 조건부로 로고+문구를 추가.
- CSS/에셋: **신규 CSS·클래스 없이** 기존 배지 클래스만 재사용. 로고는 `<div className="type1"><span className="product_award_badge__icon"/></div>` — 베이스 `components/product-award-badge.css`(루트 `app/layout.tsx` 전역 import)의 `.type1 .product_award_badge__icon` → `badge_if_award_lg.png`(80×40, 대형)이 적용된다. **주의**: `section.devices_product_other` 하위에서는 type1↔type2가 sm/lg로 뒤바뀌지만, 히어로는 그 스코프 밖이라 베이스 규칙(type1=lg)이 그대로 적용된다. 절대배치용 래퍼 `.product_award_badge`(오버레이 용도)는 이미지 하단 흐름 배치에 부적합하여 제외하고 로고를 만드는 클래스만 사용.
- 문구(원문 그대로): `Winner of the iF Design Award Germany's premier design prize`(JSX는 `&apos;`로 이스케이프).
- 검증: `/product/susol-ul-acb`(awards="01")에서 lg iF 로고+문구 렌더 확인(스크린샷). `/product/susol-ul-mccb`(awards="")는 미노출. (참고: susol-ul-acb 히어로 대표이미지 파일 `page-files/540`이 서버에 없어 404가 나나, 이는 award와 무관한 기존 데이터 미비이며 award 로고는 정적 CSS background-image라 영향 없음.)

## 13. 제품 담당 배너(11~13) / 제품 맵핑 게시글 Insights(38) — 서버 필터(BE) 구현 완료(2026-07-25)

두 기능 모두 **JSONB 배열 포함 검색(`data_json->'...' @> to_jsonb(:id)`)이 필요**한데, FO 제네릭 where(eq_/has_markets_ 등)는 배열 포함을 지원하지 않는다(has_markets_는 CSV 문자열 토큰 전용). 따라서 **전량조회+클라이언트 필터 대신 서버 측 신규 엔드포인트**로 처리한다(사용자 지시). 두 쿼리 모두 기존 `findProductManagerEmail`의 `@>` 컨벤션을 재사용한다.

### 13-1. BE — `FoProductController`(`/api/v1/fo/products`) + `PageDataService`
- `GET /{productId}/manager-email` → **기존 `findProductManagerEmail(productId, siteId)` 그대로 노출**(신규 로직 없음). `productManager-data.ms`(JSONB 배열, 담당 product id) `@> to_jsonb(:productId)` + `product_manager.is_visible='001'`로 서버 필터, `{"email": <string>|null}` 반환.
- `GET /{productId}/insights` → **신규 `findProductInsights(productId, siteId)`**:
  - `data_slug IN ('blog-data','press-data','articles-data')` + `data_json->'product_list' @> to_jsonb(:productId)`(맵핑) + 공개 + 게시일 과거 + site 스코프, 게시일 내림차순(동률 id 내림차순) **LIMIT 3**.
  - ⚠️ **필드 위치 주의(실측)**: `title/is_visible/publish_dttm/image`는 `data_json` 최상위가 아니라 **콘텐츠 섹션(press/blog/articles) 하위 중첩**이다(`product_list`만 최상위). 섹션명 = slug에서 `-data` 제거값이라 `data_json->(replace(data_slug,'-data',''))->>'필드'`로 접근한다(최초 top-level 접근은 전부 NULL이 되어 0건이 나오는 버그였고 정정함).
  - 게시일 과거 판정: `substring(regexp_replace(...publish_dttm, '[^0-9]', '', 'g'),1,8) <= :today`(사이트 tz `resolveTodayParam`, condexpr 게시상태 게이트와 동일 방식).
  - 신규 DTO `ProductInsightRowResponse{id, dataSlug, title, publishDttm, image}`(태그/상세href/이미지URL 가공은 FE).
- 보안: `/api/v1/fo/**` permitAll(`SecurityConfig`)이라 신규 `/api/v1/fo/products/**`도 비로그인 허용. **site 스코프**: 두 쿼리 모두 `(site_id = :siteId OR site_id IS NULL)` — FE `fetchApi`가 `X-Site-Id=1`을 전역 주입하므로 SSR에서 정상 매칭(헤더 없이 호출하면 0건이니 주의).

### 13-2. FE
- `productsSystemsData.ts` `fetchProductManagerEmail(productId)`: 매칭 없으면 `""` 반환.
- `highlightNewsData.ts` `fetchProductInsights(productId)`(배럴 `@/data/highlightNews`에 재노출): BE 응답 → `HighlightNewsItem[]`. slug→tag(Press/Blog/Articles)·상세href·폴백이미지·`image("[123]")`→page-files URL 변환은 기존 company 데이터 헬퍼(`pressImageSrc`/`pressDetailHref` 등) + `formatNewsDate` 재사용. 정렬/건수는 BE가 확정하므로 FE는 매핑만.
- `GenericProductDetail.tsx`(HW): `managerEmail`·`insights`를 FAQ/OtherProducts와 병렬 조회.
  - 담당 배너: `CommonBanner02 variant="expert"`의 `contactEmail={managerEmail}`(기존 정적 `detail.expertContactEmail` 대체). 담당자 없으면 `""` → **공용 CommonBanner02 무수정**으로 이메일/복사 블록 미렌더(축약형): expert는 `resolvedContactEmail = contactEmail ?? DEFAULT_EXPERT_EMAIL`이고 `{contactEmail ? ... : null}`이라, `""`는 `?? `로 폴백되지 않고(빈문자열) 조건도 falsy라 블록이 사라지고 "Send an Inquiry"만 남는다. (expert variant 사용처는 `GenericProductDetail` 단 1곳 — 회귀 영향 없음.)
  - Insights: `DevicesPageFooter`에 `highlightItems={insights}` 전달. `DevicesPageFooter`는 `highlightItems`가 주어지면 그대로 쓰고(제품 맵핑), 없으면(카테고리/랜딩) 기존 `fetchMainHighlightNews()`. 0건이면 `HighlightNewsSection`이 `items.length===0`에서 `return null` → 섹션 자연 숨김.
- SW 상세(`SwProductDetail.tsx`)는 자체 구조라 이번 배선 대상 아님(HW `GenericProductDetail`만).

### 13-3. 검증(실측)
- `/product/ix7nh-servo-drives`(1715): 담당 배너에 실담당자 `sales.us@lselectricamerica.com`(mailto)+Copy Link+Send Inquiry, Insights에 제품 맵핑 Articles 1건("order tset"). 콘솔 0.
- `/product/l7p-servo-drives`(1718): Insights에 제품 맵핑 Press 1건("order tset").
- `/product/dfsdfsdf`(2035, 담당자 없음): 배너에 이메일/복사 미노출, Send Inquiry만(축약형). (콘솔 404는 이 테스트 제품 대표이미지 `page-files/506` 부재 — 무관한 기존 데이터 이슈.)
- blog는 실데이터 매핑 0건이라 결과에 안 잡히는 게 정상. tsc/gradle compileJava 통과, bo-api(local 프로파일) 재빌드·재기동으로 신규 엔드포인트 반영.
