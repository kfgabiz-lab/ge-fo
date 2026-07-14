# Markets Faq 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/markets/components/MarketsFaq.tsx` (래퍼, 자체 DOM 없음 — `items` prop만 `CommonFaq`에 전달)
> - `fo/src/components/faq/CommonFaq.tsx` (`.common_faq__list`에 태깅)
> - `fo/src/components/ui/FaqItem.tsx` (`.faq_item`, `question`/`answer` 필드 태깅)
> - 실제 fetch 지점(STEP6 대상): markets 하위 6개 `page.tsx` — `data-center`, `power-grid`, `oil-gas-mining`, `public-infrastructure`, `industrial`, `commercial-residential`
> 상태: 개발완료 (STEP1~7 전체 완료, 실 데이터는 BO에서 추후 입력 예정, 2026-07-13)

## 1. data-slug
- 값: `faq-data`
- 다건 여부: 다건(배열) — markets 6개 페이지 각각에서 자기 페이지의 where로 필터링된 FAQ 목록을 조회

## 2. data-slugKey 매핑

```html
<!-- MarketsFaq.tsx: 자체 DOM 없음. items prop을 그대로 CommonFaq로 전달 -->

<!-- CommonFaq.tsx -->
<div className="common_faq__list" data-slug="faq-data" data-slug-repeat="true">
  <!-- FaqItem.tsx가 .map()으로 반복 렌더 -->
  <div className="faq_item" data-slug-item>
    <button className="faq_question">
      <p className="txt">
        <span className="impact">Q</span>
        <span data-slugKey="question">{question}</span>
      </p>
    </button>
    <div className="faq_answer_wrap">
      <p className="faq_answer" data-slugKey="answer">{answer}</p>
    </div>
  </div>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| question | question | string | 텍스트(`span`) | FAQ 질문 |
| answer | answer | string | 텍스트(`p.faq_answer`) | FAQ 답변 |

> "Q" 라벨(`span.impact`)은 고정 문구로 바인딩 대상 아님 (FaqItem.tsx 주석 확인).

## 3. API 확인 (STEP4 fo-be-analyzer 분석 완료 — 2026-07-13)

### 판단: 기존 엔드포인트 재사용 — 신규 BE 불필요 (확정)

- **신규 API 필요 여부: 불필요.** 기존 `FoPageDataController`(`GET /api/v1/fo/page-data/{slug}`, `bo-api/.../controller/FoPageDataController.java`)를 그대로 재사용한다. 이 컨트롤러는 `PageDataService.search()`(동적 JSONB 검색 + 페이지네이션)를 위임하는 얇은 래퍼이며, `SecurityConfig.java:54`에서 `/api/v1/fo/**` permitAll(비로그인 허용)이 이미 걸려 있다.
- **`faq-data` slug 등록: 확인 완료.** `slug_registry` id=108, `is_active=t`, type=PAGE_DATA (developer DB 라이브 + `db_backup_public_20260710.sql:12507` 양쪽 일치).
- **필드명/코드값 체계 = 스펙과 일치(현행 스키마 기준).** developer DB `slug_entity_field`의 FAQ 엔티티 현행 필드 정의가 스펙과 정확히 일치: `main_category`(select, code_group=MAINCATEGORY), `markets`(select, code_group=MARKETS), `is_visible`(radio, code_group=VISIBILITY), `question`(input), `answer`(textarea). 코드 라벨도 직접 조회로 확정:
  - MAINCATEGORY: `001=Products & Systems`, `002=Markets` → 스펙 `main_category=002`(Markets) 정확.
  - VISIBILITY: `001=공개`, `002=비공개` → 스펙 `is_visible=001`(공개) 정확.
  - MARKETS: `001=데이터센터(Data Center)`, `002=Public Infrastructure`, `003=Oil & Gas, Mining Industries`, `004=전력망(Power Grid)`, `005=산업(Industrial)`, `006=상업 및 주거(Commercial & Residential)` → 문서 4번의 6개 페이지 매핑 전부 일치. **STEP2에서 "매핑 추정"으로 남겼던 4개(public-infrastructure=002 / oil-gas-mining=003 / industrial=005 / commercial-residential=006) 모두 코드그룹 라벨과 일치함을 직접 확인 → 확정.**

### 재사용 엔드포인트 및 호출 방식
- 엔드포인트: `GET /api/v1/fo/page-data/faq-data`
- 페이지별 호출 (Query Params):
  - `eq_main_category=002` (공통) + `eq_is_visible=001` (공통) + `eq_markets={001~006}` (페이지별) + `sort=id,asc` + `size=100`
  - 예) Data Center: `GET /api/v1/fo/page-data/faq-data?eq_main_category=002&eq_is_visible=001&eq_markets=001&sort=id,asc&size=100`
- **동작 근거**: `PageDataService.appendWhereConditions()`의 `eq_` 단순키 분기(약 line 1042~1052)가 최상위 + 1~2단계 중첩 object를 `jsonb_each ... EXISTS`로 함께 탐색한다. 현행 FAQ 데이터는 `data_json.faq.{필드}`(1단계 중첩) 구조이므로 `eq_main_category`/`eq_is_visible`/`eq_markets`가 중첩 EXISTS로 정상 매칭된다(dot notation `faq.main_category=002`로 명시 지정도 가능하나, 스키마 세대가 섞여 있어 `eq_` 단순키가 더 견고).
- **응답**: `PageDataListResponse { content: [{ id, dataJson:{faq:{question, answer, ...}}, ... }], totalElements, ... }`. FO는 `dataJson.faq.question` / `dataJson.faq.answer`만 사용. STEP6 FE flatten이 단일 중첩키(`faq.question`→`question`)를 root로 올리는 기존 규칙과 일치.

### ⚠️ STEP4에서 실데이터 직접 확인 중 발견한 스키마/데이터 이슈 (prdGrp-data 유형 재발 — 반드시 인지)
- **스키마 3세대 혼재.** developer DB `faq-data` 21건은 세 가지 스키마가 섞여 있다:
  1. **현행(정본, content key `faq`)** — `faq.{main_category, markets, is_visible, question, answer}` — **스펙과 일치. 단 2건뿐(id 1580, 1581).**
  2. 중간세대(content key `faqForm`) — `faqForm.{faqMainCategory, faqTitle, isVisible, markets}` — 약 13건.
  3. 레거시(content key `faqForm`) — `faqForm.{mainCategory, title, isVisible, markets}`(+ 오타 `Markets` 1건) — 약 6건.
  → 2·3세대(구 19건)는 `main_category`/`question` 키 자체가 없어 스펙 where로 **매칭되지 않는다**(구 데이터는 자동 제외됨). 이는 정상 동작이며 BE 문제가 아니다.
- **현재 FO 노출 데이터 = 사실상 0건.** 스펙 where(`main_category=002 AND is_visible=001 AND markets=00X`)를 만족하는 레코드가 현재 라이브에 **없다**:
  - id 1581(사용자가 STEP2에서 확인한 그 레코드): `main_category=002, markets=002(Public Infra)`이나 `is_visible=002`(비공개) → 공개 필터에서 제외.
  - id 1580: `is_visible=001`이나 `main_category=001`(Products & Systems, Markets 아님) + markets 없음 → 제외.
  - markets 값 실분포도 `001×3, 003×1`뿐이라 002/004/005/006 페이지는 데이터 자체가 없음(그나마 있는 것도 구 스키마).
  → **6개 markets 페이지 모두 현재는 빈 목록.** BO 관리자가 현행 FAQ 등록폼(정본 `faq` 스키마 생성)으로 "Markets 대분류 + 공개 + 해당 markets" FAQ를 실제 입력해야 FO에 노출된다. 이는 BO 콘텐츠 입력 과제이지 BE/FE 개발 블로커가 아니다(prdGrp-data의 info.image 미입력과 동일 성격). STEP6는 API 연동·바인딩까지만 하고, 실제 노출은 데이터 입력 후 확인.

### 참고 (재사용 시 무해한 부가동작)
- `slug_relation` id=9 (master_slug=`faq-data`, FETCH, masterKey=`product`, slave=`product-data`, fetch_fields=`product-data-form.productNm`)가 있어, faq 레코드에 `product` 값이 있으면 `search()`의 `applyFetch`가 제품명을 `_fetchedRel{9}` 키로 덧붙인다. question/answer 바인딩과 무관하며 FO는 무시하면 되는 부가 필드다(성능 영향 미미).
- `sort=id,asc`는 감사컬럼이 아니므로 `ORDER BY data_json->>'id' ASC`(텍스트 정렬)로 처리된다. 현행 faq id가 전부 4자리라 사실상 오름차순과 동일하나, 엄밀한 PK 정렬은 아님(자릿수 넘어가면 사전식 정렬 주의). markets 페이지당 건수가 적어 실무상 문제 없음.

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)

### 아키텍처 결정 (목표설정 대화에서 사용자 승인)
`MarketsFaq`는 markets 하위 6개 페이지 전부에서 공용으로 쓰인다. 코드 확인 결과 현재 `data-center/page.tsx`만 명시적으로 `<MarketsFaq items={dataCenterFaqItems} />`처럼 자기 데이터를 prop으로 넘기고, 나머지 5개(`power-grid`, `oil-gas-mining`, `public-infrastructure`, `industrial`, `commercial-residential`)는 `<MarketsFaq />`로 호출해 `MarketsFaq.tsx`의 기본값(`items = faqItems`)을 그대로 쓰는 패턴이 이미 존재한다.

→ 이 기존 패턴을 그대로 재사용해 **각 6개 `page.tsx`가 자기 페이지의 where로 `fetchApi` 공통함수를 호출하고, 결과를 `items` prop으로 `MarketsFaq`에 넘기는 구조**로 STEP6을 설계한다. `CommonFaq`/`FaqItem`에 태깅된 `data-slug="faq-data"`는 "이 트리가 faq-data를 렌더한다"는 표시로 유지하되, 실제 fetch 호출 지점은 각 `page.tsx`(공용 컴포넌트 내부가 아님)다. 6곳 모두 동일한 `fetchApi` 공통함수·패턴을 재사용하고 where 값만 페이지별로 다르게 준다.

### 공통 조건
- 공통 where: `main_category=002,is_visible=001` (`main_category=002` = "Markets" 대분류)
- orderBy: `id ASC`
- 2차 정렬(tie-breaker): 불필요 — orderBy 자체가 `id`(유니크 값)이므로 동률 발생 안 함
- row limit(단건 / 다건 개수): 다건 — 페이지당 전체(상한 없음)

> ⚠️ 위 where·orderBy는 현재 `MarketsFaq.tsx`/`marketsContent.ts` 코드 자체에는 존재하지 않는 필터 로직이며, 목표설정 대화에서 사용자가 확정한 값이다. 코드 근거가 아님을 명시한다.

### 페이지별 where (markets 값)

| 페이지 디렉토리 | markets 값 | where(공통 + markets) | 라벨 | 확인 근거 |
|---|---|---|---|---|
| `data-center` | 001 | `main_category=002,is_visible=001,markets=001` | Data Center | **사용자 직접 확인** — 목표설정 대화에서 라이브 BO 화면(id=1581)으로 직접 확인·확정 |
| `power-grid` | 004 | `main_category=002,is_visible=001,markets=004` | Power Grid | **사용자 직접 확인** — 목표설정 대화에서 라이브 BO 화면(id=1581)으로 직접 확인·확정 |
| `public-infrastructure` | 002 | `main_category=002,is_visible=001,markets=002` | Public Infrastructure | **확정** — STEP4에서 developer DB `MARKETS` 코드그룹 라벨 직접 조회로 재확인 완료 |
| `oil-gas-mining` | 003 | `main_category=002,is_visible=001,markets=003` | Oil & Gas Mining Industries | **확정** — STEP4에서 developer DB `MARKETS` 코드그룹 라벨 직접 조회로 재확인 완료 |
| `industrial` | 005 | `main_category=002,is_visible=001,markets=005` | Industrial | **확정** — STEP4에서 developer DB `MARKETS` 코드그룹 라벨 직접 조회로 재확인 완료 |
| `commercial-residential` | 006 | `main_category=002,is_visible=001,markets=006` | Commercial & Residential | **확정** — STEP4에서 developer DB `MARKETS` 코드그룹 라벨 직접 조회로 재확인 완료 |

## 5. 샘플 응답 데이터

> 아래 값은 실제 bo dataJson 스키마·데이터를 확인한 것이 아닌 **추정** 데이터다(FaqItem.tsx의 question/answer 필드 구조만 코드로 확인됨). markets/main_category 필드명·코드값 체계도 사용자가 목표설정 대화에서 알려준 값이며 실제 dataJson에 그대로 존재하는지는 STEP4에서 재확인이 필요하다.

```json
{
  "content": [
    {
      "id": 201,
      "dataJson": {
        "main_category": "002",
        "markets": "001",
        "is_visible": "001",
        "question": "Data Center 시장 관련 FAQ 질문 예시",
        "answer": "Data Center 시장 관련 FAQ 답변 예시"
      }
    },
    {
      "id": 202,
      "dataJson": {
        "main_category": "002",
        "markets": "004",
        "is_visible": "001",
        "question": "Power Grid 시장 관련 FAQ 질문 예시",
        "answer": "Power Grid 시장 관련 FAQ 답변 예시"
      }
    }
  ]
}
```

## 6. 비고
1. `public-infrastructure`/`oil-gas-mining`/`industrial`/`commercial-residential` 4개 페이지의 markets 값 — STEP4에서 developer DB 코드그룹 라벨 직접 조회로 확정 완료(더 이상 추정 아님).
2. `faq-data` slug의 SlugRegistry 등록 여부 — **확인 완료**(STEP4). `slug_registry` id=108, is_active=true.
3. `main_category`/`markets`/`is_visible` 필드명·코드값 체계가 실제 `faq-data` PageData의 dataJson 스키마와 일치하는지 — **확인 완료**(STEP4). 단, 실데이터는 스키마 3세대가 혼재하며(정본 `faq` 키 2건, 구세대 `faqForm` 키 19건) 스펙 where를 만족하는 라이브 레코드가 현재 0건임 — 3번 API 확인 섹션 참고.
4. 아키텍처 결정(6개 `page.tsx`가 각자 fetch, `MarketsFaq`는 prop 전달 통로 유지)은 목표설정 대화에서 "가장 합리적이고 공통을 유지"하는 방향으로 판단을 위임받아 확정한 사항이며, 기존 코드에 이미 존재하는 `items?: FaqItem[]` prop 패턴(data-center만 명시적 prop, 나머지 5개는 기본값)을 그대로 재사용한 것이다.
5. STEP5(BE 개발)는 **불필요** — 기존 `FoPageDataController`(`GET /api/v1/fo/page-data/{slug}`)를 쿼리 파라미터만 바꿔 재사용하므로 신규 코드가 없다. STEP6(FE 연동)로 바로 진행한다.
6. 데이터 미입력 상태 — 스펙 where를 만족하는 라이브 레코드가 0건이라, STEP6 연동 완료 후에도 6개 markets 페이지 FAQ는 BO에서 정본 스키마로 신규 등록하기 전까지 빈 목록으로 보인다(prdGrp-data의 info.image 미입력과 동일 성격, BE/FE 개발 블로커 아님).

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-13 | `CommonFaq.tsx`(`.common_faq__list`)에 `data-slug="faq-data"`/`data-slug-repeat="true"`, `FaqItem.tsx`(`.faq_item`)에 `data-slug-item`, `question`/`answer` `data-slugKey` 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-13 | 공통 where(`main_category=002,is_visible=001`) + 페이지별 `markets` 값(6개) 확정, orderBy `id ASC`, row limit 다건(전체) 확정. 아키텍처 결정(6개 page.tsx 개별 fetch) 사용자 승인 |
| STEP3 | fo-dev-doc-writer | 2026-07-13 | 작업 단위 문서 작성 (상태: 설계중). API 확인 결과 "확인 필요"로 명시 |
| 승인 | 사용자 | 2026-07-13 | "모든 스텝 한번에 진행" + 판단 위임(#진행) — 개별 STEP 승인 절차 생략, 일괄 진행 승인. `fo-data-binding.md` data slug 컬럼 반영, STEP4 착수 |
| STEP4 | fo-be-analyzer | 2026-07-13 | 기존 `FoPageDataController` 재사용 확정(신규 BE 불필요). slug 등록/필드 스키마 developer DB 직접 확인 완료. 4개 페이지 markets 매핑 추정→확정 전환. 스키마 3세대 혼재로 스펙 매칭 라이브 레코드 0건 발견(BO 데이터 입력 필요, 개발 블로커 아님) |
| STEP5 | - | 2026-07-13 | 스킵 — 기존 API 재사용으로 신규 BE 개발 불필요 |
| STEP6 | fo-fe-builder | 2026-07-13 | `fo/src/app/markets/data/marketsFaqData.ts` 신규 생성(fetchApi 경유 공통 헬퍼), 6개 markets page.tsx 전부 수정(페이지별 markets 코드로 fetch → `items` prop 전달). `tsc --noEmit` 통과, curl로 BE(8080)·FO 프록시(3002) 양쪽 200 확인 |
| STEP7 | fo-qa-validator | 2026-07-13 | 6개 페이지 전체 PASS. SSR HTML+프록시 API 응답 기준 검증(브라우저 자동화 도구 미보유 환경). API 200/빈 배열 정상 수신, 마크업·flatten·페이지별 markets 코드 전달 설계대로 확인, FAQ 외 회귀 없음. 데이터 0건은 설계상 정상(BO 미입력) |
| 완료 | - | 2026-07-13 | STEP1~7 전체 완료. 실 데이터는 사용자가 추후 BO에서 직접 입력 예정(정본 `faq` 스키마로 Markets 대분류+공개+해당 markets) |
