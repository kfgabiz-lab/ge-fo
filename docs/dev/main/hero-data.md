# Video Swiper 데이터 바인딩 설계

> 대상 파일: `fo/src/app/main/components/VideoSwiper.tsx`
> 상태: 개발완료(텍스트/링크 + 미디어(이미지) 실데이터 연동) — 영상/유튜브 미디어는 범위 밖(비고 6-6 참고)

## 1. data-slug
- 값: `hero-data`
- 다건 여부: 다건(배열) — 히어로 슬라이드 전체

## 2. data-slugKey 매핑

```html
<Swiper data-slug="hero-data" data-slug-repeat="true">
  <SwiperSlide data-slug-item>
    <h2 className="sl_subtit" data-slugKey="sub"></h2>
    <h2 className="sl_tit" data-slugKey="titleText"></h2>
    <a data-slugKey="btnUrl" data-slugKey-attr="href">
      <span data-slugKey="btnText"></span>
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

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **기존 활용 가능** (STEP4 확정, 2026-07-09)
- 참고 엔드포인트: `GET /api/v1/fo/page-data/hero-data?drs_postDate=in_range&sort=heroForm.orderNo,asc&size=100` (`FoPageDataController` → `PageDataService.search()` 재사용, BE 신규 코드 없음)
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
| STEP1 | fo-slug-analyzer | 2026-07-08 | VideoSwiper.tsx에 data-slug="hero-data", data-slug-repeat, data-slug-item, data-slugKey(sub/titleText/btnUrl/btnText) 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-08 | where(노출기간 postDate_from/postDate_to), orderBy(orderNo ASC, tie-breaker id ASC), row limit(다건 전체) 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-08 | 작업 단위 문서 작성 (상태: 설계중), API 확인 결과 "확인 필요"로 명시 |
| 승인 | 사용자 | 2026-07-09 | titleText 매핑 실데이터로 확정 후 문서 승인 (상태: 승인됨) |
| STEP4 | fo-be-analyzer | 2026-07-09 | 기존 bo-api page-data 조회 API 재사용 확정(BE 신규 개발 없음). 엔드포인트: `GET /api/v1/fo/page-data/hero-data?drs_postDate=in_range&sort=heroForm.orderNo,asc&size=100` |
| STEP5 | fo-fe-builder | 2026-07-09 | fetchApi 공통함수(src/lib/api.ts) 신규 생성. MainVisual(서버 컴포넌트)에서 hero-data 조회→heroForm 언랩→FE 정렬(orderNo 숫자ASC·빈값 뒤·id ASC tie-break)→VideoSwiper에 props 전달. sub/titleText/btnUrl/btnText 실데이터 바인딩. 미디어(content)는 목업 유지+TODO. tsc 통과, SSR HTML 검증(타이틀1/2/3 순서·btnUrl 반영) 완료 |
| STEP5(추가) | fo-fe-builder | 2026-07-09 | 미디어(이미지) 실연동. `HeroItem.mediaId`(content[0]) 추가, mediaId 있으면 슬라이드를 이미지 타입으로 강제하고 src=`/api/v1/fo/page-files/{mediaId}`(프록시). 영상/유튜브는 미처리(비고 6-6). tsc 통과, SSR HTML에 `_next/image?url=...page-files/234,236,237,238` 반영 확인, 미디어 응답 200 image/png 확인 |
| STEP6(리팩터) | 호출자 | 2026-07-14 | `fetchHeroItems`가 `heroForm`을 직접 언랩하던 수동 코드를 `fo/src/lib/pageData.ts`의 `flattenPageDataItem`(bo와 동일 accessor 규칙) 사용으로 교체. tsc 통과, SSR HTML에서 titleText="타이틀1/2/3" 회귀 없음 재확인 |
