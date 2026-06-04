export const MAIN_PATH = "/main";

export function isMainPath(pathname: string) {
  return pathname === MAIN_PATH || pathname.startsWith(`${MAIN_PATH}/`);
}
