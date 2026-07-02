import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function getLenisInstance() {
  return lenisInstance;
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
