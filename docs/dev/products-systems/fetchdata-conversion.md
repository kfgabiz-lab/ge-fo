# Products & Systems 데이터 조회 공통계층(fetchData) 전환 설계

> 대상 파일: `fo/src/app/()/products-systems/data/productsSystemsData.ts`
> 상태: 승인됨

## 배경 — FO-RULE 핵심원칙 9 위반 시정

`productsSystemsData.ts`는 공통 조회 계층(`fo/src/lib/pageDataApi.ts`의 `fetchData()`)을 쓰지 않고, 파일 내부 private 헬퍼 `searchPageData(slug, query)`(37번째 줄, `fetchApi` 직접 호출 + 수동 `flattenPageDataItem` 매핑)를 거쳐 조회하고 있다. `fo/docs/FO-RULE.md` 핵심원칙 9("slugkey 이름이 실제 필드명과 일치하면 fetch 함수를 새로 만들지 않는다" — `fetchData`가 공통 계층이므로 화면 전용 fetch 함수를 중복 개발하지 않는다)에 어긋난다. 본 문서는 이 파일 안의 함수 6개를 `searchPageData` 대신 `fetchData()` 목록 브랜치 호출로 전환하는 작업 단위를 다룬다.

이번 작업은 **신규 데이터 바인딩(마크업 태깅/where 신규 확정)이 아니라 기존에 이미 확정된 slug/where/size를 그대로 유지한 채 조회 계층만 공통화하는 리팩터링**이다. data-slug/data-slugKey 자체는 변경되지 않으며, 실제 슬러그키 매핑은 기존 문서(`category-data-lv1.md`, `category-data-lv2.md`, `product-data-detail.md`, `product-data-explore-all.md`)를 그대로 참고한다.

## 1. data-slug

- 값: `category-data`(함수 3개), `product-data`(함수 3개) — 둘 다 기존 확정값 그대로, 변경 없음
- 다건 여부: 혼합 — 단건(첫행) 2개 + 목록(다건) 4개

## 2. 전환 대상 함수 → fetchData 파라미터 매핑

| 함수 | 유형 | slug | where | size/unpaged/sort |
|---|---|---|---|---|
| `fetchCategoryBySlug` | 단건(첫행) | category-data | `eq_category.depth`(옵션)+`eq_seo.slug` | size=1 |
| `fetchCategoryChildren` | 목록 | category-data | `eq_category.parentId` | unpaged=true (정렬은 FE에서 sortOrder ASC/tie id ASC, 그대로 유지) |
| `fetchTopCategories` | 목록 | category-data | `eq_category.depth=1` | unpaged=true (정렬 FE 유지) |
| `fetchAllVisibleProducts` | 목록 | product-data | `eq_product.is_visible=001` | unpaged=true (정렬 FE 유지, code localeCompare) |
| `fetchProductDetailBySlug` | 단건(첫행) | product-data | `eq_seo.slug` | size=1 |
| `fetchAllProductNames` | 목록 | product-data | `eq_product.is_visible=001` | sort=`product.product_name,asc` + unpaged=true |

전환 방식(현재 코드 대비):
- 단건(첫행) 2개(`fetchCategoryBySlug`, `fetchProductDetailBySlug`) — 현재도 `/page-data/{slug}?...&size=1` 목록 엔드포인트를 쓰고 `rows[0]`을 취하는 방식이라(PK 단건 엔드포인트가 아님), `fetchData()`의 **목록 브랜치**(`id` 미지정)를 `size:1`로 호출한 뒤 `res.content[0] ?? null`을 취하면 동일 동작이 된다. `FO-RULE.md` 핵심원칙 7(PK 단건 엔드포인트 필요)과는 무관 — 이 두 함수는 애초에 PK 조회가 아니라 `eq_seo.slug` 조건 검색이므로 목록 브랜치가 맞다.
- 목록(다건) 4개 — 현재 수동 쿼리스트링 조립(`eq_...=...&unpaged=true` 등)을 `fetchData({ slug, where, unpaged, sort })`의 `where`(Record<string,string>)/`unpaged`/`sort` 파라미터로 그대로 옮긴다. FE 정렬(sortOrder/id, code localeCompare)은 현재 로직 그대로 fetchData 호출 이후에 유지한다(전환 범위 아님).
- `fetchData()`가 이미 `page`/`size`/`unpaged`/`where`/`sort`/`리턴함수`를 전부 지원하므로(`pageDataApi.ts` 확인 완료), 이 전환을 위해 `fetchData` 자체의 시그니처를 바꿀 필요는 없다.

## 3. API 확인 (최종 체크)

- 신규 API 필요 여부: **기존 활용 가능** (신규 API 불필요 확정)
- 참고 엔드포인트: `GET /api/v1/fo/page-data/{slug}` — `fetchData()`의 목록 브랜치가 그대로 호출하는 기존 엔드포인트. BE 코드 변경 없음.

## 4. 조회 조건

함수별 where/size/sort는 위 2번 표와 동일(이미 확정, 변경 없음). orderBy가 필요한 목록 4개 함수는 서버 sort 대신 FE 정렬(기존 코드 그대로 유지)을 쓰거나(`fetchCategoryChildren`/`fetchTopCategories`/`fetchAllVisibleProducts`), 서버 `sort` 파라미터를 그대로 쓴다(`fetchAllProductNames`) — 둘 다 기존 동작 그대로이며 이번 전환에서 정렬 방식 자체를 바꾸지 않는다.

## 5. 샘플 응답 데이터

이번 전환은 API 응답 형태(`dataJson` 구조)를 바꾸지 않는다 — `/api/v1/fo/page-data/{slug}` 응답 shape과 `flattenPageDataItem` 이후 필드 접근 방식은 기존과 동일하다. 실제 샘플 응답은 이미 작성된 문서를 참고할 것:
- category-data: `category-data-lv1.md` §5, `category-data-lv2.md`
- product-data: `product-data-detail.md`, `product-data-explore-all.md`

## 6. 비고

1. **⚠️ try/catch 폴백 유지 필수(리스크)**: `fetchData()` 목록 브랜치는 에러를 throw 전파하는 반면(`pageDataApi.ts` 91번째 줄 주석 "에러는 삼키지 않고 throw 전파"), 현재 6개 함수는 전부 `try/catch`로 감싸 실패 시 `null`/빈배열 폴백을 반환한다. 전환 시 이 함수 레벨 `try/catch` 폴백을 반드시 그대로 유지해야 화면 폴백 동작(플레이스홀더/빈 목록 렌더 등)이 깨지지 않는다.
2. **전환 대상에서 제외**: `fetchCategoryByCode`는 이번 작업 범위에서 제외한다(사용자 결정). `productsSystemsData.ts` 전체를 grep한 결과 이 함수를 호출하는 코드가 정의부 외에는 전혀 없어(dead code) 손대지 않고 그대로 남겨둔다.
3. **`searchPageData` 헬퍼 완전 제거는 아님**: 6개 함수를 전환해도, `fetchCategoryByCode`(2번, 범위 제외)가 여전히 `searchPageData`를 호출하므로 이 private 헬퍼 자체는 파일에 남는다. `fetchCategoryByCode`를 정리(삭제 또는 별도 전환)하기 전까지는 `searchPageData`도 완전히 제거할 수 없다 — 이번 전환의 범위가 아니므로 결정하지 않고 사실만 기록한다.
4. **기존 문서 상 사실과 다른 부분(수정은 이번 범위 아님)**: `route-restructure.md` 28번째 줄에 "기존 `fetchCategoryByCode`/`fetchCategoryChildren`/`fetchProductsByCodePrefix`/`fetchProductDetailBySlug`도 카테고리 카드·제품 그리드 조회에 그대로 쓰인다"는 문장이 있는데, `fetchCategoryByCode`는 실제로는 호출부가 없는 dead code로 확인됐다(2번 참고). 이 문서 자체(`route-restructure.md`)의 수정은 이번 작업 범위가 아니므로 건드리지 않았고, 별도 판단(정정 필요 여부)이 필요한 항목으로만 남긴다.
5. **참고 선례**: 같은 파일의 `fetchProductFaqItems`(296번째 줄)는 이미 `fetchData()` + `flattenPageDataItem` 조합으로 구현돼 있다 — 이번 6개 함수 전환도 이 함수와 동일한 패턴(목록 브랜치 + `리턴함수`로 flatten 매핑)을 따르면 된다.
6. **호출부 영향 없음**: 6개 함수의 export 시그니처(인자/반환 타입)는 전부 그대로 유지되므로 `products-category/[slug]/page.tsx`, `product-range/[slug]/page.tsx`, `product/[slug]/page.tsx`, `products-systems/explore-all/page.tsx` 등 호출부 수정은 불필요.

## 7. STEP별 진행 이력

| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1~2 | (세션 에이전트, 사용자 확정) | 2026-07-23 | 전환 대상 6개 함수의 slug/where/size/sort 확정, `fetchCategoryByCode`는 dead code로 범위 제외 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-23 | 작업 단위 문서 작성(상태: 설계중). API 확인 "기존 활용 가능" 확정, try/catch 폴백 유지 리스크 명시 |
| 승인 | 세션 에이전트(사용자 #진행 확인) | 2026-07-23 | 확인 필요 항목 없음 확인 후 상태 "승인됨"으로 변경, STEP4 진행 |
| STEP4 | fo-be-analyzer | 2026-07-23 | 신규 BE 불필요 최종 확정(BE 코드 변경 없음). 기존 `GET /api/v1/fo/page-data/{slug}`를 `fetchData()` 목록 브랜치가 그대로 재사용 |
| STEP6 | fo-fe-developer | 2026-07-23 | 6개 함수(`fetchCategoryBySlug`/`fetchCategoryChildren`/`fetchTopCategories`/`fetchAllVisibleProducts`/`fetchProductDetailBySlug`/`fetchAllProductNames`)의 `searchPageData(slug,query)` 호출을 `fetchData()` 목록 브랜치 호출로 전환. `리턴함수`로 `flattenPageDataItem` 매핑(기존 raw row 형태 유지), 단건 2개는 `size:1`+`res.content[0] ?? null`. 함수 레벨 try/catch 폴백·값 가공 로직·export 시그니처 전부 유지. `fetchCategoryByCode`(dead code)와 `searchPageData` 헬퍼는 미변경 존치. `npx tsc --noEmit` 오류 없음 |
