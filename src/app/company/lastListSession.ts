import { isBackForwardNavigation } from "@/lib/navigation/historyNavigation";

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

const RETURN_INTENT_PREFIX = "company-list-return-intent:";

/**
 * 상세 화면의 LIST 버튼 클릭 시 호출 — "목록으로 돌아가는 중"임을 1회성으로 표시한다.
 * GNB 등에서 목록에 새로 진입하는 경우와 구분하기 위함(새 진입은 항상 1페이지여야 함).
 */
export function markListReturnIntent(variant: CompanyListVariant): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(`${RETURN_INTENT_PREFIX}${variant}`, "1");
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 시 조용히 무시
  }
}

/**
 * 목록 페이지 마운트 시 호출 — LIST 버튼을 통해 돌아온 경우에만 true를 반환하고 플래그를 소모한다.
 * 플래그가 없으면(GNB 등 새 진입) false를 반환해 기억된 페이지를 복원하지 않는다.
 */
export function consumeListReturnIntent(variant: CompanyListVariant): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = `${RETURN_INTENT_PREFIX}${variant}`;
    const hasIntent = window.sessionStorage.getItem(key) === "1";
    if (hasIntent) window.sessionStorage.removeItem(key);
    return hasIntent;
  } catch {
    return false;
  }
}

/**
 * 목록 페이지 마운트 시 호출 — LIST 버튼 또는 브라우저 뒤로가기로 돌아온 경우에만
 * 기억된 페이지 번호로 apply를 호출한다(GNB 등 새 진입 시에는 호출하지 않음).
 */
export function restoreListPageIfReturning(
  variant: CompanyListVariant,
  apply: (page: number) => void,
): void {
  if (typeof window === "undefined") return;

  const isReturning = consumeListReturnIntent(variant) || isBackForwardNavigation();
  if (!isReturning) return;

  const remembered = getRememberedListPage(variant);
  if (remembered > 1) apply(remembered);
}

/**
 * 목록 페이지 마운트 시 호출 — 이미 그 목록 페이지에 머무는 중에 GNB/브레드크럼 등
 * 자기 자신의 base path로 향하는 링크를 다시 클릭하는 경우를 감지한다.
 *
 * HistoryReloadOnNavigate는 target URL이 현재 URL과 완전히 같으면(페이지 번호는 URL에
 * 싣지 않으므로 3페이지에 있어도 URL은 항상 base path와 동일) 아무 것도 하지 않고 클릭을
 * 그냥 흘려보낸다 — 리로드도, 리마운트도 일어나지 않아 pageIndex가 그대로 남는다.
 * 그 흘려보내진 클릭을 document capture 단계에서 직접 감지해 1페이지로 되돌린다.
 */
export function watchForFreshListEntryClicks(
  variant: CompanyListVariant,
  basePath: string,
  onFreshEntry: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (window.location.pathname !== basePath) return;

    let targetUrl: URL;
    try {
      targetUrl = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (targetUrl.pathname !== basePath) return;

    rememberListPage(variant, 1);
    onFreshEntry();
  };

  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
}
