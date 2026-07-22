# Product Detail FAQ(제품별) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/product/GenericProductDetail.tsx` — `productId` 있으면 `fetchProductFaqItems(productId)` 호출, 0건이면 정적 `productTemplateFaqItems` 폴백
> - `fo/src/app/()/products-systems/data/hwProductDetail.ts` — `buildHwProductDetail()`이 `productId`(product-data `_id`)를 함께 반환하도록 확장
> - `fo/src/app/()/products-systems/data/productsSystemsData.ts` — `fetchProductFaqItems(productId)` (신규 함수, `faq-data` 조회)
> - `fo/src/app/()/products-systems/components/DevicesPageFooter.tsx` — `faqItems` prop을 받아 `CommonFaq`에 전달(변경 없음, 기존 컴포넌트 재사용)
> - `fo/src/components/faq/CommonFaq.tsx`, `fo/src/components/ui/FaqItem.tsx` — `question`/`answer` 태깅은 `faq-data.md`(markets)에서 이미 완료된 것을 그대로 재사용(신규 태깅 없음)
> - 관련 문서: `fo/docs/dev/products-systems/product-data-detail.md` §10-4(요약), `fo/docs/dev/markets/faq-data.md`(같은 slug의 markets 축 사용례 — 필드 스키마 3세대 혼재 이력·`flattenPageDataItem` 공통 규칙 참고)
> 상태: 승인됨(전체진행, 2026-07-21) — 코드 반영 완료(직접 확인), 실유효 데이터 0건(BO 입력 필요)

## 1. data-slug
- 값: `faq-data` (재사용 — `faq-data.md`가 이미 markets 6개 페이지에서 이 slug를 다룬다. products-systems는 where 조건(필터 축)이 달라 파일명에 `-product` 구분자를 붙였다)
- 다건 여부: 다건(배열) — 제품 1건(`productId`)에 연결된 FAQ 목록

## 2. data-slugKey 매핑
`CommonFaq`/`FaqItem`의 `data-slug="faq-data"`/`data-slugkey="question"`/`data-slugkey="answer"` 태깅은 `faq-data.md`(markets)에서 이미 완료돼 있고, products-systems는 이 공용 컴포넌트를 그대로 재사용한다(신규 마크업/태깅 없음).

| slugKey | dataJson 필드(flatten 기준) | 타입 | 설명 |
|---|---|---|---|
| question | question | string | FAQ 질문(공통 `flattenPageDataItem` 적용 후 root 필드) |
| answer | answer | string | FAQ 답변 |

## 3. API 확인 (최종 체크)
- 신규 API 필요 여부: **불필요** — 기존 `FoPageDataController`(`GET /api/v1/fo/page-data/faq-data`) 재사용. `faq-data` slug 등록은 `faq-data.md` STEP4에서 이미 확인됨(`slug_registry` id=108, is_active=true).
- 참고 엔드포인트: `GET /api/v1/fo/page-data/faq-data?eq_main_category=001&eq_product={productId}&eq_is_visible=001&sort=id,asc&size=100`
- 구현 함수: `fetchProductFaqItems(productId)`(`productsSystemsData.ts`) — 공통 `fetchData`(`@/lib/pageDataApi`) + `flattenPageDataItem`(`@/lib/pageData`) 사용. `faq-data.md`가 확립한 "콘텐츠 키 이름에 의존하지 않고 flatten 공통 유틸을 쓴다"는 규칙을 그대로 따른다.

## 4. ⚠️ 사용자 지시와 다른 방식으로 확정한 사항 (크리티컬)
목표설정 단계에서 사용자는 "product type(P/A)으로 FAQ를 필터"하라고 지시했다. 그러나 faq-data 스키마(`faq-data.md` §3에서 확정한 bo `page_template` id=87/86 config_json 기준 정본 필드셋 `main_category`/`markets`/`question`/`answer`/`is_visible`/`product`)에는 **product type(P/A) 단위로 필터할 수 있는 필드가 없다.** 따라서:

- **채택한 방식**: faq-data에 이미 존재하는 `product` 필드(개별 제품 id, product-data `_id`를 가리키는 FK 성격 값)로 필터한다 — `eq_product={product-data _id}`.
- **결과적으로 필터 단위가 달라졌다**: 지시받은 "제품 타입(P/A) 단위"가 아니라 "개별 제품 1건 단위"로 좁혀진다. 같은 타입의 다른 제품 페이지에는 이 FAQ가 노출되지 않는다.
- 스키마상 불가능하다는 점은 bo `faq-detail`/`faq-list` 템플릿 config_json을 직접 조회해 확인했다(추정이 아님). product type 단위 필터가 필요하다면 faq-data에 `product_type` 필드를 신규로 추가하는 BO 스키마 변경이 선행돼야 하며, 이는 이번 스코프 밖이다.

## 5. 조회 조건
- where: `eq_main_category=001`(faq-data 대분류 코드 — "Products & Systems". `faq-data.md`가 다루는 markets 축의 `002`와는 다른 값) + `eq_product={productId}` + `eq_is_visible=001`
- orderBy: `id,asc`
- row limit(다건 개수): 다건, 상한 `size=100`(제품 1건당 FAQ 100개 넘는 경우는 없다고 가정 — `faq-data.md`와 동일한 상한 관례)

## 6. 샘플 응답 데이터
> 실측 라이브 레코드 없음(product/main_category=001 조합으로 등록된 FAQ가 아직 BO에 없다) — 아래는 `faq-data.md` §5의 정본 스키마(`faq.*` snake_case)를 그대로 따른 **추정** 샘플이다.

```json
{
  "content": [
    {
      "id": 301,
      "dataJson": {
        "id": 301,
        "faq": {
          "main_category": "001",
          "product": "1234",
          "is_visible": "001",
          "question": "제품 설치 시 주의사항은 무엇인가요? (예시)",
          "answer": "제품 설치 전 정격전압/전류를 확인하세요. (예시)"
        }
      }
    }
  ]
}
```

## 7. 비고
1. **실유효 데이터 현재 0건** — BO에 `main_category=001`(Products & Systems) + 개별 `product` id로 등록된 FAQ 레코드가 아직 없다. `GenericProductDetail.tsx`는 0건이면 `productTemplateFaqItems`(정적)로 폴백하므로 화면은 깨지지 않는다. 이는 데이터 입력 과제이며 코드 블로커가 아니다.
2. **확인 필요(미검증)**: `eq_product` where가 faq-data의 `product` 필드(문자열/숫자 저장 타입 불확실)와 product-data `_id`(숫자)를 JSONB 레벨에서 정확히 매칭하는지 curl 실측으로 아직 검증되지 않았다. BO에 테스트 레코드가 등록되면 fo-fe-builder가 curl로 확정해야 한다.
3. `main_category` 코드값(`001=Products & Systems`, `002=Markets`)은 `faq-data.md` §3 "코드 라벨" 표와 동일 코드그룹을 공유한다(교차 확인 완료).
4. `faq-data.md`(markets)의 스키마 세대 혼재 경고(§3 하단 "⚠️ 스키마 세대 혼재")가 이 문서에도 그대로 적용된다 — `faq.*` snake_case(1번 세대)만 매칭 대상이며, 다른 세대(`faqForm.*`)로 입력된 레코드는 노출되지 않는다.

## 8. STEP별 진행 이력
| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP0~2 | fo-slug-analyzer / fo-fe-builder | 2026-07-21 | product type 필터 지시 → faq-data 스키마상 불가 확인 → `product` 필드 개별 제품 필터로 재설계, where/필드 확정. 판단은 `#전체진행` 위임으로 승인 |
| STEP3 | fo-dev-doc-writer | 2026-07-21 | 본 문서 신규 작성(상태: 승인됨·전체진행), `faq-data.md`(markets)와 필드/코드값 교차 확인 |
| STEP4~5(구현) | fo-fe-builder | 2026-07-21 | `fetchProductFaqItems` 신규 함수, `buildHwProductDetail` 반환 타입에 `productId` 추가, `GenericProductDetail.tsx` 연동 — 문서 작성 시점 코드 직접 확인으로 반영 완료 확인 |
