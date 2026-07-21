# Company Careers 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/components/CompanyCareersPage.tsx`의 `CareersJobsSection`(`<ul className="company-careers-jobs__grid">`) / `CareersJobCard`(`<li className="company-careers-jobs__card">`) — 채용공고 목록 반복 영역, STEP1 마크업 태깅 완료
> - `CareersTitleSection` / `CareersLinkedInSection`은 이번 스코프 범위 밖(정적 유지, `data-slug` 태깅 대상 아님)
> 상태: 설계중

## 1. data-slug
- 값: `careers-data` (dev_db_dump.sql 실측 — bo `slug_registry`에 `PAGE_DATA` 타입, `active=true`로 이미 등록되어 있음 확인)
- 다건 여부: 다건(배열)

## 2. data-slugkey 매핑

```html
<ul className="company-careers-jobs__grid" data-slug="careers-data" data-slug-repeat="true">
  <li className="company-careers-jobs__card" data-slug-item>
    <h3 className="company-careers-jobs__card-title" data-slugkey="title"></h3>
    <ul className="company-careers-jobs__card-list" data-slugkey="description">
      <!-- STEP6: 현재 duties 불릿 리스트 렌더 → description 텍스트를 줄바꿈 유지(white-space: pre-line)로 그대로 렌더하는 방식으로 교체 예정(사용자 확정 지시, 리스트 파싱 금지) -->
    </ul>
  </li>
</ul>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 설명 |
|---|---|---|---|
| title | `title` (섹션 `careers` 단일 섹션, `flattenPageDataItem` 후 root 병합) | string | 채용 직무명, `h3` 텍스트 |
| description | `description` (섹션 `careers`, flatten 후 root 병합) | string(textarea, 줄바꿈 포함) | 직무 설명 — STEP6에서 duties 불릿 리스트 대신 description 값 그대로(줄바꿈 유지) 렌더링 예정 |

> ⚠️ 위 두 필드 외에 `sort_order`(정렬 순서, 문자열 저장 — 라이브 API 응답 실측 확인), `is_visible`(공개여부 코드, "001"=공개/"002"=비공개)이 dataJson에 함께 존재하나, 이 둘은 화면에 직접 렌더되는 값이 아니라 **조회 조건(where/orderBy) 전용 필드**라 `data-slugkey` 마크업 대상이 아니다(4절 참고).

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **확인 필요** — 기존 `FoPageDataController` + `PageDataService.search()` 재사용 추정이나, STEP1에서 지적된 3가지 항목(orderBy 파라미터 지원 여부, sort 문자열 정렬 이슈, 구 스키마 레코드 제외 여부)이 코드로 검증되지 않아 단정하지 않음. 최종 판정은 fo-be-analyzer(STEP4)에서 확인.
- (기존 활용 가능 시) 참고 엔드포인트(추정): `GET /api/v1/fo/page-data/careers-data?eq_careers.is_visible=001&sort=careers.sort_order,asc&size=100`
- (신규 필요 시) 제안 엔드포인트: 해당 없음 — 확인 결과에 따라 STEP4에서 판단

## 4. 조회 조건
- where(필터 조건식, evalConditionExpr 문법): `eq_careers.is_visible=001` (공개만)
- row limit(단건 / 다건 개수): 다건, `size=100`
- orderBy(참고— 위 표에 없는 항목이나 조회 조건에 필요하므로 기록): `careers.sort_order` 오름차순 + tie-breaker `updated_at` DESC (message_resource 문구 근거: "숫자가 중복될 경우 수정일시가 최신인 Job Description이 표시됩니다"). ⚠️ 실제 BO 필드명은 `sort_order`(라이브 API 실측)

## 5. 샘플 응답 데이터

> ✅ 아래는 라이브 API 호출(`curl http://localhost:8080/api/v1/fo/page-data/careers-data?eq_careers.is_visible=001&size=100`)로 **실측 확인**한 구조다. 정렬 필드의 실제 이름은 `sort`가 아니라 **`sort_order`**(문자열 저장)임이 확인되었다.

```json
{
  "content": [
    {
      "id": 1900,
      "dataJson": {
        "careers": {
          "title": "테스트555",
          "description": "테스트555",
          "sort_order": "5",
          "is_visible": "001"
        }
      }
    }
  ],
  "totalElements": 0
}
```

## 6. 비고

### 6-1. STEP1에서 인계된 BE 확인 필요 항목 (STEP4에서 코드/실호출로 검증 예정)
1. `orderBy`(`careers.sort_order`)를 서버 파라미터로 지원하는지 여부 — `PageDataService`의 `sort` dot-notation 규칙이 이 필드에도 그대로 적용되는지 확인 필요
2. `sort_order` 값이 문자열로 저장되어 있어 "10" vs "9" 같은 사전식(lexicographic) 정렬 오류가 발생할 수 있음 — 숫자 캐스팅(예: `(data_json->'careers'->>'sort_order')::int`) 처리가 필요한지 확인 필요
3. 구 스키마 레코드(`careersForm.*` 키 사용, id 1019/1066 등 — 현재 `careers.title`/`careers.description` 스키마와 다른 필드명)가 `eq_careers.is_visible` where 조건 평가 시 자연히 결과에서 제외되는지, 아니면 별도 방어 로직이 필요한지 확인 필요

### 6-2. 범위 확정 사항
- `careersLinkedInCta.href`(LinkedIn 링크)는 이번 데이터바인딩 범위 밖 — 기존 정적값 유지(사용자가 제공한 URL과 이미 일치 확인됨)
- `CareersTitleSection`/`CareersLinkedInSection`은 이번 스코프에 포함되지 않으며 정적 상태 유지

## 7. STEP별 진행 이력
| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-21 | `CompanyCareersPage.tsx`의 `company-careers-jobs__grid`(`CareersJobCard`) 영역에 `data-slug="careers-data"`(+`data-slug-repeat`), `data-slug-item`, `data-slugkey="title"`, `data-slugkey="description"` 마크업 태깅 완료. `CareersTitleSection`/`CareersLinkedInSection`은 범위 밖 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-21 | dev_db_dump.sql 실측으로 slug 등록 상태(`careers-data`, PAGE_DATA, active=true) 및 필드(`title`/`description`/`sort`/`is_visible`) 확인. where(`eq_careers.is_visible=001`), row limit(다건 `size=100`), orderBy(`careers.sort` asc + `updated_at` DESC tie-breaker) 확정. BE 확인 필요 항목 3건을 STEP3로 인계 |
| STEP3 | fo-dev-doc-writer | 2026-07-21 | 작업 단위 문서 신규 작성(상태: 설계중). API 확인 결과 "확인 필요"로 명시, 샘플 응답 데이터는 "추정"으로 명시, STEP1 인계 BE 확인 필요 항목 3건을 6-1절에 그대로 보존 |
