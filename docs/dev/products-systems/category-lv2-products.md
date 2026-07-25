# Devices Category List — Lv3 제품 노출조건 (Lv2 카테고리 랜딩 제품 카드) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/product-range/[slug]/page.tsx` (34행 `fetchProductsByCodePrefix` 호출부 — 데이터 소스 교체 대상)
> - `fo/src/app/()/products-systems/components/DevicesCategoryList.tsx` (렌더링, `data-slug="product-data"`/`data-slug-repeat`/`data-slugkey` 태깅은 이미 존재 — 마크업 변경 없음)
> - 관계: 이 문서는 `category-data-lv2.md`가 다루는 "카드 목록(product-data, 다건)" 스펙(같은 문서 3~4절)을 기획서(product-lv2.png) 요건 반영으로 **대체**한다. `category-data-lv2.md`의 인트로(category-data, 단건) 부분은 이번 변경 대상이 아니며 그대로 유지된다.
> 상태: 설계중

## 1. data-slug
- 값: `product-data`
- 다건 여부: 다건(배열)

## 2. data-slugKey 매핑

기존 `category-data-lv2.md` 2절과 **동일**(변경 없음) — 이번 작업은 where/orderBy(데이터 소스)만 교체하고 마크업 태깅은 그대로 재사용한다.

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| product_info.image | product_info.image | array(파일ID) → string(url) | 속성(`img.src`) | 제품 카드 썸네일. `/api/v1/fo/page-files/{id}` 프록시 변환 |
| product.product_name | product.product_name | string | 텍스트(`h2`) | 제품명 |
| product_info.info_description | product_info.info_description | string | 텍스트(`p`) | 제품 설명 |

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **신규 필요**
- 근거: 기존 `GET /api/v1/fo/categories/{id}/lv2`(`category-data-lv1.md`에서 도입, Lv1 하위 Lv2 목록 전용)는 응답이 Lv2 카테고리 목록이라 Lv3 제품 목록에는 재사용 불가. `PageDataService.CATEGORY_LV2_CTE`의 `visible_product` 서브쿼리 메커니즘(`PageDataService.java:68-91`, 코드 직접 확인)은 재사용 가능한 패턴이나, anchor가 Lv1 id인 기존 CTE와 달리 이번엔 anchor가 Lv2 id 자신이라 별도 쿼리/엔드포인트가 필요하다.
- (신규 필요 시) 제안 엔드포인트: `GET /api/v1/fo/categories/{lv2Id}/products` (이 Lv2 자신의 하위 Lv3 제품 목록). 서비스 메서드/DTO 상세 설계는 STEP4(`fo-be-analyzer`)에서 확정.

## 4. 조회 조건
- where(① ~ ②, AND):
  1. junction 존재: category-data depth3 레코드 중 `data_json->'product'->>'depth'='3'` AND `data_json->'product'->>'parentId'={Lv2 id}` (`CATEGORY_LV2_CTE`의 junction 조인 `j`와 동일 구조, `PageDataService.java:80-84` 참고)
  2. 그 junction이 가리키는 product-data 레코드(`j.data_json->'product'->>'id'`로 매칭)가 `product.is_visible='001'` **AND** `product.order_status='01'` (`PageDataService.java:89-90`과 동일 조건)
  - 현재 코드(`fetchProductsByCodePrefix`, `productsSystemsData.ts:217`)는 `is_visible='001'`만 체크하고 `order_status`는 체크하지 않으며, `product.product_code` 접두사로 FE 메모리 필터링한다 — 이 방식을 위 junction 기반 방식으로 교체한다.
- row limit: 없음(전체)
- orderBy: junction 레코드(위 1번 조건의 category-data depth3 행) 최상위 `sortOrder` 숫자 오름차순(NULLS LAST) — Lv1→Lv2 정렬에 쓰인 `v.data_json->>'sortOrder'`(`PageDataService.java:551`)와 동일 패턴이되, 대상 레코드가 다르다(그쪽은 Lv2 자신 레코드, 여기는 Lv2-제품 junction 레코드).
- 2차 정렬(tie-breaker): `id ASC`
- 실측 검증 완료(2026-07-26, 사용자 제공): Lv2 id=585(EMPR) 밑 junction 4건이 sortOrder 1/2/3/4 = GMP/DMPi/IMP/MMP 순 — 기획서 목업 카드 순서와 정확히 일치.

## 5. 샘플 응답 데이터

> 신규 엔드포인트라 실제 응답 스키마는 없음. 아래는 4절에서 실측 확인된 **정렬 순서**(Lv2 id=585 EMPR)만 반영한 것이고, 필드 구조(응답 DTO 형태)는 **추정**이다 — STEP4에서 확정.

```json
[
  { "productId": 1001, "sortOrder": 1, "title": "GMP", "image": null, "description": null },
  { "productId": 1002, "sortOrder": 2, "title": "DMPi", "image": null, "description": null },
  { "productId": 1003, "sortOrder": 3, "title": "IMP", "image": null, "description": null },
  { "productId": 1004, "sortOrder": 4, "title": "MMP", "image": null, "description": null }
]
```

## 6. 비고

1. **⑤~⑧(이미지/제품명/설명/클릭이동)은 별도 작업 불필요**: `DevicesCategoryList.tsx`의 `data-slug-repeat`/`data-slugkey` 태깅은 이미 존재하며 이번 작업으로 변경되지 않는다. `page.tsx:33-41`의 데이터 소스(제품 목록을 얻는 방법)만 교체하면 카드 렌더링 자체는 그대로 동작한다.
2. **`category-data-lv2.md`와의 관계 — 확인 필요**: 이번 문서가 다루는 "카드 목록(product-data)" 스펙은 `category-data-lv2.md` 3~4절의 동일 항목을 대체한다. 개발 완료 후 두 문서를 어떻게 정리할지(① `category-data-lv2.md`의 해당 절을 이 문서로 대체 갱신 / ② 이 문서를 `category-data-lv2.md`에 흡수 통합)는 fo-orchestrator 판단이 필요하다 — 임의로 결정하지 않음.
3. **`layout` 사용 현황 관련 기존 문서 서술 불일치 발견(확인 필요)**: `category-data-lv2.md` 5절은 "신규 라우트(`/product-range/[slug]`)는 `layout=\"split\"`만 호출하며 `stacked` 분기는 데드 코드"라고 서술하나, 실제 `page.tsx:51`을 직접 읽어 확인한 결과 `layout="stacked"`가 호출되고 있다(`layout="split"` 호출부 없음). slugKey 매핑은 두 레이아웃이 동일해 이번 작업 내용에는 영향 없지만, 기존 문서 서술이 최신 코드와 어긋나 있어 별도 정정이 필요해 보인다(이 문서에서 임의로 고치지 않음).
4. `product.order_status`가 NULL/빈 값인 제품은 `='01'` 조건 불충족으로 junction에서 자동 제외된다(3치논리, 의도된 동작 — Lv1 문서(`category-data-lv1.md`)와 동일 원칙).

## 7. 데이터 없음(빈 값/매칭 0건) 시 동작 — 필수 기재
- 컨테이너(제목·설명 등) 유지 + 내부 항목만 있는 만큼 표시 (섹션 전체 조건부 숨김 금지 — `fo-data-binding-가이드.md` 5절). `page.tsx`는 현재 정적 폴백 삼항 없이 `products={productCards}`를 항상 배열로 전달하므로(빈 배열 포함), `category-data-lv1.md` 8번 비고에서 발견된 것과 같은 "0건인데 정적 목업으로 폴백되는" 버그 패턴은 이 파일에서는 확인되지 않았다(직접 코드 확인, 2026-07-26).

---

## 8. 부록 A — ⑮ Contact Us 배너

- 대상: `fo/src/app/()/product-range/[slug]/page.tsx:57` `<DevicesPageFooter />` (현재 prop 미전달, 직접 코드 확인 완료)
- `DevicesPageFooter`의 `bannerLinkHref?: string` optional prop은 이미 존재한다(`DevicesPageFooter.tsx:17,27,33` — Lv1 작업(`category-data-lv1.md` 비고 6번)에서 추가됨, 직접 코드 확인 완료).
- 필요 작업: `page.tsx:57`에서 `<DevicesPageFooter bannerLinkHref="/support/contact-us" />`로 prop만 전달.
- 신규 API/쿼리: 없음.

## 9. 부록 B — 범위 제외 확정 사항

- **① 브레드크럼**: 전역 상단 브레드크럼(`HeaderBreadcrumb.tsx`)이 `fetchDevicesMegaMenu()`(bo-api `findDevicesTree`, `ORDER BY depth ASC, sortOrder ASC NULLS LAST, id ASC`) 기반으로 이미 동적 매칭 구현됨. Lv2가 여러 Lv1에 중복 매핑된 경우(실측: `variable-frequency-drive` slug가 id=587/parentId=568, id=607/parentId=572 두 건 존재)에도 sortOrder 낮은 Lv1이 자동으로 먼저 매칭되어 표시됨. **코드 변경 불필요, QA 검증만 필요.**
- **⑨ Design Awards 로고**: ls-publish 원본 퍼블리싱(`ls-publish/src/app/()/products-systems/components/DevicesCategoryList.tsx`)에도 이 카드에는 애초에 배지 마크업이 없음(다른 화면 `DevicesProducts`/`MarketsProducts`/`DevicesProductOtherProducts`에만 원본부터 존재). 사용자 지시("퍼블리싱에 있는 그대로 진행, CSS/태그 변경 금지")에 따라 이번 범위에서 제외.

## 10. STEP별 진행 이력

| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1~2 | (세션 에이전트, 사용자 확정) | 2026-07-26 | 기획서(product-lv2.png) 요건 확인: ④ Lv3 제품 노출조건을 `CATEGORY_LV2_CTE`의 `visible_product` 메커니즘 재사용 방식으로 확정, junction 최상위 sortOrder 오름차순 정렬(Lv2 id=585 EMPR 실측 검증), 신규 엔드포인트 `GET /api/v1/fo/categories/{lv2Id}/products` 확정. ⑮ Contact Us는 기존 `bannerLinkHref` prop 전달만 필요함을 확인. ① 브레드크럼/⑨ Design Awards 로고는 범위 제외 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-26 | 작업 단위 문서 신규 작성(상태: 설계중). 코드 직접 확인으로 `layout="stacked"` 실사용 확인(기존 `category-data-lv2.md` 서술과 불일치 발견, 비고에 기록), `category-data-lv2.md`와의 문서 중복/대체 관계는 "확인 필요"로 명시. **코드 변경 없음(문서만), 승인 대기** |
