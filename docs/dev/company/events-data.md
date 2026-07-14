# Company Events 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/components/CompanyEventsPage.tsx` / `CompanyEventsFeatured.tsx` / `CompanyEventsCalendar.tsx` / `CompanyEventsPastSection.tsx` (events 전용 컴포넌트 — press/blog/articles의 공용 `CompanyFeed*`와 별개, 구조가 다름)
> - `fo/src/app/company/events/detail/[id]/page.tsx` (상세 — 신규 생성)
> - `fo/src/app/company/data/eventsData.ts` (신규 — fetchApi 조회/가공 헬퍼)
> - `fo/src/app/company/components/CompanyArticleDetail.tsx` — 이미 `variant="events"` + `eventsMeta:{venue,dates}` 지원, 직접 태깅 대상 아님
> 상태: 구현 완료(BE 변경 없음). `tsc` 통과, API 레벨 검증 완료. 실데이터 중 게시상태(A조건) 만족 레코드가 0건이라 Featured/Calendar/Past 전부 현재 빈 상태로 보임(press/blog/articles와 동일한 데이터 상태 이슈, 코드 문제 아님). 브라우저 UI 검증은 Playwright 잠금으로 미완

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
| publishDttm | string(date) | 게시일(A조건) |
| period_from | string("YYYY-MM-DD") | 행사 시작일 |
| period_to | string("YYYY-MM-DD") | 행사 종료일 |

> ⚠️ 레거시 스키마(필드명 제각각: `eventsTitle`/`eventsPeriod_from` 등) 다수 존재 — press/blog/articles와 동일 원칙으로 **호환 코드 추가하지 않음**(사용자 확인 완료). 레거시 레코드는 Past 분류식(NOT COALESCE 부정)상 값 없음 취급으로 Past에 날짜 공백으로 노출될 수 있음.

## 3. 섹션별 조회 조건 (전부 API 직접 호출로 검증 완료, BE 신규 개발 없음)

### 3-1. Featured(상단) — "이번달 + 이전달 전체" (사용자 확정)
```
condexpr_status=isVisible=001,publishDttm>=today()?'게시':'미게시'&condval_status=게시
period_from_gte={이전달 1일}&period_from_lte={이번달 마지막날}
sort=eventsForm.period_from,asc
```
- `_gte`/`_lte` 접미사는 `appendWhereConditions()`의 fieldKey(접미사 제거한 base key)로 JSONB 최상위+1단계 중첩 비교 — **`_from`/`_to` 접미사와는 다른 코드 경로**임에 주의(`_from`/`_to`는 필드명 자체가 `_from`/`_to`로 끝나는 range 쌍 필드 전용이라 `period_from`엔 안 맞음, 실측으로 확인). 개수 제한 없음(전체) → size는 넉넉히(예: 100) 요청

### 3-2. Calendar — Upcoming을 `period_from` 월별 그룹핑
```
condexpr_status=...&condval_status=게시
condexpr_upcoming=period_to>=today()?'upcoming':'past'&condval_upcoming=upcoming
sort=eventsForm.period_from,asc
```
- FE에서 `period_from`의 "YYYY-MM"으로 client-side groupBy

### 3-3. Past — `period_to<today()`, 신규 UI(검색/월/연도/정렬)
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

### 3-4. 상세(단건)
```
eq_id={id}
eq_isVisible=001   (Past 이벤트 상세도 접근 가능해야 하므로 Past와 동일하게 publishDttm 게이트 제외)
```
- `eventsMeta`: `{venue: location, dates: "{period_from} ~ {period_to}"}` 형태로 가공해 `CompanyArticleDetail`에 전달

## 4. API 확인
- 신규 API/BE 로직: **불필요**. `condexpr_`(복수 개 동시 사용 가능, `status`/`upcoming` 각각 다른 fieldKey로 독립 적용됨 — 실측 확인), `_gte`/`_lte`, `title|content|location`, `month_`/`year_`, dot-notation `sort` 전부 기존 범용 기능으로 충족

## 5. 확정 사항(사용자 승인)
1. 레거시 스키마 — press/blog/articles와 동일하게 무시
2. Featured = 이번달+이전달 전체(개수 제한 없음)
3. Upcoming/Past 분류 = `period_to` 기준
4. Past 필터 기준 필드 = `period_from`(게시일 아님)
5. Past 검색 범위 = title+content+location

## 6. STEP 진행 이력
| STEP | 담당 | 날짜 | 결과 |
|---|---|---|---|
| 분석 | fo-orchestrator(서브에이전트) + 호출자 | 2026-07-14 | 5개 설계 쟁점 제안 후 사용자 확정. API 직접 호출로 range/조건식/정렬/검색 전부 검증 완료 |
