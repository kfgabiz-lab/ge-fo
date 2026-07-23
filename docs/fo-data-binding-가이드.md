# FO 데이터 바인딩 작업 가이드

> 대상: `fo/docs/fo-data-binding.md`(fo 전체 tsx 파일 목록 + data slug 매핑표)를 기준으로 개별 컴포넌트에 실제 API 데이터를 연결하는 모든 작업
> 관련 문서: `fo/docs/fo-data-binding.md`(작업 목록), `docs/ge_guide/fo/fo-api연동가이드.md`(API 연동 공통 규칙 — 프록시/공통함수/환경변수)

---

## 1. 배경 — data-slug / data-slugkey가 가리키는 것

fo 화면의 각 데이터 블록은 bo "홈페이지관리"에서 만든 **PageData**(slug로 식별, `bo-api`의 `SlugRegistry`에 등록) 하나에 대응한다.

```
bo 홈페이지관리에서 콘텐츠 입력
        ↓
   PageData 저장 (slug로 식별, dataJson: { 섹션: { 필드: 값 } })
        ↓
   fo 컴포넌트의 data-slug/data-slugkey가 그 slug·필드를 가리킴
```

- `data-slug` = bo PageData의 slug 값 (bo 빌더 위젯의 `sourceSlug`/`dbSlug`와 동일한 개념 — `docs/ge_guide/builder/00-1.builder_widget_components.md`의 `sourceSlug` 참고)
- `data-slugkey` = 그 PageData의 `dataJson`을 `flattenPageDataItem`으로 flatten한 후의 필드명

  > ⚠️ **fo API 응답 자체는 flatten되지 않는다.** `GET /api/v1/fo/page-data/{slug}`(`PageDataService.search()`)는 `dataJson`을 원본 그대로(폼 섹션 중첩 유지, 예: `dataJson.blogForm.title`) 내려준다. flatten은 fo 쪽에서 응답을 받은 **뒤에** `fo/src/lib/pageData.ts`의 `flattenPageDataItem`(bo `utils.ts`의 동명 함수를 포팅한 것)을 호출해야 일어난다. STEP6(FE 개발)에서 이 함수를 거치지 않고 `dataJson.blogForm.title`처럼 직접 접근하면, STEP1~3에서 정한 단순한 `data-slugkey` 이름(`title` 등)과 실제 코드의 접근 경로가 어긋난다. **fetchApi로 받은 item은 반드시 `flattenPageDataItem(item)`을 거친 뒤 필드에 접근할 것.**

```html
<!-- 단건 (텍스트 콘텐츠 바인딩) -->
<div data-slug="hero-data">
  <div data-slugkey="name"></div>
  <div data-slugkey="phone"></div>
</div>

<!-- 다건(배열) — 바깥 컨테이너에 data-slug-repeat, 반복되는 아이템에 data-slug-item -->
<div data-slug="main-industries" data-slug-repeat="true">
  <div data-slug-item>
    <div data-slugkey="title"></div>
    <img data-slugkey="image" />
  </div>
</div>

<!-- 속성 바인딩 — 값이 텍스트가 아니라 href/src 등 속성에 들어가는 경우, data-slugkey-attr로 대상 속성명을 명시 -->
<a data-slugkey="url" data-slugkey-attr="href" href="">...</a>
<img data-slugkey="image" data-slugkey-attr="src" src="" />
```

- 단건: `data-slug`가 붙은 요소 하나에 `data-slugkey` 필드들이 직접 들어감
- 다건(배열): `data-slug` + `data-slug-repeat="true"`가 붙은 바깥 컨테이너 안에, 실제 반복(`.map()`) 대상 요소에 `data-slug-item`을 붙이고 그 안에 `data-slugkey`를 태깅. (예시는 `fo/docs/dev/_examples/main-cards.md` 참고)
- 속성 바인딩: `data-slugkey-attr`가 있으면 그 속성(예: `href`, `src`)에 값을 쓰고, 없으면 텍스트 콘텐츠에 쓴다. 에이전트가 요소 종류로 추측하지 않도록 반드시 명시한다.
- 중첩 다건(그룹 다건 안에 다시 목록 다건이 있는 경우): 상위·하위 반복 모두 **동일하게** `data-slug-repeat`/`data-slug-item` 어휘를 재사용한다. 별도의 중첩 전용 어휘는 없다. 아이템이 어느 반복에 속하는지는 **"가장 가까운 조상 `data-slug-repeat`"** 기준으로 판정한다.

```html
<!-- 중첩 다건 — 그룹(다건) 안에 그룹별 목록(다건)이 다시 있는 경우 -->
<div data-slug="prdGrp-data" data-slug-repeat="true">
  <div data-slug-item>
    <div data-slugkey="prdGrpNm"></div>
    <!-- 중첩: 이 그룹 1건 안에 있는 목록(다건). 아이템은 "가장 가까운 조상 data-slug-repeat"인 이 태그에 속함 -->
    <div data-slug="ms" data-slug-repeat="true">
      <div data-slug-item>
        <div data-slugkey="productDataForm.productNm"></div>
      </div>
    </div>
  </div>
</div>
```

동일한 최상위 `data-slug`가 서로 다른 두 DOM 영역(예: 탭 라벨 영역과 실제 목록 영역)에 이중으로 붙는 경우도 있다 — 이건 같은 배열을 두 군데서 다르게 렌더링하는 것뿐이므로, **연동(STEP6) 시 fetch는 반드시 1회만** 하고 그 결과를 두 렌더링에 공유해야 한다(중복 fetch 금지). 실제 적용 사례: `fo/docs/dev/main/prdGrp-data.md`(Discover Our Products, 그룹 안에 제품 목록이 중첩된 케이스).

### 공용 컴포넌트가 여러 페이지(라우트)에서 다른 where로 재사용되는 경우

한 컴포넌트가 여러 `page.tsx`에서 공용으로 쓰이는데 페이지마다 조회 조건(where)이 달라야 하는 경우가 있다(예: 같은 FAQ 컴포넌트를 6개 markets 하위 페이지가 쓰지만 각 페이지가 자기 시장(markets) 값만 보여줘야 함). 공용 컴포넌트 자체는 페이지 구분자를 받지 않으므로 내부에서 where를 라우트별로 분기할 수단이 없다.

→ 이런 경우 **각 page.tsx가 자기 페이지의 where로 fetchApi를 직접 호출하고, 결과를 공용 컴포넌트의 prop으로 전달**하는 구조를 쓴다(STEP6). 공용 컴포넌트에 태깅된 `data-slug`/`data-slugkey`는 "이 트리가 어떤 slug를 렌더하는지" 표시 용도로 유지하되, 실제 fetch 호출은 각 `page.tsx`에 위치시킨다. 기존 코드에 이미 페이지별로 다른 데이터를 prop으로 넘기는 패턴이 있으면 그 패턴을 그대로 재사용한다(신규 prop/구조를 억지로 만들지 않는다).

실제 적용 사례: `fo/docs/dev/markets/faq-data.md`(Markets FAQ, 6개 markets 페이지 공용 `CommonFaq`/`FaqItem`에 각기 다른 markets where 적용).

이 속성은 **에이전트가 코드를 분석해서 직접 마크업에 추가**하는 것이며, 자동으로 값을 읽어 채우는 런타임 라이브러리/컴포넌트가 아니다.

**`data-slug` 값(실제 slug명) 자체는 에이전트가 짓거나 추측하지 않는다.** slug는 bo Slug 레지스트리(`bo/admin/settings/slug-registry`, `bo-api`의 `SlugRegistry`)에 이미 등록돼 있거나, 사용자가 직접 새로 등록/지정하는 값이다. 에이전트가 할 일은 "여기에 데이터가 들어갈 자리다"라는 **구조**(`data-slug-repeat`, `data-slug-item`, `data-slugkey`, `data-slugkey-attr`)를 마크업에 표시하는 것까지이고, `data-slug` 값 자체는 사용자가 알려줄 때까지 비워두거나 `TODO`로 남긴다.

이 작업은 fo-orchestrator가 조율하는 전체 파이프라인 중 **slug 개념(데이터 바인딩) 파트**이며, 실제로는 아래처럼 "페이지 머지"(0단계)까지 포함한 더 큰 흐름의 일부다.

---

## 2. 작업 단계 — fo-orchestrator 파이프라인 기준

fo-orchestrator는 요청을 "페이지 머지"와 "slug 개념(데이터 바인딩)" 두 갈래로 분류해 아래 순서로 서브에이전트를 조율한다. **이 가이드(fo-data-binding-가이드.md)가 다루는 범위는 STEP 1~4이며**, STEP 0-0~0-2(페이지 머지)는 대상 페이지가 아직 fo에 이관되지 않았을 때만 선행된다.

```
[페이지 머지 — 대상 tsx가 아직 fo에 없을 때만 선행]
STEP 0-0. 페이지 분석 (fo-page-analyzer)
STEP 0-1. 페이지 이관 (fo-page-migrator) — ls-publish 소스를 그대로 fo/src/app에 이식
STEP 0-2. 공통화 (fo-common-refactor) — 반복 UI/로직을 공통 컴포넌트·함수로 추출
         → 마무리 시점에 ls-publish와 fo를 브라우저로 나란히 열어 시각 비교한다. fo 단독 렌더 확인(SSR 200, 콘솔 에러 없음)만으로는 통과하지만, 헤더/푸터 같은 기존 공용 컴포넌트에 이미 있던 CSS 드리프트(예: 고정폭 값 하나가 달라 텍스트가 줄바꿈되는 것)는 나란히 비교해야 드러난다

STEP 0-3. 기존 이관 페이지 재동기화 — ls-publish가 STEP 0-1 이후에 추가로 갱신된 경우
         → 트리거: `ls-publish`가 `git subtree pull`로 갱신된 후, 이미 STEP 0-1/0-2를 마친 페이지에 반영할 변경분이 있는지 확인할 때
         → 1) 변경 범위 파악: `git show <squash-commit> --stat`으로 이번 pull에서 바뀐 ls-publish 파일 목록 확보
         → 2) fo 대응 파일 분류: A) 이미 이관+공통화됨 → diff 병합 대상 / B) 아직 이관 안 됨 → STEP 0-0·0-1로 별도 진행 / C) fo가 이미 BE(PageData/slug) 연동으로 전환해 정적 콘텐츠가 무의미해진 파일 → 반영 불필요(바인딩 안 된 fallback/mock만 예외적으로 반영 검토)
         → 3) 3-way 병합: base=이전 pull 시점 ls-publish(`git show <squash>^:<path>`), other=이번 pull 결과(`git show <squash>:<path>`), ours=fo 현재 파일. ⚠️ fo 파일은 CRLF, `git show` 출력은 LF라서 그대로 병합하면 줄바꿈 차이로 파일 전체가 가짜 충돌 처리된다 — 반드시 LF로 통일해서 병합 판단(`tr -d '\r'`)하고, 최종 결과만 CRLF로 되돌려(`sed 's/$/\r/'`) 저장한다. `git merge-file --stdout <ours> <base> <other>`로 드라이런해서 충돌 유무부터 파일별로 구분
         → 4) 충돌 처리: 충돌이 "fo가 같은 줄에 data-slugkey 등 속성을 추가해서 줄정렬만 어긋난 것"인지 먼저 확인(콘텐츠 값 자체는 안 겹침 → fo 속성은 유지하며 값만 반영). 파일이 구조적으로 크게 갈라진 경우(예: 페이지별 커스터마이징이 오래 누적된 CSS 파일)는 개별 충돌 단위로 좌우 선택하면 엉뚱한 위치에 값이 붙는 오귀속 위험이 크다 — 이땐 "ls-publish 신버전 전체를 베이스로 채택하고 그 위에 fo만의 예외(라우팅 차이, 커스텀 레이아웃 등)를 다시 얹는" 방식이 더 안전하고 빠르다. 자산(이미지 등) 경로가 바뀌면 `ls-publish/public/...`에 실제 파일이 있는지 확인 후 `fo/public/...`로 복사
         → 5) 다른 세션이 같은 파일에 미커밋 변경을 갖고 있으면 그 파일은 건드리지 말고 스킵한 뒤 사용자에게 보고(자동으로 충돌 해결 시도 금지)
         → 6) 반영 후에는 항상 충돌마커(`<<<<<<<`/`=======`/`>>>>>>>`) 잔존 여부와 중괄호(`{`/`}`) 개수 균형을 재확인한다

[slug 개념 — 데이터 바인딩. 본 가이드가 다루는 범위]
STEP 1. 마크업 태깅 (fo-slug-analyzer)
        → 대상 tsx 파일을 분석해서 실제 JSX에 data-slug-repeat/data-slug-item/data-slugkey(+data-slugkey-attr) "구조"를 직접 추가
        → data-slug 값(실제 slug명)은 에이전트가 짓지 않는다 — 사용자가 지정한 값을 그대로 쓰거나, 아직 없으면 TODO로 비워두고 "확인 필요"로 표시
        → 이 시점엔 실제 데이터 연결(fetch) 안 함 — 위치 표시만
        → (권장) slug 값이 이미 정해져 있다면, 태깅에 들어가기 전에 그 slug가 bo에 실제 등록돼 있는지·실제 dataJson 구조가 무엇인지 먼저 스팟체크한다 — STEP4까지 미루면 구조 불일치로 STEP1~3 전체를 재작업하게 될 수 있다
        → ⚠️ **스키마 드리프트 주의**: 같은 slug라도 운영 중 필드명이 바뀌어 구/신 스키마가 레코드마다 혼재할 수 있다(예: 과거 레코드는 `termsForm.termsType`, 최신 레코드는 `terms.terms_type`). 이런 경우 "아무 레코드나" 스팟체크하면 안 되고, **STEP2에서 확정한 where/orderBy/limit로 실제 뽑힐 그 레코드**를 라이브 API로 직접 조회해서 필드명을 확인해야 한다. 정적 DB 덤프나 오래된 레코드 하나만 보고 필드명을 단정하지 말 것

STEP 2. where 파라미터 / row limit 확인 (fo-slug-analyzer)
        → 해당 slug 조회 시 필터 조건(where)이 필요한지 확인
          (bo 빌더의 evalConditionExpr 문법 재사용 — comma-AND, =,!=,<,>,<=,>=, today())
        → row limit 확인 — 단건(카드 1개) vs 다건(목록, 페이지 크기 등)

STEP 3. 작업 단위 문서 작성 — fo/docs/dev/{섹션}/{파일}.md (fo-dev-doc-writer)
        → STEP 1·2에서 확인한 내용을 문서화, 승인 대기

STEP 4. BE 분석·설계 (fo-be-analyzer)
        → 승인된 문서의 slug/where/orderBy/limit을 보고 bo-api에 재사용 가능한 API가 있는지 분석, 없으면 신규 엔드포인트 설계

STEP 5. BE 개발 (fo-be-builder)
        → STEP 4 설계를 bo-api(Java/Spring) 코드로 구현

STEP 6. FE 연동 개발 (fo-fe-builder)
        → 완료된 BE + 승인된 문서를 바탕으로 fetchApi<T>() 연동 및 마크업 바인딩
          (docs/ge_guide/fo/fo-api연동가이드.md 규칙 준수)
        → fetchApi로 받은 item은 dataJson을 직접 파고들지 말고, 반드시 `fo/src/lib/pageData.ts`의
          `flattenPageDataItem(item)`을 거친 뒤 flat key(`row.title` 등)로 접근할 것 (1절 참고)

STEP 7. QA 검증 (fo-qa-validator)
        → 실제 화면에서 데이터 바인딩 결과(where 필터링, row limit 등)를 Playwright로 검증
```

> STEP 번호는 `fo-orchestrator.md`에 정의된 실제 서브에이전트 파이프라인 번호와 맞춘 것이며, 과거 "작업 4단계"(STEP1~4) 표기는 BE 분석/개발·QA 단계가 빠져 있어 폐기한다.

---

## 3. 작업 단위 문서 — `fo/docs/dev/{섹션}/{파일}.md`

### 트리거
사용자가 `fo/docs/fo-data-binding.md`에서 항목 하나를 지정 (예: "2-9 main의 Main Cards 해줘")

### 경로/파일명 규칙
- `{섹션}` = `fo-data-binding.md`의 상위 분류명 그대로. 현재 fo에 실제로 마이그레이션된 섹션은 `main`, `markets`뿐이며(company/products-systems/search/services/support 등은 아직 없음), 새 메뉴가 마이그레이션되면 그 메뉴명이 `{섹션}`으로 추가된다.
- `{파일}` = **data-slug 값** 기준 (tsx 파일명 아님). 동일 slug가 여러 tsx에서 재사용되면 slug명 뒤에 구분자(where 조건의 핵심 값, 예: position)를 붙여 충돌을 피한다
  - 단일 사용: `{slug명}.md` (예: `hero-data` → `hero-data.md`)
  - 재사용(where로 구분): `{slug명}-{구분자}.md` (예: `banner-data` slug를 `bannerPosition=HERO`로 쓰면 `banner-data-hero.md`, `bannerPosition=INFORMATION`으로 쓰면 `banner-data-information.md`)
- 예: main의 Video Swiper(`hero-data` slug, 단일 사용) → `fo/docs/dev/main/hero-data.md`
- 예: main의 Banner Swiper(`banner-data` slug, HERO 포지션) → `fo/docs/dev/main/banner-data-hero.md`

### 문서 템플릿

```markdown
# {패널명} 데이터 바인딩 설계

> 대상 파일: {tsx 경로}
> 상태: 설계중 / 승인됨 / 개발완료

## 1. data-slug
- 값: {slug명}
- 다건 여부: 단건 / 다건(배열)

## 2. data-slugkey 매핑
| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|

## 3. API 확인 (최종 체크 — 반드시 작성)
- 신규 API 필요 여부: 신규 필요 / 기존 활용 가능
- (기존 활용 가능 시) 참고 엔드포인트:
- (신규 필요 시) 제안 엔드포인트:

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)
- where(필터 조건식, evalConditionExpr 문법):
- row limit(단건 / 다건 개수):
- orderBy(정렬 필드 + ASC/DESC):
- 2차 정렬(tie-breaker — 1차 정렬값 동일 시 기준, 보통 id):

## 5. 샘플 응답 데이터
(JSON)

## 6. 비고
(필요 시 추가 확인: 캐시/revalidate 정책, 매칭 0건일 때 동작, dataJson 필드 누락 시 처리, 응답 envelope 형태)

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
```

### 승인 흐름
1. STEP 1·2 진행 후 문서 작성 (상태: 설계중), **3번 "API 확인"은 문서 작성 마지막에 반드시 체크**
2. 사용자 승인 → 상태 "승인됨"으로 변경, `fo-data-binding.md`의 해당 행 `data slug` 컬럼에 실제 값 반영
3. `#개발`/`#진행` 명령 시에만 STEP 4(fo-be-analyzer, BE 분석·설계) 이후 착수 — API 확인 결과에 따라 BE 신규 개발 여부 결정
4. **각 STEP 담당 에이전트가 완료할 때마다 "7. STEP별 진행 이력" 표에 한 줄씩 추가한다** — 별도 이력 관리 없이 이 문서 하나로 전체 진행 상황을 추적

### 예시 문서
> ⚠️ 아래 2개는 템플릿 사용법을 보여주기 위한 **예시(가짜 데이터)**이며, 실제 Banner Swiper·Main Cards 설계 시 그대로 재사용하면 안 된다. 실제 작업 시 이 파일들은 진짜 분석 결과로 덮어써야 한다.
- 기존 API 활용 가능 케이스: `fo/docs/dev/_examples/banner-swiper.md`
- 신규 API 필요 + 다건(배열) 케이스: `fo/docs/dev/_examples/main-cards.md`

---

## 4. 공통 조회+매핑 계층 — 화면별 fetch 함수 신규 개발 금지

`fo/src/lib/pageDataApi.ts`의 `fetchData(json)`와 `fo/src/lib/pageData.ts`의 `commonData`/`commonEachData`가
slug 기반 조회+매핑의 공통 계층이다. 새 화면을 만들거나 필드를 추가할 때 화면 전용
`fetchXxxList`/`fetchXxxDetail`/`fetchXxxAdjacent`를 새로 만들지 않는다.

```
fetchData({ slug, id?, adjacent?, page?, size?, where?, sort?, 리턴함수? })
  id 있음        → 단건 전용 PK 엔드포인트(/page-data/{slug}/{id})
  id+adjacent    → 인접(이전/다음) 엔드포인트(/page-data/{slug}/{id}/adjacent)
  id 없음        → 목록 엔드포인트(/page-data/{slug})
  리턴함수 없으면 commonData(단건)/commonEachData(목록)가 자동 값 매핑
```

`data-slugkey` 이름이 flatten 후 실제 필드명과 같으면 코드 없이 자동 매핑된다. 코드값→라벨,
파일id→URL, 문자열→배열, 날짜포맷 같은 값 가공과 반복 마크업 구조는 여전히 화면별로 필요하며,
가공은 `fetchData`의 `리턴함수` 콜백으로 주입한다.

목록에서 무거운 필드(리치텍스트 본문 등)를 빼려면 `where: { exclude: "필드명" }`(콤마로 여러 개).
안 주면 기존과 동일하게 전체 필드가 내려온다. 상세 조회에는 적용하지 않는다.

### 컴포넌트 자체 useEffect로 단건 fetch할 때 주의사항 — 재호출 가드는 ref로

페이지 레벨이 아니라 모달/위젯 같은 **컴포넌트 자신의 `useEffect` 안에서** `fetchData`를 1회만 호출하는 패턴(예: 모달이 열릴 때 최초 1회 조회)에서, "이미 조회했는지" 판단하는 재호출 가드를 `useState`로 만들면 안 된다.

```js
// ❌ 잘못된 패턴 — 가드를 state로 관리
const [status, setStatus] = useState("idle");
useEffect(() => {
  if (!open || status !== "idle") return;
  setStatus("loading");   // 이 호출이 status를 바꿔서
  ...
}, [open, status]);        // 의존성 배열의 status 때문에 effect가 스스로 재실행 → 클린업이 먼저 돌며 방금 시작한 요청을 취소해버림
```

`setStatus("loading")`가 의존성 배열에 들어있는 `status`를 바꾸기 때문에, 리액트가 같은 렌더 사이클에서 effect를 즉시 한 번 더 실행시키고, 이때 클린업(`cancelled = true`)이 먼저 실행되어 방금 시작한 fetch 응답을 스스로 무효 처리해버린다. 네트워크 요청은 정상적으로 나가고 서버 응답도 정상인데(콘솔 에러도 없음), 화면엔 영영 반영되지 않는 형태로 나타나 원인 파악이 어렵다.

```js
// ✅ 올바른 패턴 — 가드는 ref로 관리(리렌더/effect 재실행을 유발하지 않음)
const fetchedRef = useRef(false);
useEffect(() => {
  if (!open || fetchedRef.current) return;
  fetchedRef.current = true;
  let cancelled = false;
  fetchData({...}).then((res) => { if (!cancelled) setTermsHtml(...); });
  return () => { cancelled = true; };
}, [open]);
```

실제 적용 사례: `src/components/modals/PrivacyPolicyModal.tsx`(termsMgmt-data 바인딩).
