import { isBackForwardNavigation } from "@/lib/navigation/historyNavigation";

const STORAGE_PREFIX = "list-page:";
const RETURN_INTENT_PREFIX = "list-page-return-intent:";

/**
 * company/lastListSession.ts와 같은 패턴을 경로 기반으로 일반화한 버전.
 * 목록 페이지 번호는 URL에 싣지 않고 sessionStorage로만 기억한다 — 상세 화면의
 * LIST 버튼이 복귀 시 참조한다. GNB 등에서 새로 진입한 경우와 구분하기 위해
 * LIST 버튼 클릭 시 별도로 "복귀 의도" 플래그를 남겨 둔다(뒤로가기는
 * isBackForwardNavigation()으로 별도 판별).
 */
export function rememberListPage(pathname: string, page: number): void {
  if (typeof window === "undefined") return;
  try {
    if (page > 1) {
      window.sessionStorage.setItem(`${STORAGE_PREFIX}${pathname}`, String(page));
    } else {
      window.sessionStorage.removeItem(`${STORAGE_PREFIX}${pathname}`);
    }
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 시 조용히 무시
  }
}

export function getRememberedListPage(pathname: string): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${pathname}`);
    const parsed = raw ? Number.parseInt(raw, 10) : 1;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  } catch {
    return 1;
  }
}

/** 상세 화면의 LIST 버튼 클릭 시 호출 — "목록으로 돌아가는 중"임을 1회성으로 표시한다. */
export function markListReturnIntent(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(`${RETURN_INTENT_PREFIX}${pathname}`, "1");
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 시 조용히 무시
  }
}

function consumeListReturnIntent(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = `${RETURN_INTENT_PREFIX}${pathname}`;
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
  pathname: string,
  apply: (page: number) => void,
): void {
  if (typeof window === "undefined") return;

  const isReturning = consumeListReturnIntent(pathname) || isBackForwardNavigation();
  if (!isReturning) return;

  const remembered = getRememberedListPage(pathname);
  if (remembered > 1) apply(remembered);
}

/**
 * 목록 페이지 마운트 시 호출 — 이미 그 목록 페이지에 머무는 중에 GNB/브레드크럼 등
 * 자기 자신의 base path로 향하는 링크를 다시 클릭하는 경우를 감지한다.
 *
 * HistoryReloadOnNavigate는 target URL이 현재 URL과 완전히 같으면(페이지 번호는
 * URL에 싣지 않으므로 3페이지에 있어도 URL은 항상 base path와 동일) 아무 것도
 * 하지 않고 클릭을 그냥 흘려보낸다 — 리로드도, 리마운트도 일어나지 않아 페이지
 * 번호가 그대로 남는다. 그 흘려보내진 클릭을 document capture 단계에서 직접
 * 감지해 1페이지로 되돌린다. (company/lastListSession.ts와 동일 패턴.)
 */
export function watchForFreshListEntryClicks(
  pathname: string,
  onFreshEntry: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (window.location.pathname !== pathname) return;

    let targetUrl: URL;
    try {
      targetUrl = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (targetUrl.pathname !== pathname) return;

    rememberListPage(pathname, 1);
    onFreshEntry();
  };

  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
}
