"use client";

import PageNumbering from "@/components/pagination/PageNumbering";
import CompanyFeedEmpty from "@/app/company/components/CompanyFeedEmpty";
import CompanyFeedListGrid from "@/app/company/components/CompanyFeedListGrid";
import CompanyFeedListToolbar from "@/app/company/components/CompanyFeedListToolbar";
import type {
  CompanyFeedListItem,
  CompanyFeedVariant,
} from "@/app/company/data/companyFeedContent";

const paginationLabels: Record<CompanyFeedVariant, string> = {
  press: "Press pagination",
  articles: "Articles pagination",
};

type CompanyFeedListSectionProps = {
  variant: CompanyFeedVariant;
  items?: CompanyFeedListItem[];
  empty?: boolean;
  detailHref?: string;
  viewAllHref?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  monthValue?: string;
  onMonthChange?: (value: string) => void;
  yearValue?: string;
  onYearChange?: (value: string) => void;
  monthOptions?: { value: string; label: string }[];
  yearOptions?: string[];
  searchValue?: string;
  onSearchSubmit?: (value: string) => void;
  sortValue?: "latest" | "oldest" | "az" | "za";
  onSortChange?: (value: "latest" | "oldest" | "az" | "za") => void;
  onViewAllClick?: () => void;
};

export default function CompanyFeedListSection({
  variant,
  items = [],
  empty = false,
  detailHref,
  viewAllHref,
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  monthValue,
  onMonthChange,
  yearValue,
  onYearChange,
  monthOptions,
  yearOptions,
  searchValue,
  onSearchSubmit,
  sortValue,
  onSortChange,
  onViewAllClick,
}: CompanyFeedListSectionProps) {
  const prefix = `company-${variant}-list`;
  const sectionClass = empty ? `${prefix} ${prefix}--no-data` : prefix;

  return (
    <section className={sectionClass}>
      <div className="inner">
        <CompanyFeedListToolbar
          variant={variant}
          monthValue={monthValue}
          onMonthChange={onMonthChange}
          yearValue={yearValue}
          onYearChange={onYearChange}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
          searchValue={searchValue}
          onSearchSubmit={onSearchSubmit}
          sortValue={sortValue}
          onSortChange={onSortChange}
        />

        <div className={`${prefix}__body`}>
          {empty ? (
            <CompanyFeedEmpty variant={variant} viewAllHref={viewAllHref} onViewAllClick={onViewAllClick}/>
          ) : (
            <>
              <CompanyFeedListGrid
                variant={variant}
                items={items}
                detailHref={detailHref}
                highlight={searchValue}
              />
              <PageNumbering
                className={`${prefix}__pagination`}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                ariaLabel={paginationLabels[variant]}
              />
            </>
          )}
        </div>

        {empty ? <div className={`${prefix}__divider`} aria-hidden="true" /> : null}
      </div>
    </section>
  );
}
