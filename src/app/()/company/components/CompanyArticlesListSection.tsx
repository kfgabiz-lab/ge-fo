"use client";

import PageNumbering from "@/components/pagination/PageNumbering";
import CompanyArticlesListGrid from "@/app/()/company/components/CompanyArticlesListGrid";
import CompanyArticlesListToolbar from "@/app/()/company/components/CompanyArticlesListToolbar";
import type { ArticlesListItem } from "@/app/()/company/data/articlesListContent";

type CompanyArticlesListSectionProps = {
  items?: ArticlesListItem[];
  detailHref?: string;
  currentPage?: number;
  totalPages?: number;
};

export default function CompanyArticlesListSection({
  items = [],
  detailHref = "/company/articles/detail",
  currentPage = 1,
  totalPages = 5,
}: CompanyArticlesListSectionProps) {
  return (
    <section className="company-articles-list">
      <div className="inner">
        <CompanyArticlesListToolbar />

        <div className="company-articles-list__body">
          <CompanyArticlesListGrid items={items} detailHref={detailHref} />
          <PageNumbering
            className="company-articles-list__pagination"
            currentPage={currentPage}
            totalPages={totalPages}
            ariaLabel="Articles pagination"
          />
        </div>
      </div>
    </section>
  );
}
