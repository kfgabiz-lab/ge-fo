# Company Careers 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/company/components/CompanyCareersPage.tsx`의 `CareersJobsSection`(`<ul className="company-careers-jobs__grid">`) / `CareersJobCard`(`<li className="company-careers-jobs__card">`) — 채용공고 목록 반복 영역, STEP1 마크업 태깅 완료
> - `fo/src/app/company/data/careersContent.ts`의 `fetchCareersJobs()` — STEP6에서 공통 계층 `fetchData` 위임 방식으로 구현 완료
> - `CareersTitleSection` / `CareersLinkedInSection`은 이번 스코프 범위 밖(정적 유지, `data-slug` 태깅 대상 아님)
> 상태: 승인됨

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

> ⚠️ 위 두 필드 외에 `sort_order`(정렬 순서, 문자열 저장 — 라이브 API 응답 실측 확인), `is_visible`(공개여부 코드, "001"=공개/"002"=비공개)이 dataJson에 함께 존재하나, 이 둘은 화면에 직접 렌더되는 값이 아니라 **조회 조건(where/정렬) 전용 필드**라 `data-slugkey` 마크업 대상이 아니다(4절 참고).

## 3. API 확인 (최종 체크)
- 신규 API 필요 여부: **신규 불필요, 기존 엔드포인트 재사용 확정** (STEP4 fo-be-analyzer 검증 완료)
- 참고 엔드포인트: `GET /api/v1/fo/page-data/careers-data` (`FoPageDataController.search` → `PageDataService.search`) — 공개 다건 `size=100` 조회로 충족
- where 표기 확정: `eq_careers.is_visible=001` (dot-notation, 섹션키 `careers`) — bo-api `appendWhereConditions`가 `.` 포함 키를 `buildJsonPath`로 `data_json->'careers'->>'is_visible'`에 정확 매칭함을 코드로 확인. prefix 없는 `eq_is_visible`도 동작은 하나 전 섹션 fallback 탐색이라 정밀도가 낮아 dot-notation 유지가 최종안.

## 4. 조회 조건
- where(필터 조건식, evalConditionExpr 문법): `eq_careers.is_visible=001` (공개만)
- row limit(단건 / 다건 개수): 다건, `size=100`
- 정렬: 서버 orderBy 미사용(4-1 참고). 클라이언트에서 `sort_order` 숫자 캐스팅 오름차순 + 결측치 뒤로 + `updatedAt` DESC tie-breaker 적용

## 5. 샘플 응답 데이터

> ✅ 아래는 라이브 API 호출(`curl http://localhost:8080/api/v1/fo/page-data/careers-data?eq_careers.is_visible=001&size=100`)로 **실측 확인**한 구조다. dev_db_dump.sql 실측으로도 동일 스키마(`careers.{title, description, is_visible, sort_order}`) 확인됨(page_data id 1629/1630).

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

### 6-1. STEP4 검증 결과 (STEP1에서 인계된 BE 확인 필요 항목)
1. `orderBy`(`careers.sort_order`) 서버 파라미터 지원 여부 → **서버 정렬 미사용으로 확정.** `sort_order`가 문자열 저장이라 2번 이슈와 함께 클라이언트 정렬로 대체.
2. `sort_order` 문자열 저장으로 인한 사전식 정렬 오류 가능성 → **확정.** 서버 sort 미사용, 클라이언트(`careersContent.ts`의 `sortCareersJobs`)에서 `Number()` 캐스팅 오름차순 정렬 + 결측치는 뒤로 + `updatedAt` DESC tie-breaker로 처리.
3. 구 스키마(`careersForm.*`) 레코드가 where 조건에서 자연 제외되는지 → **확정.** `eq_careers.is_visible` dot-notation where가 `careers` 섹션 경로만 겨냥하므로, 다른 섹션키(`careersForm`)를 쓰는 레거시 행은 별도 방어 로직 없이 자연 제외됨.

### 6-2. 범위 확정 사항
- `careersLinkedInCta.href`(LinkedIn 링크)는 이번 데이터바인딩 범위 밖 — 기존 정적값 유지(사용자가 제공한 URL과 이미 일치 확인됨)
- `CareersTitleSection`/`CareersLinkedInSection`은 이번 스코프에 포함되지 않으며 정적 상태 유지

## 7. STEP별 진행 이력
| STEP | 담당 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-21 | `CompanyCareersPage.tsx`의 `company-careers-jobs__grid`(`CareersJobCard`) 영역에 `data-slug="careers-data"`(+`data-slug-repeat`), `data-slug-item`, `data-slugkey="title"`, `data-slugkey="description"` 마크업 태깅 완료. `CareersTitleSection`/`CareersLinkedInSection`은 범위 밖 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-21 | dev_db_dump.sql 실측으로 slug 등록 상태(`careers-data`, PAGE_DATA, active=true) 및 필드(`title`/`description`/`sort`/`is_visible`) 확인. where(`eq_careers.is_visible=001`), row limit(다건 `size=100`) 확정. BE 확인 필요 항목 3건을 STEP3로 인계 |
| STEP3 | fo-dev-doc-writer | 2026-07-21 | 작업 단위 문서 신규 작성(상태: 설계중). API 확인 결과 "확인 필요"로 명시, STEP1 인계 BE 확인 필요 항목 3건을 6-1절에 보존 |
| STEP4 | fo-be-analyzer | 2026-07-23 | 신규 BE 불필요 확정(기존 `FoPageDataController`/`PageDataService.search` 재사용). where dot-notation(`eq_careers.is_visible=001`) 코드 검증 완료. STEP1/2 인계 확인 필요 항목 3건 모두 검증 완료(서버 정렬 미사용/클라 정렬 확정, 레거시 섹션 자연 제외 확정) |
| STEP5 | fo-be-analyzer | 2026-07-23 | 신규 BE 개발 없음(no-op) — STEP4에서 기존 엔드포인트 재사용으로 판정되어 BE 코드 변경 대상 없음 |
| STEP6 | fo-fe-builder | 2026-07-23 | `careersContent.ts`의 `fetchCareersJobs()`를 커스텀 fetch(`CAREERS_ENDPOINT` 상수, `CareersJobsResponse` 인터페이스, `fetchApi` 직접 호출)에서 공통 계층 `fetchData` 위임 방식으로 리팩토링. slug/size/where는 그대로 유지하고 flatten·정렬(`toCareersJob`/`sortCareersJobs`)은 리턴함수 콜백 내부로 캡슐화. `CompanyCareersPage.tsx` 호출부 시그니처 변경 없음. `npx tsc --noEmit` careers 관련 오류 0건 |
