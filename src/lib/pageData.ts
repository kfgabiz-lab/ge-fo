
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

export function flattenPageDataItem(item: PageDataItem): Record<string, unknown> {
  const restDataJson = item.dataJson ?? {};

  const sectionEntries = Object.entries(restDataJson).filter(
    ([, v]) => v !== null && typeof v === "object" && !Array.isArray(v),
  );

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
      addDotNotationKeys(flatExtra, section as Record<string, unknown>, sectionKey);

      Object.entries(section as Record<string, unknown>).forEach(([k, v]) => {
        if (keyCount[k] === 1) {
          flatExtra[k] = v;
          _pathMap[k] = `${sectionKey}.${k}`;
        }
      });
    });

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

export function commonData(item: PageDataItem): Record<string, unknown> {
  return flattenPageDataItem(item);
}

export function commonEachData(items: PageDataItem[]): Record<string, unknown>[] {
  return (items ?? []).map(commonData);
}

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
