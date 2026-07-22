# Training Curriculum 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/services/training/components/TrainingCurriculumPage.tsx` (조립 래퍼 — sales/engineering/service-training 3개 라우트가 공유, `variant`로 분기)
> - `fo/src/app/services/training/components/TrainingCurriculum.tsx` (필터 3종 + 검색 + 카드 목록(다건) + 페이지네이션 섹션 — `data-slug="currMgmt-data"` 태깅 완료)
> - `fo/src/app/services/training/components/TrainingCard.tsx` (커리큘럼 카드 1건 — `data-slugkey` 태깅 완료: id/image/product_category/title/description)
> - `fo/src/app/services/training/data/trainingContent.ts` (variant별 화면 메타 집약 — pageId/클래스/섹션id/ariaLabel/`detailHrefPrefix`, 실데이터 조회 로직은 아직 없음)
> - 진입 라우트 3개(공유): `fo/src/app/services/sales-training/page.tsx`(`training_course=03`) · `fo/src/app/services/engineering-training/page.tsx`(`training_course=01`) · `fo/src/app/services/service-training/page.tsx`(`training_course=02`)
> 상태: 설계 확정(STEP4 BE 분석 완료 — 신규 BE 없음)

## 1. data-slug
- 값: `currMgmt-data` (bo `slug_registry` id=145, `is_active=true`, type=PAGE_DATA)
- 다건 여부: 다건(배열) — 커리큘럼 카드 목록, `TrainingCurriculum.tsx`의 `<ul data-slug="currMgmt-data" data-slug-repeat="true">` / `<li data-slug-item>`에 이미 태깅됨

## 2. data-slugKey 매핑

| slugKey | dataJson 필드(flatten 기준, bare 키) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| id | `id` (PK) | number | 속성(`Link[href]`) | 상세 이동 href `${detailHrefPrefix}/${id}` 파생에 사용. `TrainingCard.tsx`에 `data-slugkey="id" data-slugkey-attr="href"` 태깅 완료 |
| image | `image[0]` (파일id 배열) | number[] | 속성(`img[src]`) | `/api/v1/fo/page-files/{id}`로 렌더. `data-slugkey="image" data-slugkey-attr="src"` 태깅 완료 |
| product_category | `product_category` (코드 P/A) | string(코드) | 텍스트(`p`) | 코드그룹 PRODUCTCATEGORY(P=Power, A=Automation) — 라벨 변환 필요. `data-slugkey="product_category"` 태깅 완료 |
| title | `title` | string | 텍스트(`h3`) | 강의 제목. `data-slugkey="title"` 태깅 완료 |
| description | `description` | string | 텍스트(`p`) | 강의 설명. `data-slugkey="description"` 태깅 완료 |

> 위 5개 slugKey는 `TrainingCard.tsx`에 이미 마크업 태깅되어 있음(STEP1 완료분). 필터(select 3종)·검색 입력은 현재 UI만 있고 상태/API 연동은 없음(정적) — 아래 4절 "선택 구현" 항목 참고.

## 3. API 확인 (최종 체크)
- `currMgmt-data` 목록 조회: **신규 개발 불필요 — STEP4 검증 완료(확정)**. 기존 `FoPageDataController`(`GET /api/v1/fo/page-data/{slug}`) → `PageDataService.search()` 그대로 커버. company blog(`blog-data`)와 동일 패턴. 근거: `PageDataService.java:1330-1350`(eq_ dot-notation `data_json->'curriculum'->>'training_course' = :param`), `:1460-1478`(`title|description` OR 검색 — bare 키를 최상위 + 1단계 중첩 `jsonb_each ... EXISTS`로 탐색하므로 `curriculum` wrapper 안의 title/description도 매칭), `:137-158`(sort=`createdAt,desc` → `created_at DESC` 감사컬럼 매핑), `:165`(size → `LIMIT/OFFSET`). 실쿼리 검증: sales(03)+is_visible=001 → id 1628/1625 정상 반환, `title|description` OR 검색 'power' → id 1625만 정상 반환
- `category-data`/`product-data`(Lv Category 계단식 필터용, 5절 참고): 기존 활용 가능 — products-systems 이관 시 이미 운영 중인 fo 공개 API로 확인됨(`fo/docs/dev/products-systems/category-data-lv1.md` 등 기존 dev 문서 존재)
- Lv Category 계단식 필터(하위 `currDtlMgmt-data.power_list`/`automation_list` 배열 포함 여부로 `currMgmt-data` 역추적, ARRAY_CONTAINS 유사 조건): **기존 공개 where로 불가 — STEP4 결론(이번 스코프 제외 권고)**. 근거:
  - 조인 검색(`joinr_/joink_/joinv_`)은 `PageDataService.java:1982-1985`에서 `ARRAY_CONTAINS` join_type을 **명시적으로 거부**(`log.warn` 후 skip). 게다가 조인 검색은 1-hop 전용이라 (category id → currDtlMgmt-data 배열포함 → curriculum_id → currMgmt-data)의 2-hop 역추적을 표현할 수 없음
  - FILTER(`rel_`, `:1855-1935`)/eq_/dot-notation/bare-key where는 모두 `data_json->>'key'` **스칼라 텍스트 추출**만 사용 — JSONB 배열 포함 연산자(`@>`, `jsonb_array_elements`)가 where 파서에 아예 없음. `appendSlaveKeyInCondition`(`:2094-2101`)도 `IN(...)` 스칼라 매칭
  - slug_relation 실데이터: id=8 `currDtlMgmt-data`→`currMgmt-data` FETCH/EQ(master_key=`curriculum_id`, slave_key=`id`), id=11 `currDtlMgmt-data`→`product-data` FETCH/ARRAY_CONTAINS(master_key=`powerList`). 둘 다 **FETCH(응답 병합) 방향이지 목록 필터(where) 방향이 아님** — 공개 목록 조회의 필터 조건으로 재사용 불가
  - **최소 신규 작업(구현 시)**: ①`resolveJoinFilterIds`의 ARRAY_CONTAINS 가드 해제 + 배열원소 매칭(`jsonb_array_elements_text`) 구현으로 조인검색을 array-contains까지 확장, 또는 ②where 파서에 배열포함 전용 접두사(예: `arr_`) 신설(`data_json->'power_list' @> to_jsonb(:id)`). 단 2-hop 역추적은 여전히 별도 처리 필요 → 난이도 높음
  - 사용자가 우선순위 낮다고 명시 → **이번 스코프 생략**(Lv Category select 미구현). Category(All/Power/Automation) 필터·검색은 5절대로 정상 진행

## 4. 조회 조건
- where(필수):
  - `eq_curriculum.training_course={코드}` — variant별 값: sales=`03`, engineering=`01`, service=`02`
  - `eq_curriculum.is_visible=001` — 공개 게이트(고정, variant 무관 공통)
- where(선택 구현 — 검색): `{"title|description": 검색어}` (제목+설명 OR 검색)
- where(선택 구현 — Category 필터, All/Power/Automation): `eq_curriculum.product_category={P|A}` — All 선택 시 이 조건 미포함
- row limit(다건 개수): `size=10` (페이지네이션)
- orderBy: `created_at desc` (최신등록순) — 관리자 화면(`currMgmt-list`)에 수동 정렬 필드가 없어 이 기준으로 확정
- 2차 정렬(tie-breaker): 불필요(created_at 동률 사실상 없음), 필요 시 `id desc` 추가 가능
- 신규 구조 한정: `curriculum.*`(snake_case) 필드만 대상. 레거시 `currMgmtForm.*`(camelCase) 데이터는 `curriculum` wrapper 자체가 없어 `data_json->'curriculum'->>'training_course'`가 NULL → `NULL = '03'` = NULL(미매칭)으로 자연 제외 — 별도 제외 where 불필요. ✅ **STEP4 실데이터 검증 완료**: `page_data(data_slug='currMgmt-data')` 총 39건 중 신규 `curriculum` 구조 6건 / 레거시 `currMgmtForm` 구조 33건. where(`curriculum.training_course='03' AND curriculum.is_visible='001'`) 적용 시 레거시 33건 중 매칭 **0건**으로 실측 확인. PostgreSQL `->`가 없는 키에 대해 에러 없이 NULL 반환하므로 안전

## 5. 샘플 응답 데이터

> ✅ **STEP4 실데이터 검증 완료** — 아래 구조(wrapper 키 `curriculum`, 필드 `title`/`description`/`image`(파일id 배열)/`product_category`(P/A)/`training_course`(01/02/03)/`is_visible`(001/002))는 bo `page_data` 실데이터(id 1624~1628, 1589 등)와 일치 확인. `templateSlug`은 실제 `currMgmt-detail`.

```json
{
  "content": [
    {
      "id": 101,
      "templateSlug": "currMgmt-detail",
      "dataJson": {
        "curriculum": {
          "title": "예시 강의 제목",
          "description": "예시 강의 설명",
          "image": [1234],
          "product_category": "P",
          "training_course": "03",
          "is_visible": "001"
        }
      }
    }
  ]
}
```

## 6. 비고
1. **상세 이동 링크만 배선, 상세 페이지 미개발**: `TrainingCard.tsx`는 `${detailHrefPrefix}/${id}` href를 렌더하지만(`/services/{variant}-training/{id}`), 3종 라우트 모두 `[courseId]/page.tsx` 상세 라우트가 없어 클릭 시 404가 발생함. 사용자 명시 허용된 사항이며, 이번 문서·개발 스코프에 상세 라우트 개발은 포함하지 않음.
2. **Lv Category 계단식 필터(이번 스코프 제외 확정)**: 목록 필터링은 `currDtlMgmt-data.power_list`/`automation_list` 배열 포함 → `curriculum_id` → `currMgmt-data` 역추적(2-hop) 구조인데, **STEP4 분석 결과 기존 공개 API where 문법으로는 불가**(조인검색이 ARRAY_CONTAINS를 거부하고 1-hop 전용, where 파서에 JSONB 배열포함 연산자 없음 — 3절 근거 참조). 사용자 우선순위 낮음 명시 → Lv Category select는 미구현. 구현이 필요해지면 BE 신규 작업(조인검색 ARRAY_CONTAINS 확장 or 배열포함 접두사 신설 + 2-hop 처리) 선행 필요.
3. **레거시 데이터 자연 제외 — STEP4 검증 완료**: 4절 참조. 실데이터 39건(신규 6/레거시 33)에서 where 적용 시 레거시 매칭 0건 실측 확인.
4. **참고 패턴**: `fo/src/app/company/data/blogData.ts` / `fo/src/app/company/components/CompanyBlogPage.tsx` 구조(공통 `fetchData`, `XXX_STATUS_WHERE` 상수, `toXxxCard`/`xxxDetailHref` 헬퍼)를 그대로 준용해 STEP6(FE 개발) 시 `trainingData.ts` 유사 헬퍼 파일 신설 예정.
5. **필터/검색 UI 현재 상태**: `TrainingCurriculum.tsx`의 카테고리/Lv Category/서브카테고리 select 3종과 검색 입력은 현재 로컬 state만 있고 실제 API 파라미터 연동은 없음(정적) — 검색과 Category(All/Power/Automation) 필터는 "선택 구현" 항목으로 이번 스펙에 포함되나, Lv Category select는 위 2번 항목(확인 필요)이 해결되기 전까지 미구현.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-22 | `TrainingCurriculum.tsx`(다건 리스트 wrapper)/`TrainingCard.tsx`(id/image/product_category/title/description) 태깅 완료. slug=`currMgmt-data`(id145) 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-22 | where(training_course variant별 코드 + is_visible=001 고정), 선택 구현(검색 title\|description, Category 필터 product_category), size=10, orderBy=created_at desc 확정. Lv Category 계단식 필터는 설계 방향만 기록, 구현 여부는 STEP3 이후 |
| STEP3 | fo-dev-doc-writer | 2026-07-22 | 작업 단위 문서 작성(상태: 설계중). API 확인: currMgmt-data 목록/category-data/product-data는 기존 활용 가능, Lv Category cascade(ARRAY_CONTAINS 유사)는 확인 필요로 명시 |
| STEP4 | fo-be-analyzer | 2026-07-22 | BO/BO-API 분석·설계. ①currMgmt-data 목록조회: 기존 `FoPageDataController`→`PageDataService.search()`로 신규 BE 불필요 확정(eq_ dot-notation·title\|description OR검색·sort·size 모두 코드+실쿼리 검증). ②레거시 자연제외 실데이터 검증 완료(39건 중 where 매칭 레거시 0건). ③Lv Category cascade는 기존 공개 where로 불가 결론(ARRAY_CONTAINS 거부+2-hop) → 이번 스코프 제외. 신규 BE 개발 항목 없음 |
