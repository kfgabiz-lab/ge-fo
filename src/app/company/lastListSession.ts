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

const SEARCH_PREFIX = "company-last-list-search:";

/** 목록 페이지의 검색어를 기억해 둔다(페이지 번호와 동일하게 URL에는 싣지 않음). */
export function rememberListSearch(variant: CompanyListVariant, search: string): void {
  if (typeof window === "undefined") return;
  try {
    if (search) {
      window.sessionStorage.setItem(`${SEARCH_PREFIX}${variant}`, search);
    } else {
      window.sessionStorage.removeItem(`${SEARCH_PREFIX}${variant}`);
    }
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 시 조용히 무시
  }
}

/** 목록 페이지 마운트 시 직전에 입력했던 검색어를 복원한다(없으면 빈 문자열). */
export function getRememberedListSearch(variant: CompanyListVariant): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(`${SEARCH_PREFIX}${variant}`) ?? "";
  } catch {
    return "";
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
    // React(App Router 개발 모드)가 useState lazy initializer/effect를 같은 tick에 두 번
    // 호출하는 경우가 있어(순수성 검증), 여기서 바로 지우면 두 번째 호출이 빈 값을 보게 된다.
    // 다음 tick으로 미뤄 지움으로써 같은 tick 내 중복 호출에는 항상 동일한 값을 반환하면서도,
    // 진짜 다음 방문(별도 페이지 로드)에서는 정상적으로 소모된 상태가 되도록 한다.
    if (hasIntent) setTimeout(() => window.sessionStorage.removeItem(key), 0);
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
  applySearch?: (search: string) => void,
): void {
  if (typeof window === "undefined") return;

  const isReturning = consumeListReturnIntent(variant) || isBackForwardNavigation();
  if (!isReturning) return;

  const remembered = getRememberedListPage(variant);
  if (remembered > 1) apply(remembered);

  if (applySearch) {
    const rememberedSearch = getRememberedListSearch(variant);
    if (rememberedSearch) applySearch(rememberedSearch);
  }
}

/**
 * 목록 페이지의 초기 state를 렌더링 시점에 동기적으로 계산한다(useState lazy initializer용).
 * useEffect 기반 복원은 브라우저/캐시 조건에 따라 마운트 후 effect가 늦게 붙거나 아예
 * 건너뛰는 경우가 있어(라우터 캐시 재사용 등), 렌더 중 1회 확정되는 이 방식이 더 견고하다.
 * SSR과의 하이드레이션 불일치 경고가 뜰 수 있으나(서버는 항상 1페이지·빈 검색어로 렌더),
 * 클라이언트 값으로 정상 교정되며 기능상 문제는 없다.
 */
export function computeInitialListState(variant: CompanyListVariant): {
  pageIndex: number;
  search: string;
} {
  if (typeof window === "undefined") return { pageIndex: 0, search: "" };

  const isReturning = consumeListReturnIntent(variant) || isBackForwardNavigation();
  if (!isReturning) {
    // 새로 진입한 것이므로 예전 검색어/페이지가 남아있다가 나중에 엉뚱하게 복원되지
    // 않도록 지금 지워 둔다(단순히 이번 렌더에서 안 쓰는 것만으로는 부족 — 이후 상세로
    // 들어갔다 LIST로 돌아올 때 예전 값을 다시 읽어오게 된다).
    rememberListPage(variant, 1);
    rememberListSearch(variant, "");
    return { pageIndex: 0, search: "" };
  }

  const remembered = getRememberedListPage(variant);
  const rememberedSearch = getRememberedListSearch(variant);
  return {
    pageIndex: remembered > 1 ? remembered - 1 : 0,
    search: rememberedSearch,
  };
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

/**
 * 목록 페이지 마운트 시 호출 — 목록에 머무는 동안 자기 자신의 상세 페이지(basePath 하위 경로)로
 * 향하는 링크를 클릭하면 "복귀 의도" 플래그를 남긴다. LIST 버튼뿐 아니라 카드를 직접 클릭해
 * 상세로 들어간 뒤 브라우저 뒤로가기로 돌아오는 경우도 페이지/검색어를 복원하기 위함 —
 * isBackForwardNavigation()(Navigation Timing API)만으로는 브라우저·환경에 따라 갱신 시점이
 * 늦어 놓치는 경우가 있어, 클릭 시점에 즉시 확정되는 이 sessionStorage 플래그를 함께 쓴다.
 */
export function markReturnIntentOnLeavingToDetail(
  variant: CompanyListVariant,
  basePath: string,
): () => void {
  if (typeof window === "undefined") return () => {};

  // HistoryReloadOnNavigate가 window capture 단계에서 click을 stopImmediatePropagation()
  // 시키므로(하드 리로드 전환), document의 click 리스너로는 이 클릭을 못 본다.
  // click보다 먼저 발생하는 mousedown으로 감지해 그 인터셉트를 우회한다.
  const handleMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return;
    const anchor = (event.target as Element | null)?.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    let targetUrl: URL;
    try {
      targetUrl = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (targetUrl.origin !== window.location.origin) return;
    if (!targetUrl.pathname.startsWith(`${basePath}/`)) return;

    markListReturnIntent(variant);
  };

  document.addEventListener("mousedown", handleMouseDown, true);
  return () => document.removeEventListener("mousedown", handleMouseDown, true);
}
