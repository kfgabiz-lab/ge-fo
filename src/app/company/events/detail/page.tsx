"use client";

import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import {
  eventsDetailBullets,
  eventsDetailHero,
  eventsDetailMeta,
  eventsDetailPager,
} from "@/app/company/data/eventsDetailContent";
import "@/assets/css/company.css";

export default function CompanyEventsDetailPage() {
  return (
    <CompanyArticleDetail
      variant="events"
      pageId="Page_company_events_detail"
      title="ELECS KOREA 2026"
      eventsMeta={eventsDetailMeta}
      heroImage={eventsDetailHero}
      pagerAriaLabel="Events post navigation"
      prev={eventsDetailPager.prev}
      next={eventsDetailPager.next}
      listHref="/company/events"
    >
      <div className={articleDetailClass("body")}>
        <ul className={articleDetailClass("list")}>
          {eventsDetailBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </CompanyArticleDetail>
  );
}
