// Products & Systems(devices) 메가메뉴 카테고리 트리는 정적 데이터가 아니라
// fetchDevicesMegaMenu()(fo/src/data/gnb/fromCategoryData.ts, category-data/product-data 실데이터 기반)로 조립된다.
// 이 파일에는 그 트리와 무관하게 다른 곳(breadcrumbConfig.ts 등)에서 참조하는 고정 경로 상수만 남긴다.

/** GNB mega depth2 · breadcrumb L2 — Software */
export const SOFTWARE_HREF = "/products-category/software";

/** Software product detail routes — breadcrumb L3 */
export const softwareProductHrefs = {
  scada: "/product-range/scada",
  xems: "/product-range/xems",
  microGrid: "/product-range/micro-grid",
  smartFactory: "/product-range/smart-factory",
} as const;
