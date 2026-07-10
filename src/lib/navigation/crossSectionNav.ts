export const MAIN_PATH = "/main";

export function isMainPath(pathname: string) {
  return pathname === MAIN_PATH || pathname.startsWith(`${MAIN_PATH}/`);
}

/** `/` — 페이지 인덱스 (히스토리 복귀 시 hard reload) */
export function isPageIndexPath(pathname: string) {
  return pathname === "/";
}

/** `/guide`, `/guide/*` — soft route OK (design guide) */
export function isGuideHubPath(pathname: string) {
  return pathname === "/guide" || pathname.startsWith("/guide/");
}

/** 제품 상세 L3 — `/products-systems/{category}/{slug}` */
export function isDevicesProductDetailPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const dsIndex = parts.indexOf("products-systems");
  if (dsIndex === -1) return false;
  return parts.slice(dsIndex + 1).length >= 2;
}

/** @deprecated Use isPageIndexPath / isGuideHubPath */
export function isGuideIndexPath(pathname: string) {
  return isPageIndexPath(pathname) || isGuideHubPath(pathname);
}
