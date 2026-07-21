// bo(bo/src/app/admin/templates/make/_shared/utils.ts)의 flattenPageDataItem 포팅.
// bo 위젯 렌더러와 동일한 accessor 규칙을 fo fetchApi 응답(dataJson 중첩 구조)에도 그대로 적용하기 위한 공통 유틸.
// 절대 fo 각 slug 파일에서 개별적으로 언랩 로직을 복붙하지 말고 이 함수를 사용할 것.

/** flattenPageDataItem 내부 — 중첩 객체의 dot notation 키를 재귀적으로 target에 추가 */
function addDotNotationKeys(
  target: Record<string, unknown>,
  obj: Record<string, unknown>,
  prefix: string,
): void {
  Object.entries(obj).forEach(([k, v]) => {
    const dotKey = `${prefix}.${k}`;
    target[dotKey] = v;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      addDotNotationKeys(target, v as Record<string, unknown>, dotKey);
    }
  });
}

export interface PageDataItem {
  id: number;
  groupId?: string | number | null;
  dataJson: Record<string, unknown>;
  createdAt?: string | null;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

/**
 * API 응답 단일 item → flat row 변환 (bo flattenPageDataItem과 동일 accessor 규칙)
 *   1단계(flat)            contentKey 없음 → fieldKey가 root에 존재, accessor: "title"
 *   2단계(contentKey)      섹션 1개(중복 없음) → root에 자동 병합, accessor: "title" 또는 "form1.title"
 *   2단계(contentKey 중복)  섹션 여러 개 + 같은 필드명 충돌 → "form1.title"만 가능, "title" 불가
 *
 * @example
 * flattenPageDataItem({ id: 1, dataJson: { blogForm: { title: "A" } }, ... })
 * // → { _id: 1, title: "A", blogForm: { title: "A" }, createdAt: ... }
 */
export function flattenPageDataItem(item: PageDataItem): Record<string, unknown> {
  const restDataJson = item.dataJson ?? {};

  // 최상위 object 값(contentKey 섹션) 감지
  const sectionEntries = Object.entries(restDataJson).filter(
    ([, v]) => v !== null && typeof v === "object" && !Array.isArray(v),
  );

  // 중복 없는 fieldKey만 root에 flat 병합 + 경로 맵 생성
  const flatExtra: Record<string, unknown> = {};
  const _pathMap: Record<string, string> = {};
  if (sectionEntries.length > 0) {
    const keyCount: Record<string, number> = {};
    sectionEntries.forEach(([, section]) =>
      Object.keys(section as Record<string, unknown>).forEach((k) => {
        keyCount[k] = (keyCount[k] ?? 0) + 1;
      }),
    );
    sectionEntries.forEach(([sectionKey, section]) => {
      // dot notation accessor 키를 재귀적으로 root에 추가 — row["form1.title"] 직접 접근
      addDotNotationKeys(flatExtra, section as Record<string, unknown>, sectionKey);

      Object.entries(section as Record<string, unknown>).forEach(([k, v]) => {
        if (keyCount[k] === 1) {
          flatExtra[k] = v;
          _pathMap[k] = `${sectionKey}.${k}`;
        }
      });
    });

    // _fetchedRel{id} 섹션 전용 단축키 (bo와 동일 규칙 — fo에서 연동 slug를 쓰게 될 경우 대비, 없으면 no-op)
    sectionEntries
      .filter(([sectionKey]) => sectionKey.startsWith("_fetchedRel"))
      .forEach(([sectionKey]) => {
        const leafCount: Record<string, number> = {};
        const leafFullKey: Record<string, string> = {};
        Object.keys(flatExtra)
          .filter((k) => k.startsWith(`${sectionKey}.`))
          .forEach((fullKey) => {
            const segs = fullKey.split(".");
            const leaf = segs[segs.length - 1];
            leafCount[leaf] = (leafCount[leaf] ?? 0) + 1;
            leafFullKey[leaf] = fullKey;
          });
        Object.entries(leafCount).forEach(([leaf, count]) => {
          const shortKey = `${sectionKey}.${leaf}`;
          if (count === 1 && !(shortKey in flatExtra)) {
            flatExtra[shortKey] = flatExtra[leafFullKey[leaf]];
          }
        });
      });
  }

  return {
    _id: item.id,
    _groupId: item.groupId ?? null,
    _pathMap,
    ...flatExtra,
    ...restDataJson,
    createdAt: item.createdAt ?? null,
    createdBy: item.createdBy ?? null,
    updatedAt: item.updatedAt ?? null,
    updatedBy: item.updatedBy ?? null,
  };
}

/**
 * API 응답 단일 item → flatten row 변환(flattenPageDataItem 공용 별칭).
 * fetchData(단건 상세 브랜치)의 기본 후처리로 사용한다 — 네트워크 호출 없이 로컬 변환.
 */
export function commonData(item: PageDataItem): Record<string, unknown> {
  return flattenPageDataItem(item);
}

/**
 * API 응답 content 배열 → flatten row 배열(네트워크 호출 없이 로컬 map).
 * fetchData(목록 브랜치)의 기본 후처리로 사용한다.
 */
export function commonEachData(items: PageDataItem[]): Record<string, unknown>[] {
  return (items ?? []).map(commonData);
}

/**
 * flatten된 row에서 camelCase/snake_case 어느 스키마든 허용하며 값을 읽는 accessor.
 * BO page_template 스키마가 camelCase(publishDttm)→snake_case(publish_dttm)로 바뀌면서
 * 신규 레코드(snake)와 구 레코드(camel)가 DB에 혼재하는 상황에 대응하기 위한 읽기 전용 헬퍼.
 * 인자로 준 키 순서대로 처음 만나는 유효값(null/undefined/빈문자열 제외)을 반환, 없으면 undefined.
 *
 * ⚠️ flattenPageDataItem 자체는 bo 위젯 렌더러 유틸의 포팅본이므로 원본 accessor 규칙을 그대로 유지한다.
 *    스키마 필드명 정규화는 공용 함수에 넣지 않고(다른 slug 파급/중복 억제 키 부활/audit 키 오염 위험),
 *    화면 바인딩 지점에서 이 헬퍼로만 처리한다.
 *
 * @example pickField(row, "publish_dttm", "publishDttm") // 신규 우선, 없으면 구 스키마
 */
export function pickField(
  row: Record<string, unknown>,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    const v = row[key];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}
