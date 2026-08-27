"use client";

import { useEffect, useRef, useState } from "react";
import CompanyEventsCalendar from "@/app/company/components/CompanyEventsCalendar";
import CompanyEventsFeatured from "@/app/company/components/CompanyEventsFeatured";
import CompanyEventsPastSection from "@/app/company/components/CompanyEventsPastSection";
import CompanyFeedTitle from "@/app/company/components/CompanyFeedTitle";
import {
  eventsCalendarQuery,
  eventsFeaturedQuery,
  eventsPastQuery,
} from "@/app/company/data/eventsData";
import { useListPageMemory } from "@/app/company/useListPageMemory";
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
  initialFeaturedItems?: EventsFeaturedItem[];
  initialCalendarMonths?: EventsCalendarMonth[];
  initialPastItems?: EventsPastItem[];
  initialPastTotalPages?: number;
};

export default function CompanyEventsPage({
  pageId = "Page_company_events",
  initialFeaturedItems = [],
  initialCalendarMonths = [],
  initialPastItems = [],
  initialPastTotalPages = 1,
}: CompanyEventsPageProps) {
  const [featuredItems, setFeaturedItems] = useState<EventsFeaturedItem[]>(initialFeaturedItems);
  const [calendarMonths, setCalendarMonths] =
    useState<EventsCalendarMonth[]>(initialCalendarMonths);

  const [pastItems, setPastItems] = useState<EventsPastItem[]>(initialPastItems);
  const {
    pageIndex: pastPageIndex,
    goToPage: goToPastPage,
  } = useListPageMemory("events", "/company/events");
  const [pastTotalPages, setPastTotalPages] = useState(initialPastTotalPages);
  const [pastSort, setPastSort] = useState<"latest" | "oldest" | "az" | "za">("latest");

  useEffect(() => {
    if (initialCalendarMonths.length > 0) return;
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

  const skipInitialPastFetch = useRef(
    initialPastItems.length > 0 && pastPageIndex === 0 && pastSort === "latest",
  );

  useEffect(() => {
    if (skipInitialPastFetch.current) {
      skipInitialPastFetch.current = false;
      return;
    }
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
