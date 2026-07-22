# Training Curriculum 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/services/training/components/TrainingCurriculumPage.tsx` (조립 래퍼 — sales/engineering/service-training 3개 라우트가 공유, `variant`로 분기)
> - `fo/src/app/services/training/components/TrainingCurriculum.tsx` (필터 3종 + 검색 + 카드 목록(다건) + 페이지네이션 섹션 — `data-slug="currMgmt-data"` 태깅 완료)
> - `fo/src/app/services/training/components/TrainingCard.tsx` (커리큘럼 카드 1건 — `data-slugkey` 태깅 완료: id/image/product_category/title/description)
> - `fo/src/app/services/training/data/trainingContent.ts` (variant별 화면 메타 집약 — pageId/클래스/섹션id/ariaLabel/`detailHrefPrefix`, 실데이터 조회 로직은 아직 없음)
> - 진입 라우트 3개(공유): `fo/src/app/services/sales-training/page.tsx`(`training_course=03`) · `fo/src/app/services/engineering-training/page.tsx`(`training_course=01`) · `fo/src/app/services/service-training/page.tsx`(`training_course=02`)
> 상태: 개발완료(currMgmt-data 리스트 바인딩 + Lv/Sub Category 계단식 필터 신규 BE 포함)

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
- Lv Category 계단식 필터(하위 `currDtlMgmt-data.power_list`/`automation_list` 배열 포함 여부로 `currMgmt-data` 역추적): **구현 완료 — 신규 전용 엔드포인트**. 기존 공용 `PageDataService`의 조인 검색(`joinr_/joink_/joinv_`)은 `ARRAY_CONTAINS` join_type을 명시적으로 거부(`PageDataService.java:1982-1985`)하고 1-hop 전용이라 2-hop 역추적을 표현할 수 없어(근거는 아래 유지), 공용 코드는 무수정하고 training 전용으로 격리 구현했다:
  - `GET /api/v1/fo/training/curriculum-by-category?categoryIds={콤마구분 category-data PK}&trainingCourse={01|02|03}&page=&size=&sort=` — `FoTrainingController`/`FoTrainingService` 신규
  - HOP-1: `currDtlMgmt-data`에서 `power_list @> id OR automation_list @> id`(주어진 id 목록 중 하나라도 포함, native `jsonb_array_elements_text` + `IN` 매칭)로 `curriculum_detail1.curriculum_id` 수집
  - HOP-2: 수집된 id로 `currMgmt-data`를 기존 게이트(`is_visible='001'`, `training_course`)로 조회, `created_at DESC` + LIMIT/OFFSET 페이징. 응답은 기존 currMgmt-data 목록과 동일한 `PageDataListResponse` 구조라 FE `toTrainingCard` 그대로 재사용
  - `categoryIds`는 **category-data PK**. Lv/Sub Category select 옵션이 "묶음"(depth1/depth2 타이틀)일 때는 그 묶음에 속한 리프(depth3, 제품연결) PK 전부를 모아서 넘김(`resolveCategoryIds`)
  - (구 근거, 참고) FILTER(`rel_`, `:1855-1935`)/eq_/dot-notation/bare-key where는 `data_json->>'key'` 스칼라 텍스트 추출만 지원, JSONB 배열포함 연산자가 where 파서에 없어 공용 확장은 부적합으로 판단하고 격리 엔드포인트를 택함
  - **주의**: `category-data`의 `_fetchedRel17`(has_training 게이트용)은 스칼라가 아니라 제품 전체 객체로 내려옴 — `has_training` 값은 `_fetchedRel17.has_training`(dot-notation 단축키)로 읽어야 함(`_fetchedRel19/20/21`은 스칼라라 그대로 읽으면 됨). FE `trainingData.ts`의 `toCategoryNode`가 이 경로로 구현돼 있음

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
2. **Lv Category 계단식 필터 — 구현 완료**: 3절 참조. Lv Category 옵션(Power=depth1/Automation=depth2 타이틀)·Sub Category 옵션(Power=depth2/Automation=제품명)은 `category-data`(depth3 노드) + 게이트(`product_type`+`has_training=001`)로 파생하고, 실제 목록 필터링은 신규 엔드포인트(`/api/v1/fo/training/curriculum-by-category`)로 처리한다. 로컬 검증용 테스트 데이터로 `currDtlMgmt-data` id 1900(`power_list=[1776]`→`currMgmt-data` 1625)/1901(`automation_list=[1801]`→1628)를 만들어 종단 검증했다(DB에 유지 중).
3. **레거시 데이터 자연 제외 — STEP4 검증 완료**: 4절 참조. 실데이터 39건(신규 6/레거시 33)에서 where 적용 시 레거시 매칭 0건 실측 확인.
4. **참고 패턴**: `fo/src/app/company/data/blogData.ts` / `fo/src/app/company/components/CompanyBlogPage.tsx` 구조(공통 `fetchData`, `XXX_STATUS_WHERE` 상수, `toXxxCard`/`xxxDetailHref` 헬퍼)를 그대로 준용해 STEP6(FE 개발) 시 `trainingData.ts` 유사 헬퍼 파일 신설 예정.
5. **필터/검색 UI 현재 상태**: Category(All/Power/Automation, PRODUCTCATEGORY 코드그룹), 검색(title|description), Lv/Sub Category(옵션 파생 + 실제 목록 필터링) 전부 실API 연동 완료. Category=All이면 Lv/Sub 비활성화, Category/Lv Category 변경 시 하위 선택값 리셋.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-22 | `TrainingCurriculum.tsx`(다건 리스트 wrapper)/`TrainingCard.tsx`(id/image/product_category/title/description) 태깅 완료. slug=`currMgmt-data`(id145) 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-22 | where(training_course variant별 코드 + is_visible=001 고정), 선택 구현(검색 title\|description, Category 필터 product_category), size=10, orderBy=created_at desc 확정. Lv Category 계단식 필터는 설계 방향만 기록, 구현 여부는 STEP3 이후 |
| STEP3 | fo-dev-doc-writer | 2026-07-22 | 작업 단위 문서 작성(상태: 설계중). API 확인: currMgmt-data 목록/category-data/product-data는 기존 활용 가능, Lv Category cascade(ARRAY_CONTAINS 유사)는 확인 필요로 명시 |
| STEP4 | fo-be-analyzer | 2026-07-22 | BO/BO-API 분석·설계. ①currMgmt-data 목록조회: 기존 `FoPageDataController`→`PageDataService.search()`로 신규 BE 불필요 확정(eq_ dot-notation·title\|description OR검색·sort·size 모두 코드+실쿼리 검증). ②레거시 자연제외 실데이터 검증 완료(39건 중 where 매칭 레거시 0건). ③Lv Category cascade는 기존 공개 where로 불가 결론(ARRAY_CONTAINS 거부+2-hop) → 이번 스코프 제외. 신규 BE 개발 항목 없음 |
| STEP5 | fo-fe-builder | 2026-07-22 | Category 필터를 정적 하드코딩(Energy/Motion 포함)에서 PRODUCTCATEGORY 코드그룹 실연동(All/Power/Automation)으로 전환. `TrainingCurriculum.tsx`/`trainingContent.ts`/variant 콘텐츠 3개 파일 수정 |
| Lv/Sub Category 재설계 | 세션+fo-orchestrator | 2026-07-22 | Lv Category(All 비활성/Power=depth1,2/Automation=depth2,3) UX 스펙 재확인 → 옵션 파생을 `category-data`(depth3 노드) + `product-data` 게이트(product_type/has_training)로 확정. depth3은 category가 아니라 product 연결 레코드임을 실API로 확인(`_fetchedRel19/20`=depth2/depth1 타이틀, `_fetchedRel21`=product_type) |
| STEP(BE 분석·구현) | fo-be-analyzer→fo-be-builder | 2026-07-22 | 신규 `FoTrainingController`/`FoTrainingService`(`/api/v1/fo/training/curriculum-by-category`) 2-hop 구현. 공용 `PageDataService` 무수정. 최초 `categoryId`(단일) → 실사용 중 "묶음 선택" 요구로 `categoryIds`(복수, OR 매칭)로 확장 |
| STEP(FE 연동) | fo-fe-builder | 2026-07-23 | `trainingData.ts`에 `TrainingCategoryNode`/`resolveCategoryIds`/`fetchTrainingByCategoryIds` 추가, `TrainingCurriculum.tsx`에 Lv/Sub 선택 시 신규 엔드포인트 호출 분기(미선택 시 기존 currMgmt-data 목록 유지) |
| 버그 수정 | 세션 | 2026-07-23 | `_fetchedRel17` 관계설정이 스칼라→전체 객체로 바뀌어 `hasTraining` 게이트가 0건 매칭되던 문제 발견, `_fetchedRel17.has_training` 경로로 수정(실API 재검증: 게이트 통과 67/67) |
| 종단 검증 | 세션 | 2026-07-23 | 로컬 DB에 테스트용 `currDtlMgmt-data`(id 1900/1901) 삽입 후 신규 엔드포인트로 전체 파이프라인(옵션 파생→categoryIds 변환→2-hop 필터→목록 결과) 실API 검증 완료 |
