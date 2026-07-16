# Devices Explore All (전제품보기 A~Z) 데이터 바인딩 설계

> 대상 파일: `fo/src/app/()/products-systems/components/DevicesExploreAll.tsx` (`.devices_explore__list`, A~Z 레터 컬럼별 다건 목록)
> 사용 페이지: `fo/src/app/()/products-systems/explore-all/page.tsx`
> 상태: 설계중

## 1. data-slug
- 값: `product-data` (`product-data-detail.md`와 동일 slug — 단건 상세가 아니라 전체 제품을 다건으로 조회하는 케이스)
- 다건 여부: 다건(배열) — 전체 제품 목록, A~Z 레터 그룹핑은 클라이언트에서 `product.product_name` 기준으로 파생

## 2. data-slugKey 매핑

```html
<ul className="devices_explore__list" data-slug="product-data" data-slug-repeat="true">
  <li data-slug-item>
    <a href={item.href} data-slugKey="product.product_name">{label}</a>
  </li>
</ul>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| product.product_name | product.product_name | string | 텍스트(`a.devices_explore__link` / `span.devices_explore__link-text`) | 제품명 라벨. A~Z 레터 그룹핑(`groupExploreProductsByLetter`)의 소스 값이기도 함(클라이언트 파생, 별도 API 필드 아님) |

> `item.href`(제품 상세 라우트)는 정적 라우팅 값, product-data 대응 필드 없음(정적 유지, 태그 없음). `discontinued`(단종 표기 도트)는 `product.is_visible` 파생 가능성이 있으나 이번 STEP1~2 범위에서 확정하지 못함(6번 비고 참고).

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **확인 필요** (STEP4 `fo-be-analyzer`에서 최종 판단, `product-data-detail.md`와 동일 slug이므로 결론도 동일할 가능성 높음)
- (기존 활용 가능 시) 참고 엔드포인트: `GET /api/v1/fo/page-data/product-data` — `product-data-detail.md`와 동일 엔드포인트를 where만 바꿔 재사용 예상(단건 `seo.slug` 대신 `is_visible` 조건으로 전체 조회)
- (신규 필요 시) 제안 엔드포인트: -

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)
- where: `product.is_visible=001`
- row limit: 다건 — 전체 제품(상한 없이 조회, A~Z 전 레터 커버 필요)
- orderBy: `product.product_name ASC`
- 2차 정렬(tie-breaker): `id ASC`

## 5. 샘플 응답 데이터

> 실 데이터는 이번 STEP1~3 범위에서 직접 조회하지 않았음. 아래는 매핑 구조를 보여주기 위한 **추정** 예시.

```json
{
  "content": [
    {
      "id": 1201,
      "dataJson": {
        "product": {
          "product_name": "Susol UL Smart MCCB",
          "is_visible": "001"
        }
      }
    },
    {
      "id": 1305,
      "dataJson": {
        "product": {
          "product_name": "H100 Plus",
          "is_visible": "001"
        }
      }
    }
  ]
}
```

## 6. 비고
1. `product-data` slug의 bo SlugRegistry 등록 여부 — **확인 필요**(`product-data-detail.md`와 공통 항목, 한 번만 확인하면 됨).
2. **미해결 확인 필요** — `discontinued`(단종) 도트 표기가 `product.is_visible` 코드값으로 파생 가능한지 미확정. 현재 정적 데이터(`gnbExploreAllProducts`)에는 `discontinued: boolean` 필드가 별도로 있으나 product-data 스키마에 정확히 대응하는 필드명은 확인하지 못함.
3. A~Z 레터 그룹핑(`groupExploreProductsByLetter`, `chunkLetterGroups`)은 전량 클라이언트 로직으로, BE where/orderBy와 무관하게 `product.product_name` 알파벳 첫 글자 기준 파생임을 확인함(정적 유지 대상 아님 — 데이터 자체는 필요하나 그룹핑 로직은 FE 유지).
4. `DevicesExploreAllToolbar.tsx`(단종 표시 토글 UI)는 이번 문서 범위 아님(정적 UI 컨트롤, product-data 대응 필드 없음).

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-16 | `DevicesExploreAll.tsx`(`.devices_explore__list`)에 `data-slug="product-data" data-slug-repeat="true"` + `data-slug-item` + `product.product_name` 다건 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-16 | where `product.is_visible=001`, orderBy `product.product_name ASC`, tie `id ASC`, row limit 전체(상한 없음) 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-16 | 작업 단위 문서 작성 (상태: 설계중). API 확인 "확인 필요", discontinued 파생 필드 미확정 항목 명시 |
