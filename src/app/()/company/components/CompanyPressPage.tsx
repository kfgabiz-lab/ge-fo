"use client";

import CompanyPressFeatured from "@/app/()/company/components/CompanyPressFeatured";
import CompanyPressListSection from "@/app/()/company/components/CompanyPressListSection";
import CompanyPressTitle from "@/app/()/company/components/CompanyPressTitle";
import {
  pressFeatured,
  pressItems,
  pressListPager,
} from "@/app/()/company/data/pressListContent";
import "@/assets/css/company.css";

type CompanyPressPageProps = {
  empty?: boolean;
  pageId?: string;
};

export default function CompanyPressPage({
  empty = false,
  pageId = "Page_company_press",
}: CompanyPressPageProps) {
  return (
    <main className="company-page company-page--press" id={pageId}>
      <CompanyPressTitle />
      <CompanyPressFeatured
        title={pressFeatured.title}
        description={pressFeatured.description}
        date={pressFeatured.date}
        image={pressFeatured.image}
        href={pressFeatured.href}
      />
      <CompanyPressListSection
        empty={empty}
        items={empty ? [] : pressItems}
        currentPage={pressListPager.currentPage}
        totalPages={pressListPager.totalPages}
      />
    </main>
  );
}
