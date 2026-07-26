# Main Image Popup 데이터 바인딩 설계

> 대상 파일: `fo/src/app/main/components/MainImagePopup.tsx`
> 상태: 설계중

## 1. data-slug
- 값: `popup-data` (bo `slug_registry` id=118, type=PAGE_DATA 기등록 — 사용자 확인. 신규 슬러그 아님)
- 다건 여부: 단건

## 2. data-slugkey 매핑

```html
<div className="main_image_popup__panel" role="dialog" data-slug="popup-data">
  <Link href={...} data-slugkey="popup.url" data-slugkey-attr="href">
    <!-- 태깅 완료(기존 코드) -->
    <img
      src={...}
      alt={mainImagePopupContent.imageAlt}
      data-slugkey="popup.image" data-slugkey-attr="src"
      <!-- alt는 정적 고정 텍스트 유지(사용자 확정) — popup.title 바인딩 없음 -->
    />
  </Link>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| popup.url | popup.url (flatten 후 root: url) | string(url) | 속성(`Link[href]`) | 팝업 클릭 시 이동 링크. `MainImagePopup.tsx`에 태깅 완료 |
| popup.image | popup.image[0] (파일id 배열, flatten 후 root: image) | number[] | 속성(`img[src]`) | `/api/v1/fo/page-files/{fileId}` 프록시로 렌더(`TrainingCard.tsx`/`DevicesProductHero.tsx`와 동일 기존 패턴 재사용, 신규 로직 아님). `MainImagePopup.tsx`에 태깅 완료 |
| ~~popup.title~~ | (바인딩 안 함) | — | — | **사용자 확정**: alt는 정적 고정 텍스트(`mainImagePopupContent.imageAlt`) 유지, title은 이번 스코프에서 바인딩하지 않음 |

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **기존 활용 가능**
- 참고 엔드포인트: `GET /api/v1/fo/page-data/popup-data?drs_popup.post_period=in_range&sort=createdAt,desc&size=1`
  - `FoPageDataController` → `PageDataService.search()` 재사용, BE 신규 코드 불필요.
  - 근거(코드 직접 확인): `PageDataService.java` 1554~1613행 — `drs_{rangeKey}` 접두사가 날짜범위(`before`/`in_range`/`after`)를 지원하며, `rangeKey`에 `.`(dot notation)이 있으면 `{경로}_from`/`{경로}_to`를 각각 탐색한다(예: `drs_popup.post_period` → `popup.post_period_from` <= today() AND `popup.post_period_to` >= today()). 이 패턴은 이미 `hero-data`(`fo/docs/dev/main/hero-data.md` 2.5절, `drs_post_period=in_range`)와 `banner-data`(`fo/docs/dev/main/banner-data-hero.md`)가 동일한 `post_period_from`/`post_period_to` 필드에 실제 사용 중인 선례다.
  - `sort=createdAt,desc`는 감사컬럼 매핑(`PageDataService.java` 2241/2252행, `createdAt` → `created_at`)으로 슬러그 무관 공통 지원되며, `size=1`은 기존 `LIMIT :size` 파라미터(227행)로 커버된다.
  - ⚠️ 위는 코드 근거로 확인한 것이며, **popup-data slug에 실제 레코드가 존재하는지, dataJson이 정말 `{"popup": {...}}` 구조로 저장되는지(사용자 제공 스펙 기준)는 라이브 데이터로 아직 확인되지 않았다.** STEP4(fo-be-analyzer)에서 실제 `page_data` 레코드를 조회해 재확인 필요.

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)
- where(필터 조건식, evalConditionExpr 문법): `popup.post_period_from<=today(),popup.post_period_to>=today()` — 게시기간 게이트(사용자 승인 완료). 실 구현은 3번의 `drs_popup.post_period=in_range` 파라미터로 대응
- row limit(단건 / 다건 개수): 단건(limit 1)
- orderBy(정렬 필드 + ASC/DESC): `createdAt DESC` — 최신 등록 1건 기준(사용자 확정 지시)
- 2차 정렬(tie-breaker — 1차 정렬값 동일 시 기준): `id DESC` — createdAt 동률 시 더 나중에 저장된(더 큰 id) 레코드를 "최신"으로 우선

## 5. 샘플 응답 데이터

> ⚠️ 아래는 사용자가 제공한 dataJson 구조 스펙을 바탕으로 구성한 **추정** 데이터이며, 실제 bo 레코드 값은 확인되지 않았다.

```json
{
  "content": [
    {
      "id": 999,
      "dataJson": {
        "popup": {
          "url": "/company/articles",
          "image": [1234],
          "title": "Grid-Forming Technology White Paper — New Release",
          "post_period_from": "20260701",
          "post_period_to": "20260731"
        }
      }
    }
  ]
}
```

flatten 후(추정):

```json
{
  "url": "/company/articles",
  "image": [1234],
  "title": "Grid-Forming Technology White Paper — New Release",
  "post_period_from": "20260701",
  "post_period_to": "20260731"
}
```

## 6. 비고
1. `popup-data`는 신규 슬러그가 아니라 bo `slug_registry`에 이미 등록된(id=118, type=PAGE_DATA) 슬러그다(사용자 확인). `MainImagePopup.tsx`에도 `data-slug="popup-data"`가 이미 태깅돼 있다.
2. **해결됨 — 한 요소(`<img>`) 다중 속성 바인딩 문법**: 기존 가이드/문서에 요소 하나당 `data-slugkey`+`data-slugkey-attr` 1쌍만 지원하는 선례뿐이라 새 문법을 신설하지 않기로 함. **사용자 확정**: `alt`는 `mainImagePopupContent.imageAlt` 정적 고정 텍스트로 유지하고, `popup.title`은 이번 스코프에서 바인딩하지 않는다(스크린리더용 alt는 실사용 노출 텍스트가 아니라는 판단).
3. 게시기간 where(`drs_` 패턴)는 hero-data/banner-data 실사용 선례와 `PageDataService.java` 코드로 실현 가능성을 확인했으나, popup-data 실제 레코드·필드 경로 실측은 아직 안 됐다(3번 API 확인 참고, STEP6 fo-be-analyzer에서 재확인).

## 7. 데이터 없음(빈 값/매칭 0건) 시 동작 — 필수 기재
- **확정(사용자 결정)**: 이 팝업은 리스트가 아니라 단건 레코드 자체가 곧 콘텐츠 전부라, `fo-data-binding-가이드.md` 5절의 "컨테이너 유지" 원칙(리스트형 전제)을 그대로 적용하지 않는다. **게시기간 매칭이 0건이면 팝업을 아예 렌더/오픈하지 않는다** (빈 팝업 노출 방지). FE 구현 시 `MainImagePopup`은 data-slug 조회 결과가 0건이면 `autoOpen` 자체를 트리거하지 않도록 처리한다.

## 8. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-26 | `MainImagePopup.tsx`에 `data-slug="popup-data"`, `popup.url`(Link href), `popup.image`(img src) 태깅 완료. `popup.title`(img alt)은 다중 속성 바인딩 문법 미확정으로 보류 |
| STEP2 | fo-slug-analyzer | 2026-07-26 | where(게시기간 `post_period_from<=today(),post_period_to>=today()`), row limit(단건 1), orderBy(createdAt DESC, 최신 등록 1건) 사용자 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-26 | 작업 단위 문서 작성(상태: 설계중). API 확인: 기존 활용 가능(코드 근거 확보). 이미지 alt 다중 바인딩 문법 및 0건 시 동작 2건을 "확인 필요"로 명시 |
| STEP3-확정 | (사용자) | 2026-07-26 | alt는 정적 유지(title 바인딩 안 함), 매칭 0건이면 팝업 자체를 열지 않음 — 2건 모두 확정 |
