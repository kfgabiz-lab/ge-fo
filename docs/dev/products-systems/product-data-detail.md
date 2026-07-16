# Devices Product Detail (제품상세 HW/SW) 데이터 바인딩 설계

> 대상 파일:
> - HW 제품상세: `fo/src/app/()/products-systems/components/product/DevicesProductHero.tsx` (히어로+스펙, 단건)
> - SW 제품상세: `fo/src/app/()/products-systems/components/product/DevicesHvdcHero.tsx` / `DevicesHvdcOverview.tsx`(scada 라우트에서 사용), `DevicesMicroGridHero.tsx` / `DevicesMicroGridOverview.tsx`, `DevicesSmartFactoryHero.tsx` / `DevicesSmartFactoryOverview.tsx`, `DevicesXemsHero.tsx` / `DevicesXemsOverview.tsx` (각 히어로+오버뷰, 단건)
> - Key Features(HW 전용): `fo/src/components/content/DevicesProductFeaturesSection.tsx` (`sectionId="product-key-feature"` 기본값 사용처만 대상, SW Benefits 사용처는 제외)
> - 관련제품: `fo/src/app/()/products-systems/components/product/DevicesProductOtherProducts.tsx` (다건)
> - 사용 페이지(HW): `motor-control/{h100_plus,metasol-ms,susol-ul-smart-mccb}/page.tsx`
> - 사용 페이지(SW): `software/{scada,micro-grid,smart-factory,xems}/page.tsx` (scada 페이지가 `DevicesHvdcHero`/`DevicesHvdcOverview`를 사용 — 컴포넌트명과 라우트명이 다름, 실제 코드 확인됨)
> 상태: 설계중

## 1. data-slug
- 값: `product-data`
- 다건 여부: 혼합 — 히어로/오버뷰/스펙/Key Features는 단건(제품 1건 row), 관련제품은 다건(배열)

## 2. data-slugKey 매핑

```html
<!-- HW: DevicesProductHero.tsx -->
<section data-slug="product-data">
  <img data-slugKey="product_info.image" data-slugKey-attr="src" />
  <h1 data-slugKey="product.product_name">{series}</h1>
  <p data-slugKey="product.product_description">{description}</p>
  <dl>
    <!-- specs는 배열이 아니라 product_spec의 고정 3필드 인덱스매핑(최대 3) -->
    <dt data-slugKey="product_spec.spec1_title"></dt><dd data-slugKey="product_spec.spec1_content"></dd>
    <dt data-slugKey="product_spec.spec2_title"></dt><dd data-slugKey="product_spec.spec2_content"></dd>
    <dt data-slugKey="product_spec.spec3_title"></dt><dd data-slugKey="product_spec.spec3_content"></dd>
  </dl>
</section>

<!-- SW: DevicesHvdcHero / DevicesMicroGridHero / DevicesSmartFactoryHero / DevicesXemsHero (동일 구조) -->
<div data-slug="product-data">
  <h1 data-slugKey="product.product_name">{title}</h1>
  <p data-slugKey="product.product_description">{description}</p>
</div>

<!-- SW: DevicesHvdcOverview / DevicesMicroGridOverview / DevicesSmartFactoryOverview / DevicesXemsOverview -->
<section data-slug="product-data">
  <!-- scada(Hvdc)만 <img src>, 나머지 3개는 background-image style -->
  <img data-slugKey="product_info.image" data-slugKey-attr="src" />  <!-- scada만 -->
  <div data-slugKey="product_info.image" style={{backgroundImage:`url(...)`}} />  <!-- micro-grid/smart-factory/xems -->
  <p data-slugKey="product_info.info_description">{description}</p>
</section>

<!-- HW: DevicesProductFeaturesSection.tsx (Key Features, sectionId="product-key-feature" 사용처만) -->
<section data-slug="product-data">
  <!-- 고정 4필드 인덱스매핑(최대 4), 배열 아님 -->
  <h3 data-slugKey="key_feature1.key1_title"></h3><p data-slugKey="key_feature1.key1_content"></p>
  <h3 data-slugKey="key_feature2.key2_title"></h3><p data-slugKey="key_feature2.key2_content"></p>
  <h3 data-slugKey="key_feature3.key3_title"></h3><p data-slugKey="key_feature3.key3_content"></p>
  <h3 data-slugKey="key_feature4.key4_title"></h3><p data-slugKey="key_feature4.key4_content"></p>
</section>

<!-- 관련제품: DevicesProductOtherProducts.tsx (다건) -->
<div data-slug="product-data" data-slug-repeat="true">
  <div data-slug-item>
    <img data-slugKey="product_info.image" data-slugKey-attr="src" />
    <h3 data-slugKey="product.product_name"></h3>
  </div>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| product.product_name | product.product_name | string | 텍스트(HW `h1.devices_product_hero__series` / SW `h1.devices_software_hero__title`) | 제품명 (히어로 메인 제목) |
| product.product_description | product.product_description | string | 텍스트(HW `p.devices_product_hero__desc` / SW `p.devices_software_hero__desc`) | 제품 설명 |
| product_info.image (히어로, HW) | product_info.image | array(파일ID) → string(url) | 속성(`img.src`) | HW 히어로 제품 이미지. 파일ID 배열 → `/api/v1/fo/page-files/{id}` 프록시 변환 |
| product_info.image (오버뷰, SW-scada) | product_info.image | array(파일ID) → string(url) | 속성(`img.src`) | scada(Hvdc) 오버뷰 이미지, `<img>` 렌더 |
| product_info.image (오버뷰, SW-나머지 3개) | product_info.image | array(파일ID) → string(url) | 텍스트 아님, CSS `background-image` — FE에서 style 처리 필요(속성 바인딩 아님, 별도 분기) | micro-grid/smart-factory/xems 오버뷰 이미지, background-image로 렌더(scada와 다른 렌더 방식) |
| product_info.info_description | product_info.info_description | string | 텍스트(`p.devices_software_overview__desc`) | SW 오버뷰 설명 |
| product_spec.spec{1~3}_title | product_spec.spec{N}_title | string | 텍스트(`dt`) | HW 스펙 라벨. 배열 아님, 고정 3필드 인덱스매핑 |
| product_spec.spec{1~3}_content | product_spec.spec{N}_content | string | 텍스트(`dd`) | HW 스펙 값. 배열 아님, 고정 3필드 인덱스매핑 |
| key_feature{1~4}.key{N}_title | key_feature{N}.key{N}_title | string | 텍스트(`h3.devices_product_features__tit`) | HW Key Features 카드 제목. 배열 아님, 고정 4필드 인덱스매핑 |
| key_feature{1~4}.key{N}_content | key_feature{N}.key{N}_content | string | 텍스트(`p.devices_product_features__desc`) | HW Key Features 카드 설명. 배열 아님, 고정 4필드 인덱스매핑 |
| product.product_name (관련제품, 다건) | product.product_name | string | 텍스트(`h3.devices_product_other__tit`) | 관련제품 카드명 — `_fetchedRel5`/`_fetchedRel6` 관계로 연결 예상, shape 미확정(6번 비고 참고) |
| product_info.image (관련제품, 다건) | product_info.image | array(파일ID) → string(url) | 속성(`img.src`) | 관련제품 카드 이미지 — 관계 확장 shape 미확정(6번 비고 참고) |

> HW 히어로의 `subtitle`, SW 히어로의 `tagline`, SW 오버뷰의 제목(`overviewTitle`)은 product-data 대응 필드 없음(실측) → 정적 유지, 태그 없음.

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **확인 필요** (STEP4 `fo-be-analyzer`에서 최종 판단)
- (기존 활용 가능 시) 참고 엔드포인트: `GET /api/v1/fo/page-data/product-data` — main/markets에서 검증된 `FoPageDataController` 패턴 재사용 가능성이 높으나, `seo.slug`/`product_code` 단건 조회 및 관계(`_fetchedRel5/6`) 확장 방식은 STEP4에서 확인 필요. bo SlugRegistry에 `product-data` slug가 실제 등록돼 있는지는 직접 검증하지 않았음 — bo 관리자 화면 또는 STEP4 DB 조회로 확인 필요.
- (신규 필요 시) 제안 엔드포인트: -

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)

### 히어로/오버뷰/스펙/Key Features (단건)
- where: `seo.slug={제품키}` (또는 `product.product_code`) — **제품 route 폴더명(`susol-ul-smart-mccb`, `h100_plus` 등) ↔ DB `seo.slug`/`product_code` 표기 불일치 가능성 확인 필요**(4번 비고 참고). FE 정적 콘텐츠상의 slug 값은 `h100_plus`/`metasol-ms`/`susol-ul-smart-mccb`(HW), scada/micro-grid/smart-factory/xems 페이지는 `productDetailContent.ts`류 정적 데이터를 참조 — 실제 DB `seo.slug` 값과 동일한지는 STEP4 이전 미검증
- row limit: 단건(1건)
- orderBy: 없음
- 2차 정렬(tie-breaker): 불필요

### 관련제품 (다건)
- where: 현재 제품 row의 관계필드 `_fetchedRel5`/`_fetchedRel6` 값 기준 — shape 미확정(6번 비고)
- row limit: 다건(Other Products 슬라이더 노출 개수, 상한 미확정 — 현재 정적 데이터 기준 4개 이상 노출 시 슬라이드)
- orderBy: 미확정(관계 shape 확정 후 결정)
- 2차 정렬(tie-breaker): 미확정

## 5. 샘플 응답 데이터

> 실 데이터는 이번 STEP1~3 범위에서 직접 조회하지 않았음. 아래는 매핑 구조를 보여주기 위한 **추정** 예시.

```json
{
  "content": [
    {
      "id": 1201,
      "dataJson": {
        "seo": { "slug": "susol-ul-acb" },
        "product": {
          "product_code": "L01-07-01",
          "product_name": "Susol UL Smart MCCB",
          "product_description": "UL 인증 저압 스마트 배선용 차단기"
        },
        "product_info": {
          "image": [],
          "info_description": "SW 제품 오버뷰 설명 예시(SW 라우트에서만 사용)"
        },
        "product_spec": {
          "spec1_title": "Rated Current", "spec1_content": "100~1600A",
          "spec2_title": "Voltage", "spec2_content": "AC 690V",
          "spec3_title": "Breaking Capacity", "spec3_content": "65kA"
        },
        "key_feature1": { "key1_title": "Smart Monitoring", "key1_content": "실시간 상태 모니터링 예시" },
        "key_feature2": { "key2_title": "Compact Design", "key2_content": "설명 예시" },
        "key_feature3": { "key3_title": "Safety", "key3_content": "설명 예시" },
        "key_feature4": { "key4_title": "Connectivity", "key4_content": "설명 예시" },
        "_fetchedRel5": "TODO-shape 미확정",
        "_fetchedRel6": "TODO-shape 미확정"
      }
    }
  ]
}
```

## 6. 비고
1. **미해결 확인 필요** — 제품 route 폴더명(`susol-ul-smart-mccb`, `h100_plus` 등, `fo/src/app/()/products-systems/data/productDetailContent.ts`의 정적 `slug` 필드 값)과 실제 DB `seo.slug`/`product_code` 표기가 일치하는지 미확정. 예: 정적 데이터의 `susol-ul-smart-mccb`가 DB에는 `susol-ul-acb` 등 다른 표기로 등록돼 있을 가능성 — 제품별 where 값은 STEP4에서 bo 데이터 직접 확인 후 확정 필요.
2. **미해결 확인 필요** — 관련제품 `_fetchedRel5`/`_fetchedRel6` 관계 확장 shape(관련 제품 row의 `product.product_name`/`product_info.image`로 펼쳐지는지, rel5/rel6 중 어느 슬롯을 목록 소스로 쓰는지) 미확정. `DevicesProductOtherProducts.tsx` 주석에도 "확정 필요"로 명시돼 있음(실측).
3. `product-data` slug의 bo SlugRegistry 등록 여부 — **확인 필요**(직접 검증 안 함).
4. `product_info.image` 현재 실측 미입력(0건) — 화면 플레이스홀더 다수는 설계상 정상, 개발 블로커 아님.
5. SW 오버뷰 이미지 렌더 방식이 컴포넌트별로 다름: scada(`DevicesHvdcOverview`)만 `<img src>`, micro-grid/smart-factory/xems는 CSS `background-image`. `product_info.image`는 동일 필드지만 FE 바인딩 시 분기 처리 필요(STEP6 대상).
6. 이번 범위 제외(정적 유지 — product-data에 대응 필드 없음, 실측): `DevicesProductDownloads`, `DevicesProductApplications`, `DevicesProductWhy`, `DevicesSoftwareHighlights`/`DevicesMicroGridHighlights`/`DevicesXemsEnergySolutions`, `DevicesProductVideo`(youtube), `DevicesPageFooter` FAQ, HW 히어로 `subtitle`, SW 히어로 `tagline`, SW 오버뷰 `overviewTitle`, `series` 라벨(현재 `product.product_name`과 별도 슬롯이나 실제로는 같은 값 사용, 필드 자체는 product-data 존재).
7. HW `susol-ul-smart-mccb` 라우트 외에 SW `scada` 라우트가 컴포넌트명 `DevicesHvdcHero`/`DevicesHvdcOverview`를 사용하는 것은 리네이밍 누락으로 보이나, 이번 문서는 데이터 바인딩 범위만 다루므로 컴포넌트명 정정은 별도 과제로 남김(기능 영향 없음, 실측 확인).

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-16 | HW(`DevicesProductHero.tsx`)에 히어로+스펙(고정 3필드) 태깅, SW 4종 히어로/오버뷰(Hvdc/MicroGrid/SmartFactory/Xems)에 `product.product_name`/`product.product_description`/`product_info.image`/`product_info.info_description` 태깅(오버뷰 이미지 렌더 방식 분기 주석 포함), `DevicesProductFeaturesSection.tsx`에 Key Features 전용(`sectionId="product-key-feature"`) 조건부 태깅(SW Benefits 제외), `DevicesProductOtherProducts.tsx`에 관련제품 다건 태깅(관계 shape 미확정 주석 포함) 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-16 | 단건 where(`seo.slug` 또는 `product.product_code`) 구조 확정, 제품별 실제 slug 값은 "확인 필요"로 보류. 관련제품 where/orderBy/limit은 관계 shape 미확정으로 보류 |
| STEP3 | fo-dev-doc-writer | 2026-07-16 | 작업 단위 문서 작성 (상태: 설계중). API 확인 "확인 필요", 제품별 slug 표기 불일치 및 관련제품 관계 shape 미확정을 미해결 항목으로 명시 |
