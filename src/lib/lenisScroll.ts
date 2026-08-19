import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

const PAGE_SCROLL_LOCK_CLASS = "is-page-scroll-lock";
let pageScrollEventsBound = false;

function getScrollableAncestor(node: EventTarget | null): HTMLElement | null {
  let el: HTMLElement | null =
    node instanceof HTMLElement
      ? node
      : node instanceof Node
        ? node.parentElement
        : null;

  while (el && el !== document.body && el !== document.documentElement) {
    const overflowY = window.getComputedStyle(el).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      return el;
    }
    el = el.parentElement;
  }

  return null;
}

function preventPageWheel(event: WheelEvent) {
  const scrollable = getScrollableAncestor(event.target);
  if (!scrollable) {
    event.preventDefault();
    return;
  }

  if (event.deltaY < 0 && scrollable.scrollTop <= 0) {
    event.preventDefault();
    return;
  }

  if (
    event.deltaY > 0 &&
    scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1
  ) {
    event.preventDefault();
  }
}

function preventPageTouchMove(event: TouchEvent) {
  if (!getScrollableAncestor(event.target)) {
    event.preventDefault();
  }
}

function bindPageScrollBlock() {
  if (pageScrollEventsBound) return;
  pageScrollEventsBound = true;
  window.addEventListener("wheel", preventPageWheel, { passive: false });
  window.addEventListener("touchmove", preventPageTouchMove, { passive: false });
}

function unbindPageScrollBlock() {
  if (!pageScrollEventsBound) return;
  pageScrollEventsBound = false;
  window.removeEventListener("wheel", preventPageWheel);
  window.removeEventListener("touchmove", preventPageTouchMove);
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

  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    scrollY + window.innerHeight,
  );

  document.documentElement.classList.add(PAGE_SCROLL_LOCK_CLASS);
  document.documentElement.style.height = `${docHeight}px`;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.height = `${docHeight}px`;

  lenis?.scrollTo(scrollY, { immediate: true });
  lenis?.stop();
  bindPageScrollBlock();
}

export function unlockPageScroll(scrollY: number) {
  unbindPageScrollBlock();
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
