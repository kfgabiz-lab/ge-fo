import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export type UseModalFocusTrapOptions = {
  /** Focus the first focusable on activate (default: true) */
  autoFocus?: boolean;
  /** Restore focus to the previously focused element on deactivate (default: true) */
  restoreFocus?: boolean;
  /** Extra roots included in the trap (e.g. depth1 nav + mega panel) */
  additionalRefs?: RefObject<HTMLElement | null>[];
};

function isFocusable(element: HTMLElement) {
  if (element.hasAttribute("disabled") || element.tabIndex < 0) {
    return false;
  }

  if (
    element.getAttribute("aria-hidden") === "true" ||
    element.closest('[aria-hidden="true"]') ||
    element.closest("[inert]")
  ) {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  return true;
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(isFocusable);
}

function collectFocusableElements(roots: HTMLElement[]) {
  const seen = new Set<HTMLElement>();
  const items: HTMLElement[] = [];

  for (const root of roots) {
    for (const element of getFocusableElements(root)) {
      if (seen.has(element)) continue;
      seen.add(element);
      items.push(element);
    }
  }

  return items;
}

/**
 * Traps Tab focus inside one or more containers while active.
 * Restores focus to the previously focused element on close (optional).
 */
export function useModalFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  options: UseModalFocusTrapOptions = {},
) {
  const {
    autoFocus = true,
    restoreFocus = true,
    additionalRefs = [],
  } = options;
  const additionalRefsRef = useRef(additionalRefs);
  additionalRefsRef.current = additionalRefs;
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const roots = [
      containerRef.current,
      ...additionalRefsRef.current.map((ref) => ref.current),
    ].filter((root): root is HTMLElement => root != null);

    if (!roots.length) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const containsTarget = (node: Node | null) =>
      !!node && roots.some((root) => root.contains(node));

    const focusFirst = () => {
      const focusable = collectFocusableElements(roots);
      const first = focusable[0];

      if (first) {
        first.focus();
        return;
      }

      const fallback = roots[0];
      if (!fallback.hasAttribute("tabindex")) {
        fallback.tabIndex = -1;
      }
      fallback.focus();
    };

    let focusFrame = 0;
    if (autoFocus) {
      focusFrame = requestAnimationFrame(focusFirst);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = collectFocusableElements(roots);
      if (focusableElements.length === 0) {
        event.preventDefault();
        roots[0]?.focus();
        return;
      }

      const activeElement = document.activeElement;
      const currentIndex =
        activeElement instanceof HTMLElement
          ? focusableElements.indexOf(activeElement)
          : -1;

      event.preventDefault();

      if (focusableElements.length === 1) {
        focusableElements[0].focus();
        return;
      }

      if (event.shiftKey) {
        const nextIndex =
          currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[nextIndex]?.focus();
        return;
      }

      const nextIndex =
        currentIndex >= focusableElements.length - 1 || currentIndex < 0
          ? 0
          : currentIndex + 1;
      focusableElements[nextIndex]?.focus();
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || containsTarget(target)) {
        return;
      }

      const focusableElements = collectFocusableElements(roots);
      if (focusableElements.length === 0) {
        roots[0]?.focus();
        return;
      }

      focusableElements[0].focus();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      if (focusFrame) cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);

      if (!restoreFocus) return;

      const previous = previousFocusRef.current;
      if (previous && document.contains(previous)) {
        previous.focus();
      }
    };
  }, [active, autoFocus, containerRef, restoreFocus]);
}
