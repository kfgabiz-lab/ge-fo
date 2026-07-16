# Main Cards 데이터 바인딩 설계

> 대상 파일: `fo/src/components/main/main-cards.tsx`
> 상태: 예시 (실제 작업용 아님 — `fo-data-binding-가이드.md`의 다건(배열) 마크업 규칙을 보여주기 위한 샘플)

## 1. data-slug
- 값: `main-industries` (신규 지정 — 기존 등록된 slug 없음)
- 다건 여부: 다건(배열) — 산업분야 카드 6개 (Data Center / Power Grid / Oil & Gas / Public Infrastructure / Industrial / Commercial-Residential)

## 2. data-slugkey 매핑

```html
<div data-slug="main-industries" data-slug-repeat="true">
  <div data-slug-item>
    <img data-slugkey="icon" />
    <div data-slugkey="title"></div>
    <div data-slugkey="description"></div>
    <a data-slugkey="linkUrl"></a>
  </div>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 설명 |
|---|---|---|---|
| icon | icon | string(url) | 카드 아이콘 이미지 |
| title | title | string | 산업분야명 (예: Data Center) |
| description | description | string | 카드 설명 문구 |
| linkUrl | linkUrl | string(url) | 클릭 시 이동할 markets 페이지 경로 |

## 3. API 확인 (최종 체크)
- 신규 API 필요 여부: **신규 필요**
- 제안 엔드포인트: `/api/v1/fo/page-data/main-industries` — bo 홈페이지관리에 `main-industries` slug를 신규 등록(`SlugRegistry` + PageData)하고, fo 공개용 컨트롤러 라우트 신규 추가 필요

## 4. 조회 조건
- where: 없음 (전체 카드 노출, 노출순서는 dataJson 내 정렬 필드 또는 등록순)
- row limit: 다건 — 등록된 카드 전체 (현재 6개, 향후 추가 가능성 고려해 상한 없이 조회)

## 5. 샘플 응답 데이터

```json
{
  "content": [
    {
      "id": 1,
      "dataJson": {
        "icon": "/img/main/icon-datacenter.svg",
        "title": "Data Center",
        "description": "Reliable power infrastructure for mission-critical facilities.",
        "linkUrl": "/markets/data-center"
      }
    },
    {
      "id": 2,
      "dataJson": {
        "icon": "/img/main/icon-powergrid.svg",
        "title": "Power Grid",
        "description": "Smart grid solutions for stable energy transmission.",
        "linkUrl": "/markets/power-grid"
      }
    }
  ]
}
```

## 6. 비고
- 이 문서는 예시입니다. `main-industries`라는 slug명·필드명은 실제 작업 시 다시 정해야 함.
- 다건 마크업 규칙 참고용 예시로만 사용 — `data-slug-repeat`(바깥 컨테이너) + `data-slug-item`(반복 아이템) 조합 확인용.
