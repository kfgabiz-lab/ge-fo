"use client";

import CompanyFeedFeatured from "@/app/company/components/CompanyFeedFeatured";
import CompanyFeedListSection from "@/app/company/components/CompanyFeedListSection";
import CompanyFeedTitle from "@/app/company/components/CompanyFeedTitle";
import {
  companyFeedContent,
  type CompanyFeedVariant,
} from "@/app/company/data/companyFeedContent";
import "@/assets/css/company.css";

// 공통 피드 리스트 페이지 (Press/Articles). variant로 콘텐츠/class 접두어/pageId 분기
type CompanyFeedPageProps = {
  variant: CompanyFeedVariant;
  empty?: boolean;
  pageId?: string;
};

export default function CompanyFeedPage({
  variant,
  empty = false,
  pageId,
}: CompanyFeedPageProps) {
  const content = companyFeedContent[variant];
  const resolvedPageId = pageId ?? content.pageId;
  const { featured, items, pager } = content;

  return (
    <main className={`company-page company-page--${variant}`} id={resolvedPageId}>
      <CompanyFeedTitle variant={variant} />
      <CompanyFeedFeatured
        variant={variant}
        title={featured.title}
        description={featured.description}
        date={featured.date}
        image={featured.image}
        href={featured.href}
      />
      <CompanyFeedListSection
        variant={variant}
        empty={empty}
        items={empty ? [] : items}
        currentPage={pager.currentPage}
        totalPages={pager.totalPages}
      />
    </main>
  );
}
