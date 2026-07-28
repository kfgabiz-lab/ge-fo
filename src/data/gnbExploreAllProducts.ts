// 카테고리 컨텍스트(?category=) 부착 — GNB 링크 생성부(fromCategoryData.ts)와 동일한 공용 헬퍼.
import { withCategoryContext } from "@/lib/navigation/categoryContext";

export const EXPLORE_ALL_PRODUCTS_PATH = "/products-systems/explore-all";

export type GnbExploreProduct = {
  id: string;
  label: string;
  href: string;
  discontinued?: boolean;
  lv1Id?: string;
  // 이 제품이 매핑된 "공개 Lv2"(devices-tree depth3 junction의 parentId, visibleLv2 교집합) rowId 목록.
  // Explore All 페이지의 Lv1/Lv2 셀렉트 필터(OR 다중매핑)에 사용. 정적 폴백 데이터에는 없음.
  lv2Ids?: string[];
};

export type GnbExploreLetterGroup = {
  letter: string;
  items: GnbExploreProduct[];
};

const productHrefMap: Record<string, string> = {
  DMPi: "/product/metasol-ms",
  GMP: "/product/metasol-ms",
  HVDC: "/product/scada",
  "H100 Plus": "/product/h100-plus",
  IMP: "/product/metasol-ms",
  "Metasol MS": "/product/metasol-ms",
  MMP: "/product/metasol-ms",
  SCADA: "/product/scada",
  "Diagnosis System": "/product/smart-factory",
  "Micro Grid": "/product/micro-grid",
  "Smart Factory": "/product/smart-factory",
  xEMS: "/product/xems",
  "Susol UL ACB": "/product/metasol-ms",
  "Susol UL MCCB": "/product/susol-ul-smart-mccb",
};

const lv1IdMap: Record<string, string> = {
  "Cast Resin Transformer": "mv",
  "Dead Tank Circuit Breaker": "hv",
  "Diagnosis System": "software",
  FACTS: "hv",
  GIS: "hv",
  "HVDC": "hv",
  "Metal Clad Switchgear": "mv",
  "Metal Enclosed Load Interrupter\nSwitchgear": "mv",
  "Micro Grid": "software",
  "Motion Controllers": "automation",
  "MV Fuse": "mv",
  "MV MCC": "mv",
  "Padmount Switchgear": "mv",
  "Padmount Transformer": "mv",
  "PHOX Servo Drives": "automation",
  "Power Transformer": "hv",
  "Servo Motors": "automation",
  "SMART I/O": "automation",
  "Smart Factory": "software",
  xEMS: "software",
  XGB: "automation",
  XGT: "automation",
};

const discontinuedLabels = new Set(["BK-Series_DIN SPD(UL)"]);

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function product(label: string, href?: string): GnbExploreProduct {
  const normalized = label.replace(/\n/g, " ");
  const lv1Id =
    lv1IdMap[label] ??
    (normalized.startsWith("DC ") ? "dc" : undefined) ??
    "lv";

  return {
    id: slugify(label),
    label,
    href: href ?? productHrefMap[normalized] ?? productHrefMap[label] ?? "/products-category/lv-products-and-systems",
    discontinued: discontinuedLabels.has(label),
    lv1Id,
  };
}

/** Figma 4701:82590 — Explore All Products A–Z index */
export const gnbExploreAllProducts: GnbExploreProduct[] = [
  "BK-Series_DIN SPD(UL)",
  "BK-Series_UL Type",
  "Cast Resin Transformer",
  "DC Magnetic Contactor",
  "DC MCB(Miniature Circuit Breaker)",
  "DC MCCB/Disconnect(Up to 600A)",
  "DC Relay",
  "DC Surge Protective Device(UL1449)",
  "Dead Tank Circuit Breaker",
  "Diagnosis System",
  "DMPi",
  "E House",
  "eXP2",
  "FACTS",
  "G100",
  "GFCI",
  "GIS",
  "GMP",
  "H100 Plus",
  "HVDC",
  "IEC DC ACB & Switch-Disconnector",
  "IMP",
  "iS7",
  "iX7M Servo Drives",
  "iX7NH Servo Drives",
  "iXP3",
  "L7NH Servo Drives",
  "L7P Servo Drives",
  "Load Interrupter Switch",
  "L-Series_UL Type",
  "LV MCC",
  "LXP",
  "M100",
  "Metal Clad Switchgear",
  "Metal Enclosed Load Interrupter\nSwitchgear",
  "Metasol MS",
  "Micro Grid",
  "Mini MS",
  "MMP",
  "MMS",
  "Motion Controllers",
  "MV Fuse",
  "MV MCC",
  "Padmount Switchgear",
  "Padmount Transformer",
  "PHOX Servo Drives",
  "Power Transformer",
  "Remote Power Panel",
  "S100",
  "SAFETY",
  "SCADA",
  "Secondary Unit Substation",
  "Servo Motors",
  "SMART I/O",
  "SP100",
  "Susol UL ACB",
  "Susol UL MCCB",
  "Susol UL VCB",
  "Thermal Overload Relay",
  "UL DC Compact Switch-Disconnector",
  "UL DC Switch-Disconnector",
  "UL SPD",
  "UL1558 Switchgear",
  "UL67 Panelboard",
  "UL891 Switchboard",
  "xEMS",
  "XGB",
  "XGT",
].map((label) => product(label));

// 제품명(label) → 상세 정적 라우팅 href. product-data 로 목록을 대체할 때 각 제품의 href 를 파생하는 데 사용.
// 매핑에 없으면 devices-systems 진입 라우트로 폴백(데이터 필드 아님, 정적 라우팅).
export function resolveExploreHref(label: string): string {
  const normalized = label.replace(/\n/g, " ");
  return (
    productHrefMap[normalized] ??
    productHrefMap[label] ??
    "/products-category/lv-products-and-systems"
  );
}

// resolveExploreHref 결과가 /product/{slug} 형태면 그 제품이 속한 Lv2 카테고리 컨텍스트를 붙인다.
//
// ⚠️ 컨텍스트는 "목록에 뜬 제품"이 아니라 "링크가 가리키는 제품(slug)" 기준으로 붙여야 한다.
//    productHrefMap 은 동일성 매핑이 아니라 "가장 가까운 상세 페이지"로 보내는 표라서
//    (DMPi·GMP·IMP·MMP·Susol UL ACB 가 모두 /product/metasol-ms 로 간다) 목록 제품의 카테고리를
//    붙이면 링크 대상과 무관한 값이 실린다.
//
// lv2IdBySlug: 제품 slug → 그 제품이 속한 공개 Lv2 id(devices-tree depth3 연결행의 parentId).
//   호출부(explore-all 페이지)가 이미 조회해 둔 devices-tree 로 만들어 넘긴다(추가 조회 없음).
//   매핑이 없으면 withCategoryContext 가 href 를 그대로 돌려주므로 기존 동작과 동일하다.
export function withExploreProductCategory(
  href: string,
  lv2IdBySlug: ReadonlyMap<string, string>,
): string {
  const matched = href.match(/^\/product\/([^/?#]+)$/);
  if (!matched) return href;
  return withCategoryContext(href, lv2IdBySlug.get(matched[1]));
}

function getFirstLetter(label: string): string {
  const match = label.replace(/^\s+/, "").match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : "#";
}

export function groupExploreProductsByLetter(
  products: GnbExploreProduct[],
): GnbExploreLetterGroup[] {
  const groups = new Map<string, GnbExploreProduct[]>();

  for (const item of products) {
    const letter = getFirstLetter(item.label);
    const bucket = groups.get(letter) ?? [];
    bucket.push(item);
    groups.set(letter, bucket);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({
      letter,
      items: [...items].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      ),
    }));
}

export function chunkLetterGroups<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}
