# Training 상세페이지(코스 1뎁스 + 세션 2뎁스) 데이터 바인딩 설계

> 대상 파일:
> - 코스 상세(1뎁스): `fo/src/app/services/training/components/TrainingDetailPage.tsx`(조립 래퍼, `data-slug="currDtlMgmt-data"` 단건 태깅 완료) + `TrainingDetailHero.tsx`(부모 curriculum 히어로) + `TrainingDetailSchedule.tsx`(중첩 다건 wrapper `data-slug="training_schedule" data-slug-repeat="true"`) + `TrainingDetailSession.tsx`(세션 카드, `data-slug-item`)
> - 세션 상세(2뎁스): `fo/src/app/services/training/components/TrainingSessionPage.tsx`(동일 slug 단건 태깅 완료) + `TrainingSessionDetail.tsx`(헤더: category/title) + `TrainingSessionDetailAside.tsx`(사이드바: date/duration/training_type/capacity/address/phone/email)
> - 진입 라우트(variant 3종 × 2뎁스, 공유): `fo/src/app/services/{sales|engineering|service}-training/[courseId]/page.tsx`, `.../[courseId]/[sessionId]/page.tsx`
> 상태: 설계중 (사용자 승인 하 오케스트레이터/서브에이전트 판단으로 STEP4까지 연속 진행 중)

## 1. data-slug
- 값: `currDtlMgmt-data` (bo `slug_registry` id=155, type=PAGE_DATA, `is_active=true`)
- 다건 여부: 단건(코스 상세/세션 상세 공통 — 옵션A 역방향 필터조회 결과[0]) + 그 내부에 `training_schedule` 중첩 다건(서브리스트, repeat)
- 실DB 현황: `page_data(data_slug='currDtlMgmt-data')` 38건 중 snake_case 정본 스키마(`curriculum_detail1/2/3`) 7건. 레거시 camelCase(`currDltMgmtForm*`)는 이번 문서 where 조건 경로 자체가 없어 자연 제외됨(별도 제외 where 불필요, `currMgmt-data`와 동일 패턴)

### 조회/연결 방식 — 옵션A 역방향 필터조회
- `GET /api/v1/fo/page-data/currDtlMgmt-data?eq_curriculum_detail1.curriculum_id={courseId}&eq_curriculum_detail3.is_visible=001&sort=updatedAt,desc` → 결과[0]을 단건으로 채택
  - `courseId` = 부모 `currMgmt-data.id`(URL 세그먼트, 리스트 카드 href `${detailHrefPrefix}/${id}`에서 전달)
  - 부모 `curriculum`(리스트와 동일 레코드)은 응답 필드 `_fetchedRel8`(slug_relation id=8, `curriculum_id` EQ `currMgmt-data.id`, join_type=FETCH)로 자동 병합됨 — 실API로 병합 확인됨
- 세션 2뎁스(`sessionId`, uuid)는 별도 API 조회 없음 — 위 코스 단건 조회 결과의 `training_schedule` 배열에서 `id === sessionId` 매칭 1건을 FE에서 선택(STEP6 구현 대상)
- 공개 게이트(이중 방어):
  - 서버 where: `eq_curriculum_detail3.is_visible=001`
  - FE 재판정: `_fetchedRel8.curriculum.is_visible !== "001"` 이면 `notFound()` (부모 커리큘럼 자체가 비공개로 전환된 경우 대비)

## 2. data-slugKey 매핑

### 2-1. 코스 상세(1뎁스)

**Hero — `TrainingDetailHero.tsx`** (모두 부모 `_fetchedRel8.curriculum.*`, 리스트 카드와 동일 원천)

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| image | `_fetchedRel8.curriculum.image[0]`(파일id 배열) | number[] | 속성(`img[src]`) | `/api/v1/fo/page-files/{id}`로 렌더. 태깅 완료 |
| product_category | `_fetchedRel8.curriculum.product_category`(코드 P/A) | string(코드) | 텍스트(`p`) | PRODUCTCATEGORY 코드그룹 — 라벨 변환 필요. 태깅 완료 |
| title | `_fetchedRel8.curriculum.title` | string | 텍스트(`h1`) | 태깅 완료 |
| description | `_fetchedRel8.curriculum.description` | string | 텍스트(`p`) | 태깅 완료 (`curriculum_detail2.description` 오버라이드 후보 있었으나 리스트 연속성 우선해 부모 값 채택) |

**Schedule 중첩 다건 — `TrainingDetailSchedule.tsx` / `TrainingDetailSession.tsx`** (`data-slug="training_schedule" data-slug-repeat="true"`, 아이템 `data-slug-item`)

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| date | `training_schedule[n].date` | string | 텍스트(`p`) | 세션 날짜. 태깅 완료 |
| title | `training_schedule[n].title` | string | 텍스트(`h2`) | 세션 제목(코스 제목 `detail.title`은 현재 폴백 표시용 — STEP6에서 세션 title로 교체 여부 확정). 태깅 완료 |
| id | `training_schedule[n].id`(uuid) | string | 속성(`Link[href]`) | 세션 상세 href `${hrefPrefix}/${courseId}/${id}` 파생. 태깅 완료 |

> ⚠️ **필드명 gap(STEP4 재확인 대상)**: `page_template(slug='currDltMgmt-basicInfo', id=108)` config_json 기준 `training_schedule` 정본 필드는 `date / time(dateRange) / title / description / trainer` 5개. 반면 실데이터 관찰치는 `training_*` 접두사·`time_from/time_to` 분리형이 섞여 있어 과거/테스트 변형으로 판단, 신뢰하지 않음. STEP4에서 정본 config_json과 실데이터를 재대조해 최종 필드명을 확정해야 함.

**코스레벨 단건 필드 — 반복 카드에 동일 표시 (`TrainingDetailSession.tsx`, 현재 미태깅/주석 표기)**

| 화면 항목 | 예상 dataJson 필드 | 설명 |
|---|---|---|
| trainingType | `curriculum_detail1.training_type`(코드→라벨) | 반복 아이템이 아닌 부모 단건 값이라 slugKey로 태깅하지 않고 STEP6에서 코드로 채움 |
| duration | `curriculum_detail2.duration` | 상동 |
| location | `curriculum_detail2.address` | 상동 |
| productsCovered | `curriculum_detail1.power_list` / `curriculum_detail1.automation_list` → `product-data` 제품명 | 관계키(`_fetchedRelN`) 미확정 — 3절 참고, **확인 필요** |
| closesLabel(접수마감 라벨) | `curriculum_detail2.register_date_to` 기반 산출 추정 | `training_schedule` 스키마에 대응 필드 없음 — 산출식 **확인 필요** |

### 2-2. 세션 상세(2뎁스)

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| product_category | `_fetchedRel8.curriculum.product_category` | string(코드) | 텍스트(`p`) | 부모 값, 코스 상세와 동일. 태깅 완료 |
| title | 매칭된 `training_schedule[n].title` | string | 텍스트(`h1`) | STEP6에서 `sessionId` 매칭 후 채움. 태깅 완료(슬롯만) |
| date | 매칭된 `training_schedule[n].date` | string | 텍스트(`p`) | 태깅 완료 |
| duration | `curriculum_detail2.duration` | string | 텍스트(`p`) | 코스레벨. 태깅 완료 |
| training_type | `curriculum_detail1.training_type`(코드→라벨) | string(코드) | 텍스트(`p`) | 코스레벨. 태깅 완료 |
| capacity | `curriculum_detail2.capacity` | string/number | 텍스트(`p`) | 코스레벨. 태깅 완료 |
| address | `curriculum_detail2.address` | string | 텍스트(`li`) | 코스레벨. 태깅 완료 |
| phone | `curriculum_detail2.phone` | string | 텍스트(`li`) | 코스레벨. 태깅 완료 |
| email | `curriculum_detail2.email` | string | 텍스트(`li`) | 코스레벨. 태깅 완료 |
| (미태깅) 장소명 | 대응 필드 없음(gap) | - | 텍스트 | `curriculum_detail2`에 장소명 필드 없음 — **확인 필요**(6절 참고) |
| (미태깅) productsCovered | `power_list`/`automation_list` → `product-data` | - | 텍스트/반복 | 코스 상세와 동일 gap — **확인 필요** |

## 3. API 확인 (최종 체크)
- **코스 단건조회: 신규 개발 불필요.** 기존 `FoPageDataController`(`GET /api/v1/fo/page-data/{slug}`) → `PageDataService.search()`가 옵션A 역방향 where(`eq_curriculum_detail1.curriculum_id`, `eq_curriculum_detail3.is_visible`) + `_fetchedRel8` FETCH 병합(부모 `curriculum` 자동 병합)까지 실API로 검증됨. `currMgmt-data` 목록 조회와 동일한 `fetchData` 브랜치를 재사용 가능
- **연결제품(power_list/automation_list → product-data) 표시: 신규 필요 — 확인 필요(STEP4 확정 대상).** 현재 `slug_relation` id=11은 master_key가 camel `powerList`(ARRAY_CONTAINS/FETCH)라 snake_case `power_list`/`automation_list`엔 매칭되지 않고, 실측상 기존 relation 11조차 `_fetchedRel11` 산출 0건으로 확인됨. snake_case 전용 신규 `slug_relation`(power_list/automation_list → product-data) 추가 + 기존 relation 11 산출 0건 원인 규명이 STEP4/5 과제
- 세션 매칭(`training_schedule[n].id === sessionId`): 신규 API 불필요 — 코스 단건 조회 응답 내 배열에서 FE 선택 로직만 필요(STEP6)

## 4. 조회 조건
- where(필수, 코스/세션 공통):
  - `eq_curriculum_detail1.curriculum_id={courseId}`
  - `eq_curriculum_detail3.is_visible=001`
- sort: `updatedAt,desc`
- row limit: 단건(결과[0] 채택)
- 세션 2뎁스 전용: 별도 where 없음 — 위 코스 단건 응답의 `training_schedule` 배열을 FE에서 `id===sessionId` 필터
- 공개 게이트 이중 방어: 서버 where(`is_visible=001`) + FE 재판정(`_fetchedRel8.curriculum.is_visible==="001"` 아니면 `notFound()`)
- 신규 구조 한정: `curriculum_detail1/2/3.*`(snake_case) 정본만 대상. 레거시 camelCase는 where 경로 자체가 없어 매칭되지 않음(자연 제외)

## 5. 샘플 응답 데이터

> ⚠️ 아래는 STEP1/2 확정 값(where·병합키·필드 존재)을 기반으로 한 구조 예시이며, `training_schedule` 내부 필드명은 **추정**(`page_template` id=108 config_json 기준: date/time/title/description/trainer). 실데이터 관찰치와 불일치 가능성이 있어 STEP4에서 재확인 필요.

```json
{
  "content": [
    {
      "id": 1900,
      "templateSlug": "currDltMgmt-basicInfo",
      "dataJson": {
        "curriculum_detail1": {
          "curriculum_id": 1625,
          "training_type": "01",
          "power_list": [1776],
          "automation_list": []
        },
        "curriculum_detail2": {
          "duration": "2 Days",
          "capacity": 20,
          "address": "123 Example Ave, Seoul",
          "phone": "02-1234-5678",
          "email": "training@example.com",
          "register_date_to": "2026-08-01"
        },
        "curriculum_detail3": {
          "is_visible": "001"
        },
        "training_schedule": [
          {
            "id": "b3f1c2a0-1111-4a2b-9c3d-000000000001",
            "date": "2026-08-15",
            "title": "예시 세션 제목",
            "description": "예시 세션 설명",
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
      }
    }
  ]
}
```

## 6. 비고
1. **연결제품 관계키 미확정 — 확인 필요(STEP4)**: `power_list`/`automation_list`(코스레벨 다건) → `product-data` 제품명 매핑에 쓸 `_fetchedRelN`이 아직 없음. 기존 relation id=11(camel `powerList`) 재사용 불가, snake_case 신규 relation 추가 + 다건 렌더 구조(반복 vs 조인 문자열) 결정 필요
2. **closesLabel(접수마감 라벨) 산출식 — 확인 필요**: `training_schedule` 스키마에 대응 필드가 없어 `curriculum_detail2.register_date_to` 기반 산출로 추정. 확정 안 됨
3. **사이드바 장소명(location.name) 대응 필드 부재 — 확인 필요**: `curriculum_detail2`에 주소/전화/이메일은 있으나 장소명 필드가 없음(gap). bo 관리자 화면에서 실제 입력 필드 존재 여부 확인 필요
4. **코스레벨 단건 필드 → 반복 카드 바인딩 로직**: `trainingType`/`duration`/`location`은 `training_schedule` 아이템 필드가 아니라 코스 단건 값을 모든 카드에 동일 표시하는 구조. STEP6에서 부모 단건 레코드 값을 반복 렌더 시 주입하는 로직 필요(현재 마크업엔 slugKey 미태깅, 주석으로만 표기)
5. **`training_schedule` 필드명 재확인 필요(STEP4)**: 2-1절 참고. config_json 정본(date/time/title/description/trainer)과 실데이터 관찰치(training_* 접두사, time_from/time_to 분리형) 불일치 — 최종 필드명 확정 전까지 임시로 정본 필드명 기준 태깅
6. **레거시 자연 제외**: `currMgmt-data`와 동일 패턴 — 별도 제외 where 불필요(where 경로 자체가 레거시 구조엔 없음)
7. **정적 유지(대응 bo 필드 없음, 바인딩 대상 아님)**: Agenda 표(No1~7)/Who should attend/Meals/카운트다운/공유버튼/recaptcha/캘린더연동(Google·iCal)/등록폼(제출 연동 없음) — 이번 데이터 바인딩 스코프 밖

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-23 | `TrainingDetailPage.tsx`/`TrainingSessionPage.tsx`(단건 wrapper), `TrainingDetailSchedule.tsx`/`TrainingDetailSession.tsx`(training_schedule 중첩 다건: date/title/id), `TrainingDetailHero.tsx`/`TrainingSessionDetail.tsx`/`TrainingSessionDetailAside.tsx`(단건 필드) 태깅 완료. slug=`currDtlMgmt-data`(id155) 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-23 | 옵션A 역방향 필터조회(`eq_curriculum_detail1.curriculum_id`+`eq_curriculum_detail3.is_visible=001`, `sort=updatedAt,desc`, 결과[0]) 확정. 부모 병합키 `_fetchedRel8`(slug_relation id=8) 실API로 병합 확인. 세션 2뎁스는 별도 조회 없이 FE `id===sessionId` 선택으로 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-23 | 작업 단위 문서 작성(상태: 설계중). API 확인: 코스 단건조회는 기존 `PageDataService.search()`로 신규 BE 불필요(확정), 연결제품(power_list/automation_list→product-data)은 확인 필요로 명시. 미해결 항목(연결제품 관계키/closesLabel 산출식/장소명 gap/training_schedule 필드명 gap/코스레벨→반복카드 바인딩)을 6절에 정리 |
