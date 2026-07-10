# Main Notic(공지) 데이터 바인딩 설계

> 대상 파일: `fo/src/app/main/components/MainVisual.tsx` (`<section className="main_notic">` 블록)
> 상태: 개발완료 — 단, prefix 라벨 표시는 테스트데이터 재저장 필요(6.비고 2 참고, 코드 문제 아님)

## 1. data-slug
- 값: `banner-data` (기존 확정값 재사용 — HERO 배너와 동일 slug, where 조건으로 INFORMATION 위치만 구분)
- 다건 여부: 단건 — 조건 매칭 다건을 orderBy+limit=1로 좁혀 최신 1건만 노출

## 2. data-slugKey 매핑

```html
<a href="" className="item"
   data-slug="banner-data"
   data-slugKey="url" data-slugKey-attr="href">
  <div className="tit_area">
    <p className="tit">
      <img src="/ico/ico_bell_20.svg" alt="" aria-hidden="true" />
      <span data-slugKey="prefix">Exhibition</span>
    </p>
    <p className="txt" data-slugKey="bottomText">Triple iF Design 2026 ...</p>
  </div>
  <div className="btn_area"> ...(More 버튼, 고정 UI)... </div>
</a>
```

| slugKey | dataJson 필드(flatten 기준, bannerForm 언랩) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| url | url | string(url) | 속성(`a[href]`) | 공지 클릭 링크 |
| prefix | prefix | string(code) | 텍스트(`span`, 벨 아이콘 옆 카테고리 라벨) | select. 코드그룹 `BANNER_PREFIX`(001=뉴스레터, 002=Power). **코드값이 그대로 저장되므로 화면 표시는 코드→라벨 변환 필요(STEP5 FE 처리)** |
| bottomText | bottomText | string | 텍스트(`p.txt`) | 공지 본문 텍스트 |

(벨 아이콘 `ico_bell_20.svg`, More 라벨/화살표는 고정 UI로 미태깅)

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **기존 활용 가능 + 신규 1건(코드 라벨 변환)** (STEP4 확정, 2026-07-09)
- 공지 조회 엔드포인트: `GET /api/v1/fo/page-data/banner-data?eq_bannerPosition=INFORMATION&eq_isVisible=001&sort=updatedAt,desc&size=1` (HERO 배너와 동일 엔드포인트 재사용, where/sort 파라미터만 상이. `updatedAt`은 dataJson 경로가 아니라 PageData 테이블 실컬럼(`updated_at`)으로 정렬됨을 코드로 확인함. tie-breaker(id DESC)는 `PageDataService`가 단일 정렬만 지원해 BE 미지원 — 동시각 중복 확률이 극히 낮아 updatedAt 단일 정렬로 진행 확정, 신규 BE 보류)
- prefix 코드→라벨 변환 엔드포인트(신규): `GET /api/v1/fo/codes/{groupCode}` (`FoCodeController`, `BANNER_PREFIX` 호출 시 `[{code:"001",name:"뉴스레터"},{code:"002",name:"Power"}]` 반환 확인). 기존 `CodeDetail`/`CodeGroup` 엔티티·리포지토리 재사용, 신규는 공개 컨트롤러 1개 + 리포지토리 메서드 1개뿐. 이후 다른 select 필드 코드 변환에도 재사용 가능.

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)
- where(필터 조건식, evalConditionExpr 문법): `bannerPosition=INFORMATION,isVisible=001` — 배너 위치가 INFORMATION이고 공개(001)인 항목만 조회 (comma-AND). 사용자 확정값
- row limit(단건 / 다건 개수): 단건(1) — 조건에 맞는 다건 중 orderBy+limit=1로 최신 1건만 조회
- orderBy(정렬 필드 + ASC/DESC): updatedAt DESC (최신 1건 노출)
- 2차 정렬(tie-breaker — 1차 정렬값 동일 시 기준, 보통 id): id DESC

## 5. 샘플 응답 데이터

```json
{
  "content": [
    {
      "id": 1330,
      "dataJson": {
        "bannerForm": {
          "url": "...",
          "image": ["<미디어ID>"],
          "title": "...",
          "prefix": "1",
          "infoSort": "...",
          "sortOrder": "...",
          "isVisible": "001",
          "mainTitle": "...",
          "bottomText": "Triple iF Design 2026 ...",
          "postDate_to": "...",
          "postDate_from": "...",
          "bannerPosition": "INFORMATION"
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
  "prefix": "1",
  "bottomText": "Triple iF Design 2026 ..."
}
```

> 참고(기존 테스트데이터, id=1330): prefix 값이 "1"로 저장되어 있어 코드그룹 `BANNER_PREFIX`의 코드값 "001"과 정확히 일치하지 않음 — 6.비고 참고.

## 6. 비고
1) prefix 필드는 코드값(001/002)이 그대로 저장되므로, 화면에 라벨(뉴스레터/Power)을 표시하려면 STEP5(FE)에서 코드그룹 `BANNER_PREFIX` 코드→라벨 변환이 필요하다.
2) 기존 테스트데이터(id=1330)의 prefix 값이 "1"로 저장돼 있어 코드 "001"과 정확히 일치하지 않으므로, 코드→라벨 변환이 정상 동작하려면 데이터 재저장(prefix="001" 등)이 필요할 수 있다.
3) dataJson 최상위가 `bannerForm`으로 래핑 — flatten 시 래퍼 처리 방식은 HERO 배너(`banner-data-hero.md`)와 동일하게 처리 필요.
4) 벨 아이콘(`ico_bell_20.svg`)과 More 버튼(라벨/화살표)은 고정 UI로 slugKey 미부여.
5) 단건 노출 구조 — 다건 API 응답에서 조건에 맞는 여러 건 중 orderBy(updatedAt DESC) + limit=1로 좁혀 최신 1건만 화면에 바인딩.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-09 | MainVisual.tsx main_notic 블록에 data-slug="banner-data", data-slugKey(url[href]/prefix/bottomText) 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-09 | where(bannerPosition=INFORMATION, isVisible=001), orderBy(updatedAt DESC, tie-breaker id DESC), row limit(단건 1) 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-09 | 작업 단위 문서 작성 (상태: 설계중), API 확인 "확인 필요" 명시 |
| 승인 | 사용자 | 2026-07-09 | 문서 승인 (상태: 승인됨) |
| STEP4 | fo-be-analyzer | 2026-07-09 | 공지 조회는 HERO와 동일 엔드포인트 재사용 확정(where/sort만 변경). tie-breaker(id DESC)는 BE 단일 정렬 한계로 미지원 판단, 사용자가 updatedAt 단일 정렬로 확정. prefix 코드→라벨 변환은 기존 FO 공개 코드 API 부재 확인 → 신규 `GET /api/v1/fo/codes/{groupCode}` 설계(기존 CodeDetail/CodeGroup 재사용) |
| STEP5 | fo-be-builder | 2026-07-09 | `FoCodeController`, `FoCodeResponse` 신규 + `CodeDetailRepository`/`CodeService`에 목록 조회 메서드 각 1개 추가. `./gradlew compileJava` 성공. bo-api 재기동 후 curl 검증: `GET /api/v1/fo/codes/BANNER_PREFIX` → `[{"code":"001","name":"뉴스레터"},{"code":"002","name":"Power"}]` 정상 확인 |
| STEP6 | fo-fe-builder | 2026-07-09 | FE 연동 완료. `mainVisualData.ts`에 `fetchNoticeItem()` 추가(공지 배너 최신1건 + `BANNER_PREFIX` 코드목록 `Promise.all` 병렬 조회, 코드→라벨 변환). `MainVisual.tsx` main_notic 섹션을 실데이터/정적 목업 폴백 분기로 변경. `npx tsc --noEmit` 통과. SSR 확인: 실데이터 매칭됨(bottomText="dsfsdfsdfsdf", url="https://www.lselectricamerica.com/"). **단, prefix 저장값이 "1"이라 `BANNER_PREFIX`(001/002)와 불일치 → 코드→라벨 변환 폴백으로 원본값 "1" 표시**(6.비고 2) 케이스 실제 재현). 라벨 정상 표시하려면 데이터 재저장(prefix="001" 등) 필요 |
| STEP7 | fo-qa-validator(대체: SSR 검증) | 2026-07-10 | Playwright 미가용으로 SSR HTML 검증으로 대체(핵심 원칙 3에 따라 사전 고지). HTTP 200, 에러 마커 0건, url/bottomText 실데이터 반영, 섹션 순서(main_visual→main_notic→main_info→main_cards→main_products) 정상·인접 섹션 침범 없음 확인. prefix 라벨 이슈는 알려진 데이터 문제로 확정, 사용자 확인하에 컴포넌트 작업 완료 처리 |
