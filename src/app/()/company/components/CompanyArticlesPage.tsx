"use client";

import CompanyArticlesFeatured from "@/app/()/company/components/CompanyArticlesFeatured";
import CompanyArticlesListSection from "@/app/()/company/components/CompanyArticlesListSection";
import CompanyArticlesTitle from "@/app/()/company/components/CompanyArticlesTitle";
import {
  articlesFeatured,
  articlesItems,
  articlesListPager,
} from "@/app/()/company/data/articlesListContent";
import "@/assets/css/company.css";

type CompanyArticlesPageProps = {
  pageId?: string;
};

export default function CompanyArticlesPage({
  pageId = "Page_company_articles",
}: CompanyArticlesPageProps) {
  return (
    <main className="company-page company-page--articles" id={pageId}>
      <CompanyArticlesTitle />
      <CompanyArticlesFeatured
        title={articlesFeatured.title}
        description={articlesFeatured.description}
        date={articlesFeatured.date}
        image={articlesFeatured.image}
        href={articlesFeatured.href}
      />
      <CompanyArticlesListSection
        items={articlesItems}
        currentPage={articlesListPager.currentPage}
        totalPages={articlesListPager.totalPages}
      />
    </main>
  );
}
