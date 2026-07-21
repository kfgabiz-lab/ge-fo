# Company Events 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/components/CompanyEventsPage.tsx` / `CompanyEventsFeatured.tsx` / `CompanyEventsCalendar.tsx` / `CompanyEventsPastSection.tsx` (events 전용 컴포넌트 — press/blog/articles의 공용 `CompanyFeed*`와 별개, 구조가 다름)
> - `fo/src/app/company/events/detail/[id]/page.tsx` (상세 — 신규 생성)
> - `fo/src/app/company/data/eventsData.ts` (신규 — fetchApi 조회/가공 헬퍼)
> - `fo/src/app/company/components/CompanyArticleDetail.tsx` — 이미 `variant="events"` + `eventsMeta:{venue,dates}` 지원, 직접 태깅 대상 아님
> - `fo/src/lib/formatDate.ts` — `formatDisplayDate` 수정, `formatMonthLabel` 신규 추가 완료
> 상태: Featured(3-1)/Calendar(3-2) 스펙 재확정 및 구현·QA 완료(2026-07-21, `#완료`). Past(3-3)는 변경 없음(기존 구현 유지). 게시상태(A조건) 미달로 전 구간 데이터가 비어보이던 이슈는 Featured/Calendar에서 A조건 자체가 제거되어 해소됨. **Past 정렬 A-Z/Z-A 확장 설계중(2026-07-21, 승인 대기 — 3-3-1절 참고)** / **상세조회·pager(이전글/다음글) 성능개선 설계중(2026-07-21, 승인 대기 — 3-5절 참고)**

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

### 3-1. Featured(상단 캐러셀) — "이번달~다음달, 미시작만" (2026-07-21 재확정, 구현·QA 완료)
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

### 3-2. Calendar(캘린더) — 전체조회 + FE 개별 필터 (2026-07-21 재확정, 구현·QA 완료)
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

### 3-3-1. Past 정렬 확장 — A-Z / Z-A (2026-07-21 신규 스코프, 설계중·승인 대기)
- 정렬 옵션: 기존 Latest/Oldest(2종, 위 3-3의 `sort=eventsForm.period_from,desc|asc`) → **Latest/Oldest/A-Z/Z-A(4종)**로 확장
  - Latest/Oldest: 기존 유지 — 파라미터는 3-3 원문 표기 그대로(아래 ⚠️ 참고)
  - A-Z: `sort=events.title,asc` / Z-A: `sort=events.title,desc`
- title 정렬 경로: `events.title` — `PageDataService`의 `sort` dot-notation 규칙(`<래퍼키>.title` → `ORDER BY data_json->'<래퍼키>'->>'title'`)에 따라 확정. dev DB 실측(bare 래퍼 + title 구조)으로 확인됨(STEP1)
- ⚠️ **표기 불일치 발견(코드로 확인됨, 2026-07-21)**: 위 3-1/3-2/3-3 코드블록은 정렬 파라미터를 `sort=eventsForm.period_from,...`(폼 래퍼)로 적고 있으나, 실제 구현체 `fo/src/app/company/data/eventsData.ts`(72·99·102·128·184행)는 이미 `sort=events.period_from,...`(`events` bare 래퍼)로 호출 중임을 직접 확인했다. 즉 이 문서의 3-1~3-3 코드블록 표기(`eventsForm.period_from`)가 실제 배포된 코드와 다르다 — title 정렬(`events.title`)은 이 실제 코드 기준(`events` bare 래퍼)과 일치하는 표기다. **2026-07-21 STEP3.5에서 3-5(인접글)절의 sortField를 이 실제 코드 기준(`events.period_from`)으로 확정**했다 — 다만 3-1~3-3 코드블록 자체의 표기(`eventsForm.period_from`)를 정정할지는 이번 STEP 범위 밖으로 남아 있어 여전히 별도 정리 필요
- 적용 범위: Past Events 섹션(3-3)에만 정렬 UI 추가 — Featured(3-1)/Calendar(3-2) 섹션은 이번 스코프 대상 아님
- FE sort 상태 타입: `"latest" | "oldest"` → `"latest" | "oldest" | "az" | "za"`로 확장 필요
- FE 대상: `CompanyEventsPastSection.tsx`의 인라인 정렬 UI에 A-Z/Z-A 옵션 추가(라벨 "A-Z"/"Z-A")
- API 확인: **기존 활용 가능(잠정) — 확인 필요/검증 예정.** `PageDataService`의 `sort` 파라미터가 dot-notation 중첩 JSON 정렬(`buildJsonPath`, SQL Injection 검증 포함)을 이미 범용 지원하므로 title 정렬(`events.title,asc|desc`)도 기존 엔드포인트(`GET /api/v1/fo/page-data/events-data`)로 처리 가능할 것으로 판단되나, 코드/실호출 기반 최종 검증(및 위 `events` vs `eventsForm` 표기 정리)은 **STEP3(fo-be-analyzer)에서 확인 예정** — 신규 BE 개발 필요 여부는 그 결과에 따라 확정

### 3-4. 상세(단건) — 2026-07-21 STEP3.5 갱신: 전용 엔드포인트로 교체(Option B)
기존에는 범용 목록 검색 API에 `eq_id`/`eq_isVisible` 쿼리파라미터를 얹어 상세를 조회했으나(아래 "기존(폐기 대상)"), 상세 페이지 진입 지연 문제 해결을 위해 PK 전용 경량 엔드포인트로 교체한다.

**신규**: `GET /api/v1/fo/page-data/events-data/{id}?eq_isVisible=001`
- PK 실컬럼 `id=:id`(인덱스 사용) + `isVisible=001` 게이트만 걸어 1행 조회. COUNT/FETCH관계/사용자명조회 생략(경량).
- Past 이벤트 상세도 접근 가능해야 하므로 `publishDttm` 게이트는 상세에서 제외(3-3과 동일 방침 유지, 5번 확정 사항 참고).
- 응답은 기존 `search()` 응답의 `content[0]`과 동일한 `PageDataResponse` 1건 형태 — FE `flattenPageDataItem`은 무변경.
- 못 찾거나 게이트 탈락 시 404 → FE `notFound()`.
- `eventsMeta`: `{venue: location, dates: "{period_from} ~ {period_to}"}` 형태로 가공해 `CompanyArticleDetail`에 전달(변경 없음)

**기존(폐기 대상)**:
```
eq_id={id}
eq_isVisible=001   (Past 이벤트 상세도 접근 가능해야 하므로 Past와 동일하게 publishDttm 게이트 제외)
```
범용 `search()`를 단건 조회에 재사용하던 방식 — COUNT 쿼리·FETCH 관계 등 불필요한 오버헤드가 있어 신규 전용 엔드포인트로 교체된다.

### 3-5. 인접글(prev/next) — 신규 (2026-07-21 STEP3 확정·승인 대기)

**배경**: 기존 상세 페이지(`fo/src/app/company/events/detail/[id]/page.tsx`)는 `fetchEventsDetail(id)`와 함께 `fetchEventsPast({page:0, sort:"latest", ...})`(Past 목록 최대 10건 재조회)를 병렬 호출해, 그 배열에서 현재 id의 index로 prev/next를 계산했다(Option A, blog/press/articles와 동일 패턴). 이 방식은 상세 진입마다 Past 목록 전체를 재조회하는 비용이 들고, 목록 10건 밖의 더 과거 이벤트에서는 prev/next가 비어버리는 버그가 있었다.

**신규**: `GET /api/v1/fo/page-data/events-data/{id}/adjacent?sortField=period_from&titleField=events.title` (+ 스코프 게이트 파라미터, `X-Site-Id` 헤더 optional)
- 현재 레코드의 `period_from` 값을 서브쿼리로 조회한 뒤 (정렬키, id) 튜플 비교로 prev/next 각 `LIMIT 1` 조회
  - prev = 정렬키가 현재보다 큰 것 중 최근접(`ORDER BY 정렬키 ASC, id ASC LIMIT 1`)
  - next = 정렬키가 현재보다 작은 것 중 최근접(`ORDER BY 정렬키 DESC, id DESC LIMIT 1`)
- 응답: `{ prev: {id, title} | null, next: {id, title} | null }`
- 기존 "Past 목록 10건(page:0) 재조회 후 FE index 계산" 방식을 완전히 대체 — 목록 10건 밖 과거 이벤트 pager 누락 버그도 함께 해결된다.

**⚠️ 상세 게이트와 인접 스코프 게이트가 다르다 — 반드시 구분**:
- 상세(3-4) 게이트: `eq_isVisible=001`만 — Past 여부와 무관하게 예정(Upcoming) 이벤트 상세도 URL로 직접 열려야 하므로 `publishDttm`/`upcoming` 조건 없음(기존 방침 유지)
- 인접(3-5) 스코프 게이트: `eq_isVisible=001` **+** `condexpr_upcoming=period_to>=today()?'upcoming':'past'&condval_upcoming=past` — pager는 Past Events 섹션(3-3) 전용 UI이므로, 인접글 후보도 "과거 이벤트"로만 한정한다. 즉 상세는 열리지만(Upcoming 이벤트 상세 접근 가능) 그 상세 화면의 pager 후보군은 Past로 한정된다는 뜻 — 상세와 인접의 스코프가 의도적으로 다르다.

**화면(events-data) 파라미터**
| 항목 | 값 |
|---|---|
| slug | `events-data` |
| 상세 게이트(where) | `eq_isVisible=001` |
| 인접 sortField | `period_from` (dot-notation: `events.period_from`) |
| 인접 titleField | `events.title` |
| 인접 스코프 게이트 | `eq_isVisible=001` + `condexpr_upcoming=period_to>=today()?'upcoming':'past'&condval_upcoming=past` (과거 이벤트만) |

⚠️ **표기 정정**: 3-3-1절에서 이미 지적된 대로, 3-1~3-3 코드블록은 `sort=eventsForm.period_from,...`(폼 래퍼)로 표기돼 있으나 실제 배포 코드(`fo/src/app/company/data/eventsData.ts` 72·99·102·128·184행)는 `sort=events.period_from,...`(`events` bare 래퍼)를 사용 중임이 코드로 확인됐다. 이번 인접글 신규 설계의 sortField는 이 실제 코드 기준을 따라 **`events.period_from`**으로 확정한다. 3-1~3-3 코드블록의 `eventsForm.period_from` 표기 자체를 정정할지는 이번 STEP 범위 밖의 별도 후속 정리 대상이다(3-3-1절에서 이미 미해결로 남아 있던 사항).

**재사용되는 기존 BE 로직**: `PageDataService`의 `appendWhereConditions` / `bindSearchParams` / `buildJsonPath` / `isValidSegments` / `toAuditColumn` / `mapRowToResponse` 재사용. 신규 코드는 `FoPageDataController`의 상세·인접 GET 엔드포인트 2개와 `PageDataService`의 `findPublicDetail` / `findAdjacent` 메서드 2개뿐(blog/press/articles와 공용 구현, slug 무관 제네릭). `SecurityConfig`의 `/api/v1/fo/**` permitAll이 자동 커버.

**FE 반영 범위(참고, 개발 착수는 `#개발` 승인 이후)**: `fo/src/app/company/events/detail/[id]/page.tsx`의 `fetchEventsPast({page:0,...})` 호출 제거 후 신규 인접글 엔드포인트 호출로 교체 필요(STEP6 범위). 이번 STEP3.5에서는 설계 확정·문서화까지만 진행한다.

## 4. API 확인
- Featured/Calendar(3-1/3-2): 신규 API/BE 로직 **불필요**. `condexpr_`(복수 개 동시 사용 가능, `status`/`upcoming`/`notstarted` 각각 다른 fieldKey로 독립 적용 — 실측 확인), `_gte`/`_lte`, `unpaged=true`, `title|content|location`, `month_`/`year_`, dot-notation `sort` 전부 기존 범용 기능(다른 slug에서도 사용 중)으로 충족
- Past 정렬 A-Z/Z-A(3-3-1) 관련 title 정렬 판정: **확인 필요/검증 예정**(STEP3)
- 상세 조회/인접글(pager)(3-4/3-5) 관련: **신규 필요** — 상세 전용 GET 1개(`/{id}`) + 인접글 전용 GET 1개(`/{id}/adjacent`), 총 2개 신규 엔드포인트(3-4/3-5 참고, 2026-07-21 STEP3 확정). blog/press/articles와 공용 구현이라 slug별 추가 개발은 아님. bo `SlugRegistry`/`PageData` 상 `events-data` slug 실존 여부는 이번 STEP에서 직접 검증하지 않음 — **확인 필요**(bo 관리자 화면 확인 요청)

## 5. 확정 사항(사용자 승인)
1. 레거시 스키마 — press/blog/articles와 동일하게 무시
2. Featured = 이번달~다음달, `period_from>=today()`(미시작만), 게시예정일(`publishDttm`) 게이트 제거 — **2026-07-21 재확정**(이전: 이번달+이전달 전체, upcoming 기준)
3. Calendar = `unpaged=true` 전체조회 + FE에서 `period_to<today` 개별 제외(BE upcoming 조건 제거) — **2026-07-21 재확정**(이전: BE `condexpr_upcoming`)
4. Past 분류 = `period_to` 기준(변경 없음)
5. Past 필터 기준 필드 = `period_from`(게시일 아님, 변경 없음)
6. Past 검색 범위 = title+content+location(변경 없음)
7. 날짜 표시 포맷 통일: 개별 날짜 "Apr 02, 2026"(`formatDisplayDate` zero-pad 버그 수정), 월/년 헤더 "Feb, 2026"(`formatMonthLabel` 신규) — **2026-07-21**
8. 상세조회/인접글(pager) = Option B(신규 전용 엔드포인트 2개) 채택 — 상세와 인접의 게이트/스코프가 다름(3-5 참고, 2026-07-21)

## 6. STEP 진행 이력
| STEP | 담당 | 날짜 | 결과 |
|---|---|---|---|
| 분석 | fo-orchestrator(서브에이전트) + 호출자 | 2026-07-14 | 5개 설계 쟁점 제안 후 사용자 확정. API 직접 호출로 range/조건식/정렬/검색 전부 검증 완료 |
| 스펙 재확정 | fo-orchestrator(서브에이전트) + 호출자 | 2026-07-21 | #진행 승인. Featured: 이번달~다음달 + `period_from>=today()`(미시작만), 게시예정일 게이트 제거. Calendar: `unpaged=true` 전체조회로 전환, BE upcoming 조건 제거하고 FE 개별 필터로 이관. 날짜 표시 포맷 버그 수정(`formatDisplayDate`) 및 월 헤더 신규 공통함수(`formatMonthLabel`) 추가. Past(3-3)/상세(3-4)는 변경 없음. 코드 구현 및 fo(3002) 실화면 QA 완료(`#완료`) |
| 정렬 확장 STEP1~2 | fo-slug-analyzer + fo-dev-doc-writer | 2026-07-21 | Past 섹션(3-3)에 한해 정렬 옵션을 Latest/Oldest → Latest/Oldest/A-Z/Z-A로 확장 설계. title 정렬 경로 `events.title` 확정(dev DB 실측). 3-1~3-3 문서 표기(`eventsForm.period_from`)와 실제 코드(`eventsData.ts`의 `events.period_from`) 간 불일치 발견 — 정정 여부 STEP3에서 정리 예정. API 확인은 "기존 활용 가능(잠정)/확인 필요" 상태(상태: 설계중, 승인 대기) |
| STEP3.5(성능개선) | fo-dev-doc-writer | 2026-07-21 | 상세 페이지 진입 3~4초 지연 문제 해결을 위해 상세조회/인접글(pager)을 Option B(신규 BE 엔드포인트 2개)로 재설계 문서화 — 상세 `GET /api/v1/fo/page-data/events-data/{id}`, 인접 `GET /api/v1/fo/page-data/events-data/{id}/adjacent?sortField=period_from&titleField=events.title`. 상세/인접 게이트 차이(visible-only vs visible+past) 명시. 기존 Option A(FE index 계산) 폐기 결정(상태: 설계중, 승인 대기, 3-5절 참고) |
