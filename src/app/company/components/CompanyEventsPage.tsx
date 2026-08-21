"use client";

import { useCallback, useEffect, useState } from "react";
import CompanyEventsCalendar from "@/app/company/components/CompanyEventsCalendar";
import CompanyEventsFeatured from "@/app/company/components/CompanyEventsFeatured";
import CompanyEventsPastSection from "@/app/company/components/CompanyEventsPastSection";
import CompanyFeedTitle from "@/app/company/components/CompanyFeedTitle";
import {
  eventsCalendarQuery,
  eventsFeaturedQuery,
  eventsPastQuery,
} from "@/app/company/data/eventsData";
import { getRememberedListPage, rememberListPage } from "@/app/company/lastListSession";
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
  // SSR과 최초 클라이언트 렌더가 항상 1page로 일치하도록 0으로 초기화하고,
  // sessionStorage 복원은 하이드레이션 이후 effect에서만 수행한다(hydration mismatch 방지).
  const [pastPageIndex, setPastPageIndex] = useState(0);
  const [pastTotalPages, setPastTotalPages] = useState(1);
  const [pastSort, setPastSort] = useState<"latest" | "oldest" | "az" | "za">("latest");

  useEffect(() => {
    const remembered = getRememberedListPage("events");
    if (remembered > 1) setPastPageIndex(remembered - 1);
  }, []);

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

  const goToPastPage = useCallback((page: number) => {
    const nextIndex = Math.max(0, page - 1);
    setPastPageIndex(nextIndex);
    rememberListPage("events", nextIndex + 1);
  }, []);

  const handlePastPageChange = (page: number) => {
    goToPastPage(page);
  };
  const handlePastSortChange = (value: "latest" | "oldest" | "az" | "za") => {
    setPastSort(value);
    goToPastPage(1);
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
