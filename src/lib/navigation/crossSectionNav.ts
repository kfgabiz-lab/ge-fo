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

/** 제품 상세 — 신규 `/product/{slug}` · `/product-range/{slug}`(SW 제품상세) + 구 `/products-systems/{category}/{slug}`(리다이렉트 전 호환) */
export function isDevicesProductDetailPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  // 신규 라우트: /product/{slug}, /product-range/{slug}
  if (
    (parts[0] === "product" || parts[0] === "product-range") &&
    parts.length >= 2
  ) {
    return true;
  }
  // 구 라우트: /products-systems/{category}/{slug} (하위 2세그먼트 이상) — 리다이렉트 전 접근 호환
  const dsIndex = parts.indexOf("products-systems");
  if (dsIndex !== -1 && parts.slice(dsIndex + 1).length >= 2) {
    return true;
  }
  return false;
}

/** @deprecated Use isPageIndexPath / isGuideHubPath */
export function isGuideIndexPath(pathname: string) {
  return isPageIndexPath(pathname) || isGuideHubPath(pathname);
}
