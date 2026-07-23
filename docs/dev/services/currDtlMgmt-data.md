# Training 상세페이지(코스 1뎁스 + 세션 2뎁스) 데이터 바인딩 설계

> 대상 파일:
> - 코스 상세(1뎁스, 오퍼링 카드 다건): `fo/src/app/services/training/components/TrainingDetailPage.tsx`(조립 래퍼) + `TrainingDetailHero.tsx`(부모 curriculum 히어로, `_fetchedRel8`) + `TrainingDetailSchedule.tsx`(`currDtlMgmt-data` 목록 wrapper `data-slug="currDtlMgmt-data" data-slug-repeat="true"`, Training Type/Month 필터) + `TrainingDetailSession.tsx`(오퍼링 카드 1건, `data-slug-item`, 행 PK 기반 상세링크)
> - 세션 상세(2뎁스, 목록 재사용 + 행PK 매칭 단건): `fo/src/app/services/training/components/TrainingSessionPage.tsx`(조립 래퍼) + `TrainingSessionDetail.tsx`(헤더: category/title, 공유·Add to Calendar·카운트다운 인터랙션, `content` 본문 렌더 및 training 탭 동적화) + `TrainingSessionDetailAside.tsx`(사이드바: date/duration/training_type/capacity/address/phone/email/products, `TrainingSessionLocationMap` 지도 포함) + `TrainingSessionDetailForm.tsx` / `TrainingSessionDetailTableScroll.tsx`(Agenda 표, `training_schedule[]` 정렬·재채번 렌더, Trainer 컬럼 조건부 비노출) + `TrainingSessionCountdown.tsx`(접수마감 카운트다운) + `TrainingSessionLocationMap.tsx`(신규, 사이드바 주소 하단 단일마커 지도)
> - 진입 라우트(variant 3종 × 2뎁스, 공유): `fo/src/app/services/{sales|engineering|service}-training/[courseId]/page.tsx`, `.../[courseId]/[sessionId]/page.tsx` (OG 메타 `generateMetadata` 포함)
> - 공통 로직: `fo/src/data/breadcrumbConfig.ts`(브레드크럼 3 variant 코스/세션 경로 인식) / `fo/src/lib/eventShare.ts`(공유·Add to Calendar 생성 로직) / `fo/src/lib/geo/geocode.ts` + `loadGoogleMaps`(지도, 기존 로직 재사용) / `fo/src/lib/api.ts`(`SITE_URL` export, OG image 절대경로용)
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
| 본문(content) | `curriculum_detail2.content` | string(HTML) | WYSIWYG 본문. `data-slugkey="content"` + `dangerouslySetInnerHTML`로 렌더. **빈값이면 본문 섹션 및 training 탭 비노출**. 기존 정적 "Who should attend?"/"Meals" 블록 및 관련 상수·타입 필드는 제거됨(비고 4 참고) |
| date | `curriculum_detail2.training_date_from` | string(date) | 사이드바 |
| duration | `curriculum_detail2.duration` | string | "N Hours"로 표기 |
| training_type | `curriculum_detail1.training_type`(CSV) | string(코드) | split 후 TRAININGTYPE 라벨 조합 |
| capacity | `curriculum_detail2.capacity` | string/number | |
| address | `curriculum_detail2.address` | string | `training_type`(`curriculum_detail1.training_type`)이 Virtual(002) 단독이면 **비노출**(코스 카드와 동일 `shouldShowAddress` 게이트로 정정). 비노출 시 Add to Calendar의 `event.location`도 빈값, 사이드바 지도(`TrainingSessionLocationMap`)도 미렌더 |
| phone | `curriculum_detail2.phone` | string | 주소 게이트와 무관하게 유지 |
| email | `curriculum_detail2.email` | string | 주소 게이트와 무관하게 유지 |
| 대상제품 | `_fetchedRel22[].product.product_name` + `_fetchedRel23[].product.product_name` | string[] | 카드와 동일 합산 로직 |
| Agenda 표(No/Time/Contents/Trainer) | 선택된 행의 `training_schedule[]` | array | 아래 참고 |

**Agenda 표 = 선택된 행의 `training_schedule[]`을 `date`+`time_from` 오름차순 정렬(`sortSchedule`) 후 렌더한다.** No는 정렬된 배열 기준 index+1로 재채번한다(bo 저장순서가 아님). Add to Calendar(Google/iCal)의 first/last 시각도 정렬된 배열 기준으로 계산한다.

| Agenda 컬럼 | 필드 |
|---|---|
| No | 정렬된 배열 index + 1(순번, 별도 저장 필드 아님. `date`+`time_from` 오름차순 재채번) |
| Time | `training_schedule[n].time_from` ~ `training_schedule[n].time_to` |
| Contents | `training_schedule[n].title` + `training_schedule[n].description` |
| Trainer | `training_schedule[n].trainer`. **정렬된 배열의 모든 행 `trainer`가 빈값이면 Trainer 컬럼(th+td) 전체 비노출**(뷰모델 `showTrainerColumn` 계산) |

### 2-4. FE 인터랙션/동적 로직 (신규 BE 불필요, 순수 FE 처리)

| 항목 | 대상 필드 | 처리 방식 |
|---|---|---|
| 공유(X/LinkedIn/Email/FB) | 현재 페이지 URL + 선택된 행의 `curriculum_detail2.title` | `fo/src/lib/eventShare.ts`에서 각 채널 href 생성 |
| Add to Calendar(Google/iCal) | 선택된 행의 `curriculum_detail2.training_date_from/training_date_to/title` + `curriculum_detail2.address`(게이트 통과 시) | Google Calendar URL + `.ics` Blob 생성(`fo/src/lib/eventShare.ts`). first/last 시각은 정렬된 `training_schedule[]` 기준 |
| 카운트다운 | `curriculum_detail2.register_period_to` | `TrainingSessionCountdown.tsx`에서 실시간 렌더. 카드의 접수마감일 표시와 동일 데이터 소스 사용해 정합성 확보. 마감 경과 시 0/Closed 처리 |
| training 탭 라벨/노출 | `curriculum_detail2.content` 유무 + 진입 variant | `TRAINING_TAB_LABELS` + `buildSessionTabs`로 variant별 "Sales/Engineering/Service Training" 동적 라벨 부여. `content` 빈값이면 training 탭 자체를 제외하고, 그 경우 Agenda 탭 클릭 시 최상단으로 스크롤 |
| Google Map(사이드바, 신규 UI) | 세션 `address`(주소 게이트 통과 시) | `TrainingSessionLocationMap.tsx`(신규, pub 원본 없음). 기존 `geocodeAddress`(`@/lib/geo/geocode`) + `loadGoogleMaps` 재사용, 단일 마커. 주소 노출 조건과 동일하게 게이트(주소 비노출 시 지도도 비노출). `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 미설정 시 그레이스풀 미렌더 |
| OG 메타태그(og:title/description/image, 신규) | 커리큘럼: `curriculum.title`/`description`/`image[0]`. 세션: `curriculum_detail2.title` + 부모 `curriculum.description`(세션 전용 설명 필드 없음) + 커리큘럼 image | 코스/세션 라우트에 `generateMetadata` 추가(variant 3종 × 2뎁스 = 총 6개 파일). image는 `SITE_URL` 접두 절대경로(`/api/v1/fo/page-files/{id}`). `generateMetadata`와 `page`가 동일 fetch 인자로 호출되어 Next fetch memoization으로 요청 1회. 공용 헬퍼(`fetchTrainingDetailRows`/`buildCourseMetadata`/`buildSessionMetadata`) 추출 |
| 브레드크럼(3 variant) | `fo/src/data/breadcrumbConfig.ts` | 코스(`curriculumId`)·세션(`sessionId`, 숫자) 경로 인식, 실 제목 fetch 불가 구조라 제네릭 고정 라벨 사용 |

## 3. API 확인 (최종 체크)
- **1뎁스 오퍼링 목록 조회: 신규 개발 불필요.** 기존 `FoPageDataController`(`GET /api/v1/fo/page-data/{slug}`) → `PageDataService.search()`가 `eq_` dot-notation where + `condexpr_`/`condval_`(leaf key) + dot-notation `sort` + `unpaged` + `_fetchedRel` FETCH 병합까지 전부 기존 범용 기능으로 커버(다른 slug에서 이미 사용 중인 패턴 재조합). 신규 relation 불필요(기존 `_fetchedRel8`/`22`/`23` 재사용)
- **2뎁스 세션 상세: 신규 개발 불필요.** 전용 단건 API를 두지 않고 1뎁스와 동일한 목록 조회를 재사용해 FE에서 `id===sessionId` 선택
- **필터(Training Type/Month), 공유/Add to Calendar/카운트다운: 신규 BE 불필요.** 전부 이미 매핑된 필드를 FE에서 가공/재조합하는 순수 FE 로직
- **세션 본문 content, training 탭 동적화, Agenda 정렬·재채번, Trainer 컬럼 조건부, 세션 사이드바 주소 게이트, Google Map, OG 메타: 전부 신규 BE 불필요.** `curriculum_detail2.content`는 기존 dataJson 필드를 그대로 재사용(신규 컬럼 아님), 나머지는 이미 fetch된 값을 FE에서 정렬/조건부 렌더/조합하는 순수 FE 로직. Google Map은 기존 `geocodeAddress`/`loadGoogleMaps`(where-to-buy 등에서 이미 쓰던 로직) 재사용. OG 메타는 Next.js `generateMetadata` FE 라우트 기능이며 데이터는 기존 목록 조회를 그대로 재사용

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

> ⚠️ 1:N 모델 기준 구조 예시. 한 커리큘럼(`curriculumId=1625`)에 오퍼링 행 2건이 정상적으로 매칭되는 케이스를 보여준다. `content` 필드는 세션 본문 바인딩 예시로 추가.

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
          "content": "<p>예시 세션 본문 HTML (WYSIWYG)</p>",
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
          "content": "",
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

> 두 번째 오퍼링 행(`id=1901`)은 `content: ""`(빈값) 예시로, 이 경우 본문 섹션과 training 탭이 비노출되고 `address: null`(Virtual 단독)이라 주소 li와 지도도 비노출된다.

## 6. 비고
1. **1:N 모델 확정**: `currMgmt-data`(커리큘럼) 1 : `currDtlMgmt-data`(교육정보/오퍼링) N. `curriculum_id`에 DB unique 제약이 없고(`page_data`는 PK만 존재) 관리 화면(`page_template` id=106 `currDtlMgmt-list`)도 다행 그리드이므로, 한 커리큘럼에 여러 오퍼링 행이 달리는 구조가 정상이다. `content` 전체를 카드로 매핑하며 `content[0]`만 쓰는 단건 처리는 하지 않는다.
2. **연결제품 관계키**: `power_list`(최상위 필드, slug_relation id=22)/`automation_list`(최상위 필드, id=23) → `category-data` FETCH, 응답 키 `_fetchedRel22`/`_fetchedRel23`, 제품명 경로 `_fetchedRelN[].product.product_name`. 경로는 `curriculum_detail1.power_list`가 아니라 최상위 `power_list`/`automation_list`이다.
3. **사이드바 장소명(location.name) 대응 필드 부재 — 확인 필요**: `curriculum_detail2`에 주소/전화/이메일은 있으나 장소명 필드가 없다. bo 관리자 화면에서 실제 입력 필드 존재 여부 확인 필요(스코프 밖).
4. **세션 본문 content 동적바인딩(구현 완료)**: `curriculum_detail2.content`(WYSIWYG HTML)를 세션 상세 본문에 `data-slugkey="content"` + `dangerouslySetInnerHTML`로 렌더한다. 기존 정적 "Who should attend?"/"Meals" 블록 및 관련 상수(`SHARED_WHO_SHOULD_ATTEND`/`SHARED_MEALS`)·타입 필드(`whoShouldAttend`/`meals`)는 제거되었다. `content` 빈값이면 본문 섹션과 training 탭이 비노출된다. sanitize 처리는 하지 않으며(fo에 sanitize 유틸 부재), company blog/press/articles/events 상세·products `GenericProductDetail`과 동일하게 BO 관리자 WYSIWYG를 직접 `dangerouslySetInnerHTML`로 렌더하는 기존 선례를 따른다(신규 의존성 미추가, 동일 신뢰경계).
5. **Duration 단위 표기**: `curriculum_detail2.duration` 원값에 단위가 없어(예: "12") FE 렌더 시 "Hours"를 부기한다(카드/사이드바 공통). bo 저장 데이터 자체는 변경하지 않는다.
6. **Training Type 코드**: `curriculum_detail1.training_type`은 CSV 문자열("001"/"002"/"001,002")이다. `,` split 후 TRAININGTYPE 코드그룹 라벨을 조합해 표시한다.
7. **레거시 자연 제외**: `currMgmt-data`와 동일 패턴 — where 경로 자체가 레거시(camelCase) 구조엔 없어 자연 제외된다(별도 제외 where 불필요).
8. **Google Map(신규 UI, pub에 없음)**: 세션 사이드바 주소 하단에 단일 마커 지도(`TrainingSessionLocationMap.tsx`)를 추가했다. 기존 `geocodeAddress`(`@/lib/geo/geocode`) + `loadGoogleMaps`를 재사용하며, 주소 노출 조건(`shouldShowAddress`)과 동일하게 게이트한다(주소 비노출 시 지도도 비노출). `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 미설정 시 그레이스풀 미렌더(where-to-buy와 동일 제약, 미검증 항목은 STEP 이력 참고).
9. **OG 메타태그(신규)**: 코스/세션 상세 라우트에 `generateMetadata`로 `og:title`/`og:description`/`og:image`를 추가했다. 커리큘럼=부모 `curriculum.title`/`description`/`image[0]`, 세션=`curriculum_detail2.title` + 부모 `curriculum.description`(세션 전용 설명 필드 없음) + 커리큘럼 image. image는 `SITE_URL` 접두 절대경로(`/api/v1/fo/page-files/{id}`). `generateMetadata`와 `page`가 동일 fetch 인자로 호출되어 Next fetch memoization으로 요청이 1회로 합쳐진다. 공용 헬퍼(`fetchTrainingDetailRows`/`buildCourseMetadata`/`buildSessionMetadata`) 추출.

## 7. 데이터 없음(빈 값/매칭 0건) 시 동작
- 1뎁스 오퍼링 행이 0건이면 커리큘럼 상세 자체가 `notFound()` (비고 1)
- 세션 상세 `content`(본문) 빈값이면 본문 섹션 및 training 탭 비노출, 컨테이너 자체는 유지(비고 4)
- Agenda 표에서 모든 행 `trainer`가 빈값이면 Trainer 컬럼(th+td)만 비노출, 표 자체는 유지(2-3절)
- 세션 사이드바 주소는 `training_type`이 Virtual(002) 단독이면 li 자체 비노출, 그에 연동해 Add to Calendar location과 Google Map도 비노출(2-3절)

## 8. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-23 | `TrainingDetailPage.tsx`/`TrainingSessionPage.tsx`(조립 wrapper), `TrainingDetailSchedule.tsx`/`TrainingDetailSession.tsx`, `TrainingDetailHero.tsx`/`TrainingSessionDetail.tsx`/`TrainingSessionDetailAside.tsx` 태깅. slug=`currDtlMgmt-data`(id155) 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-23 | 옵션A 역방향 필터조회(단건 결과[0] 채택) 확정, 부모 병합키 `_fetchedRel8` 실API 병합 확인 |
| STEP3 | fo-dev-doc-writer | 2026-07-23 | 작업 단위 문서 작성(상태: 설계중) |
| B-STEP1~3(경량 갱신) | fo-slug-analyzer → fo-dev-doc-writer | 2026-07-23 | 세션 인터랙션(공유/Add to Calendar/카운트다운)·스케줄 필터·브레드크럼 확정 반영, `training_schedule` 필드 `{id,date,time_from,time_to,title,description,trainer}` 확정 |
| 정정(관계키/카드 노출범위) | fo-dev-doc-writer | 2026-07-23 | 연결제품 관계키를 `_fetchedRel22`(power_list, id=22)/`_fetchedRel23`(automation_list, id=23)로 확정, 카드 노출 필드범위 명확화 |
| **1:N 모델 재확정** | fo-dev-doc-writer | 2026-07-23 | `currMgmt-data` 1 : `currDtlMgmt-data` N이 정상 구조임을 확인하고 문서 전면 재작성. 코스 1뎁스를 "단건 결과[0]"에서 **오퍼링 카드 다건 목록**으로 재정의(where에 `condexpr_training_date_to`+`condval` 과거제외, `sort=curriculum_detail2.training_date_from,asc`, `unpaged=true` 추가). 카드 필드를 전부 "그 행 고유값"으로 재정의(교육일자/접수마감일/제목/대상제품/교육타입CSV/교육시간/조건부주소/상세링크). Hero는 각 오퍼링 행의 `_fetchedRel8.curriculum.*`로 취득하도록 재정의. 세션 2뎁스는 `sessionId`를 **행 PK(숫자)**로 재정의하고 전용 단건 API 없이 1뎁스 목록 재사용 + `id===sessionId` 매칭으로 확정(`findPublicDetail`은 `_fetchedRel` 미병합이라 부적합해 미채택). Agenda 표를 선택된 행의 `training_schedule[]` 실데이터로 재정의. 연결제품 경로를 `curriculum_detail1.power_list`에서 최상위 `power_list`/`automation_list`로 정정. Training Type 필터를 드롭다운 단일선택(퍼블리싱 원본 마크업 유지)으로, Month 필터를 고정옵션(Jun~Oct)으로 명확화. 신규 BE 없음(기존 search+condexpr+sort+applyFetch 재사용) |
| 구현 반영(5개 항목) | fo-dev-doc-writer | 2026-07-23 | 실제 코드 반영 사항 문서화. ① 세션 본문 `curriculum_detail2.content`(WYSIWYG HTML) 동적바인딩 신규 추가(`data-slugkey="content"`+`dangerouslySetInnerHTML`), 정적 Who should attend/Meals 블록·상수(`SHARED_WHO_SHOULD_ATTEND`/`SHARED_MEALS`)·타입 필드(`whoShouldAttend`/`meals`) 제거, content 빈값이면 본문+training 탭 비노출. ② training 탭 라벨 variant별 동적화(`TRAINING_TAB_LABELS`+`buildSessionTabs`), content 없으면 탭 제외+Agenda 탭 클릭 시 최상단 스크롤. ③ `training_schedule[]`을 date+time_from 오름차순 정렬(`sortSchedule`) 후 No 재채번, Add to Calendar first/last도 정렬 배열 기준. ④ Agenda Trainer 컬럼, 전 행 trainer 공란 시 th+td 전체 비노출(`showTrainerColumn`). ⑤ 세션 사이드바 address를 코스 카드와 동일 `shouldShowAddress(training_type)` 게이트로 정합화(Virtual 단독 시 비노출, event.location 연동). 추가로 신규 UI인 Google Map(`TrainingSessionLocationMap.tsx`, 기존 `geocodeAddress`+`loadGoogleMaps` 재사용, 주소 게이트 동일 적용)과 OG 메타(`generateMetadata`, 코스/세션×variant 3종=6개 라우트, `SITE_URL` 절대경로 image) 구현. tsc 통과. SSR HTML·소스 대조로 content 렌더/탭 라벨/Agenda 정렬·재채번/Trainer 컬럼/Virtual 주소·지도 비노출 PASS. 미검증(환경 제약): 지도 실제 타일 렌더(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 미설정, where-to-buy와 동일 제약), 탭 클릭 스크롤 애니메이션(Playwright 브라우저 프로필 점유로 미실행), content 빈값/trainer 전부빈값 조건부 비노출(라이브 데이터 없어 소스 로직만 확인). 신규 API/DB 변경 없음 |
