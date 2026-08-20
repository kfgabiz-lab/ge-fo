export function isBackForwardNavigation() {
  if (typeof window === "undefined") return false;

  const entry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  return entry?.type === "back_forward";
}

let pendingBackForwardNavigation = false;

export function markBackForwardNavigation() {
  pendingBackForwardNavigation = true;
}

export function consumeBackForwardNavigation() {
  const was = pendingBackForwardNavigation;
  pendingBackForwardNavigation = false;
  return was;
}
