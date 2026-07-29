const HISTORY_NAV_PENDING_KEY = "ls:history-nav-pending";

export function isBackForwardNavigation() {
  if (typeof window === "undefined") return false;

  const entry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  return entry?.type === "back_forward";
}

export function markHistoryNavigationPending() {
  try {
    sessionStorage.setItem(HISTORY_NAV_PENDING_KEY, "1");
  } catch {
  }
}

export function isHistoryNavigationPending() {
  try {
    return sessionStorage.getItem(HISTORY_NAV_PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearHistoryNavigationPending() {
  try {
    sessionStorage.removeItem(HISTORY_NAV_PENDING_KEY);
  } catch {
  }
}
