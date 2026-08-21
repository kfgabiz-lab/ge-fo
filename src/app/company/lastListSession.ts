const STORAGE_PREFIX = "company-last-list-page:";

export type CompanyListVariant = "blog" | "press" | "events" | "articles";

/**
 * 목록 페이지를 넘길 때마다 현재 페이지 번호를 기억해 둔다. URL에는 싣지 않는다
 * (주소창을 깨끗하게 유지하기 위함) — 상세 페이지의 LIST 버튼이 복귀 시 참조한다.
 */
export function rememberListPage(variant: CompanyListVariant, page: number): void {
  if (typeof window === "undefined") return;
  try {
    if (page > 1) {
      window.sessionStorage.setItem(`${STORAGE_PREFIX}${variant}`, String(page));
    } else {
      window.sessionStorage.removeItem(`${STORAGE_PREFIX}${variant}`);
    }
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 시 조용히 무시
  }
}

/** 목록 페이지 마운트 시 직전에 머물렀던 페이지 번호를 복원한다(없으면 1). */
export function getRememberedListPage(variant: CompanyListVariant): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${variant}`);
    const parsed = raw ? Number.parseInt(raw, 10) : 1;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  } catch {
    return 1;
  }
}
