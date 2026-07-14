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
};

export default function CompanyFeedListSection({
  variant,
  items = [],
  empty = false,
  detailHref,
  viewAllHref,
  currentPage = 1,
  totalPages = 5,
}: CompanyFeedListSectionProps) {
  const prefix = `company-${variant}-list`;
  const sectionClass = empty ? `${prefix} ${prefix}--no-data` : prefix;

  return (
    <section className={sectionClass}>
      <div className="inner">
        <CompanyFeedListToolbar variant={variant} />

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
