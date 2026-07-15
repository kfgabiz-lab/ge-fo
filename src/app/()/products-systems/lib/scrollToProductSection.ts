import type Lenis from "lenis";
import { getLenisInstance, scrollWindowTo } from "@/lib/lenisScroll";

/** GNB + sticky sub-nav clearance — mobile / no side nav fallback */
export const PRODUCT_SECTION_SCROLL_OFFSET_PX = 200;

/** Product nav scroll — 100ms (GNB 전환과 동기) */
export const PRODUCT_SECTION_SCROLL_DURATION = 0.1;

const PAGE_BOTTOM_THRESHOLD_PX = 80;
const NATIVE_SMOOTH_SCROLL_FALLBACK_MS = 150;
const ALIGNMENT_THRESHOLD_PX = 1;
const SCROLL_SPY_THRESHOLD_PX = 48;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ScrollToProductSectionOptions = {
  updateHash?: boolean;
  onComplete?: () => void;
  /** Reserved — alignment uses `.devices_product_nav` top, not the clicked row */
  navLink?: HTMLElement | null;
};

export type ResolveActiveProductSectionOptions = {
  /** Negative when scrolling up */
  scrollDelta?: number;
};

function getProductNavElement() {
  return document.querySelector<HTMLElement>(".devices_product_nav");
}

function getProductNavListElement() {
  return document.querySelector<HTMLElement>(".devices_product_nav__list");
}

function getProductNavLinkElement(sectionId: string) {
  return document.querySelector<HTMLElement>(
    `a.devices_product_nav__link[href="#${sectionId}"]`,
  );
}

function updateSectionHash(sectionId: string, enabled: boolean) {
  if (!enabled) return;

  const hash = `#${sectionId}`;
  if (window.location.hash !== hash) {
    window.history.replaceState(null, "", hash);
  }
}

function runAfterScroll(onComplete?: () => void) {
  if (!onComplete) return;

  const timerId = globalThis.setTimeout(onComplete, NATIVE_SMOOTH_SCROLL_FALLBACK_MS);

  globalThis.addEventListener(
    "scrollend",
    () => {
      globalThis.clearTimeout(timerId);
      onComplete();
    },
    { once: true },
  );
}

export function getSectionViewportTop(element: HTMLElement) {
  return element.getBoundingClientRect().top;
}

const PRODUCT_SECTION_TITLE_SELECTORS = [
  ".devices_product_applications__head .section_tit",
  ".devices_product_downloads__head .section_tit",
  ".devices_product_features__head .section_tit",
  ".devices_markets__head .section_tit",
  ".devices_help__head .section_tit",
  ".section_tit",
] as const;

function getCurrentScrollY(lenis?: Lenis | null) {
  if (lenis) {
    return lenis.scroll;
  }

  return window.scrollY || document.documentElement.scrollTop;
}

function resolveProductSectionScrollTarget(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (!section) return null;

  for (const selector of PRODUCT_SECTION_TITLE_SELECTORS) {
    const target = section.querySelector<HTMLElement>(selector);
    if (target) return target;
  }

  return section;
}

/**
 * Side nav alignment line — `.devices_product_nav` top (sticky nav box).
 * `.section_tit` scroll target aligns to this viewport Y.
 */
export function getProductNavAlignmentLine(
  _sectionId?: string,
  _navLink?: HTMLElement | null,
) {
  const nav = getProductNavElement();
  if (nav) {
    return getSectionViewportTop(nav);
  }

  const list = getProductNavListElement();
  if (list) {
    return getSectionViewportTop(list);
  }

  return null;
}

function alignSectionTitToNavRow(
  sectionId: string,
  lenis?: Lenis | null,
  navLink?: HTMLElement | null,
) {
  const scrollTarget = resolveProductSectionScrollTarget(sectionId);
  const alignmentLine = getProductNavAlignmentLine(sectionId, navLink);
  if (!scrollTarget || alignmentLine === null) return;

  const delta = getSectionViewportTop(scrollTarget) - alignmentLine;

  if (Math.abs(delta) <= ALIGNMENT_THRESHOLD_PX) return;

  const targetTop = Math.max(0, getCurrentScrollY(lenis) + delta);

  if (lenis) {
    lenis.scrollTo(targetTop, {
      immediate: true,
      programmatic: true,
      force: true,
    });
    return;
  }

  scrollWindowTo(targetTop, { immediate: true });
}

function getProductSectionScrollTop(
  scrollTarget: HTMLElement,
  lenis?: Lenis | null,
  alignmentLine?: number | null,
) {
  const scrollY = getCurrentScrollY(lenis);
  const line = alignmentLine ?? PRODUCT_SECTION_SCROLL_OFFSET_PX;

  return Math.max(
    0,
    getSectionViewportTop(scrollTarget) + scrollY - line,
  );
}

/**
 * Scroll to a product section.
 * Side nav — `.section_tit` top aligns with `.devices_product_nav` top.
 */
export function scrollToProductSection(
  sectionId: string,
  options: ScrollToProductSectionOptions = {},
) {
  const scrollTarget = resolveProductSectionScrollTarget(sectionId);
  const onComplete = options.onComplete;

  if (!scrollTarget) {
    onComplete?.();
    return;
  }

  const immediate = prefersReducedMotion();
  const lenis = getLenisInstance();
  const alignmentLine = getProductNavAlignmentLine(sectionId, options.navLink);
  const targetTop = getProductSectionScrollTop(scrollTarget, lenis, alignmentLine);

  const finish = () => {
    alignSectionTitToNavRow(sectionId, lenis, options.navLink);
    updateSectionHash(sectionId, options.updateHash !== false);
    onComplete?.();
  };

  if (lenis) {
    lenis.scrollTo(targetTop, {
      immediate,
      programmatic: true,
      force: true,
      ...(immediate ? {} : { duration: PRODUCT_SECTION_SCROLL_DURATION }),
      onComplete: finish,
    });
    return;
  }

  scrollWindowTo(targetTop, { behavior: immediate ? "auto" : "smooth" });

  if (immediate) {
    finish();
    return;
  }

  runAfterScroll(finish);
}

export function isNearProductSection(
  sectionId: string,
  thresholdPx = 48,
  navLink?: HTMLElement | null,
) {
  const scrollTarget = resolveProductSectionScrollTarget(sectionId);
  if (!scrollTarget) return false;

  const alignmentLine =
    getProductNavAlignmentLine(sectionId, navLink) ??
    PRODUCT_SECTION_SCROLL_OFFSET_PX;

  return (
    Math.abs(getSectionViewportTop(scrollTarget) - alignmentLine) <= thresholdPx
  );
}

export function resolveActiveProductSectionId(
  sectionIds: readonly string[],
  options: ResolveActiveProductSectionOptions = {},
) {
  const sections = sectionIds
    .map((id) => {
      const element = document.getElementById(id);
      return element ? { id, element } : null;
    })
    .filter((entry): entry is { id: string; element: HTMLElement } => entry !== null);

  if (sections.length === 0) {
    return sectionIds[0] ?? "";
  }

  const scrollBottom = window.scrollY + window.innerHeight;
  const pageBottom = document.documentElement.scrollHeight;

  if (scrollBottom >= pageBottom - PAGE_BOTTOM_THRESHOLD_PX) {
    return sections[sections.length - 1].id;
  }

  const scrollDelta = options.scrollDelta ?? 0;
  const isScrollingUp = scrollDelta < -1;

  const entries = sections.map(({ id, element }) => {
    const scrollTarget = resolveProductSectionScrollTarget(id) ?? element;
    const linkLine = getProductNavAlignmentLine(id);
    const titTop = getSectionViewportTop(scrollTarget);
    const distance =
      linkLine === null
        ? Math.abs(titTop - PRODUCT_SECTION_SCROLL_OFFSET_PX)
        : Math.abs(titTop - linkLine);

    return { id, titTop, linkLine, distance };
  });

  if (isScrollingUp) {
    for (const { id, distance } of entries) {
      if (distance <= SCROLL_SPY_THRESHOLD_PX) {
        return id;
      }
    }
  } else {
    let passedId = sectionIds[0];
    let anyPassed = false;

    for (const { id, titTop, linkLine } of entries) {
      if (linkLine === null) continue;
      if (titTop <= linkLine + SCROLL_SPY_THRESHOLD_PX) {
        passedId = id;
        anyPassed = true;
      }
    }

    if (anyPassed) {
      return passedId;
    }
  }

  let activeId = sectionIds[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const { id, distance } of entries) {
    if (distance < bestDistance) {
      bestDistance = distance;
      activeId = id;
    } else if (
      isScrollingUp &&
      Math.abs(distance - bestDistance) <= 8 &&
      sectionIds.indexOf(id) < sectionIds.indexOf(activeId)
    ) {
      activeId = id;
    }
  }

  return activeId;
}

export function getProductNavObserverRootMargin() {
  const nav = getProductNavElement();
  const list = getProductNavListElement();
  const rawLine = nav
    ? getSectionViewportTop(nav)
    : list
      ? getSectionViewportTop(list)
      : PRODUCT_SECTION_SCROLL_OFFSET_PX;
  const line = Number.isFinite(rawLine)
    ? Math.max(0, Math.round(rawLine))
    : PRODUCT_SECTION_SCROLL_OFFSET_PX;

  return `-${line}px 0px -50% 0px`;
}
