# Where to Buy Agency 데이터 바인딩 설계

> 대상 파일:
> - `fo/src/app/support/where-to-buy/components/WhereToBuyContents.tsx` (카드 목록 컨테이너 — 다건)
> - `fo/src/app/support/where-to-buy/components/WhereToBuyLocationCard.tsx` (카드 반복 아이템)
> - `fo/src/app/support/where-to-buy/components/WhereToBuyMapPopup.tsx` (지도 팝업 — 활성 1건 상세, 단건)
> - `fo/src/app/support/where-to-buy/components/WhereToBuyMap.tsx` (지도 마커 — lat/lng를 JS 좌표 계산에만 사용, DOM 텍스트 노드 없어 마크업 태깅 불가. 문서 매핑만)
> - 대상 아님(정적/UI 컨트롤): `WhereToBuyTitle`, `WhereToBuyBanner`, `WhereToBuyControls`, `WhereToBuyEmpty`
> 상태: 승인됨 — 단, 6절 BE 프로필 항목은 "확인 필요"로 남아있음

## 1. data-slug
- 값: `wheretobuy-agency-data` (bo `slug_registry` id=181, type=PAGE_DATA, entity_id=29 — developer DB 실조회로 실존 확인됨)
- page_template: id=124(목록/검색), id=125(상세폼)
- 다건 여부: 혼합 — 카드 목록(`WhereToBuyContents`/`WhereToBuyLocationCard`)은 **다건(배열)**, 지도 팝업(`WhereToBuyMapPopup`)은 동일 slug의 **활성 1건 상세(단건)**

## 2. data-slugKey 매핑

### 2-1. 카드 목록 (다건, `WhereToBuyContents.tsx` + `WhereToBuyLocationCard.tsx`)

```html
<div data-slug="wheretobuy-agency-data" data-slug-repeat="true">
  <div data-slug-item>
    <h2 data-slugKey="agency_name"></h2>
    <p data-slugKey="address"></p>
    <a data-slugKey="office_number" data-slugKey-attr="href" href="tel:"></a>
    <a data-slugKey="homepage" data-slugKey-attr="href" href="">
      <span data-slugKey="homepage"></span>
    </a>
  </div>
</div>
```

| slugKey | dataJson 필드(agencyForm 기준) | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| agency_name | `agencyForm.agency_name` | string | 텍스트(카드 `h2`) | 대리점명 |
| address | `agencyForm.address` | string | 텍스트(카드) | 주소 |
| office_number | `agencyForm.office_number` | string | 텍스트 + 속성(`a[href]`, FE가 `tel:` 접두 가공) | 전화번호. 카드 전화 표시 및 Call Now href |
| homepage | `agencyForm.homepage` | string | 속성(`a[href]`) + 텍스트(동일 값 이중 — anchor 안 span) | 웹사이트 URL. href·라벨 표시 모두 동일 값 사용 |

### 2-2. 지도 팝업 (단건, `WhereToBuyMapPopup.tsx`)

```html
<div data-slug="wheretobuy-agency-data">
  <h3 data-slugKey="agency_name"></h3>
  <p data-slugKey="address"></p>
  <a data-slugKey="office_number" data-slugKey-attr="href" href="tel:"></a>
</div>
```

| slugKey | dataJson 필드 | 타입 | 바인딩 대상 | 설명 |
|---|---|---|---|---|
| agency_name | `agencyForm.agency_name` | string | 텍스트(`h3`) | 팝업 상단 대리점명 |
| address | `agencyForm.address` | string | 텍스트 | 팝업 주소 |
| office_number | `agencyForm.office_number` | string | 텍스트 + 속성(`a[href]`) | 팝업 전화번호 |

### 2-3. 마크업 태깅 불가 — 지도 마커 JS 전용 (`WhereToBuyMap.tsx`)

| 필드 | dataJson 필드 | 타입 | 비고 |
|---|---|---|---|
| lat | `agencyForm.address_lat` | number | 지도 마커 좌표 계산에만 사용, DOM 텍스트 노드 없음 → `data-slugKey` 태깅 불가. STEP6에서 fetchApi 결과를 지도 컴포넌트 prop으로 직접 전달 |
| lng | `agencyForm.address_lng` | number | 상동 |

### 2-4. 이번 범위 제외(확정)
`badges`(bo 폼 필드 없음, CSS `display:none` 상태), `brandPin`, `directionsHref`(FE 가공값, bo 필드 아님), `temp1`~`temp4`. 신규 필드 추가 금지.

## 3. API 확인 (최종 체크 — 확정)
- 신규 API 필요 여부: **기존 활용 가능** (신규 불필요, 확정)
- 참고 엔드포인트: `GET /api/v1/fo/page-data/{slug}` (`FoPageDataController`, `bo-api/.../controller/FoPageDataController.java:22` → `PageDataService.search()`). `/api/v1/fo/**`는 `SecurityConfig.java:56`에서 permitAll — 비로그인 조회 가능(press-data/blog-data와 동일 패턴, 실호출 검증된 방식)
- 최종 호출: `GET /api/v1/fo/page-data/wheretobuy-agency-data?eq_agencyForm.is_visible=001&size=100`
- 응답: `content[i].dataJson.agencyForm.{필드}`. 카드 목록·지도 마커·팝업이 이 단일 응답을 공유(fetch 1회, 중복 fetch 금지)

## 4. 조회 조건
- where(필터 조건식): `eq_agencyForm.is_visible=001` (공개만)
- row limit: 다건 — `size=100` (실 공개 3건 소량, 방어적 상한값)
- orderBy: 기본값 `created_at DESC` (명시적 정렬 요구 없음, 실건수 소량이라 파라미터 미부여)
- 2차 정렬(tie-breaker): **확인 필요** — STEP4 단계에서 명시적으로 확정되지 않음. 실건수가 소량이라 실질 영향은 낮으나, tie-breaker 기준(예: `id`)을 명시할지 여부는 별도 확인 필요
- 거리필터(500/250/100/50mi)·주소검색·"이 지역에서 검색"(영역필터)·내위치(geolocation)는 서버 where 파라미터가 아니라, 위 단일 fetch로 받은 전체 배열을 **FE(`fo/src/data/support/whereToBuyContent.ts`)에서 클라이언트 사이드로 필터링**하는 방식으로 구현되어 있다(`filterLocationsByRadius`/`filterLocationsByBounds`, haversine 거리 계산). BE 재조회 없이 이미 받은 배열만으로 동작하므로 신규 API 불필요.

## 5. 샘플 응답 데이터

> 로컬 bo-api(`GET /api/v1/fo/page-data/wheretobuy-agency-data?eq_agencyForm.is_visible=001&size=100`) 실호출 결과(실측, 2026-07-21). STEP4 당시(developer DB) 값과 데이터가 달라졌으므로 이 버전이 현재 기준이다.

```json
{
  "content": [
    {
      "id": 1841,
      "dataJson": {
        "agencyForm": {
          "agency_name": "MARSHALL WOLF AUTOMATION",
          "address": "923 S Main St, Algonquin, IL 60102, USA",
          "office_number": "847-641-2324",
          "homepage": "https://www.wolfautomation.com",
          "address_lat": 42.1595811,
          "address_lng": -88.2969481,
          "is_visible": "001"
        }
      }
    },
    {
      "id": 1837,
      "dataJson": {
        "agencyForm": {
          "agency_name": "le electric america",
          "address": "625 Heathrow Dr, Lincolnshire, IL 60069, USA",
          "office_number": "01-1234-1111",
          "homepage": "https://www.lselectricamerica.com/",
          "address_lat": 42.1880235,
          "address_lng": -87.9439671,
          "is_visible": "001"
        }
      }
    },
    {
      "id": 1836,
      "dataJson": {
        "agencyForm": {
          "agency_name": "ls electric",
          "address": "Chicago, IL, USA",
          "office_number": "10-1234-1234",
          "homepage": "https://www.ls-electric.com/",
          "address_lat": 41.88325,
          "address_lng": -87.6323879,
          "is_visible": "001"
        }
      }
    }
  ],
  "totalElements": 3
}
```

- 공개(`is_visible='001'`) 3건: id 1841/1837/1836. 전부 유효 좌표(0/빈값 아님), 전부 일리노이/시카고 인근이라 지도 기본중심(`mapDefaultCenter`, 4절 참고)에서 가까운 거리
- STEP4 문서화 당시 존재했던 좌표 이상값(0 또는 빈 문자열) 레코드(id 1646/1632)는 현재 조회 결과에 없음 — 데이터가 그 사이 정리된 것으로 보이며, 6절의 좌표 품질 이슈는 현재 기준으로는 해당 없음(단, 방어 가드 코드 자체는 유지)

## 6. 비고

1. **좌표 품질 가드**: STEP4 문서화 당시 공개 레코드 중 좌표가 `0`/빈 문자열인 것이 있었으나(5절 참고), 현재 데이터에는 해당 레코드가 없다. 다만 향후 유사 불량 데이터가 다시 들어올 수 있으므로, `fo/src/data/support/whereToBuyContent.ts`의 `hasValidCoords()`(`Number.isFinite && !== 0` 가드)로 지도 마커/`LatLngBounds` 생성에서 걸러내는 처리는 그대로 유지한다. **BE where 조건으로 강제 필터링하지 않는다**(bo 데이터 정합성 문제이지 FO 조회조건 문제가 아님 — 근본 정리는 bo 관리자 화면에서 해당 레코드를 수정하는 것).
2. **BE 검증 프로필 (확인 필요)**: 이번 STEP4 실조회는 local DB 접속 실패로 developer DB(10.153.11.120)를 통해 수행함. STEP7 QA 단계에서 bo-api를 어떤 프로필(local/developer)로 기동해 최종 검증할지는 아직 결정되지 않음 — QA 진입 전 확인 필요.
3. `WhereToBuyMap.tsx`는 lat/lng를 지도 마커 생성 JS 로직에만 사용하고 이를 표시하는 DOM 텍스트 노드가 없어 `data-slugKey` 마크업 태깅이 불가능하다(2-3 참고). STEP6에서 fetchApi 응답을 지도 컴포넌트 prop으로 직접 전달해야 한다.
4. `badges`/`brandPin`/`directionsHref`/`temp1~4`는 bo 폼 필드 부재 또는 FE 전용 가공값이라 이번 스코프에서 제외 확정. 신규 필드를 bo에 추가하는 것도 이번 범위에 포함되지 않는다.
5. 거리필터(500/250/100/50mi)·주소검색·"이 지역에서 검색"(영역필터)·내위치(geolocation)는 이후 후속 작업(0-8 FO화면개발수정)에서 구현 완료됨 — `fo/src/data/support/whereToBuyContent.ts`의 `filterLocationsByRadius`/`filterLocationsByBounds`가 이 문서 3절의 단일 fetch 결과를 클라이언트 사이드에서 필터링한다. 신규 where 파라미터·BE 재작업 없음(4절 참고).
6. `homepage` 필드는 href 속성과 텍스트 라벨에 동일 값이 이중으로 쓰인다(anchor 태그 안에 span으로 같은 문자열 재노출) — 별도 라벨 필드가 없으므로 오타/불일치 아님.
7. **마커 아이콘 자산은 반드시 실제 `.svg` 파일로, 확장자도 `.svg`로 저장해야 한다**: `whereToBuyPage.mapPinImage`/`mapBrandPinImage`(`whereToBuyContent.ts`)가 가리키는 `fo/public/img/support/where-to-buy/pin.svg`/`pin-brand.svg`는 과거 `.png` 확장자로 저장돼 있었는데 실제 내용은 SVG XML이라(ls-publish 레거시 원본부터 동일 오류), 브라우저가 PNG로 디코딩을 시도하다 실패해 `google.maps.Marker`의 `icon.url` 이미지 로드가 깨지고 지도 핀이 전혀 안 보이는 문제가 있었다(2026-07-21 수정). 이 폴더에 새 핀 이미지를 추가/교체할 때는 파일 실제 포맷과 확장자가 일치하는지(`file` 명령 등으로) 반드시 확인한다.

## 7. STEP별 진행 이력
| STEP | 담당 에이전트 | 날짜 | 결과 요약 |
|---|---|---|---|
| STEP1 | fo-slug-analyzer | 2026-07-16 | `WhereToBuyContents`(컨테이너, data-slug-repeat)/`WhereToBuyLocationCard`(data-slug-item, agency_name/address/office_number/homepage)/`WhereToBuyMapPopup`(동일 slug 단건) 태깅 완료. `WhereToBuyMap`은 DOM 텍스트 노드 없어 태깅 불가 확인(문서 매핑만). Title/Banner/Controls/Empty는 정적/UI 컨트롤로 대상 제외 확정 |
| STEP2 | fo-slug-analyzer | 2026-07-16 | where(`is_visible=001` 공개만), row limit(다건 `size=100`, 실공개 4건), orderBy(기본값 `created_at DESC`, 명시요구 없음) 확정. 거리필터·검색어는 FE 미구현으로 이번 범위 제외 확정. tie-breaker는 미확정(확인 필요)으로 남김 |
| STEP4 | fo-be-analyzer | 2026-07-16 | slug 실존 확인(`slug_registry` id=181, entity_id=29). 신규 API 불필요 — 기존 `FoPageDataController`/`PageDataService.search()` 재사용 확정. developer DB 실조회로 전체 6건/공개 4건(id 1837/1836/1646/1632) 확인, id 1646/1632 좌표 이상값(0 및 빈값) 발견. local DB 접속 실패로 developer DB 사용 |
| STEP3 | fo-dev-doc-writer | 2026-07-16 | 작업 단위 문서 신규 작성(support 섹션 신규 생성). 좌표 품질·BE 검증 프로필 2건은 "확인 필요"로 명시, 그 외 항목은 승인됨 상태로 확정 반영 |
| STEP6(재구현) | fo-fe-builder | 2026-07-22 | `fetchWhereToBuyLocations`(`fo/src/data/support/whereToBuyContent.ts`) 내부 구현을 `fetchApi` 직접호출에서 공통계층 `fetchData`(`fo/src/lib/pageDataApi.ts`)로 교체. slug/where(`eq_agencyForm.is_visible=001`)/size(100)/orderBy 등 3·4절 스펙 변경 없음, 값 가공(`toWhereToBuyLocation`)은 `리턴함수`로 그대로 재사용. 함수 시그니처 유지로 호출부(`WhereToBuyContents.tsx`) 무수정. dead code(`WHERE_TO_BUY_ENDPOINT`/`WhereToBuyPageResponse`) 제거. 타입체크 통과 |
