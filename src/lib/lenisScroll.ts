import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

const PAGE_SCROLL_LOCK_CLASS = "is-page-scroll-lock";

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
}

export function unlockPageScroll(scrollY: number) {
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
