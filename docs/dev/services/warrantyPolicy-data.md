# Warranty Policy Coverage 제품 보증표 데이터 바인딩 설계

> 대상 파일: `fo/src/app/services/warranty-policy/components/WarrantyPolicyCoverage.tsx` (`<tbody>` 제품 보증표만 — 그 외 섹션은 정적 유지)
> 상태: 설계완료·승인됨 — STEP6 FE 연동 진행 중

## 0. 이번 범위 제외(정적 유지)
`coverage.title/cardsHeading/cards/cardsFootnote/notesTitle/notes`, `banner.*`, `extension.*`, `apply.*`, `numBadgeIcon` 등 제품 보증표(`tableRows`) 외 모든 섹션은 `fo/src/data/services/warrantyPolicyContent.ts` 정적 데이터를 그대로 유지한다. slug 바인딩 대상이 아니다.

## 1. data-slug
- 값: `warrantyPolicy-data` (bo `slug_registry` id=40, `is_active=true`, type=PAGE_DATA — STEP4 developer DB 직접 조회로 실존 확인 완료)
- 다건 여부: 다건(목록) — `page_data` 9레코드(제품별 보증기간 목록), `template_slug`=`warrantyPolicy-detail`. 각 레코드 1행.
- 태깅 위치: `WarrantyPolicyCoverage.tsx`의 `<tbody data-slug="warrantyPolicy-data" data-slug-repeat="true">`, 각 `<tr data-slug-item>` (기 적용 완료, STEP1-2 재조정).

## 2. data-slugkey 매핑

| slugKey | bo dataJson 필드(2세대 fallback) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| product | `warranty_policy.product_name` ?? `warrantyPolicyForm.productNm` | string | 텍스트(`th`) | 제품명 |
| category | `warranty_policy.product_type` ?? `warrantyPolicyForm.productType` (코드 001/002/003 → 라벨변환) | string(코드) | 텍스트(`td`) | 제품 카테고리. FE가 코드→영문 라벨 변환 |
| warranty | `warranty_policy.warranty_period` ?? `warrantyPolicyForm.warrantyPeriod` | string | 텍스트(`td`) | 보증기간. 원문 그대로(단위/접미사 없음). 실데이터 멀티라인 없음 → `warrantyLines` 미사용 |

slugKey는 FO 표 의미론 이름(`product`/`category`/`warranty`)을 사용한다. bo 2세대 필드명 정규화·코드라벨 변환은 STEP6 FE가 위 fallback 규칙으로 명시 처리한다.

## 3. API 확인 (확정)
- 신규 API 필요 여부: 기존 활용 가능 (신규 불필요, 확정)
- 참고 엔드포인트: `GET /api/v1/fo/page-data/{slug}` (`FoPageDataController` → `PageDataService.search()`). `/api/v1/fo/**` permitAll 적용됨. markets `faq-data.md`(STEP4)에서 동일 컨트롤러 재사용 선례.

## 4. 조회 조건
- 엔드포인트/파라미터: `GET /api/v1/fo/page-data/warrantyPolicy-data?size=100`, 헤더 `X-Site-Id: 1`
- BE eq_ 필터/정렬 미사용: bo dataJson이 2세대 혼재(`is_visible`/`isVisible`)라 `eq_is_visible=001` 단순키가 구세대(camelCase)를 누락시킴 → 전건(9건) 조회 후 FE에서 필터·정렬
- where(FE 처리): `is_visible === '001'`(공개)만 통과. VISIBILITY 코드 001=공개, 002=비공개. 현재 공개 4건(id 769/929/1558/1572)
- row limit: 다건(목록). 공개 필터 후 현재 4행
- orderBy: `id ASC` (2차 정렬 겸용). 실데이터에 sortOrder/displayOrder 부재로 확정

## 5. 샘플 응답 데이터

> STEP4 developer DB 실덤프 기반 — 추정 아님

```json
{
  "content": [
    {
      "id": 769,
      "siteId": 1,
      "dataJson": {
        "warrantyPolicyForm": {
          "productNm": "eletrics Test Air",
          "productType": "003",
          "warrantyPeriod": "3",
          "isVisible": "001"
        }
      }
    },
    {
      "id": 1572,
      "siteId": 1,
      "dataJson": {
        "warranty_policy": {
          "product_name": "form key change test2",
          "product_type": "001",
          "warranty_period": "3",
          "is_visible": "001"
        }
      }
    }
  ]
}
```

- 코드라벨: PRODUCTTYPE `001=Power Production`, `002=Power Orders`, `003=Automation`. VISIBILITY `001=공개`, `002=비공개`
- 공개(001) 4건: `769(Automation, "3")`, `929(Power Orders, "2")`, `1558(Power Production, "5")`, `1572(Power Production, "3")`

## 6. 비고
1. **이번 범위 제외(정적 유지)**: 제품 보증표 외 모든 섹션(카드/배너/노트/extension/apply/타이틀)은 fo 정적 데이터 유지. slug 바인딩 안 함.
2. **2세대 필드 혼재**: bo 2026-07-13 13:12 폼키 변경(구 camelCase → 신 snake_case). FE는 양세대 fallback(`warranty_policy` ?? `warrantyPolicyForm`) 영구 지원.
3. **코드→영문 라벨**: FO는 정적 영문 페이지, i18n 인프라·productType 메시지키 없음. `FoCodeController`는 한글만 반환해 부적합 → FE에 코드→영문 하드코딩 맵(`{001:'Power Production',002:'Power Orders',003:'Automation'}`) 사용 확정.
4. **9건 전부 개발 테스트 데이터**(실운영 콘텐츠 아님). QA는 이 값 기준으로 표 반영 확인.
5. **warranty_period 자유입력**: DB에 "3", "일주일" 등 단위 없는 텍스트 → 원문 그대로 표시(정적 "99 years" 포맷 미적용).

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP0-0 | fo-page-analyzer(오케스트레이터 직접 수행) | 2026-07-14 | 소스 7개+데이터 구조 분석, service-center 이관 패턴 확인 |
| STEP0-1 | fo-page-migrator | 2026-07-14 | fo로 8개 파일 신규 이관, tsc 통과. basePath(/pub 제거)·Title 인라인화·CSS import(services.css만) 보정 |
| STEP0-2 | fo-common-refactor | 2026-07-14 | jscpd 5.53% cross-file 중복 0건 → 억지 공통화 금지 원칙대로 신규 추출 없음. + 오케스트레이터 SSR 렌더 확인(200) |
| STEP1(초안) | fo-slug-analyzer | 2026-07-14 | 최초 단일PageData 전제로 6파일 전체 태깅(warrancyPolicy-data). 이후 STEP4 충돌로 폐기 |
| STEP2(초안) | fo-slug-analyzer | 2026-07-14 | where 불필요/limit 1(단건 전제) — STEP4 충돌로 폐기 |
| STEP3(초안) | fo-dev-doc-writer | 2026-07-14 | 단건 전제 문서 작성 — 폐기 |
| STEP4 | fo-be-analyzer | 2026-07-14 | developer DB 직접조회로 결정적 충돌 2건 발견: ①slug 오타(warrancy→warranty, 실등록은 warrantyPolicy-data id=40, 9건) ②모델 불일치(실제는 제품보증목록 4필드, 리치 단건 아님). 사용자 결정→slug 철자 t 교정 + 범위 축소(tableRows만). FoPageDataController 재사용(신규 불필요) 확정. 코드→라벨/공개필터/정렬 스펙 확정 |
| STEP1-2(재조정) | fo-slug-analyzer | 2026-07-14 | 태깅 축소: coverage 보증표 tbody 한 곳만 data-slug="warrantyPolicy-data" + product/category/warranty. 나머지 5파일 정적 복원. tsc 통과(오케스트레이터 확인) |
| STEP3(재작성) | fo-dev-doc-writer | 2026-07-14 | 철자 교정 + 표 중심 축소 재작성 |
| STEP7(QA) | fo-qa-validator | 2026-07-14 | BE developer 프로필 기동(8080, developer DB) 후 실데이터 검증 6/6 통과. 프록시(3002→8080) 200, page-data 9건 응답. 공개 4행(769/929/1558/1572) id ASC 렌더·비공개 5건(930/1213/1275/1571/1634) 제외·코드→라벨(003→Automation/002→Power Orders/001→Power Production) 정상. 정적 섹션(타이틀/카드/노트/배너/extension/apply mailto) 전부 유지, 회귀 없음. 치명 콘솔·네트워크 에러 0(단 data-slugkey casing dev 경고만 존재-무해). Playwright 라이브 렌더 스크린샷 확보 |
