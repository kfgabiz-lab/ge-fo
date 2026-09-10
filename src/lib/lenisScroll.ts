import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

const PAGE_SCROLL_LOCK_CLASS = "is-page-scroll-lock";
const MOBILE_MAX_WIDTH = 780;

let scrollLockCount = 0;
let lockedScrollY = 0;
let usesBodyFixedLock = false;
let nativeScrollBlockAttached = false;

let viewportHeightSyncHandler: (() => void) | null = null;

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

function readBodyFixedScrollY() {
  if (document.body.style.position !== "fixed") return null;

  const top = Number.parseFloat(document.body.style.top);
  if (Number.isNaN(top)) return null;

  return Math.max(0, -top);
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

function applyBodyFixedLock(scrollY: number) {
  const mobile = isMobileViewport();

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  if (mobile) {
    syncLockedViewportHeight();
    attachLockedViewportHeightSync();
    return;
  }

  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    scrollY + window.innerHeight,
  );

  document.documentElement.style.height = `${docHeight}px`;
  document.body.style.height = `${docHeight}px`;
}

function clearBodyFixedLock() {
  detachLockedViewportHeightSync();
  document.documentElement.style.height = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.height = "";
}

function isScrollableOverflowY(style: CSSStyleDeclaration) {
  const overflowY = style.overflowY;
  return (
    overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay"
  );
}

function canElementScrollY(el: HTMLElement, deltaY: number) {
  if (!isScrollableOverflowY(window.getComputedStyle(el))) {
    return false;
  }

  if (el.scrollHeight <= el.clientHeight + 1) {
    return false;
  }

  if (deltaY < 0) {
    return el.scrollTop > 0;
  }

  if (deltaY > 0) {
    return el.scrollTop + el.clientHeight < el.scrollHeight - 1;
  }

  return true;
}

function findScrollableAncestor(target: EventTarget | null, deltaY: number) {
  let el =
    target instanceof HTMLElement
      ? target
      : target instanceof Node
        ? target.parentElement
        : null;

  while (el && el !== document.documentElement && el !== document.body) {
    if (canElementScrollY(el, deltaY)) {
      return el;
    }
    el = el.parentElement;
  }

  return null;
}

function isInsideNestedScrollArea(target: EventTarget | null) {
  let el =
    target instanceof HTMLElement
      ? target
      : target instanceof Node
        ? target.parentElement
        : null;

  while (el && el !== document.documentElement && el !== document.body) {
    if (
      isScrollableOverflowY(window.getComputedStyle(el)) &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      return true;
    }
    el = el.parentElement;
  }

  return false;
}

function onLockedWheel(event: WheelEvent) {
  if (findScrollableAncestor(event.target, event.deltaY)) {
    return;
  }

  event.preventDefault();
}

function onLockedTouchMove(event: TouchEvent) {
  if (event.touches.length > 1) return;
  if (isInsideNestedScrollArea(event.target)) return;

  event.preventDefault();
}

function onLockedNativeScroll() {
  if (usesBodyFixedLock) return;

  const currentY = window.scrollY || document.documentElement.scrollTop;
  if (Math.abs(currentY - lockedScrollY) < 1) return;

  window.scrollTo({ top: lockedScrollY, behavior: "auto" });
  lenisInstance?.scrollTo(lockedScrollY, { immediate: true });
}

function attachNativeScrollBlock() {
  if (nativeScrollBlockAttached) return;

  nativeScrollBlockAttached = true;
  window.addEventListener("wheel", onLockedWheel, { passive: false });
  window.addEventListener("touchmove", onLockedTouchMove, { passive: false });
  window.addEventListener("scroll", onLockedNativeScroll, { passive: true });
}

function detachNativeScrollBlock() {
  if (!nativeScrollBlockAttached) return;

  nativeScrollBlockAttached = false;
  window.removeEventListener("wheel", onLockedWheel);
  window.removeEventListener("touchmove", onLockedTouchMove);
  window.removeEventListener("scroll", onLockedNativeScroll);
}

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function getLenisInstance() {
  return lenisInstance;
}

export function getWindowScrollY() {
  if (scrollLockCount > 0) {
    return lockedScrollY;
  }

  const bodyFixedScrollY = readBodyFixedScrollY();
  if (bodyFixedScrollY !== null) {
    return bodyFixedScrollY;
  }

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
  if (scrollLockCount === 0) {
    lockedScrollY = scrollY;
    document.documentElement.classList.add(PAGE_SCROLL_LOCK_CLASS);

    const lenis = lenisInstance;
    if (lenis) {
      lenis.scrollTo(scrollY, { immediate: true });
      lenis.stop();
      usesBodyFixedLock = false;
    } else {
      usesBodyFixedLock = true;
      applyBodyFixedLock(scrollY);
    }

    // Lenis stop() alone is not enough: is-page-scroll-lock keeps
    // overflow-y: scroll (scrollbar gutter), so native wheel still moves the page.
    attachNativeScrollBlock();
  }

  scrollLockCount += 1;
}

export function unlockPageScroll(scrollY?: number) {
  if (scrollLockCount === 0) return;

  scrollLockCount -= 1;
  if (scrollLockCount > 0) return;

  const restoreY = scrollY ?? lockedScrollY;
  lockedScrollY = 0;

  detachNativeScrollBlock();
  document.documentElement.classList.remove(PAGE_SCROLL_LOCK_CLASS);

  if (usesBodyFixedLock) {
    clearBodyFixedLock();
    usesBodyFixedLock = false;
  }

  const lenis = lenisInstance;
  lenis?.start();

  const restore = () => {
    scrollWindowTo(restoreY, { immediate: true });
  };

  restore();

  requestAnimationFrame(() => {
    restore();

    if (Math.abs(getWindowScrollY() - restoreY) > 2) {
      requestAnimationFrame(restore);
    }
  });
}
