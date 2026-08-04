# FO Redis 캐시 구조

> 대상 저장소: `ge-api` (bo-api). 이 문서는 FO 개발 시 참고용으로 `ge-fo` 루트에 둔다.
> 상태: 2026-08-04 기준 구현 완료. `ge-api`의 `RedisCacheConfig.java` / `PageDataService.java` / `SearchManageService.java` 참고.

---

## 핵심 원칙

1. **캐싱은 FO 전용 보조수단이다.** BO(관리자) 조회/CRUD는 어떤 경우에도 캐시를 읽지 않는다.
   - BO 관리자 화면은 "현재 데이터를 GET으로 불러와 폼에 채우고 → 일부만 수정 → 전체 객체를 통째로 다시 저장"하는 read-modify-write 패턴을 쓴다. 이 흐름에서 캐시를 읽으면, 캐시가 아주 잠깐이라도 최신이 아닐 때 그 스냅샷 기준으로 저장되면서 필드가 통째로 유실되는 사고가 날 수 있다
   - 그래서 BO의 단건/목록 조회(`getById`, `search`, `getOne`, `getList`)는 캐시 로직을 아예 타지 않고 항상 DB를 직접 조회한다.
2. **캐시는 원본 데이터에 절대 영향을 주지 않는다.** 캐시를 통째로 비워도(flush) 원본 DB 데이터는 전혀 영향받지 않는다. 캐시 쓰기 실패도 저장 자체를 실패시키지 않는다(`CacheErrorHandler`로 캐시 연산 예외는 로그만 남기고 삼킴).
3. **BO 저장 시점에 write-through로 캐시를 채운다.** BO에서 등록/수정(`create`/`update`/`patchField`/`addText`/`deleteText` 등)이 성공하면, 그 결과를 곧바로 Redis에 반영한다. FO는 이 캐시를 나중에 읽어서 쓰는 소비자다(현재 FO 쪽 실제 소비 코드는 아직 없음 — 필요한 화면에서 이 캐시를 읽어오는 구현이 추가로 필요하다).

---

## 캐시 목록

| 캐시 이름 | 원본 데이터 | 값 타입 | 키 | TTL | write-through 트리거 | evict 트리거 |
|---|---|---|---|---|---|---|
| `searchManage` | `search_manage` / `search_manage_text` (검색관리) | `SearchManageResponse` | `id`(search_manage.id) | 30분 | `create`(신규 id), `update`, `addText`, `deleteText` | `delete` |
| `productData` | `page_data` WHERE `data_slug='product-data'` | `PageDataResponse` | `id`(page_data.id) | 30분 | `create`, `update`, `patchField` | 없음(product는 삭제 기능이 없음) |
| `contentsData` | `page_data` WHERE `data_slug` IN (`blog-data`,`press-data`,`articles-data`) | `PageDataResponse` | `id`(page_data.id) | 30분 | `create`, `update`, `patchField` | `delete`, `deleteByPk`(전체삭제), `deleteByGroupId`(전체삭제, slug 무관 무조건) |

`productData`/`contentsData`는 `PageDataService`의 공용 CRUD 메서드(product/blog/press/articles 등 여러 콘텐츠 타입이 공유)에 slug 조건부로 붙어있다. 예: `#slug == 'product-data'` 조건이 참일 때만 `productData` 캐시에 반영.

---

## Redis 키 포맷

```
nahp:cache:{캐시이름}::{키}
```

예시:
- `nahp:cache:searchManage::17`
- `nahp:cache:productData::2326`
- `nahp:cache:contentsData::2348`

`::`(콜론 2개)는 의도된 포맷이다(GUI 트리뷰에서 "[Empty]" 폴더로 보일 수 있으나 정상 동작이며, 다른 코드에서 이 포맷을 파싱/의존하는 곳은 없다).

## 값 포맷

- 값은 순수 JSON이며 `@class` 같은 타입 힌트가 없다 (`Jackson2JsonRedisSerializer<타입>`으로 캐시별 값 타입을 고정해서 default typing 없이 직렬화).
- 날짜/시각은 ISO-8601 문자열(`"2026-08-03T04:51:15.157672"`)이며 유닉스 타임스탬프(숫자)가 아니다.
- `productData`/`contentsData`의 값은 `PageDataResponse.dataJson`(Map) 안에 원본 페이지 데이터가 그대로 들어있다. FETCH 관계로 채워지는 `_fetchedRel{n}` 필드는 `dataJson` 최상위에만 붙는다(폼 섹션 내부에 중첩된 동일 이름 필드가 있다면 그건 별개이며 백엔드가 채워주지 않는 필드다).

---

## 확인 방법 (개발서버)

인증 없이 열려있는 테스트 엔드포인트로 캐시 값을 직접 조회할 수 있다:

```
GET /api/v1/redisTest/ping                     # Redis 연결 확인 (REDIS_OK)
GET /api/v1/redisTest/get?key={위 키 포맷}       # 캐시된 JSON 값 그대로 반환
```

예: `GET /api/v1/redisTest/get?key=nahp:cache:productData::2326`

---

## 환경별 활성화 여부

- `ls.redis-enabled=true`일 때만 `RedisCacheConfig`(캐시 설정 전체)가 로드된다. `false`면 `@Cacheable`/`@CachePut`/`@CacheEvict` 애노테이션은 전부 비활성(아무 동작 안 함) 상태가 된다.
- `application-dev.yml`(개발서버): `redis-enabled: true`, 실제 Azure Redis(`redis-lse-kc-dev-nahp-01.redis.cache.windows.net`) 연결.
- `application-developer.yml`/`application-local.yml`(로컬 개발자 PC): `redis-enabled: false`(기본값) — 로컬에서는 캐싱 자체가 동작하지 않는다. 로컬에서 캐싱 동작을 직접 확인하려면 Docker로 로컬 Redis를 띄우고 해당 프로필에 `redis-enabled: true` + `spring.data.redis.host/port`를 임시로 지정해야 한다(커밋 금지, 확인 후 원복).

---

## FO에서 이 캐시를 쓰려면

현재 이 캐시는 **BO 저장 시 채워지기만 하고, 아직 FO 쪽에서 읽어서 쓰는 코드는 없다.** FO 개발 시 이 캐시를 활용하려면:

1. 필요한 화면/API에서 `CacheManager`로 위 캐시 이름 + id(page_data.id 또는 search_manage.id)로 조회를 시도
2. 캐시 미스(또는 캐시 자체가 없는 상태, 즉 로컬처럼 `redis-enabled=false`인 환경)일 때는 반드시 기존 DB 직접 조회 경로로 폴백해야 한다 — 캐시가 없다고 화면이 깨지면 안 된다(캐시는 어디까지나 보조수단).
3. 캐시에 값을 쓰는(evict/put) 로직은 FO 쪽에 추가하지 않는다 — 원본 데이터 쓰기와 캐시 갱신은 전부 BO 쪽(`ge-api`)의 책임이다.