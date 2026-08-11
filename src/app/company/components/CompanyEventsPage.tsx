"use client";

import { useEffect, useState } from "react";
import CompanyEventsCalendar from "@/app/company/components/CompanyEventsCalendar";
import CompanyEventsFeatured from "@/app/company/components/CompanyEventsFeatured";
import CompanyEventsPastSection from "@/app/company/components/CompanyEventsPastSection";
import CompanyFeedTitle from "@/app/company/components/CompanyFeedTitle";
import {
  eventsCalendarQuery,
  eventsFeaturedQuery,
  eventsPastQuery,
} from "@/app/company/data/eventsData";
import { fetchData } from "@/lib/pageDataApi";
import type {
  EventsCalendarMonth,
  EventsFeaturedItem,
  EventsPastItem,
} from "@/app/company/data/eventsListContent";
import "@/assets/css/company.css";

const FEATURED_FALLBACK_IMAGE = "/img/devices/product/list_no_data.svg";
const PAST_FALLBACK_IMAGE = "/img/devices/product/list_no_data.svg";

type CompanyEventsPageProps = {
  pageId?: string;
};

export default function CompanyEventsPage({
  pageId = "Page_company_events",
}: CompanyEventsPageProps) {
  const [featuredItems, setFeaturedItems] = useState<EventsFeaturedItem[]>([]);
  const [calendarMonths, setCalendarMonths] = useState<EventsCalendarMonth[]>([]);

  const [pastItems, setPastItems] = useState<EventsPastItem[]>([]);
  const [pastPageIndex, setPastPageIndex] = useState(0);
  const [pastTotalPages, setPastTotalPages] = useState(1);
  const [pastSort, setPastSort] = useState<"latest" | "oldest" | "az" | "za">("latest");

  useEffect(() => {
    let alive = true;
    fetchData(eventsFeaturedQuery(FEATURED_FALLBACK_IMAGE))
      .then((res) => {
        if (alive) setFeaturedItems(res.content);
      })
      .catch(() => {
        if (alive) setFeaturedItems([]);
      });
    fetchData(eventsCalendarQuery())
      .then((res) => {
        if (alive) setCalendarMonths(res.content);
      })
      .catch(() => {
        if (alive) setCalendarMonths([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    fetchData(
      eventsPastQuery({
        page: pastPageIndex,
        sort: pastSort,
        fallbackImage: PAST_FALLBACK_IMAGE,
      }),
    )
      .then((res) => {
        if (!alive) return;
        setPastItems(res.content);
        setPastTotalPages(res.totalPages || 1);
      })
      .catch(() => {
        if (alive) setPastItems([]);
      });
    return () => {
      alive = false;
    };
  }, [pastPageIndex, pastSort]);

  const handlePastPageChange = (page: number) => {
    setPastPageIndex(Math.max(0, page - 1));
  };
  const handlePastSortChange = (value: "latest" | "oldest" | "az" | "za") => {
    setPastSort(value);
    setPastPageIndex(0);
  };

  return (
    <main className="company-page company-page--events" id={pageId}>
      <CompanyFeedTitle
        variant="press"
        heading="Events"
        description="All Planned Exhibitions and Webinars"
      />
      <CompanyEventsFeatured items={featuredItems} />
      <CompanyEventsCalendar months={calendarMonths} />
      <CompanyEventsPastSection
        items={pastItems}
        currentPage={pastPageIndex + 1}
        totalPages={pastTotalPages}
        onPageChange={handlePastPageChange}
        sortValue={pastSort}
        onSortChange={handlePastSortChange}
      />
    </main>
  );
}
