"use client";

const MAX_VISIBLE_PAGES = 5;

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
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  const visiblePages = getVisiblePages(safeCurrent, safeTotal);

  const goToPage = (page: number) => {
    if (page < 1 || page > safeTotal || page === safeCurrent) return;
    onPageChange?.(page);
  };

  const controlClass = (disabled: boolean) =>
    `page-numbering__control${disabled ? " is-disabled" : ""}`;

  return (
    <nav
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
