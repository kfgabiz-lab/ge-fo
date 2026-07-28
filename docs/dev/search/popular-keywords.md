# Popular Keywords(통합검색 인기 검색어) 데이터 바인딩 설계

> 대상 파일: `fo/src/app/search/components/SearchAllHero.tsx` (114~148줄)
> 상태: 설계중

## 1. data-slug
- 값: **없음(N/A)** — 이 섹션은 bo PageData(slug) 개념이 아니라 사용자 검색어 로그 집계(검색 API) 개념이다. `data-slug`/`data-slugKey` 마크업 태깅 대상이 아니며, slug 값을 임의로 짓지 않는다.
- 다건 여부: 다건(목록, 상위 5건) — 단, PageData 배열이 아니라 검색어 랭킹 API 응답(`string[]`)

## 2. data-slugKey 매핑
해당 없음(N/A). slug 기반 매핑 대상이 아니므로 이 표는 작성하지 않는다. STEP6(fo-fe-builder)에서 아래 3번 API 함수를 `SearchAllHero.tsx`에서 직접 호출하는 방식으로 연동한다(현재 `GnbSearchPanel.tsx`/`NotFoundPage.tsx`가 쓰는 패턴과 동일).

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **기존 활용 가능**
- 참고 엔드포인트: `GET /api/v1/fo/search-keywords/popular?source=UNIFIED_SEARCH`
  - `fo/src/data/search/searchKeywordData.ts`의 `fetchPopularKeywords("UNIFIED_SEARCH")` 함수로 이미 구현·사용 중
  - 실사용처: `fo/src/components/layout/shared/GnbSearchPanel.tsx`(GNB 헤더 검색), `fo/src/components/common/NotFoundPage.tsx`(404 페이지 검색) — 둘 다 "통합검색(UNIFIED_SEARCH)" 개념으로 이미 이 API를 쓰고 있음
  - 신규 BE 개발 불필요. `SearchAllHero.tsx`가 정적 배열(`searchAllPage.popularTags`) 대신 이 함수를 호출하도록 연동하는 것이 STEP6의 작업 범위.

## 4. 조회 조건
- where(필터 조건식): `source=UNIFIED_SEARCH` 고정(쿼리 파라미터, evalConditionExpr 대상 아님 — 검색 API 자체 파라미터)
- row limit(단건 / 다건 개수): 상위 5건 — `searchKeywordData.ts` 주석("최대 5건, 상위 순")에 근거. BE 내부 상수로 fo 쪽에서 조정 불가.

## 5. 샘플 응답 데이터
실측 응답 값 자체는 확인하지 않았음(추정). `GnbSearchPanel.tsx`/`NotFoundPage.tsx`의 타입 사용 근거(`Promise<string[]>`)로 볼 때 형태는 문자열 배열:
```json
["DC Device", "Metasol MS", "Susol MCCB", "MCCB", "PLC"]
```

## 6. 비고
- STEP1+2에서 사용자와 확인한 사항: 검색어가 입력된 상태(검색 결과 화면)일 때 Popular Keywords 노출 정책이 기획서에 "보완 필요"로 명시된 미확정 사항이라고 전달받음.

### 미해결 확인 필요 항목
1. (기획 미확정) 검색어가 입력된 상태(검색 결과 화면)에서 Popular Keywords 노출/숨김/다른 목록 대체 여부 — 기획서 "보완 필요" 항목, 확인 필요.
2. API 0건일 때 현재 `SearchAllHero.tsx`에 남아있는 정적 하드코딩 배열(`searchAllPage.popularTags`, `downloadCenterContent.ts`에서 가져온 값)을 폴백으로 유지할지, 아니면 다른 UNIFIED_SEARCH 소비처(`GnbSearchPanel`/`NotFoundSearch`)와 동일하게 "폴백 없음 — 비어 있으면 태그 영역 미노출" 정책으로 통일할지 확인 필요. (근거: `GnbSearchPanel.tsx` 33행, `NotFoundSearch.tsx` 13행 주석에 이미 "폴백 없음" 정책이 명시돼 있어, 이 화면만 다르게 갈지 통일할지는 사용자 판단 필요.)

## 7. 데이터 없음(빈 값/매칭 0건) 시 동작 — 필수 기재
- 원칙(`fo-data-binding-가이드.md` 5절): 컨테이너(레이블 "Popular:"/"Trending:" 등)는 유지하고 태그 목록만 있는 만큼(0개 포함) 표시 — 섹션 전체를 조건부로 숨기지 않는다.
- 다만 위 6번 확인 필요 항목 2)의 정책(다른 소비처와 동일하게 "0건이면 영역 자체 미노출")과 이 원칙이 상충할 수 있어, 최종 동작은 사용자 확인 후 확정한다.
