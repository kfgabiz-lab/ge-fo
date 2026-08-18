"use client";

import { useLayoutEffect, useRef } from "react";
import { getWindowScrollY, scrollWindowTo } from "@/lib/lenisScroll";

const MAX_VISIBLE_PAGES = 5;

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
  if (previous instanceof HTMLElement) return previous;

  const section = nav.closest("section");
  if (section instanceof HTMLElement) return section;

  return nav;
}

function getContentFingerprint(nav: HTMLElement) {
  const target = findPaginationScrollTarget(nav);
  return `${target.childElementCount}:${target.textContent ?? ""}`;
}

function scrollToUpdatedArea(nav: HTMLElement) {
  const target = findPaginationScrollTarget(nav);
  const top = Math.max(
    0,
    getWindowScrollY() +
      target.getBoundingClientRect().top -
      getStickyHeaderOffset(),
  );

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
}: PageNumberingProps) {
  const navRef = useRef<HTMLElement>(null);
  const didMountRef = useRef(false);
  const contentFingerprintRef = useRef("");
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  const visiblePages = getVisiblePages(safeCurrent, safeTotal);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (!didMountRef.current) {
      didMountRef.current = true;
      contentFingerprintRef.current = getContentFingerprint(nav);
      return;
    }

    const scrollAfterContentUpdate = () => {
      contentFingerprintRef.current = getContentFingerprint(nav);
      scrollToUpdatedArea(nav);
    };

    if (getContentFingerprint(nav) !== contentFingerprintRef.current) {
      scrollAfterContentUpdate();
      return;
    }

    const target = findPaginationScrollTarget(nav);
    const observer = new MutationObserver(() => {
      observer.disconnect();
      scrollAfterContentUpdate();
    });
    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [safeCurrent]);

  const goToPage = (page: number) => {
    if (page < 1 || page > safeTotal || page === safeCurrent) return;
    onPageChange?.(page);
  };

  const controlClass = (disabled: boolean) =>
    `page-numbering__control${disabled ? " is-disabled" : ""}`;

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
          onClick={() => goToPage(safeCurrent + 1)}
        >
          <ChevronIcon className="page-numbering__chev page-numbering__chev--right" />
        </button>
        <button
          type="button"
          className={`${controlClass(safeCurrent === safeTotal)} page-numbering__control--end`}
          disabled={safeCurrent === safeTotal}
          aria-label="Last page"
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
