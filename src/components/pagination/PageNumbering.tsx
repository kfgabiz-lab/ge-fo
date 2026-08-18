"use client";

import { useLayoutEffect, useRef } from "react";
import { getLenisInstance, scrollWindowTo } from "@/lib/lenisScroll";

const MAX_VISIBLE_PAGES = 5;
const LIST_TARGET_SELECTOR =
  "ul, ol, .support_tech_hub_grid, [class*='__list'], [class*='__grid']";

function getStickyHeaderOffset() {
  const wrap = document.querySelector<HTMLElement>(
    ".main_header-wrap, .sub_header-wrap",
  );
  if (!wrap) return 0;

  if (!wrap.classList.contains("is-at-top")) {
    return Math.round(wrap.offsetHeight);
  }

  const header = wrap.querySelector<HTMLElement>(
    ".main_header, .sub_header, .gnb_menu_wrap",
  );
  return header ? Math.round(header.getBoundingClientRect().height) : 0;
}

function findPaginationScrollTarget(nav: HTMLElement) {
  const previous = nav.previousElementSibling;
  if (previous instanceof HTMLElement) {
    const list = previous.matches(LIST_TARGET_SELECTOR)
      ? previous
      : previous.querySelector<HTMLElement>(LIST_TARGET_SELECTOR);
    return list ?? previous;
  }

  const section = nav.closest("section");
  if (section instanceof HTMLElement) return section;

  return nav;
}

function getContentFingerprint(nav: HTMLElement) {
  const target = findPaginationScrollTarget(nav);
  const items = Array.from(target.children, (child) =>
    (child.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
  );
  return `${items.length}:${items.join("|")}`;
}

function getScrollAlignElement(nav: HTMLElement, scrollTargetSelector?: string) {
  if (scrollTargetSelector) {
    const scope = nav.closest("section") ?? document;
    const target = scope.querySelector<HTMLElement>(scrollTargetSelector);
    if (target) return target;
  }

  const list = findPaginationScrollTarget(nav);
  if (list.firstElementChild instanceof HTMLElement) {
    return list.firstElementChild;
  }
  return list;
}

function getAlignOffset(align: HTMLElement) {
  if (align.classList.contains("section_tit")) {
    const navList = document.querySelector<HTMLElement>(
      ".devices_product_nav > ul.devices_product_nav__list",
    );
    if (navList) {
      const navTop = navList.getBoundingClientRect().top;
      if (navTop > 0) return Math.round(navTop);
    }
  }

  return getStickyHeaderOffset();
}

function scrollToUpdatedArea(nav: HTMLElement, scrollTargetSelector?: string) {
  const align = getScrollAlignElement(nav, scrollTargetSelector);
  const lenis = getLenisInstance();
  lenis?.resize();

  const scrollY = lenis?.scroll ?? window.scrollY ?? document.documentElement.scrollTop;
  const top = Math.max(
    0,
    scrollY + align.getBoundingClientRect().top - getAlignOffset(align),
  );

  if (lenis) {
    lenis.scrollTo(top, { immediate: true, force: true });
    return;
  }

  scrollWindowTo(top, { immediate: true });
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = MAX_VISIBLE_PAGES;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - MAX_VISIBLE_PAGES + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

type PageNumberingProps = {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  ariaLabel?: string;
  scrollTargetSelector?: string;
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <img loading="lazy" decoding="async"
      src="/ico/ico_pag_chev_10.svg"
      alt=""
      width={6}
      height={10}
      className={className}
      aria-hidden
    />
  );
}

export default function PageNumbering({
  className = "",
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = "Page navigation",
  scrollTargetSelector,
}: PageNumberingProps) {
  const navRef = useRef<HTMLElement>(null);
  const pendingScrollRef = useRef(false);
  const contentFingerprintRef = useRef("");
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  const visiblePages = getVisiblePages(safeCurrent, safeTotal);

  useLayoutEffect(() => {
    if (!pendingScrollRef.current) return;

    const nav = navRef.current;
    if (!nav) return;

    const previous = contentFingerprintRef.current;

    const finish = () => {
      pendingScrollRef.current = false;
      contentFingerprintRef.current = getContentFingerprint(nav);
      const active = document.activeElement;
      if (active instanceof HTMLElement && nav.contains(active)) {
        active.blur();
      }
      scrollToUpdatedArea(nav, scrollTargetSelector);
      requestAnimationFrame(() => {
        scrollToUpdatedArea(nav, scrollTargetSelector);
      });
    };

    if (getContentFingerprint(nav) !== previous) {
      finish();
      return;
    }

    const target = findPaginationScrollTarget(nav);
    const observer = new MutationObserver(() => {
      if (getContentFingerprint(nav) === previous) return;
      observer.disconnect();
      finish();
    });
    observer.observe(target, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [safeCurrent, scrollTargetSelector]);

  const goToPage = (page: number) => {
    if (page < 1 || page > safeTotal || page === safeCurrent) return;
    if (navRef.current) {
      contentFingerprintRef.current = getContentFingerprint(navRef.current);
      pendingScrollRef.current = true;
    }
    onPageChange?.(page);
  };

  const controlClass = (disabled: boolean) =>
    `page-numbering__control${disabled ? " is-disabled" : ""}`;

  const preventButtonFocus = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  return (
    <nav
      ref={navRef}
      className={`page-numbering${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel}
    >
      <div className="page-numbering__inner">
        <button
          type="button"
          className={`${controlClass(safeCurrent === 1)} page-numbering__control--first`}
          disabled={safeCurrent === 1}
          aria-label="First page"
          onMouseDown={preventButtonFocus}
          onClick={() => goToPage(1)}
        >
          <span className="page-numbering__icon page-numbering__icon--double" aria-hidden>
            <ChevronIcon className="page-numbering__chev page-numbering__chev--left" />
            <ChevronIcon className="page-numbering__chev page-numbering__chev--left" />
          </span>
        </button>
        <button
          type="button"
          className={`${controlClass(safeCurrent === 1)} page-numbering__control--prev`}
          disabled={safeCurrent === 1}
          aria-label="Previous page"
          onMouseDown={preventButtonFocus}
          onClick={() => goToPage(safeCurrent - 1)}
        >
          <ChevronIcon className="page-numbering__chev page-numbering__chev--left" />
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            className={`page-numbering__page${
              page === safeCurrent ? " is-active" : ""
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === safeCurrent ? "page" : undefined}
            onMouseDown={preventButtonFocus}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className={`${controlClass(safeCurrent === safeTotal)} page-numbering__control--next`}
          disabled={safeCurrent === safeTotal}
          aria-label="Next page"
          onMouseDown={preventButtonFocus}
          onClick={() => goToPage(safeCurrent + 1)}
        >
          <ChevronIcon className="page-numbering__chev page-numbering__chev--right" />
        </button>
        <button
          type="button"
          className={`${controlClass(safeCurrent === safeTotal)} page-numbering__control--end`}
          disabled={safeCurrent === safeTotal}
          aria-label="Last page"
          onMouseDown={preventButtonFocus}
          onClick={() => goToPage(safeTotal)}
        >
          <span className="page-numbering__icon page-numbering__icon--double" aria-hidden>
            <ChevronIcon className="page-numbering__chev page-numbering__chev--right" />
            <ChevronIcon className="page-numbering__chev page-numbering__chev--right" />
          </span>
        </button>
      </div>
    </nav>
  );
}

export { MAX_VISIBLE_PAGES };
