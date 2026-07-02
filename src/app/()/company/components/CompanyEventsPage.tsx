"use client";

import CompanyEventsCalendar from "@/app/()/company/components/CompanyEventsCalendar";
import CompanyEventsFeatured from "@/app/()/company/components/CompanyEventsFeatured";
import CompanyEventsPastSection from "@/app/()/company/components/CompanyEventsPastSection";
import CompanyPressTitle from "@/app/()/company/components/CompanyPressTitle";
import {
  eventsCalendarMonths,
  eventsFeaturedItems,
  eventsPastItems,
  eventsPastPager,
} from "@/app/()/company/data/eventsListContent";
import "@/assets/css/company.css";

type CompanyEventsPageProps = {
  pageId?: string;
};

export default function CompanyEventsPage({
  pageId = "Page_company_events",
}: CompanyEventsPageProps) {
  return (
    <main className="company-page company-page--events" id={pageId}>
      <CompanyPressTitle
        heading="Events"
        description="All Planned Exhibitions and Webinars"
      />
      <CompanyEventsFeatured items={eventsFeaturedItems} />
      <CompanyEventsCalendar months={eventsCalendarMonths} />
      <CompanyEventsPastSection
        items={eventsPastItems}
        currentPage={eventsPastPager.currentPage}
        totalPages={eventsPastPager.totalPages}
      />
    </main>
  );
}
