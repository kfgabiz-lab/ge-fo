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

const FILTERS_PREFIX = "company-last-list-filters:";

/** 목록 페이지의 필터(카테고리·정렬·월/년 등)를 기억해 둔다 — 검색어/페이지와 동일한 목적. */
export function rememberListFilters(
  variant: CompanyListVariant,
  filters: Record<string, string>,
): void {
  if (typeof window === "undefined") return;
  try {
    const hasAny = Object.values(filters).some((value) => value);
    if (hasAny) {
      window.sessionStorage.setItem(`${FILTERS_PREFIX}${variant}`, JSON.stringify(filters));
    } else {
      window.sessionStorage.removeItem(`${FILTERS_PREFIX}${variant}`);
    }
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 시 조용히 무시
  }
}

/** 목록 페이지 마운트 시 직전에 적용돼 있던 필터를 복원한다(없으면 빈 객체). */
export function getRememberedListFilters(variant: CompanyListVariant): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(`${FILTERS_PREFIX}${variant}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
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
    // 이 함수는 useEffect 안에서만 호출된다(렌더 중 lazy initializer에서는 더 이상 안 씀).
    // Strict Mode가 effect를 mount→cleanup→mount로 두 번 돌리더라도 컴포넌트 state는
    // 그대로 유지되므로, 여기서 바로 지워도 안전하다: 첫 번째 mount가 복원해 둔 state를
    // 두 번째 mount가 다시 지우지 않고 그냥 스킵하기 때문. setTimeout으로 지우는 걸
    // 지연시키면 오히려 다음 진입(새 페이지 로드) 전까지 타이머가 확실히 실행된다는
    // 보장이 없어(탭이 백그라운드로 밀리는 등) 플래그가 남을 수 있었다.
    if (hasIntent) window.sessionStorage.removeItem(key);
    return hasIntent;
  } catch {
    return false;
  }
}

/**
 * 목록 페이지 마운트 직후(useEffect) 호출 — LIST 버튼 또는 브라우저 뒤로가기로 돌아온
 * 경우에만 기억된 페이지 번호·검색어로 apply를 호출한다(GNB 등 새 진입 시에는 호출하지 않고,
 * 대신 이전에 남아있을 수 있는 값을 지운다).
 *
 * useState lazy initializer(렌더 중 동기 계산) 대신 useEffect에서 복원하는 이유: 렌더 중에
 * sessionStorage 값으로 초기 state를 계산하면 서버(SSR, 항상 1페이지·빈 검색어)와 클라이언트가
 * 달라져 하이드레이션 불일치가 발생한다. 이 리포에서는 그 불일치가 (React 버전에 따라) 단순 경고가
 * 아니라 예외로 던져지며 트리 전체가 재생성되는데, 그 과정이 위 deferred-clear(setTimeout(0))와
 * 경합하면서 return-intent 플래그가 다음 렌더까지 지워지지 않고 새 진입 판정에 잘못 섞여드는
 * 문제가 있었다. 모든 관련 네비게이션이 이미 하드 리로드(완전한 새 마운트)이므로, 초기 렌더는
 * 항상 서버와 동일하게 비워두고 effect에서 patch하는 쪽이 하이드레이션 충돌 없이 안전하다.
 */
export function restoreListStateIfReturning(
  variant: CompanyListVariant,
  basePath: string,
  apply: {
    pageIndex?: (pageIndex: number) => void;
    search?: (search: string) => void;
    filters?: (filters: Record<string, string>) => void;
  },
): void {
  if (typeof window === "undefined") return;

  const viaIntent = consumeListReturnIntent(variant);
  // return-intent 플래그만으로는 부족했다 — 목록 페이지에 머무는 동안(예: 복원된 결과를 보다가
  // GNB 버튼을 누르려는 순간) 카드 링크에 마우스다운만 걸리고 실제 이동은 하지 않는 경우가
  // 있어(실측으로 확인됨), 그 뒤 전혀 다른 경로로 다시 들어와도 플래그가 "복귀"로 잘못
  // 남아있었다. 진짜 상세 페이지에서 돌아온 것인지 document.referrer로 한 번 더 검증한다 —
  // 진짜 LIST 버튼 복귀라면 referrer가 이 목록의 상세 페이지(예: /company/blog/123-slug)여야
  // 한다. GNB로 다른 카테고리를 거쳐 돌아온 경우엔 referrer가 그 카테고리 페이지이므로 걸러진다.
  let referrerMatches = false;
  try {
    const referrerUrl = document.referrer ? new URL(document.referrer) : null;
    referrerMatches =
      !!referrerUrl &&
      referrerUrl.origin === window.location.origin &&
      referrerUrl.pathname.startsWith(`${basePath}/`);
  } catch {
    referrerMatches = false;
  }

  const isReturning = (viaIntent && referrerMatches) || isBackForwardNavigation();
  if (!isReturning) {
    // 새로 진입한 것이므로 예전 검색어/페이지가 남아있다가 나중에 엉뚱하게 복원되지
    // 않도록 지금 지워 둔다(단순히 이번 렌더에서 안 쓰는 것만으로는 부족 — 이후 상세로
    // 들어갔다 LIST로 돌아올 때 예전 값을 다시 읽어오게 된다).
    rememberListPage(variant, 1);
    rememberListSearch(variant, "");
    rememberListFilters(variant, {});
    return;
  }

  const remembered = getRememberedListPage(variant);
  if (remembered > 1) apply.pageIndex?.(remembered - 1);

  const rememberedSearch = getRememberedListSearch(variant);
  if (rememberedSearch) apply.search?.(rememberedSearch);

  const rememberedFilters = getRememberedListFilters(variant);
  if (Object.keys(rememberedFilters).length > 0) apply.filters?.(rememberedFilters);
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
    rememberListFilters(variant, {});
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
