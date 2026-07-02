"use client";

import PageNumbering from "@/components/pagination/PageNumbering";
import CompanyPressEmpty from "@/app/()/company/components/CompanyPressEmpty";
import CompanyPressListGrid from "@/app/()/company/components/CompanyPressListGrid";
import CompanyPressListToolbar from "@/app/()/company/components/CompanyPressListToolbar";
import type { PressListItem } from "@/app/()/company/data/pressListContent";

type CompanyPressListSectionProps = {
  items?: PressListItem[];
  empty?: boolean;
  detailHref?: string;
  viewAllHref?: string;
  currentPage?: number;
  totalPages?: number;
};

export default function CompanyPressListSection({
  items = [],
  empty = false,
  detailHref = "/company/press/detail",
  viewAllHref = "/company/press",
  currentPage = 1,
  totalPages = 5,
}: CompanyPressListSectionProps) {
  const sectionClass = empty
    ? "company-press-list company-press-list--no-data"
    : "company-press-list";

  return (
    <section className={sectionClass}>
      <div className="inner">
        <CompanyPressListToolbar />

        <div className="company-press-list__body">
          {empty ? (
            <CompanyPressEmpty viewAllHref={viewAllHref} />
          ) : (
            <>
              <CompanyPressListGrid items={items} detailHref={detailHref} />
              <PageNumbering
                className="company-press-list__pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                ariaLabel="Press pagination"
              />
            </>
          )}
        </div>

        {empty ? <div className="company-press-list__divider" aria-hidden="true" /> : null}
      </div>
    </section>
  );
}
