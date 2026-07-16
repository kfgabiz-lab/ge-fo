# Banner Swiper 데이터 바인딩 설계

> 대상 파일: `fo/src/app/main/components/BannerSwiper.tsx`
> 상태: 개발완료(링크/텍스트 + 이미지 실데이터 연동)
> ⚠️ 2026-07-16: bo 빌더의 배너 데이터 스키마 key 리네이밍으로 현재 코드가 구 key를 참조 중 → 리네이밍 재작업 **설계(승인 대기)**. 상세는 아래 `2.5` 참고.

## 1. data-slug
- 값: `banner-data`
- 다건 여부: 다건(배열) — 메인 히어로 옆 사이드 배너

## 2. data-slugKey 매핑

```html
<Swiper data-slug="banner-data" data-slug-repeat="true">
  <SwiperSlide data-slug-item>
    <Link data-slugKey="url" data-slugKey-attr="href">
      <Image data-slugKey="image" data-slugKey-attr="src" />
      <p className="tit" data-slugKey="mainTitle"></p>
      <p className="txt" data-slugKey="subTitle"></p>
    </Link>
  </SwiperSlide>
</Swiper>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| url | url | string(url) | 속성(`Link[href]`) | 배너 클릭 링크 |
| image | image | string(url) | 속성(`Image[src]`) | 배너 이미지 |
| mainTitle | mainTitle | string | 텍스트(`p.tit`) | 표시용 대형 제목. 근거: title(제목, 관리용)과 별도로 mainTitle(타이틀, 표시용) 보유 |
| subTitle | subTitle | string | 텍스트(`p.txt`) | 보조 텍스트. 실데이터 확인 완료(2026-07-09) — id=1285에 subTitle="SUB TITLE TEST" 실값 존재 확인, 매핑 확정 |

## 2.5 스키마 리네이밍 재작업 (2026-07-16 — 승인 대기)

> 배경: bo 빌더에서 배너 데이터 템플릿(`banner-detail`)의 contentKey(래퍼)와 fieldKey가 리네이밍됐다. 현재 `page_data`(banner-data) 실데이터는 신 key로 저장돼 있으나, FE(`mainVisualData.ts` `fetchBannerItems`)와 위 2절 매핑표는 아직 구 key를 참조한다. 아래는 2026-07-16 DB 실측(page_data HERO 배너 id=1820~1822, page_template `banner-detail`의 contentKey/fieldKey)으로 확정한 구→신 매핑이다. **where(HERO·공개) 값·의미는 그대로이며 필드명만 바뀐다.**

| 구분 | 구 key (현재 소스/2절 표) | 신 key (2026-07-16 DB 실측) |
|---|---|---|
| 콘텐츠 래퍼(contentKey) | `bannerForm` | `banner` |
| 배너 링크(`url`) | `url` | `url` (불변) |
| 배너 이미지(`image`) | `image` | `image` (불변, 미디어ID 배열) |
| 표시 대형제목(`mainTitle`) | `mainTitle` | `banner_title` |
| 보조 텍스트(`subTitle`) | `subTitle` | `sub_title` |
| 정렬값(`sortOrder`) | `sortOrder` | `sort_order` |
| 공개여부(`isVisible`) | `isVisible` | `is_visible` |
| 배너위치(`bannerPosition`) | `bannerPosition` | `banner_position` |
| 정보정렬(`infoSort`) | `infoSort` | `infomation_sort` (DB 철자 그대로) |
| 관리 라벨 | `title` | `title` (불변, 화면 미표시) |
| 노출기간 | `postDate_from` / `postDate_to` | `post_period_from` / `post_period_to` |

- 신 조회 엔드포인트: `GET /api/v1/fo/page-data/banner-data?eq_banner_position=HERO&eq_is_visible=001&sort=banner.sort_order,asc&size=100`
  - where 값(`HERO`/`001`)·`size=100`·정렬 방향(ASC) 불변. `eq_` 파라미터 키명(bannerPosition→banner_position, isVisible→is_visible)과 sort 경로(bannerForm.sortOrder→banner.sort_order)만 신 스키마로 교체.
  - 래퍼 리네이밍(`bannerForm`→`banner`)은 `flattenPageDataItem`이 자동 처리. flatten 후 root 필드는 `url`/`image`/`banner_title`/`sub_title`/`sort_order`.
- 수정 위치: **FE 전용** — `fetchBannerItems`의 `row.mainTitle`/`row.subTitle`/`row.sortOrder` 참조부 + `eq_` 파라미터 + sort 경로. 범용 `PageDataService`(BE) 변경 불필요. `pickField(row, "banner_title", "mainTitle")` 등 공통 헬퍼 재사용 권장.
- 마크업(`BannerSwiper.tsx`의 `data-slug`/`data-slugKey`) annotation 정렬은 STEP5(FE 개발) 시 반영, 이번 재확인 범위 밖.

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **기존 활용 가능** (STEP4 확정, 2026-07-09)
- 참고 엔드포인트(구 스키마): `GET /api/v1/fo/page-data/banner-data?eq_bannerPosition=HERO&eq_isVisible=001&sort=bannerForm.sortOrder,asc&size=100` (`FoPageDataController` → `PageDataService.search()` 재사용, BE 신규 코드 없음)
- 리네이밍 후 엔드포인트(2026-07-16, 2.5 참고): `GET /api/v1/fo/page-data/banner-data?eq_banner_position=HERO&eq_is_visible=001&sort=banner.sort_order,asc&size=100`

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)
- where(필터 조건식, evalConditionExpr 문법): `bannerPosition=HERO,isVisible=001` — 배너 위치가 HERO이고 공개(001)인 항목만 조회 (comma-AND). 사용자 확정값
- row limit(단건 / 다건 개수): 다건 — 조건에 맞는 배너 전체(2026-07-09 재확인: HERO 2건 중 isVisible=001(공개)은 id=1289 1건뿐, id=1285는 isVisible=002(비공개)라 제외됨 — 현재 실제 노출 대상 1건)
- orderBy(정렬 필드 + ASC/DESC): sortOrder ASC
- 2차 정렬(tie-breaker — 1차 정렬값 동일 시 기준, 보통 id): id ASC

## 5. 샘플 응답 데이터

```json
{
  "content": [
    {
      "id": 1289,
      "dataJson": {
        "bannerForm": {
          "url": "...",
          "image": ["<미디어ID>"],
          "title": "...",
          "prefix": "...",
          "infoSort": "...",
          "sortOrder": "...",
          "isVisible": "001",
          "mainTitle": "...",
          "bottomText": "...",
          "postDate_to": "...",
          "postDate_from": "...",
          "bannerPosition": "HERO"
        }
      }
    },
    {
      "id": 1285,
      "dataJson": {
        "bannerForm": {
          "url": "...",
          "image": ["<미디어ID>"],
          "title": "...",
          "prefix": "...",
          "infoSort": "...",
          "sortOrder": "...",
          "isVisible": "001",
          "mainTitle": "...",
          "bottomText": "...",
          "postDate_to": "...",
          "postDate_from": "...",
          "bannerPosition": "HERO"
        }
      }
    }
  ]
}
```

flatten 후(예상 — 래퍼 `bannerForm` 처리 방식은 6.비고 참고):

```json
{
  "url": "...",
  "image": ["<미디어ID>"],
  "mainTitle": "...",
  "subTitle": "..."
}
```

> 확인 완료(2026-07-09): `subTitle` 필드는 실제 dataJson(bannerForm)에 존재함. id=1289는 빈 값(""), id=1285는 "SUB TITLE TEST" 실값 확인.

## 6. 비고
1) ✅ dataJson 최상위 `bannerForm` 래퍼 처리 — 해결됨. `fo/src/lib/pageData.ts`의 `flattenPageDataItem`(bo `utils.ts` 동명 함수 포팅)으로 처리한다. 섹션이 `bannerForm` 하나뿐이라 키 충돌 없이 `url`/`mainTitle`/`subTitle`/`sortOrder`/`image`가 root로 flat 병합된다.
2) image(이미지) 실데이터 연동 완료(2026-07-09, STEP5 추가):
   - `bannerForm.image`(미디어ID 배열)의 **첫 요소**만 대표 미디어ID(`BannerItem.mediaId`)로 사용. 여러 개 있어도 나머지는 이번 범위 밖.
   - `mediaId`가 있으면 이미지 src를 업로드 미디어 스트리밍 엔드포인트 `/api/v1/fo/page-files/{mediaId}`(fo 오리진 상대경로 → `next.config.ts` rewrites 로 bo-api:8080 프록시)로 사용. `next/image`가 `/_next/image?url=...`로 최적화(같은 오리진 상대경로라 remotePatterns 불필요).
   - `mediaId`가 없으면(null) 기존 정적 목업 이미지를 index 순환으로 유지.
   - 검증: SSR HTML에서 `_next/image?url=%2Fapi%2Fv1%2Ffo%2Fpage-files%2F233` 반영 확인. next/image 최적화 경로(200 image/png, 4880B)·프록시 원본 경로(200 image/png, 22484B) 모두 실제 이미지 응답 확인.
3) next/image의 src는 런타임에 최적화 URL/srcset로 변환됨 — 이미지 실연동은 위 2번대로 정상 동작 확인 완료.
4) subTitle vs bottomText: p.txt→subTitle 매핑, 2026-07-09 실데이터(id=1285 "SUB TITLE TEST")로 확정 완료. bottomText는 현재 미표시 추가 필드.
5) orderBy sortOrder ASC / tie-breaker id ASC 확정 완료(FE 후처리, `fetchBannerItems`).

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-08 | BannerSwiper.tsx에 data-slug="banner-data", data-slug-repeat, data-slug-item, data-slugKey(url/image/mainTitle/subTitle) 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-08 | where(bannerPosition=HERO, isVisible=001), orderBy(sortOrder ASC, tie-breaker id ASC), row limit(다건 전체) 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-08 | 작업 단위 문서 작성 (상태: 설계중), API 확인 결과 "확인 필요"로 명시 |
| 승인 | 사용자 | 2026-07-09 | subTitle 필드 실데이터로 확정 후 문서 승인 (상태: 승인됨) |
| STEP4 | fo-be-analyzer | 2026-07-09 | 기존 bo-api page-data 조회 API 재사용 확정(BE 신규 개발 없음). 엔드포인트: `GET /api/v1/fo/page-data/banner-data?eq_bannerPosition=HERO&eq_isVisible=001&sort=bannerForm.sortOrder,asc&size=100` |
| STEP5 | fo-fe-builder | 2026-07-09 | MainVisual(서버 컴포넌트)에서 banner-data 조회→bannerForm 언랩→FE 정렬(sortOrder ASC·id ASC tie-break)→BannerSwiper에 props 전달. url/mainTitle/subTitle 실데이터 바인딩. 이미지(image)는 목업 유지+TODO. 실데이터 2건(id=1285,1289) 다건 처리 확인. tsc 통과, SSR HTML 검증(TITLE TEST→hero test 순서) 완료 |
| STEP5(추가) | fo-fe-builder | 2026-07-09 | 이미지 실연동. `BannerItem.mediaId`(image[0]) 추가, mediaId 있으면 이미지 src=`/api/v1/fo/page-files/{mediaId}`(프록시), 없으면 목업 유지. tsc 통과, SSR HTML에 `_next/image?url=...page-files/233` 반영 확인, 미디어 응답 200 image/png 확인 |
| STEP6(리팩터) | 호출자 | 2026-07-14 | `fetchBannerItems`가 `bannerForm`을 직접 언랩하던 수동 코드를 `fo/src/lib/pageData.ts`의 `flattenPageDataItem` 사용으로 교체. tsc 통과, SSR HTML에서 mainTitle 값 회귀 없음 재확인 |
| STEP1(리네이밍 재확인) | fo-slug-analyzer | 2026-07-16 | bo `banner-detail` contentKey/fieldKey + page_data(HERO id=1820~1822) 실측으로 구→신 key 확정(2.5 표): 래퍼 `bannerForm`→`banner`, `mainTitle`→`banner_title`, `subTitle`→`sub_title`, `sortOrder`→`sort_order`, `isVisible`→`is_visible`, `bannerPosition`→`banner_position`, `infoSort`→`infomation_sort`, `postDate_from/to`→`post_period_from/to`. where 값(HERO/001)·orderBy·limit 불변(필드명만). 마크업 미변경 |
| STEP2(문서 갱신) | fo-dev-doc-writer | 2026-07-16 | `2.5` 리네이밍 재작업 매핑표·신 엔드포인트(`eq_banner_position`/`eq_is_visible`/`sort=banner.sort_order`) 반영. **승인 대기 — 승인 후 STEP3 이후 진행. 이 문서 상태: 리네이밍 설계중** |
