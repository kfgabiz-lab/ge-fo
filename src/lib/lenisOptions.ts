import type { LenisOptions } from "lenis";

function isScrollableOverflow(node: HTMLElement): boolean {
  const style = window.getComputedStyle(node);
  const overflowY = style.overflowY;

  if (overflowY !== "auto" && overflowY !== "scroll" && overflowY !== "overlay") {
    return false;
  }

  return node.scrollHeight > node.clientHeight + 1;
}

function shouldPreventSmoothScroll(node: HTMLElement): boolean {
  if (
    node.closest(
      "[data-lenis-prevent], [data-lenis-prevent-wheel], [data-lenis-prevent-touch]",
    )
  ) {
    return true;
  }

  const tag = node.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }

  let el: HTMLElement | null = node;
  while (el && el !== document.documentElement) {
    if (isScrollableOverflow(el)) {
      return true;
    }
    el = el.parentElement;
  }

  return false;
}

export function createLenisOptions(): LenisOptions {
  if (typeof window === "undefined") {
    return { autoRaf: true };
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    return {
      autoRaf: true,
      smoothWheel: false,
    };
  }

  return {
    autoRaf: true,
    lerp: 0.9,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    smoothWheel: true,
    syncTouch: false,
    prevent: (node) => shouldPreventSmoothScroll(node),
  };
}
