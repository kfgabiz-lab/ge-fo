# Devices Category List (LV2 카테고리 리스트) 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/()/products-systems/components/DevicesCategoryList.tsx` (`layout="stacked"`/`layout="split"` 공용 — 인트로 단건 + 하위 카테고리 카드 목록 다건)
> - 사용 페이지: `fo/src/app/()/products-systems/lv-automation/page.tsx`(`layout="stacked"`), `fo/src/app/()/products-systems/variable-frequency-drive/page.tsx`(`layout="split"`, 기본값)
> 상태: 설계중

## 1. data-slug
- 값: `category-data` (`category-data-lv1.md`와 동일 slug, 동일 필드 구조 — where의 depth1 코드 값만 페이지별로 다름)
- 다건 여부: 혼합 — 인트로(단건, depth1) + 하위 카테고리 카드 목록(다건, depth2). `layout` prop(stacked/split)은 순수 레이아웃(UI 배치)만 다르고 데이터 구조는 동일.

## 2. data-slugKey 매핑

```html
<!-- 인트로(단건, depth1) — stacked: .devices_category__header / split: .devices_category__intro-inner -->
<div className="devices_category__header" data-slug="category-data">
  <h1 className="devices_category__tit" data-slugKey="category.title">{intro.title}</h1>
  <p className="devices_category__desc" data-slugKey="category.description">{intro.description}</p>
</div>

<!-- 카드 목록(다건, depth2) — stacked: .devices_category__grid / split: .devices_category__list-inner -->
<div className="devices_category__grid" data-slug="category-data" data-slug-repeat="true">
  <div data-slug-item> <!-- stacked: CategoryProductCardStacked / split: CategoryProductCard -->
    <img data-slugKey="device_systems.image" data-slugKey-attr="src" />
    <h2 data-slugKey="category.title">...</h2>
    <p data-slugKey="category.description">...</p> <!-- CategoryList만 카드에 description 있음(lv1 카드에는 없음) -->
  </div>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| category.title (인트로, 단건) | category.title | string | 텍스트(`h1`, stacked `.devices_category__tit` / split `.devices_category__tit`) | LV2 상위 카테고리명 (depth1 레코드) |
| category.description (인트로, 단건) | category.description | string | 텍스트(`p.devices_category__desc`) | LV2 상위 카테고리 설명 (depth1 레코드) |
| device_systems.image (카드, 다건) | device_systems.image | array(파일ID) → string(url) | 속성(`img.src`) | 하위 카테고리 카드 썸네일. 파일ID 배열 → `/api/v1/fo/page-files/{id}` 프록시 변환. 실측 0건 입력(정상) |
| category.title (카드, 다건) | category.title | string | 텍스트(`h2.devices_category__item-tit`) | 하위 카테고리명 (depth2 레코드) |
| category.description (카드, 다건) | category.description | string | 텍스트(`p.devices_category__item-desc`) | 하위 카테고리 설명 (depth2 레코드) — lv1의 카드(`DevicesProducts.tsx`)에는 없는 필드로, `DevicesCategoryList` 카드에만 존재 |

> `intro.parentLabel`/`intro.parentHref`(브레드크럼)와 카드의 `href`(View Detail 링크)는 정적 라우팅/네비게이션 값이며 category-data 대응 필드 없음(정적 유지, 태그 없음).

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **확인 필요** (STEP4 `fo-be-analyzer`에서 최종 판단, `category-data-lv1.md`와 동일 slug이므로 결론도 동일할 가능성이 높으나 별도 확인)
- (기존 활용 가능 시) 참고 엔드포인트: `GET /api/v1/fo/page-data/category-data` — `category-data-lv1.md`와 동일 엔드포인트 재사용 예상, where 값(부모 코드)만 페이지별로 다름
- (신규 필요 시) 제안 엔드포인트: -

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)

### 인트로 (단건, depth1)
- where: `category.depth=1 AND category.code={페이지 카테고리코드}` — **lv-automation/variable-frequency-drive 페이지가 어느 category.code에 매핑되는지는 확인 필요**(motor-control=`L01`만 실측 확정, 이 두 페이지는 미확정)
- row limit: 단건(1건)
- orderBy: 없음
- 2차 정렬(tie-breaker): 불필요

### 카드 목록 (다건, depth2)
- where: `category.parentId={상위 depth1 rowId}` 또는 `category.code LIKE '{부모코드}-%' AND category.depth=2` — 부모코드가 확인 필요 상태이므로 카드 where도 함께 미확정
- row limit: 다건(페이지별 하위 카테고리 개수, 상한 없이 조회)
- orderBy: `sortOrder ASC`
- 2차 정렬(tie-breaker): `id ASC`

## 5. 샘플 응답 데이터

> 부모 category.code가 미확정이라 아래는 구조만 보여주는 **추정** 예시(실제 code 값 아님).

```json
{
  "content": [
    {
      "id": 900,
      "dataJson": {
        "category": {
          "depth": 1,
          "code": "TODO-확인필요",
          "title": "LV Automation",
          "description": "인트로 설명 예시"
        }
      }
    },
    {
      "id": 901,
      "dataJson": {
        "category": {
          "depth": 2,
          "code": "TODO-확인필요-01",
          "parentId": 900,
          "title": "하위 카테고리명 예시",
          "description": "하위 카테고리 설명 예시",
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
1. **미해결 확인 필요** — lv-automation / variable-frequency-drive 페이지가 어느 `category.code`에 매핑되는지 미확정(motor-control=`L01`만 실측 확정). bo 카테고리 관리 화면 또는 DB 직접 조회로 확인 필요. 확인 전까지 이 문서의 where 값은 채울 수 없음.
2. `category-data` slug의 bo SlugRegistry 등록 여부 — **확인 필요**(`category-data-lv1.md`와 공통 항목, 중복 확인 불필요 — 한 번만 확인하면 됨).
3. `device_systems.image` 현재 실측 미입력(0건) — 정상, 개발 블로커 아님.
4. `layout="stacked"`(lv-automation) / `layout="split"`(variable-frequency-drive, 기본값)는 UI 배치 차이일 뿐 데이터 구조(slugKey)는 완전히 동일함을 확인함.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-16 | `DevicesCategoryList.tsx`의 stacked/split 두 레이아웃 모두에 인트로(`.devices_category__header`/`.devices_category__intro-inner`) 단건 태깅(`category.title`/`category.description`), 카드 목록(`.devices_category__grid`/`.devices_category__list-inner`) 다건 태깅(`device_systems.image` attr src, `category.title`, `category.description`) 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-16 | where 구조(인트로 depth1+code, 카드 parentId/code LIKE+depth2), orderBy `sortOrder ASC`, tie `id ASC` 확정. 단, lv-automation/variable-frequency-drive의 실제 category.code 값은 미확인 상태로 "확인 필요" 표시 |
| STEP3 | fo-dev-doc-writer | 2026-07-16 | 작업 단위 문서 작성 (상태: 설계중). API 확인 "확인 필요", category.code 매핑 미해결 항목 명시 |
