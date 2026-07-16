# Video Swiper 데이터 바인딩 설계

> 대상 파일: `fo/src/app/main/components/VideoSwiper.tsx`
> 상태: 개발완료(텍스트/링크 + 미디어(이미지) 실데이터 연동) — 영상/유튜브 미디어는 범위 밖(비고 6-6 참고)
> ⚠️ 2026-07-16: bo 빌더의 Hero 데이터 스키마 key 리네이밍으로 현재 코드가 구 key를 참조 중 → 리네이밍 재작업 **설계(승인 대기)**. 상세는 아래 `2.5` 참고.

## 1. data-slug
- 값: `hero-data`
- 다건 여부: 다건(배열) — 히어로 슬라이드 전체

## 2. data-slugkey 매핑

```html
<Swiper data-slug="hero-data" data-slug-repeat="true">
  <SwiperSlide data-slug-item>
    <h2 className="sl_subtit" data-slugkey="sub"></h2>
    <h2 className="sl_tit" data-slugkey="titleText"></h2>
    <a data-slugkey="btnUrl" data-slugkey-attr="href">
      <span data-slugkey="btnText"></span>
    </a>
  </SwiperSlide>
</Swiper>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| sub | sub | string | 텍스트(`h2.sl_subtit`) | 서브타이틀 |
| titleText | titleText | string | 텍스트(`h2.sl_tit`) | 타이틀 텍스트(화면 표시 대형 제목). 실데이터 확인 완료(2026-07-09) — titleText="타이틀1/2/3"(화면 표시용), title="히어로1"/"qeqweqw"/"hero1"(관리자 화면용 로우 식별 라벨, 화면 미표시). 매핑 확정 |
| btnUrl | btnUrl | string(url) | 속성(`a[href]`) | 버튼 링크 |
| btnText | btnText | string | 텍스트(`a` 내부 `span`) | 버튼 라벨 |

## 2.5 스키마 리네이밍 재작업 (2026-07-16 — 승인 대기)

> 배경: bo 빌더에서 Hero 데이터 템플릿(`hero-detail`)의 contentKey(래퍼)와 fieldKey가 리네이밍됐다. 현재 `page_data`(hero-data) 실데이터는 신 key로 저장돼 있으나, FE(`mainVisualData.ts`)와 위 2절 매핑표는 아직 구 key를 참조한다. 아래는 2026-07-16 DB 실측(page_data id=1812, page_template `hero-detail`의 contentKey/fieldKey)으로 확정한 구→신 매핑이다. **조회 조건(where/orderBy/limit)의 의미·값은 그대로이며 필드명만 바뀐다(조회조건 재설계 아님).**

| 구분 | 구 key (현재 소스/2절 표) | 신 key (2026-07-16 DB 실측) |
|---|---|---|
| 콘텐츠 래퍼(contentKey) | `heroForm` | `hero` |
| 서브타이틀(`sub`) | `sub` | `sub_title` |
| 타이틀(`titleText`) | `titleText` | `hero_title` |
| 버튼 링크(`btnUrl`) | `btnUrl` | `button_url` |
| 버튼 라벨(`btnText`) | `btnText` | `button_text` |
| 정렬값(`orderNo`) | `orderNo` | `sort_order` |
| 노출기간 | `postDate_from` / `postDate_to` | `post_period_from` / `post_period_to` |
| 대표 미디어 | `content` | `content` (불변, 미디어ID 배열) |
| 관리 라벨 | `title` | `title` (불변, 화면 미표시) |

- 신 조회 엔드포인트: `GET /api/v1/fo/page-data/hero-data?drs_post_period=in_range&sort=hero.sort_order,asc&size=100`
  - `drs_` 날짜범위 연산자는 rangeKey에 `_from`/`_to`를 붙여 탐색한다(`PageDataService.appendWhereConditions`). rangeKey를 `postDate`→`post_period`로 바꾸면 `post_period_from`/`post_period_to`를 조회한다. `in_range` 연산자·`size=100`·정렬 방향(ASC) 불변.
  - 래퍼 리네이밍(`heroForm`→`hero`)은 `flattenPageDataItem`이 콘텐츠 키 이름에 무관하게 단일 섹션을 root로 평탄화하므로 추가 작업 불필요. flatten 후 root 필드는 `sub_title`/`hero_title`/`button_url`/`button_text`/`sort_order`/`content`.
- 수정 위치: **FE 전용** — `fo/src/app/main/components/mainVisualData.ts`의 `row.sub`/`row.titleText`/`row.btnUrl`/`row.btnText`/`row.orderNo` 참조부 + 쿼리 파라미터(`drs_postDate`/`sort=heroForm.orderNo`). 범용 `PageDataService`는 JSONB 동적검색이라 BE 변경 불필요. 신·구 데이터 혼재 대비로 `pickField(row, "hero_title", "titleText")` 공통 헬퍼(`fo/src/lib/pageData.ts`) 재사용 권장.
- 마크업(`VideoSwiper.tsx`의 `data-slug`/`data-slugKey` 태깅)은 이번 재확인 범위에서 건드리지 않음 — annotation 정렬은 STEP5(FE 개발) 시 반영.

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **기존 활용 가능** (STEP4 확정, 2026-07-09)
- 참고 엔드포인트(구 스키마): `GET /api/v1/fo/page-data/hero-data?drs_postDate=in_range&sort=heroForm.orderNo,asc&size=100` (`FoPageDataController` → `PageDataService.search()` 재사용, BE 신규 코드 없음)
- 리네이밍 후 엔드포인트(2026-07-16, 2.5 참고): `GET /api/v1/fo/page-data/hero-data?drs_post_period=in_range&sort=hero.sort_order,asc&size=100` — 엔드포인트/재사용 구조 동일, 파라미터 필드명만 신 스키마로 교체
- 정렬 정밀도 제약: orderNo가 문자열 정렬이라 "10"<"2" 오정렬·빈값 처리를 BE가 못 함 → FE(`fetchHeroItems`)에서 orderNo 숫자 캐스팅 후 빈값/비숫자는 맨 뒤로 정렬, id ASC tie-break 후처리로 보완(STEP5 반영 완료)

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)
- where(필터 조건식, evalConditionExpr 문법): `postDate_from<=today(),postDate_to>=today()` — 노출기간(postDate_from/postDate_to) 내 항목만 조회 (comma-AND, today() 함수)
- row limit(단건 / 다건 개수): 다건 — 조건에 맞는 슬라이드 전체
- orderBy(정렬 필드 + ASC/DESC): orderNo ASC
- 2차 정렬(tie-breaker — 1차 정렬값 동일 시 기준, 보통 id): id ASC

## 5. 샘플 응답 데이터

```json
{
  "content": [
    {
      "id": 1257,
      "dataJson": {
        "heroForm": {
          "sub": "",
          "title": "...",
          "btnUrl": "",
          "btnText": "...",
          "content": ["<미디어ID>"],
          "default": "-",
          "orderNo": "",
          "titleText": "...",
          "postDate_to": "...",
          "postDate_from": "..."
        }
      }
    },
    {
      "id": 1295,
      "dataJson": {
        "heroForm": {
          "sub": "...",
          "title": "...",
          "btnUrl": "...",
          "btnText": "...",
          "content": ["<미디어ID>"],
          "default": "-",
          "orderNo": "...",
          "titleText": "...",
          "postDate_to": "...",
          "postDate_from": "..."
        }
      }
    }
  ]
}
```

flatten 후(예상 — 래퍼 `heroForm` 처리 방식은 6.비고 참고):

```json
{
  "sub": "",
  "titleText": "...",
  "btnUrl": "",
  "btnText": "..."
}
```

## 6. 비고
1) 미디어 필드: `hero-data`의 `content`(media 타입, 미디어ID 배열)를 실 이미지로 연동 완료(2026-07-09, STEP5 추가 반영). 상세는 아래 6번 참고.
2) title vs titleText: sl_tit→titleText 매핑, 2026-07-09 실데이터 대조로 확정 완료 (titleText="타이틀1/2/3" 화면 표시, title은 관리자 라벨).
3) ✅ dataJson 최상위 `heroForm` 래퍼 처리 — 해결됨. `fo/src/lib/pageData.ts`의 `flattenPageDataItem`(bo `utils.ts` 동명 함수 포팅)으로 처리한다. 섹션이 `heroForm` 하나뿐이라 키 충돌 없이 `sub`/`titleText`/`btnUrl`/`btnText`/`orderNo`/`content`가 root로 flat 병합된다.
4) orderNo 빈 문자열("") 실데이터 존재 — 정렬 시 빈 값 처리 방법(맨 뒤 배치 등) 확인 필요.
5) 버튼 라벨 span 래핑으로 인한 `.btn-base` 스타일 영향 가능성(렌더 확인 권장).
6) 미디어(이미지) 실데이터 연동 완료(2026-07-09, STEP5 추가):
   - `heroForm.content`(미디어ID 배열)의 **첫 요소**만 대표 미디어ID(`HeroItem.mediaId`)로 사용. 배열에 여러 개 있어도 나머지는 이번 범위 밖(갤러리 등 UI 미구현).
   - `mediaId`가 있으면 해당 슬라이드를 **이미지 타입으로 강제**하고 src를 업로드 미디어 스트리밍 엔드포인트 `/api/v1/fo/page-files/{mediaId}`(fo 오리진 상대경로 → `next.config.ts` rewrites 로 bo-api:8080 프록시)로 설정. `next/image`가 `/_next/image?url=...`로 최적화(같은 오리진 상대경로라 remotePatterns 불필요).
   - `mediaId`가 없으면(null) 기존 정적 목업(`mainSlides`)을 index 순환으로 유지.
   - **영상/유튜브 미처리 제약**: 실제 파일이 이미지인지 영상인지 mime_type으로 판단하기 어려워, `content`에 미디어ID가 있으면 우선 **이미지로만** 렌더링한다. 원래 목업이 video/youtube 타입이던 슬라이드도 실데이터 mediaId가 있으면 이미지로 대체됨. 영상 파일 대응(video/youtube 렌더링)은 이번 범위 밖 — 별도 추가 작업 필요.
   - 검증: SSR HTML에서 `_next/image?url=%2Fapi%2Fv1%2Ffo%2Fpage-files%2F{234 등}` 반영 확인. next/image 최적화 경로(200 image/png)·프록시 원본 경로(200 image/png) 모두 실제 이미지 응답 확인.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-08 | VideoSwiper.tsx에 data-slug="hero-data", data-slug-repeat, data-slug-item, data-slugkey(sub/titleText/btnUrl/btnText) 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-08 | where(노출기간 postDate_from/postDate_to), orderBy(orderNo ASC, tie-breaker id ASC), row limit(다건 전체) 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-08 | 작업 단위 문서 작성 (상태: 설계중), API 확인 결과 "확인 필요"로 명시 |
| 승인 | 사용자 | 2026-07-09 | titleText 매핑 실데이터로 확정 후 문서 승인 (상태: 승인됨) |
| STEP4 | fo-be-analyzer | 2026-07-09 | 기존 bo-api page-data 조회 API 재사용 확정(BE 신규 개발 없음). 엔드포인트: `GET /api/v1/fo/page-data/hero-data?drs_postDate=in_range&sort=heroForm.orderNo,asc&size=100` |
| STEP5 | fo-fe-builder | 2026-07-09 | fetchApi 공통함수(src/lib/api.ts) 신규 생성. MainVisual(서버 컴포넌트)에서 hero-data 조회→heroForm 언랩→FE 정렬(orderNo 숫자ASC·빈값 뒤·id ASC tie-break)→VideoSwiper에 props 전달. sub/titleText/btnUrl/btnText 실데이터 바인딩. 미디어(content)는 목업 유지+TODO. tsc 통과, SSR HTML 검증(타이틀1/2/3 순서·btnUrl 반영) 완료 |
| STEP5(추가) | fo-fe-builder | 2026-07-09 | 미디어(이미지) 실연동. `HeroItem.mediaId`(content[0]) 추가, mediaId 있으면 슬라이드를 이미지 타입으로 강제하고 src=`/api/v1/fo/page-files/{mediaId}`(프록시). 영상/유튜브는 미처리(비고 6-6). tsc 통과, SSR HTML에 `_next/image?url=...page-files/234,236,237,238` 반영 확인, 미디어 응답 200 image/png 확인 |
| STEP6(리팩터) | 호출자 | 2026-07-14 | `fetchHeroItems`가 `heroForm`을 직접 언랩하던 수동 코드를 `fo/src/lib/pageData.ts`의 `flattenPageDataItem`(bo와 동일 accessor 규칙) 사용으로 교체. tsc 통과, SSR HTML에서 titleText="타이틀1/2/3" 회귀 없음 재확인 |
| STEP1(리네이밍 재확인) | fo-slug-analyzer | 2026-07-16 | bo `hero-detail` contentKey/fieldKey + page_data(id=1812) 실측으로 구→신 key 확정(2.5 표): 래퍼 `heroForm`→`hero`, `sub`→`sub_title`, `titleText`→`hero_title`, `btnUrl`→`button_url`, `btnText`→`button_text`, `orderNo`→`sort_order`, `postDate_from/to`→`post_period_from/to`. where/orderBy/limit 값·의미 불변(필드명만). 마크업 미변경 |
| STEP2(문서 갱신) | fo-dev-doc-writer | 2026-07-16 | `2.5` 리네이밍 재작업 매핑표·신 엔드포인트(`drs_post_period`, `sort=hero.sort_order`) 반영. **승인 대기 — 사용자 승인 후 STEP3(BE 분석) 이후 진행. 이 문서 상태: 리네이밍 설계중** |
