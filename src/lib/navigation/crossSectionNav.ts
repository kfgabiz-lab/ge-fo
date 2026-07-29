export const MAIN_PATH = "/main";

export function isMainPath(pathname: string) {
  return pathname === MAIN_PATH || pathname.startsWith(`${MAIN_PATH}/`);
}

export function isPageIndexPath(pathname: string) {
  return pathname === "/";
}

export function isGuideHubPath(pathname: string) {
  return pathname === "/guide" || pathname.startsWith("/guide/");
}

export function isDevicesProductDetailPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (
    (parts[0] === "product" || parts[0] === "product-range") &&
    parts.length >= 2
  ) {
    return true;
  }
  const dsIndex = parts.indexOf("products-systems");
  if (dsIndex !== -1 && parts.slice(dsIndex + 1).length >= 2) {
    return true;
  }
  return false;
}

export function isGuideIndexPath(pathname: string) {
  return isPageIndexPath(pathname) || isGuideHubPath(pathname);
}
