import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

const PAGE_SCROLL_LOCK_CLASS = "is-page-scroll-lock";
const MOBILE_MAX_WIDTH = 780;

let viewportHeightSyncHandler: (() => void) | null = null;

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

function syncLockedViewportHeight() {
  const viewport = window.visualViewport;
  const height = viewport?.height ?? window.innerHeight;

  document.documentElement.style.height = `${height}px`;
  document.body.style.height = `${height}px`;
}

function attachLockedViewportHeightSync() {
  const viewport = window.visualViewport;
  if (!viewport || viewportHeightSyncHandler) return;

  viewportHeightSyncHandler = syncLockedViewportHeight;
  viewport.addEventListener("resize", viewportHeightSyncHandler);
  viewport.addEventListener("scroll", viewportHeightSyncHandler);
  syncLockedViewportHeight();
}

function detachLockedViewportHeightSync() {
  const viewport = window.visualViewport;
  if (!viewport || !viewportHeightSyncHandler) return;

  viewport.removeEventListener("resize", viewportHeightSyncHandler);
  viewport.removeEventListener("scroll", viewportHeightSyncHandler);
  viewportHeightSyncHandler = null;
}

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function getLenisInstance() {
  return lenisInstance;
}

export function getWindowScrollY() {
  if (lenisInstance) {
    return lenisInstance.scroll;
  }

  return window.scrollY || document.documentElement.scrollTop;
}

type ScrollWindowOptions = {
  immediate?: boolean;
  behavior?: ScrollBehavior;
};

export function scrollWindowTo(
  top: number,
  options?: ScrollWindowOptions,
) {
  const immediate =
    options?.immediate ?? options?.behavior === "auto";

  if (lenisInstance) {
    lenisInstance.scrollTo(top, { immediate });
    return;
  }

  window.scrollTo({
    top,
    behavior: immediate ? "auto" : (options?.behavior ?? "auto"),
  });
}

export function lockPageScroll(scrollY: number) {
  const lenis = lenisInstance;
  const mobile = isMobileViewport();

  document.documentElement.classList.add(PAGE_SCROLL_LOCK_CLASS);
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  if (mobile) {
    // iOS: full document height + fixed body + keyboard overflows the viewport.
    syncLockedViewportHeight();
    attachLockedViewportHeightSync();
  } else {
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      scrollY + window.innerHeight,
    );

    document.documentElement.style.height = `${docHeight}px`;
    document.body.style.height = `${docHeight}px`;
  }

  lenis?.scrollTo(scrollY, { immediate: true });
  lenis?.stop();
}

export function unlockPageScroll(scrollY: number) {
  detachLockedViewportHeightSync();
  document.documentElement.classList.remove(PAGE_SCROLL_LOCK_CLASS);
  document.documentElement.style.height = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.height = "";

  const lenis = lenisInstance;
  lenis?.start();

  const restore = () => {
    scrollWindowTo(scrollY, { immediate: true });
  };

  restore();

  requestAnimationFrame(() => {
    restore();

    if (Math.abs(getWindowScrollY() - scrollY) > 2) {
      requestAnimationFrame(restore);
    }
  });
}
