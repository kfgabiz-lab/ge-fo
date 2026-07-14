"use client";

import PageNumbering from "@/components/pagination/PageNumbering";
import CompanyFeedEmpty from "@/app/company/components/CompanyFeedEmpty";
import CompanyFeedListGrid from "@/app/company/components/CompanyFeedListGrid";
import CompanyFeedListToolbar from "@/app/company/components/CompanyFeedListToolbar";
import type {
  CompanyFeedListItem,
  CompanyFeedVariant,
} from "@/app/company/data/companyFeedContent";

// variant별 페이지네이션 aria-label (기존 개별 섹션의 라벨을 그대로 이관)
const paginationLabels: Record<CompanyFeedVariant, string> = {
  press: "Press pagination",
  articles: "Articles pagination",
};

// 공통 피드 리스트 섹션 (Press/Articles). 툴바 + 그리드/Empty + 페이지네이션 구조 동일
type CompanyFeedListSectionProps = {
  variant: CompanyFeedVariant;
  items?: CompanyFeedListItem[];
  empty?: boolean;
  detailHref?: string;
  viewAllHref?: string;
  currentPage?: number;
  totalPages?: number;
  // 페이지네이션 클릭 핸들러(선택). 미지정 시 정적 표시만(기존 Articles 동작 유지)
  onPageChange?: (page: number) => void;
  // 툴바(월/연도/검색/정렬) 상태 — 그대로 CompanyFeedListToolbar에 전달. 미지정 시 비연동 장식 UI 유지
  monthValue?: string;
  onMonthChange?: (value: string) => void;
  yearValue?: string;
  onYearChange?: (value: string) => void;
  searchValue?: string;
  onSearchSubmit?: (value: string) => void;
  sortValue?: "latest" | "oldest";
  onSortChange?: (value: "latest" | "oldest") => void;
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
  searchValue,
  onSearchSubmit,
  sortValue,
  onSortChange,
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
          searchValue={searchValue}
          onSearchSubmit={onSearchSubmit}
          sortValue={sortValue}
          onSortChange={onSortChange}
        />

        <div className={`${prefix}__body`}>
          {empty ? (
            <CompanyFeedEmpty variant={variant} viewAllHref={viewAllHref} />
          ) : (
            <>
              <CompanyFeedListGrid variant={variant} items={items} detailHref={detailHref} />
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
