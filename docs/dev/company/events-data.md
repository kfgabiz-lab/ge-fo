# Company Events 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/components/CompanyEventsPage.tsx` / `CompanyEventsFeatured.tsx` / `CompanyEventsCalendar.tsx` / `CompanyEventsPastSection.tsx` (events 전용 컴포넌트 — press/blog/articles의 공용 `CompanyFeed*`와 별개, 구조가 다름)
> - `fo/src/app/company/events/detail/[id]/page.tsx` (상세 — 신규 생성)
> - `fo/src/app/company/data/eventsData.ts` (신규 — fetchApi 조회/가공 헬퍼)
> - `fo/src/app/company/components/CompanyArticleDetail.tsx` — 이미 `variant="events"` + `eventsMeta:{venue,dates}` 지원, 직접 태깅 대상 아님
> - `fo/src/lib/formatDate.ts` — `formatDisplayDate` 수정 대상, `formatMonthLabel` 신규 추가 대상
> 상태: **Featured(3-1)/Calendar(3-2) where 스펙 재확정(#진행 승인, 2026-07-21)** — 코드는 아직 구 스펙으로 구현되어 있어 다음 STEP에서 반영 필요. Past(3-3)/상세(3-4)는 변경 없음(기존 구현 유지).

## 1. data-slug
- 값: `events-data` (Featured/Calendar/Past/상세 전부 동일 slug 재사용)
- press/blog/articles와 다른 점: `location`(장소), `period_from`/`period_to`(행사 기간) 필드가 추가로 있고, category처럼 별도 분류 필드는 없음

## 2. 실제 필드 구조 (`eventsForm`, 실 API 검증)
| 필드 | 타입 | 비고 |
|---|---|---|
| title | string | |
| content | string(HTML) | 상세 본문 |
| location | string | Venue로 사용 |
| image | number[] | `/api/v1/fo/page-files/{id}` |
| isVisible | string("001"/"002") | |
| publishDttm | string(date) | 게시일(A조건) — Featured/Calendar에서는 미사용(3-1/3-2 참고) |
| period_from | string("YYYY-MM-DD") | 행사 시작일 |
| period_to | string("YYYY-MM-DD") | 행사 종료일 |

> ⚠️ 레거시 스키마(필드명 제각각: `eventsTitle`/`eventsPeriod_from` 등) 다수 존재 — press/blog/articles와 동일 원칙으로 **호환 코드 추가하지 않음**(사용자 확인 완료). 레거시 레코드는 Past 분류식(NOT COALESCE 부정)상 값 없음 취급으로 Past에 날짜 공백으로 노출될 수 있음.

## 3. 섹션별 조회 조건

### 3-1. Featured(상단 캐러셀) — "이번달~다음달, 미시작만" (2026-07-21 재확정, 코드 미반영)
```
eq_isVisible=001
period_from_gte={이번달 1일}&period_from_lte={다음달 마지막날}
condexpr_notstarted=period_from>=today()?'예정':'시작'&condval_notstarted=예정
sort=eventsForm.period_from,asc
```
- 조회 범위: 이번달 1일 ~ 다음달 말일(달력 기준)
- 추가 조건: `period_from>=today()` — "진행 예정"의 정의를 "미시작"으로 확정(아직 시작 안 한 이벤트만 노출)
- `isVisible=001` 조건 유지
- **게시예정일(`publishDttm`) 게이트 제거** — 이전 설계엔 있었으나 이번 요구사항엔 없어 제외
- 표시 필드: 썸네일(image), Events명(title), Venue(location), Dates(period_from~period_to)
- 2건 이상이면 좌우 버튼(SwiperBarControls, 기존 컴포넌트 유지)으로 순회
- 조회 결과 0건이면 영역 전체 비노출(기존 컴포넌트 로직 유지)
- 날짜 표시 형식: `formatDisplayDate` 수정으로 "Apr 02, 2026"(1~9일 zero-pad 누락 버그 수정)

### 3-2. Calendar(캘린더) — 전체조회 + FE 개별 필터 (2026-07-21 재확정, 코드 미반영)
```
eq_isVisible=001
unpaged=true
sort=eventsForm.period_from,asc
```
- 조회 범위: `unpaged=true`로 전체 조회(개수 제한 없음, 기존 `size=100` 캡 제거)
- `isVisible=001` 조건 유지, **게시예정일(`publishDttm`) 게이트 미사용**(Featured와 동일 이유)
- **BE의 upcoming(미종료) 조건 제거** — 대신 FE에서 이벤트마다 `period_to < today`인 것만 표시에서 개별 제외
- 월/년 배치 기준: `period_from`(시작일) 기준 "YYYY-MM" 그룹핑(기존과 동일)
- FE 필터링 결과 이벤트가 0건이 된 월/년은 캘린더에 미노출(기존과 동일 효과, 원인만 BE조건→FE필터로 변경)
- 표시 필드: Events명(title), Venue(location), Dates(period_from~period_to)
- 선택 시 상세 페이지 이동(기존 유지)
- 월/년 헤더 라벨: 신규 공통함수 `formatMonthLabel`로 "Feb, 2026"(기존엔 "2026-02" 원본 그대로 노출되던 버그)
- Dates 표시 형식: Featured와 동일 "Apr 02, 2026"

### 3-3. Past(하단 리스트) — 변경 없음(이번 작업 범위 아님)
```
eq_isVisible=001                (⚠️ 게시상태 A조건 아님 — isVisible만 확인, publishDttm 무시. 사용자 확정: "지난 이벤트는 publishDttm이 과거여도 나와야 함")
condexpr_upcoming=period_to>=today()?'upcoming':'past'&condval_upcoming=past
title|content|location=검색어   (검색, 장소도 포함)
month_period_from=01~12         (월 필터)
year_period_from=YYYY           (연도 필터, 옵션 2026/2025 하드코딩 — press/blog와 동일 결정)
sort=eventsForm.period_from,desc|asc  (Latest/Oldest)
page/size=10 페이지네이션
```
> ⚠️ **2026-07-14 수정**: 최초 설계는 Past에도 Featured/Calendar와 동일한 게시상태 A조건(`publishDttm>=today()`)을 걸었으나, 실사용 중 종료된 지난 이벤트가 전혀 안 나오는 문제 발생 — 원인은 `publishDttm`이 과거(예: 어제)면 A조건상 "미게시"로 걸러져 Past에서도 제외되는 것으로 확인(코드 정상, 조건 설계가 부적절했음). 사용자 확정에 따라 **Past는 `publishDttm` 조건을 아예 제외**하고 `isVisible=001`만 확인하도록 변경. `publishDttm`은 "노출 유지 기한" 성격이라 이미 끝난 행사의 기록성 노출과는 무관하다고 판단.

### 3-4. 상세(단건) — 변경 없음
```
eq_id={id}
eq_isVisible=001   (Past 이벤트 상세도 접근 가능해야 하므로 Past와 동일하게 publishDttm 게이트 제외)
```
- `eventsMeta`: `{venue: location, dates: "{period_from} ~ {period_to}"}` 형태로 가공해 `CompanyArticleDetail`에 전달

## 4. API 확인
- 신규 API/BE 로직: **불필요**. `condexpr_`(복수 개 동시 사용 가능), `_gte`/`_lte`, `unpaged=true`, `title|content|location`, `month_`/`year_`, dot-notation `sort` 전부 기존 범용 기능(다른 slug에서도 사용 중)으로 충족

## 5. 확정 사항(사용자 승인)
1. 레거시 스키마 — press/blog/articles와 동일하게 무시
2. Featured = 이번달~다음달, `period_from>=today()`(미시작만), 게시예정일(`publishDttm`) 게이트 제거 — **2026-07-21 재확정**(이전: 이번달+이전달 전체, upcoming 기준)
3. Calendar = `unpaged=true` 전체조회 + FE에서 `period_to<today` 개별 제외(BE upcoming 조건 제거) — **2026-07-21 재확정**(이전: BE `condexpr_upcoming`)
4. Past 분류 = `period_to` 기준(변경 없음)
5. Past 필터 기준 필드 = `period_from`(게시일 아님, 변경 없음)
6. Past 검색 범위 = title+content+location(변경 없음)
7. 날짜 표시 포맷 통일: 개별 날짜 "Apr 02, 2026"(`formatDisplayDate` zero-pad 버그 수정), 월/년 헤더 "Feb, 2026"(`formatMonthLabel` 신규) — **2026-07-21**

## 6. STEP 진행 이력
| STEP | 담당 | 날짜 | 결과 |
|---|---|---|---|
| 분석 | fo-orchestrator(서브에이전트) + 호출자 | 2026-07-14 | 5개 설계 쟁점 제안 후 사용자 확정. API 직접 호출로 range/조건식/정렬/검색 전부 검증 완료 |
| 스펙 재확정 | fo-orchestrator(서브에이전트) + 호출자 | 2026-07-21 | #진행 승인. Featured: 이번달~다음달 + `period_from>=today()`(미시작만), 게시예정일 게이트 제거. Calendar: `unpaged=true` 전체조회로 전환, BE upcoming 조건 제거하고 FE 개별 필터로 이관. 날짜 표시 포맷 버그 수정(`formatDisplayDate`) 및 월 헤더 신규 공통함수(`formatMonthLabel`) 추가. Past(3-3)/상세(3-4)는 변경 없음. **코드는 아직 미반영, 다음 STEP에서 구현 예정** |
