# Discover Our Products 데이터 바인딩 설계

> 대상 파일: `fo/src/app/main/components/MainProducts.tsx`
> 상태: 개발완료 (STEP7 QA 통과)

## 1. data-slug
- 값: `prdGrp-data` (bo SlugRegistry 기등록 PAGE_DATA — `slug_registry` 테이블 직접 확인 완료: id=18, is_active=true)
- 다건 여부: 다건(배열) + 동적(그룹 개수 고정 아님) + 중첩(그룹 안에 제품 다건이 다시 있음, 중첩 슬러그명 `ms`)

## 2. data-slugKey 매핑

```html
<!-- 그룹(prdGrp-data) 다건 — tab_area(라벨)와 products_panels(정본) 두 곳에 동일 배열 이중 배치, 1회 fetch 공유 -->
<div className="tab_area" data-slug="prdGrp-data" data-slug-repeat="true">
  <TabButton data-slug-item data-slugKey="prdGrpNm" ... />
</div>

<div className="products_panels" data-slug="prdGrp-data" data-slug-repeat="true">
  <div data-slug-item>
    <!-- 그룹 1건 내부에 제품(ms) 다건이 중첩 반복됨 -->
    <Swiper data-slug="ms" data-slug-repeat="true">
      <SwiperSlide data-slug-item>
        <Link data-slugKey="seo.slug" data-slugKey-attr="href">
          <img data-slugKey="info.image" data-slugKey-attr="src" />
          <h3 data-slugKey="productDataForm.productNm"></h3>
          <p data-slugKey="productDataForm.prdSubDesc"></p>
          <!-- productDataForm.awards 값 존재 시 ProductAwardBadge 조건부 노출 -->
        </Link>
      </SwiperSlide>
    </Swiper>
  </div>
</div>
```

| slugKey | dataJson 필드(flatten 기준) | 타입 | 바인딩 대상(텍스트 / 속성명) | 설명 |
|---|---|---|---|---|
| prdGrpNm | prdGrpNm | string | 텍스트 | 그룹명(탭 라벨) |
| productDataForm.productNm | (중첩 `ms` 배열 내부) productDataForm.productNm | string | 텍스트(`h3.tit_product`) | 제품명 |
| productDataForm.prdSubDesc | (중첩 `ms` 배열 내부) productDataForm.prdSubDesc | string | 텍스트(`p.txt`) | 제품 설명(카드 description) |
| info.image | (중첩 `ms` 배열 내부) info.image | string(url) | 속성(`img[src]`) | 제품 대표이미지 (dns-detail 탭 소속 필드) |
| seo.slug | (중첩 `ms` 배열 내부) seo.slug | string | 속성(`Link[href]`) | 제품 상세 링크 — FE에서 `/product/{seo.slug}`로 합성 (접두 `/product/` 조립은 STEP6에서 처리) |
| productDataForm.awards | (중첩 `ms` 배열 내부) productDataForm.awards | string(코드값, 예: "iF Design Awards 2026:01") | 조건부 배지 | 값 있으면 `ProductAwardBadge` 노출 |

마크업 구조: `prdGrp-data`(그룹 다건, `tab_area`=라벨/`products_panels`=정본 이중 배치, 동일 배열 1회 fetch 후 공유) 안에 중첩으로 `ms`(제품 다건, `prdGrp-data.dataJson.ms` — bo 멀티셀렉트 contentKey) 반복.

## 3. API 확인 (최종 체크 — 반드시 작성, 단정 금지)
- 신규 API 필요 여부: **신규 필요 (확정)**
- `prdGrp-data` slug의 SlugRegistry 등록 여부는 **확인 완료**: `db_backup_public_20260710.sql`의 `slug_registry` 테이블 직접 조회 결과 `id=18, slug=prdGrp-data, type=PAGE_DATA, is_active=true`로 등록돼 있음(2026-05-27 등록, comjsjc).
- STEP4(fo-be-analyzer)가 bo-api 소스(`PageDataService`, `slug_relation` 테이블)를 직접 확인한 결과: `master_slug='prdGrp-data'`인 `slug_relation`(자동 조인 설정) 행이 없어 **기존 범용 ARRAY_CONTAINS FETCH로 처리 불가** — `productManager-data`(유사 사례, master_key=`ms`)는 있으나 이건 `ms`가 순수 id배열일 때만 동작하고, `prdGrp-data.ms`는 `{id, sortOrder}` 객체 배열이라 재사용 불가. (사용자 세션 로컬 백업 교차검증으로 slug_relation 부재 사실 재확인 완료)
- (기존 활용 가능 시) 참고 엔드포인트: 없음 — `PageDataService`의 JSONB 조회 패턴(네이티브 쿼리 구조)만 재사용
- (신규 필요 시) 제안 엔드포인트: **`GET /api/v1/fo/product-groups`**
  - 기존 패턴 준수(`FoMenuController`/`FoPageDataController` 확인 완료): `FoProductGroupController` 신규 작성, `@RequestMapping("/api/v1/fo/product-groups")`, "main/" 같은 화면 경로 접두어 없이 리소스명 그대로(flat) — 기존 컨트롤러들과 동일한 명명 규칙
  - 서비스: 신규 서비스 메서드(2쿼리 배치 — ①그룹 목록 ②ms의 productId들 IN 조회 후 Java에서 조인) — `PageDataService`의 네이티브 JSONB 조회 방식 재사용, 얇은 컨트롤러로 위임
  - 응답 DTO: 기존 명명 규칙 따라 `FoProductGroupResponse`

## 4. 조회 조건 (아래 4개 필수 — orderBy 없이 다건 매칭 시 결과가 불확정됨)

### 그룹(prdGrp-data)
- where(필터 조건식, evalConditionExpr 문법): `prdGrpForm1.isVisible = '001'` — 공개(001) 그룹만.
  - ⚠️ **레거시 스키마 제외 확정**: `page_data` 실데이터 직접 확인 결과, 2026-06 초 생성된 구버전 테스트 레코드(id 626/631/743/744 등)는 `isVisible`이 `prdGrpForm1`이 아닌 별도 `prdGrpForm2.isVisible`에 있고 `ms`도 sortOrder 없는 단순 id배열이라 스키마가 다름. **사용자 확정**: 이 구버전(테스트) 데이터는 무시하고 `prdGrpForm1.isVisible='001'`인 레코드만 조회한다 — 구버전은 자동으로 where 조건에서 걸러짐(필드 경로 자체가 다르므로 매칭 안 됨).
  - 현재 코드(MainProducts.tsx)에는 필터 로직 자체가 없으며, 이 where는 목표설정 대화에서 사용자가 확정한 값이다. 코드 근거는 아님.
- row limit(단건 / 다건 개수): 다건 — 제한 없음(전체 그룹 조회)
- orderBy(정렬 필드 + ASC/DESC): `prdGrpOrd` ASC
- 2차 정렬(tie-breaker): `id` ASC

### 제품(ms, 그룹 내부 중첩)
- where(필터 조건식, evalConditionExpr 문법): 별도 없음. bo 등록 시점에 sourceFilter `dispYn=001,orderStatus=01`로 이미 제한된 제품만 선택 가능한 구조라 fo 조회단 필터가 불필요하다는 것이 목표설정 대화에서 사용자가 확정한 값이며, **이 역시 코드 근거는 아니다.**
- row limit(단건 / 다건 개수): 다건 — 그룹당 제한 없음(전체, 스크롤/스와이프로 소비)
- orderBy(정렬 필드 + ASC/DESC): `extraFields.sortOrder` ASC
- 2차 정렬(tie-breaker): `id` ASC

## 5. 샘플 응답 데이터

> 아래 값은 현재 코드(MainProducts.tsx)의 하드코딩 목업 데이터를 참고해 구성한 **추정** 데이터이며, 실제 bo dataJson 스키마·값은 확인되지 않았다.

```json
{
  "content": [
    {
      "id": 101,
      "dataJson": {
        "prdGrpNm": "New Arrivals",
        "prdGrpOrd": 1,
        "isVisible": "001",
        "ms": [
          {
            "id": 5001,
            "productDataForm": {
              "productNm": "Metasol MS",
              "prdSubDesc": "Metasol Contactor & Overload Relay",
              "awards": "",
              "sortOrder": 1
            },
            "info": {
              "image": "/img/main/product_01.jpg"
            },
            "seo": {
              "slug": "metasol-ms"
            }
          },
          {
            "id": 5002,
            "productDataForm": {
              "productNm": "XGB Series PLC",
              "prdSubDesc": "Compact PLC for industrial automation",
              "awards": "iF Design Awards 2026:01",
              "sortOrder": 2
            },
            "info": {
              "image": "/img/main/product_01.jpg"
            },
            "seo": {
              "slug": "xgb-series-plc"
            }
          },
          {
            "id": 5003,
            "productDataForm": {
              "productNm": "G100 Inverter",
              "prdSubDesc": "High-performance AC drive solutions",
              "awards": "iF Design Awards 2026:01",
              "sortOrder": 3
            },
            "info": {
              "image": "/img/main/product_01.jpg"
            },
            "seo": {
              "slug": "g100-inverter"
            }
          }
        ]
      }
    },
    {
      "id": 102,
      "dataJson": {
        "prdGrpNm": "Best Sellers",
        "prdGrpOrd": 2,
        "isVisible": "001",
        "ms": [
          {
            "id": 5011,
            "productDataForm": {
              "productNm": "Metasol MS",
              "prdSubDesc": "Metasol Contactor & Overload Relay",
              "awards": "",
              "sortOrder": 1
            },
            "info": {
              "image": "/img/main/product_01.jpg"
            },
            "seo": {
              "slug": "metasol-ms"
            }
          },
          {
            "id": 5012,
            "productDataForm": {
              "productNm": "Susol ACB",
              "prdSubDesc": "Air circuit breaker for power distribution",
              "awards": "",
              "sortOrder": 2
            },
            "info": {
              "image": "/img/main/product_01.jpg"
            },
            "seo": {
              "slug": "susol-acb"
            }
          }
        ]
      }
    }
  ]
}
```

## 6. 비고
1. `tab_area`(라벨)와 `products_panels`(정본)가 동일 `prdGrp-data` 배열을 공유하며 fetch는 1회만 수행한다. STEP6 연동 시 두 위치에서 이 배열을 중복 fetch하지 않도록 반드시 지켜야 하는 제약이다.
2. 이중 중첩 반복(`data-slug-repeat`/`data-slug-item` 어휘를 상위·중첩에 동일하게 재사용, 아이템 소속 판정은 "가장 가까운 조상 `data-slug-repeat`" 규칙 적용)은 `fo-data-binding-가이드.md`에 아직 명문화되지 않은 신규 패턴이며, 이번 건에서 실제 마크업에 적용해 확정했다. 이 패턴을 가이드 문서에 별도로 추가할지는 이후 별도 논의가 필요하다(이 문서 작성 시점에는 추가하지 않음).
3. 미해결 확인 필요 항목(3번 API 확인 참고): `prdGrp-data` slug 등록 여부는 DB 확인 완료(id=18, active). 남은 건 `ms` 중첩 배열의 제품 조인 응답 제공 여부뿐이며, 이는 사용자 확인 사항이 아니라 STEP4(fo-be-analyzer)가 bo-api 소스를 읽고 판단할 범위다.
4. 조회 조건(4번)의 그룹 `prdGrpForm1.isVisible=001` where와 제품 `ms` where 없음은 모두 목표설정 대화에서 사용자가 확정한 값이며, 현재 MainProducts.tsx 코드 자체에는 해당 필터 로직이 없다는 점을 다시 한 번 명시한다.
5. `product-data` 68건 중 `info.image` 0건, `seo.slug` 1건만 데이터가 입력돼 있음(STEP4 확인). STEP5는 API·필드 매핑 구현까지만 하고, 실제 이미지/SEO 슬러그 값 입력은 BO 화면에서 별도로 진행하는 것으로 사용자 확정함 — 데이터 미입력 상태에서는 화면에 이미지/링크가 비어 보일 수 있음.
6. **실제 라이브 데이터 기준 현황(STEP7 QA 확인)**: 현재 공개(`isVisible=001`) 그룹은 "New Arrivals"(id 1339)와 "Best Product - test"(id 1507) 2개뿐이며, "Best Sellers"라는 이름의 공개 그룹은 없음. New Arrivals가 참조하는 제품(id 1333)은 product-data에 존재하지 않는 dangling 참조라 New Arrivals 탭은 현재 빈 화면으로 보임(로직상 정상 — BO에서 그룹명/제품 구성 정리 필요). QA 스크린샷: `fo-qa-validator` 세션 스크래치패드 참고.
7. STEP6에서 `data-slugKey`/`data-slugKey-attr` 속성 사용 시 React 개발모드 콘솔 경고(커스텀 data-* 속성 casing 관련) 2건 발생 — DOM 속성 자체는 정상 부착되고 프로덕션 빌드에는 노출 안 됨. 이 표기 규칙(`data-slugKey` 카멜케이스)은 이번 건뿐 아니라 기존 가이드 예시 문서 전체가 동일하게 쓰고 있는 컨벤션이라, 고칠지 여부는 이 작업 범위를 넘는 별도 논의 사항으로 남겨둠.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-13 | MainProducts.tsx에 `data-slug="prdGrp-data"`(tab_area/products_panels 이중 배치), `data-slug-repeat`, `data-slug-item`, `data-slugKey`(prdGrpNm) 태깅 및 그룹 내부 중첩 `data-slug="ms"` 반복(제품 다건: productDataForm.productNm/prdSubDesc/awards, info.image, seo.slug) 태깅 완료 |
| STEP2 | fo-slug-analyzer | 2026-07-13 | 그룹 where(isVisible=001), orderBy(prdGrpOrd ASC, tie-breaker id ASC), row limit(전체) / 제품(ms) where(없음), orderBy(extraFields.sortOrder ASC, tie-breaker id ASC), row limit(그룹당 전체) 확정 |
| STEP3 | fo-dev-doc-writer | 2026-07-13 | 작업 단위 문서 작성 (상태: 설계중), API 확인 결과 "확인 필요"로 명시 |
| 승인 | 사용자 | 2026-07-13 | `#승인` — 문서 승인 완료 (SlugRegistry 등록 확인 정정 반영 후 승인). `fo-data-binding.md` data slug 컬럼 반영, STEP4 착수 |
| STEP4 | fo-be-analyzer | 2026-07-13 | bo-api 소스·실데이터 분석 완료. 신규 API 필요 확정(`GET /api/v1/fo/product-groups`, 기존 `FoMenuController`/`FoPageDataController` 패턴 준수). 레거시 스키마 데이터(구버전 테스트 그룹) 발견 → 사용자 확정으로 무시 처리 |
| STEP5 | fo-be-builder | 2026-07-13 | `FoProductGroupController`/`FoProductGroupService`/`FoProductGroupResponse` 신규 구현(2쿼리 배치, N+1 방지, dangling 제거, tie-breaker 반영). 컴파일 성공, 실데이터 기반 로직 검증 완료 |
| STEP6 | fo-fe-builder | 2026-07-13 | `MainProducts.tsx`(서버 컴포넌트) + `MainProductsClient.tsx` + `mainProductsData.ts` 신규/교체. 하드코딩 제거, `fetchApi`로 동적 그룹/제품 연동. FE 타입(`prdGrpOrd`/`sortOrder`)이 BE(String)와 불일치했던 버그를 세션 내 정정 완료 |
| STEP7 | fo-qa-validator | 2026-07-13 | BE(developer 프로필) 재기동 후 실브라우저 검증. 7개 검증항목 전부 통과. 실데이터 기준 New Arrivals 빈 화면·이미지 플레이스홀더·링크 비활성·배지 미노출 전부 정상 확인 |
