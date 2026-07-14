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
