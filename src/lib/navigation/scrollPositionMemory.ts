const STORAGE_PREFIX = "scroll-pos:";

function storageKey(pathWithSearch: string): string {
  return `${STORAGE_PREFIX}${pathWithSearch}`;
}

/** 현재 스크롤 위치를 경로별로 기억해 둔다 — 브라우저 네이티브 scrollRestoration에
 * 기대지 않고 이 앱이 직접 복원을 관장하기 위한 저장소. */
export function saveScrollPosition(pathWithSearch: string, y: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey(pathWithSearch), String(Math.round(y)));
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 시 조용히 무시
  }
}

export function getSavedScrollPosition(pathWithSearch: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey(pathWithSearch));
    if (raw == null) return null;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}