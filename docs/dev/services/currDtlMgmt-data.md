# Training 상세페이지(코스 1뎁스 + 세션 2뎁스) 데이터 바인딩 설계

> 대상 파일:
> - 코스 상세(1뎁스, 오퍼링 카드 다건): `fo/src/app/services/training/components/TrainingDetailPage.tsx`(조립 래퍼) + `TrainingDetailHero.tsx`(부모 curriculum 히어로, `_fetchedRel8`) + `TrainingDetailSchedule.tsx`(`currDtlMgmt-data` 목록 wrapper `data-slug="currDtlMgmt-data" data-slug-repeat="true"`, Training Type/Month 필터) + `TrainingDetailSession.tsx`(오퍼링 카드 1건, `data-slug-item`, 행 PK 기반 상세링크)
> - 세션 상세(2뎁스, 목록 재사용 + 행PK 매칭 단건): `fo/src/app/services/training/components/TrainingSessionPage.tsx`(조립 래퍼) + `TrainingSessionDetail.tsx`(헤더: category/title, 공유·Add to Calendar·카운트다운 인터랙션) + `TrainingSessionDetailAside.tsx`(사이드바: date/duration/training_type/capacity/address/phone/email/products) + `TrainingSessionDetailForm.tsx` / `TrainingSessionDetailTableScroll.tsx`(Agenda 표, `training_schedule[]` 동적 렌더) + `TrainingSessionCountdown.tsx`(접수마감 카운트다운)
> - 진입 라우트(variant 3종 × 2뎁스, 공유): `fo/src/app/services/{sales|engineering|service}-training/[courseId]/page.tsx`, `.../[courseId]/[sessionId]/page.tsx`
> - 공통 로직: `fo/src/data/breadcrumbConfig.ts`(브레드크럼 3 variant 코스/세션 경로 인식) / `fo/src/lib/eventShare.ts`(공유·Add to Calendar 생성 로직)
> 상태: 설계중 (1:N 모델로 재확정 — 커리큘럼 1건에 오퍼링/교육정보 N행이 정상 구조)

## 1. data-slug
- 값: `currDtlMgmt-data` (bo `slug_registry` id=155, type=PAGE_DATA, `is_active=true`)
- 다건 여부: **다건(1:N)**. `currMgmt-data`(커리큘럼) 1건에 `currDtlMgmt-data`(교육정보/오퍼링) N건이 정상 구조. `curriculum_id`에 DB unique 제약 없음(`page_data`는 PK(`id`)만 존재) — 한 커리큘럼에 여러 오퍼링 행이 달리는 것을 전제로 설계한다. 관리 화면 근거: `page_template` id=106 `currDtlMgmt-list`(다행 그리드)
- 세션 2뎁스(`sessionId`)는 이 다건 목록 중 행 PK(`id`, 숫자)로 매칭한 1건이며, 별도 slug/API가 아니다

### 조회/연결 방식
**1뎁스(코스 상세) — 오퍼링 카드 목록, 다건**
- `GET /api/v1/fo/page-data/currDtlMgmt-data?eq_curriculum_detail1.curriculum_id={curriculumId}&eq_curriculum_detail3.is_visible=001&condexpr_training_date_to=training_date_to>=today()?'valid':'past'&condval_training_date_to=valid&sort=curriculum_detail2.training_date_from,asc&unpaged=true`
  - `curriculumId` = 부모 `currMgmt-data.id`(URL 세그먼트)
  - 과거 회차 제외는 서버 `condexpr`/`condval`로 1차 처리 + FE 2차 재판정(이중 방어)
  - ⚠️ `condexpr`는 dot 경로를 지원하지 않는다. `curriculum_detail2.training_date_to`가 아니라 **leaf key `training_date_to`**로 넘겨야 파서가 중첩 구조를 EXISTS로 훑어 매칭한다
  - `sort=curriculum_detail2.training_date_from,asc`는 다건 정렬을 위한 기술적 필요 orderBy이며, 별도 비즈니스 정렬 요구사항은 없다
  - `unpaged=true`로 전체 조회(페이지네이션 없음)
  - 부모 `curriculum`(리스트와 동일 레코드)은 응답 필드 `_fetchedRel8`(slug_relation id=8, `curriculum_id` EQ `currMgmt-data.id`, join_type=FETCH)로 **행별로** 자동 병합됨
  - 연결제품(오퍼링별 다건)은 응답 필드 `_fetchedRel22`(slug_relation id=22, master 최상위 `power_list`, ARRAY_CONTAINS, FETCH → category-data)와 `_fetchedRel23`(slug_relation id=23, master 최상위 `automation_list`, ARRAY_CONTAINS, FETCH → category-data)로 **행별로** 자동 병합됨. 제품명 경로는 `_fetchedRel22[].product.product_name` / `_fetchedRel23[].product.product_name`(경로가 `curriculum_detail1.power_list` 아래가 아니라 최상위 `power_list`/`automation_list`)
  - `content` 배열 전체를 카드로 1:1 매핑한다(`content[0]`만 취해 단건 처리하지 않는다)
- Hero(커리큘럼 설명 영역)는 이 목록 각 행의 `_fetchedRel8.curriculum.*`에서 취득한다(부모 `currMgmt-data` 공개 단건 getById가 없으므로 오퍼링 행에 병합된 값을 재사용). `content`가 0행이면 `notFound()`

**2뎁스(세션 상세) — 목록 재사용 + 행 PK 매칭, 단건**
- 전용 단건 엔드포인트를 두지 않는다. 1뎁스와 **동일한 목록 조회**를 재사용해 `content.find(row => row.id === sessionId)`로 1건을 FE에서 선택한다
- `findPublicDetail`(단건 getById) 계열은 채택하지 않음 — `_fetchedRel` 병합이 없어 Hero/제품 표시에 부적합. 목록 브랜치를 재사용하는 편이 원칙에 부합
- 공개 게이트(이중 방어): 서버 `eq_curriculum_detail3.is_visible=001` + FE 재판정(`_fetchedRel8.curriculum.is_visible !== "001"` 이면 `notFound()`)

## 2. data-slugKey 매핑

### 2-1. 코스 상세(1뎁스) — 오퍼링 카드(다건)

각 카드 값은 전부 **그 행 고유값**이다(부모 커리큘럼의 값이 아님).

| 카드 요소 | slugKey/필드(flatten 기준) | 타입 | 설명 |
|---|---|---|---|
| 교육일자 | `curriculum_detail2.training_date_from` ~ `training_date_to` | string(date) | 동월이면 "Jul 30–31, 2026", 월경계면 "Jul 30 – Aug 1, 2026"(연도는 1회만 표기) |
| 접수마감일 | `curriculum_detail2.register_period_to` | string(date) | 교육일자와 별개로 표시 |
| 제목 | `curriculum_detail2.title` | string | 부모 커리큘럼 title이 아니라 오퍼링 행 고유 title |
| 대상제품 | `_fetchedRel22[].product.product_name`(Power) + `_fetchedRel23[].product.product_name`(Automation) | string[] | 두 배열 합산 표시(빈 배열/부재 방어) |
| 교육타입 | `curriculum_detail1.training_type` | string(CSV 코드) | **CSV 문자열**("001" / "002" / "001,002"). `,` split 후 TRAININGTYPE 코드그룹 라벨 조합("In-Person, Virtual" 등) |
| 교육시간 | `curriculum_detail2.duration` | string | 원값에 단위 없음("12") → FE 렌더 시 "N Hours"로 표기 |
| 주소 | `curriculum_detail2.address` | string | `training_type`이 Virtual(002) 단독이면 **비노출**, In-Person(001)이 포함되면 노출 |
| 상세링크 | 행 PK `id` | number | `href=/services/{variant}-training/{curriculumId}/{행PK}` |

**Hero(커리큘럼 설명 영역) — `TrainingDetailHero.tsx`** (각 오퍼링 행의 `_fetchedRel8.curriculum.*`에서 취득, 공개 커리큘럼 단건 API 없음)

| slugKey | dataJson 필드(flatten 기준) | 타입 | 설명 |
|---|---|---|---|
| image | `_fetchedRel8.curriculum.image[0]`(파일id 배열) | number[] | `/api/v1/fo/page-files/{id}`로 렌더 |
| product_category | `_fetchedRel8.curriculum.product_category`(코드 P/A) | string(코드) | PRODUCTCATEGORY 코드그룹 라벨 변환 |
| title | `_fetchedRel8.curriculum.title` | string | |
| description | `_fetchedRel8.curriculum.description` | string | 전체 노출(말줄임 없음) |

> 오퍼링 행이 0건이면(`content.length === 0`) 커리큘럼 상세 자체가 `notFound()` 처리된다.

### 2-2. 필터(1뎁스, client-side)

| 필터 | UI | 매칭 대상 | 방식 |
|---|---|---|---|
| Training Type | All / In-Person / Virtual, **드롭다운 단일선택** | 행 `curriculum_detail1.training_type`(CSV) | CSV를 split해 선택값과 교집합 있으면 통과. (checkbox가 아니라 드롭다운을 채택한 이유: 퍼블리싱 원본 마크업 유지) |
| Month | Jun / Jul / Aug / Sep / Oct(고정 옵션, 데이터에서 도출하지 않음) | 행 `curriculum_detail2.training_date_from`의 월 | default 미선택(=전체 노출) |

두 필터는 client-side이며 AND로 적용된다(둘 다 선택 시 교집합).

### 2-3. 세션 상세(2뎁스)

`content.find(row => row.id === sessionId)`로 선택된 오퍼링 행 1건 기준.

| 화면 항목 | dataJson 필드(flatten 기준) | 타입 | 설명 |
|---|---|---|---|
| product_category | `_fetchedRel8.curriculum.product_category` | string(코드) | 부모 값, 코스 상세 Hero와 동일 |
| title | `curriculum_detail2.title` | string | 오퍼링 행 고유 title(카드와 동일 값) |
| date | `curriculum_detail2.training_date_from` | string(date) | 사이드바 |
| duration | `curriculum_detail2.duration` | string | "N Hours"로 표기 |
| training_type | `curriculum_detail1.training_type`(CSV) | string(코드) | split 후 TRAININGTYPE 라벨 조합 |
| capacity | `curriculum_detail2.capacity` | string/number | |
| address | `curriculum_detail2.address` | string | |
| phone | `curriculum_detail2.phone` | string | |
| email | `curriculum_detail2.email` | string | |
| 대상제품 | `_fetchedRel22[].product.product_name` + `_fetchedRel23[].product.product_name` | string[] | 카드와 동일 합산 로직 |
| Agenda 표(No/Time/Contents/Trainer) | 선택된 행의 `training_schedule[]` | array | 아래 참고 |

**Agenda 표 = 선택된 행의 `training_schedule[]` 실데이터**로 렌더한다.

| Agenda 컬럼 | 필드 |
|---|---|
| No | 배열 index + 1(순번, 별도 저장 필드 아님) |
| Time | `training_schedule[n].time_from` ~ `training_schedule[n].time_to` |
| Contents | `training_schedule[n].title` + `training_schedule[n].description` |
| Trainer | `training_schedule[n].trainer` |

### 2-4. FE 인터랙션/동적 로직 (신규 BE 불필요, 순수 FE 처리)

| 항목 | 대상 필드 | 처리 방식 |
|---|---|---|
| 공유(X/LinkedIn/Email/FB) | 현재 페이지 URL + 선택된 행의 `curriculum_detail2.title` | `fo/src/lib/eventShare.ts`에서 각 채널 href 생성 |
| Add to Calendar(Google/iCal) | 선택된 행의 `curriculum_detail2.training_date_from/training_date_to/title` + `curriculum_detail2.address` | Google Calendar URL + `.ics` Blob 생성(`fo/src/lib/eventShare.ts`) |
| 카운트다운 | `curriculum_detail2.register_period_to` | `TrainingSessionCountdown.tsx`에서 실시간 렌더. 카드의 접수마감일 표시와 동일 데이터 소스 사용해 정합성 확보. 마감 경과 시 0/Closed 처리 |
| 브레드크럼(3 variant) | `fo/src/data/breadcrumbConfig.ts` | 코스(`curriculumId`)·세션(`sessionId`, 숫자) 경로 인식, 실 제목 fetch 불가 구조라 제네릭 고정 라벨 사용 |

## 3. API 확인 (최종 체크)
- **1뎁스 오퍼링 목록 조회: 신규 개발 불필요.** 기존 `FoPageDataController`(`GET /api/v1/fo/page-data/{slug}`) → `PageDataService.search()`가 `eq_` dot-notation where + `condexpr_`/`condval_`(leaf key) + dot-notation `sort` + `unpaged` + `_fetchedRel` FETCH 병합까지 전부 기존 범용 기능으로 커버(다른 slug에서 이미 사용 중인 패턴 재조합). 신규 relation 불필요(기존 `_fetchedRel8`/`22`/`23` 재사용)
- **2뎁스 세션 상세: 신규 개발 불필요.** 전용 단건 API를 두지 않고 1뎁스와 동일한 목록 조회를 재사용해 FE에서 `id===sessionId` 선택
- **필터(Training Type/Month), 공유/Add to Calendar/카운트다운: 신규 BE 불필요.** 전부 이미 매핑된 필드를 FE에서 가공/재조합하는 순수 FE 로직

## 4. 조회 조건
- where(1뎁스 목록 및 2뎁스 재사용 공통):
  - `eq_curriculum_detail1.curriculum_id={curriculumId}`
  - `eq_curriculum_detail3.is_visible=001`
  - `condexpr_training_date_to=training_date_to>=today()?'valid':'past'` + `condval_training_date_to=valid`(과거 회차 서버 1차 제외, leaf key 사용) + FE 2차 재판정
- sort: `curriculum_detail2.training_date_from,asc` (다건 매칭을 위한 기술적 필요 orderBy)
- row limit: 다건, `unpaged=true`(전체 조회, 페이지네이션 없음)
- 세션 2뎁스 전용: 별도 where 없음 — 위 목록 응답에서 `id===sessionId`로 FE 선택
- Training Type / Month 필터: 별도 API where 아님 — 이미 fetch된 배열을 FE에서 client 필터링(AND)
- 공개 게이트 이중 방어: 서버 where(`is_visible=001`) + FE 재판정(`_fetchedRel8.curriculum.is_visible==="001"` 아니면 `notFound()`)

## 5. 샘플 응답 데이터

> ⚠️ 1:N 모델 기준 구조 예시. 한 커리큘럼(`curriculumId=1625`)에 오퍼링 행 2건이 정상적으로 매칭되는 케이스를 보여준다.

```json
{
  "content": [
    {
      "id": 1900,
      "templateSlug": "currDltMgmt-basicInfo",
      "dataJson": {
        "curriculum_detail1": {
          "curriculum_id": 1625,
          "training_type": "001,002"
        },
        "curriculum_detail2": {
          "title": "예시 오퍼링 A",
          "training_date_from": "2026-07-30",
          "training_date_to": "2026-07-31",
          "register_period_to": "2026-07-25",
          "duration": "12",
          "capacity": 20,
          "address": "123 Example Ave, Seoul",
          "phone": "02-1234-5678",
          "email": "training@example.com"
        },
        "curriculum_detail3": {
          "is_visible": "001"
        },
        "power_list": [1776],
        "automation_list": [],
        "training_schedule": [
          {
            "id": "b3f1c2a0-1111-4a2b-9c3d-000000000001",
            "date": "2026-07-30",
            "time_from": "09:00",
            "time_to": "12:00",
            "title": "예시 세션 1 제목",
            "description": "예시 세션 1 설명",
            "trainer": "홍길동"
          },
          {
            "id": "b3f1c2a0-1111-4a2b-9c3d-000000000002",
            "date": "2026-07-31",
            "time_from": "09:00",
            "time_to": "12:00",
            "title": "예시 세션 2 제목",
            "description": "예시 세션 2 설명",
            "trainer": "홍길동"
          }
        ]
      },
      "_fetchedRel8": {
        "curriculum": {
          "id": 1625,
          "title": "예시 강의 제목",
          "description": "예시 강의 설명",
          "image": [1234],
          "product_category": "P",
          "is_visible": "001"
        }
      },
      "_fetchedRel22": [
        { "product": { "id": 1776, "product_name": "예시 Power 제품명" } }
      ],
      "_fetchedRel23": []
    },
    {
      "id": 1901,
      "templateSlug": "currDltMgmt-basicInfo",
      "dataJson": {
        "curriculum_detail1": {
          "curriculum_id": 1625,
          "training_type": "002"
        },
        "curriculum_detail2": {
          "title": "예시 오퍼링 B(Virtual)",
          "training_date_from": "2026-08-20",
          "training_date_to": "2026-08-20",
          "register_period_to": "2026-08-15",
          "duration": "6",
          "capacity": 30,
          "address": null,
          "phone": "02-1234-5678",
          "email": "training@example.com"
        },
        "curriculum_detail3": {
          "is_visible": "001"
        },
        "power_list": [],
        "automation_list": [1801],
        "training_schedule": [
          {
            "id": "b3f1c2a0-1111-4a2b-9c3d-000000000003",
            "date": "2026-08-20",
            "time_from": "13:00",
            "time_to": "19:00",
            "title": "예시 세션 3 제목",
            "description": "예시 세션 3 설명",
            "trainer": "김철수"
          }
        ]
      },
      "_fetchedRel8": {
        "curriculum": {
          "id": 1625,
          "title": "예시 강의 제목",
          "description": "예시 강의 설명",
          "image": [1234],
          "product_category": "P",
          "is_visible": "001"
        }
      },
      "_fetchedRel22": [],
      "_fetchedRel23": [
        { "product": { "id": 1801, "product_name": "예시 Automation 제품명" } }
      ]
    }
  ]
}
```

## 6. 비고
1. **1:N 모델 확정**: `currMgmt-data`(커리큘럼) 1 : `currDtlMgmt-data`(교육정보/오퍼링) N. `curriculum_id`에 DB unique 제약이 없고(`page_data`는 PK만 존재) 관리 화면(`page_template` id=106 `currDtlMgmt-list`)도 다행 그리드이므로, 한 커리큘럼에 여러 오퍼링 행이 달리는 구조가 정상이다. `content` 전체를 카드로 매핑하며 `content[0]`만 쓰는 단건 처리는 하지 않는다.
2. **연결제품 관계키**: `power_list`(최상위 필드, slug_relation id=22)/`automation_list`(최상위 필드, id=23) → `category-data` FETCH, 응답 키 `_fetchedRel22`/`_fetchedRel23`, 제품명 경로 `_fetchedRelN[].product.product_name`. 경로는 `curriculum_detail1.power_list`가 아니라 최상위 `power_list`/`automation_list`이다.
3. **사이드바 장소명(location.name) 대응 필드 부재 — 확인 필요**: `curriculum_detail2`에 주소/전화/이메일은 있으나 장소명 필드가 없다. bo 관리자 화면에서 실제 입력 필드 존재 여부 확인 필요(스코프 밖).
4. **여전히 정적(대응 bo 필드 없음)**: Who should attend, Meals. Agenda 표는 `training_schedule[]` 실데이터로 동적 렌더된다(더 이상 정적 항목 아님).
5. **Duration 단위 표기**: `curriculum_detail2.duration` 원값에 단위가 없어(예: "12") FE 렌더 시 "Hours"를 부기한다(카드/사이드바 공통). bo 저장 데이터 자체는 변경하지 않는다.
6. **Training Type 코드**: `curriculum_detail1.training_type`은 CSV 문자열("001"/"002"/"001,002")이다. `,` split 후 TRAININGTYPE 코드그룹 라벨을 조합해 표시한다.
7. **레거시 자연 제외**: `currMgmt-data`와 동일 패턴 — where 경로 자체가 레거시(camelCase) 구조엔 없어 자연 제외된다(별도 제외 where 불필요).

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-23 | `TrainingDetailPage.tsx`/`TrainingSessionPage.tsx`(조립 wrapper), `TrainingDetailSchedule.tsx`/`TrainingDetailSession.tsx`, `TrainingDetailHero.tsx`/`TrainingSessionDetail.tsx`/`TrainingSessionDetailAside.tsx` 태깅. slug=`currDtlMgmt-data`(id155) 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-23 | 옵션A 역방향 필터조회(단건 결과[0] 채택) 확정, 부모 병합키 `_fetchedRel8` 실API 병합 확인 |
| STEP3 | fo-dev-doc-writer | 2026-07-23 | 작업 단위 문서 작성(상태: 설계중) |
| B-STEP1~3(경량 갱신) | fo-slug-analyzer → fo-dev-doc-writer | 2026-07-23 | 세션 인터랙션(공유/Add to Calendar/카운트다운)·스케줄 필터·브레드크럼 확정 반영, `training_schedule` 필드 `{id,date,time_from,time_to,title,description,trainer}` 확정 |
| 정정(관계키/카드 노출범위) | fo-dev-doc-writer | 2026-07-23 | 연결제품 관계키를 `_fetchedRel22`(power_list, id=22)/`_fetchedRel23`(automation_list, id=23)로 확정, 카드 노출 필드범위 명확화 |
| **1:N 모델 재확정** | fo-dev-doc-writer | 2026-07-23 | `currMgmt-data` 1 : `currDtlMgmt-data` N이 정상 구조임을 확인하고 문서 전면 재작성. 코스 1뎁스를 "단건 결과[0]"에서 **오퍼링 카드 다건 목록**으로 재정의(where에 `condexpr_training_date_to`+`condval` 과거제외, `sort=curriculum_detail2.training_date_from,asc`, `unpaged=true` 추가). 카드 필드를 전부 "그 행 고유값"으로 재정의(교육일자/접수마감일/제목/대상제품/교육타입CSV/교육시간/조건부주소/상세링크). Hero는 각 오퍼링 행의 `_fetchedRel8.curriculum.*`로 취득하도록 재정의. 세션 2뎁스는 `sessionId`를 **행 PK(숫자)**로 재정의하고 전용 단건 API 없이 1뎁스 목록 재사용 + `id===sessionId` 매칭으로 확정(`findPublicDetail`은 `_fetchedRel` 미병합이라 부적합해 미채택). Agenda 표를 선택된 행의 `training_schedule[]` 실데이터로 재정의. 연결제품 경로를 `curriculum_detail1.power_list`에서 최상위 `power_list`/`automation_list`로 정정. Training Type 필터를 드롭다운 단일선택(퍼블리싱 원본 마크업 유지)으로, Month 필터를 고정옵션(Jun~Oct)으로 명확화. 신규 BE 없음(기존 search+condexpr+sort+applyFetch 재사용) |
