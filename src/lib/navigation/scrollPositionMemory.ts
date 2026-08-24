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

const RETURN_INTENT_KEY = "scroll-pos-return-intent";

/**
 * 상세 화면의 "LIST" 같은 복귀 버튼 클릭 시 호출 — 브라우저 back/forward가 아닌
 * 일반 링크 클릭(navigate 타입)이라 isBackForwardNavigation()으로는 못 잡지만,
 * 사용자 입장에서는 "돌아가는" 동작이므로 스크롤도 복원해야 한다.
 */
export function markScrollReturnIntent(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(RETURN_INTENT_KEY, "1");
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 시 조용히 무시
  }
}

/** 목적지 페이지 마운트 시 1회성으로 소비한다. */
export function consumeScrollReturnIntent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const has = window.sessionStorage.getItem(RETURN_INTENT_KEY) === "1";
    if (has) window.sessionStorage.removeItem(RETURN_INTENT_KEY);
    return has;
  } catch {
    return false;
  }
}
