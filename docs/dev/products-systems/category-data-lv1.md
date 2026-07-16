# Devices Hero + Products Grid (LV1 카테고리 랜딩) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/DevicesHero.tsx` (히어로 인트로, 단건 — `.devices_hero__inner`)
> - `fo/src/app/()/products-systems/components/DevicesProducts.tsx` (하위 카테고리 카드 그리드, 다건 — `.devices_products__grid`, `DevicesHero`가 `withProducts` prop으로 embedded 렌더도 겸함)
> - 사용 페이지: `fo/src/app/()/products-systems/motor-control/page.tsx` (`<DevicesHero withProducts />`)
> 상태: 설계중

## 1. data-slug
- 값: `category-data`
- 다건 여부: 혼합 — 히어로 인트로(단건, category depth1 레코드) + 하위 카테고리 카드 목록(다건, category depth2 레코드). 같은 slug를 두 컨텍스트(단건/다건)에서 다른 where로 조회하는 케이스(가이드 1절 "동일 최상위 data-slug가 서로 다른 두 DOM 영역에 이중으로 붙는 경우"와 유사하되, 여기서는 depth가 달라 결과셋 자체가 다름).

## 2. data-slugKey 매핑

```html
<!-- DevicesHero.tsx: 히어로 인트로(단건, depth1) -->
<div className="devices_hero__inner" data-slug="category-data">
  <h1 className="devices_hero__tit" data-slugKey="category.title">{title}</h1>
  <p className="devices_hero__desc" data-slugKey="category.description">{description}</p>
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
| category.description (히어로, 단건) | category.description | string | 텍스트(`p.devices_hero__desc`) | LV1 카테고리 설명 (depth1 레코드) |
| device_systems.image (카드, 다건) | device_systems.image | array(파일ID) → string(url) | 속성(`img.src`) | 하위 카테고리 카드 썸네일. 파일ID 배열 → FE에서 `/api/v1/fo/page-files/{id}` 프록시로 변환. 현재 실측 0건 입력(플레이스홀더 폴백 필요, 정상) |
| category.title (카드, 다건) | category.title | string | 텍스트(`h3.tit`) | 하위 카테고리명 (depth2 레코드) |

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **확인 필요** (STEP4 `fo-be-analyzer`에서 최종 판단)
- (기존 활용 가능 시) 참고 엔드포인트: `GET /api/v1/fo/page-data/category-data` — main/markets에서 이미 검증된 `FoPageDataController`(`PageDataService.search()`) 패턴 재사용 가능성이 높으나, depth/parentId 기반 where 필터·orderBy 적용 방식은 STEP4에서 확인 필요. bo SlugRegistry에 `category-data` slug가 실제 등록돼 있는지는 이 문서 작성 시점에 직접 검증하지 않았음 — bo 관리자 화면(`bo/admin/settings/slug-registry`) 또는 STEP4 DB 조회로 확인 필요.
- (신규 필요 시) 제안 엔드포인트: -

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)

### 히어로 인트로 (단건, depth1)
- where: `category.depth=1 AND category.code={페이지 카테고리코드}` — motor-control 페이지는 카테고리 `L01`("LV Products and Systems")로 실측 확정(히어로 title 및 하위 14개 카드가 L01 depth2 children과 일치)
- row limit: 단건(1건)
- orderBy: 없음(단건이라 불필요)
- 2차 정렬(tie-breaker): 불필요

### 카드 목록 (다건, depth2)
- where: `category.parentId={상위 depth1 rowId}` (motor-control=568) 또는 `category.code LIKE '{부모코드}-%' AND category.depth=2`
- row limit: 다건 — motor-control 실측 14건(상한 없이 조회)
- orderBy: `sortOrder ASC`
- 2차 정렬(tie-breaker): `id ASC`

## 5. 샘플 응답 데이터

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
          "title": "LV Products and Systems",
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

## 6. 비고
1. `category-data` slug의 bo SlugRegistry 등록 여부 — **확인 필요**(직접 검증 안 함). bo 관리자 화면에서 확인 필요.
2. `device_systems.image` 현재 실측 미입력(0건) — 화면상 카드 썸네일이 플레이스홀더로 보이는 것은 설계상 정상이며 개발 블로커 아님.
3. depth1 히어로 레코드에는 이미지 필드가 없음(정상) — `DevicesHero.tsx`에 이미지 바인딩 없음.
4. 이번 문서는 motor-control(카테고리 `L01`) 케이스만 확정. lv-automation/variable-frequency-drive는 같은 컴포넌트 구조가 아니라 `DevicesCategoryList.tsx`를 쓰므로 별도 문서(`category-data-lv2.md`)로 분리했다.
5. 이번 범위 제외(정적 유지): `DevicesMarkets`, `DevicesHelp`, `DevicesPageFooter`는 category-data 대응 필드 없음(별도 컴포넌트/slug 대상, 이번 문서 범위 아님).

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-16 | `DevicesHero.tsx`(`.devices_hero__inner`)에 `data-slug="category-data"` + `category.title`/`category.description` 단건 태깅, `DevicesProducts.tsx`(`.devices_products__grid`)에 `data-slug="category-data" data-slug-repeat`/`data-slug-item` + `device_systems.image`(attr src)/`category.title` 다건 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-16 | 히어로 where(`depth=1 AND code=L01`, motor-control 실측 확정) / 카드 where(`parentId=568` 또는 `code LIKE 'L01-%' AND depth=2`), orderBy `sortOrder ASC`, tie `id ASC` 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-16 | 작업 단위 문서 작성 (상태: 설계중). API 확인 결과 "확인 필요"로 명시 |
