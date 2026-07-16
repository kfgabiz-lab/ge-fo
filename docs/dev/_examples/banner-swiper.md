# Banner Swiper 데이터 바인딩 설계

> 대상 파일: `fo/src/components/main/banner-swiper.tsx`
> 상태: 예시 (실제 작업용 아님 — `fo-data-binding-가이드.md`의 템플릿 사용법을 보여주기 위한 샘플)

## 1. data-slug
- 값: `banner-data` (`fo-data-binding.md`의 "Banner Swiper" 행에 이미 지정되어 있음)
- 다건 여부: 다건(배열) — 배너 슬라이드 여러 장

## 2. data-slugkey 매핑

```html
<div data-slug="banner-data" data-slug-repeat="true">
  <div data-slug-item>
    <img data-slugkey="image" />
    <div data-slugkey="title"></div>
    <a data-slugkey="linkUrl"></a>
  </div>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 설명 |
|---|---|---|---|
| image | image | string(url) | 배너 이미지 경로 |
| title | title | string | 배너 제목 |
| linkUrl | linkUrl | string(url) | 클릭 시 이동 링크 |

## 3. API 확인 (최종 체크)
- 신규 API 필요 여부: **기존 활용 가능**
- 참고 엔드포인트: `banner-data` slug는 bo 홈페이지관리에서 이미 운영 중인 PageData로 가정 — `bo-api`의 `PageDataService` 조회 로직을 그대로 재사용하고, fo 공개용 컨트롤러 라우트(`/api/v1/fo/page-data/{slug}`)만 추가하면 됨. 완전 신규 서비스 로직 불필요.

## 4. 조회 조건
- where: 없음 (전체 배너 노출)
- row limit: 다건 — 등록된 배너 전체

## 5. 샘플 응답 데이터

```json
{
  "content": [
    {
      "id": 1,
      "dataJson": {
        "image": "/img/main/banner-01.jpg",
        "title": "New Product Launch",
        "linkUrl": "/products-systems/motor-control/h100_plus"
      }
    },
    {
      "id": 2,
      "dataJson": {
        "image": "/img/main/banner-02.jpg",
        "title": "ESG Report 2026",
        "linkUrl": "/company/esg"
      }
    }
  ]
}
```

## 6. 비고
- 이 문서는 예시입니다. 실제 `banner-data` slug가 bo에 등록되어 있는지, dataJson 필드명이 실제로 `image`/`title`/`linkUrl`인지는 실제 작업 시 bo 쪽에서 반드시 확인 필요.
