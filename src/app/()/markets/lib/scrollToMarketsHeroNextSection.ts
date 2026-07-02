import type Lenis from "lenis";
import { getLenisInstance, scrollWindowTo } from "@/lib/lenisScroll";

export const MARKETS_HERO_SCROLL_DURATION = 0.5;
export const MARKETS_HERO_SNAP_THRESHOLD_PX = 8;

let marketsHeroSnapping = false;

export function isMarketsHeroSnapping() {
  return marketsHeroSnapping;
}

export function getMarketsHeroStickyWrap() {
  return document.querySelector<HTMLElement>(
    ".markets-page .markets_hero__sticky-wrap",
  );
}

export function getMarketsHeroNextSection() {
  const heroWrap = getMarketsHeroStickyWrap();
  const next = heroWrap?.nextElementSibling;
  return next instanceof HTMLElement ? next : null;
}

function getCurrentScrollY(lenis?: Lenis | null) {
  if (lenis) {
    return lenis.scroll;
  }

  return window.scrollY || document.documentElement.scrollTop;
}

export function isInMarketsHeroSnapZone(lenis?: Lenis | null) {
  const heroWrap = getMarketsHeroStickyWrap();
  if (!heroWrap) return false;

  const heroHeight = heroWrap.getBoundingClientRect().height;
  if (heroHeight <= 0) return false;

  return getCurrentScrollY(lenis) < heroHeight - MARKETS_HERO_SNAP_THRESHOLD_PX;
}

export function getMarketsHeroNextSectionScrollTop(lenis?: Lenis | null) {
  const nextSection = getMarketsHeroNextSection();
  if (nextSection) {
    const scrollY = getCurrentScrollY(lenis);
    return Math.max(0, nextSection.getBoundingClientRect().top + scrollY);
  }

  const heroWrap = getMarketsHeroStickyWrap();
  return heroWrap?.getBoundingClientRect().height ?? window.innerHeight;
}

type ScrollToMarketsHeroNextSectionOptions = {
  lenis?: Lenis | null;
  immediate?: boolean;
  onComplete?: () => void;
};

export function scrollToMarketsHeroNextSection(
  options: ScrollToMarketsHeroNextSectionOptions = {},
) {
  if (marketsHeroSnapping) {
    options.onComplete?.();
    return;
  }

  const immediate =
    options.immediate ??
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = options.lenis ?? getLenisInstance();
  const onComplete = options.onComplete;
  const targetTop = getMarketsHeroNextSectionScrollTop(lenis);

  if (targetTop <= getCurrentScrollY(lenis) + MARKETS_HERO_SNAP_THRESHOLD_PX) {
    onComplete?.();
    return;
  }

  marketsHeroSnapping = true;

  let completed = false;
  const finish = () => {
    if (completed) return;
    completed = true;
    marketsHeroSnapping = false;
    onComplete?.();
  };

  const fallbackMs = immediate
    ? 50
    : Math.round(MARKETS_HERO_SCROLL_DURATION * 1000) + 200;
  const fallbackTimer = window.setTimeout(finish, fallbackMs);

  const wrappedComplete = () => {
    window.clearTimeout(fallbackTimer);
    finish();
  };

  if (lenis) {
    lenis.scrollTo(targetTop, {
      immediate,
      programmatic: true,
      force: true,
      ...(immediate
        ? {}
        : { duration: MARKETS_HERO_SCROLL_DURATION }),
      onComplete: wrappedComplete,
    });
    return;
  }

  scrollWindowTo(targetTop, { behavior: immediate ? "auto" : "smooth" });
  wrappedComplete();
}
