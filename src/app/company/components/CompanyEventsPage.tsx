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

// 미디어 미등록 시 폴백 이미지(퍼블리싱 정적 이미지 재사용)
const FEATURED_FALLBACK_IMAGE = "/img/company/events/featured_01.png";
const PAST_FALLBACK_IMAGE = "/img/company/events/past_01.png";

type CompanyEventsPageProps = {
  pageId?: string;
};

// Events: events-data slug 실데이터 연동. Featured(이번달+이전달 전체)/Calendar(예정, 월별)/Past(지난, 검색·정렬·월·연도)
export default function CompanyEventsPage({
  pageId = "Page_company_events",
}: CompanyEventsPageProps) {
  const [featuredItems, setFeaturedItems] = useState<EventsFeaturedItem[]>([]);
  const [calendarMonths, setCalendarMonths] = useState<EventsCalendarMonth[]>([]);

  const [pastItems, setPastItems] = useState<EventsPastItem[]>([]);
  const [pastPageIndex, setPastPageIndex] = useState(0);
  const [pastTotalPages, setPastTotalPages] = useState(1);
  const [pastSearch, setPastSearch] = useState("");
  const [pastSort, setPastSort] = useState<"latest" | "oldest" | "az" | "za">("latest");
  const [pastMonth, setPastMonth] = useState("");
  const [pastYear, setPastYear] = useState("");

  // Featured/Calendar는 필터 없이 최초 1회 조회
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

  // Past: 페이지/검색/정렬/월/연도 변경 시 재조회
  useEffect(() => {
    let alive = true;
    fetchData(
      eventsPastQuery({
        page: pastPageIndex,
        search: pastSearch || undefined,
        sort: pastSort,
        month: pastMonth || undefined,
        year: pastYear || undefined,
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
  }, [pastPageIndex, pastSearch, pastSort, pastMonth, pastYear]);

  const handlePastPageChange = (page: number) => {
    setPastPageIndex(Math.max(0, page - 1));
  };
  const handlePastSearchSubmit = (value: string) => {
    setPastSearch(value);
    setPastPageIndex(0);
  };
  const handlePastSortChange = (value: "latest" | "oldest" | "az" | "za") => {
    setPastSort(value);
    setPastPageIndex(0);
  };
  const handlePastMonthChange = (value: string) => {
    setPastMonth(value);
    setPastPageIndex(0);
  };
  const handlePastYearChange = (value: string) => {
    setPastYear(value);
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
        searchValue={pastSearch}
        onSearchSubmit={handlePastSearchSubmit}
        sortValue={pastSort}
        onSortChange={handlePastSortChange}
        monthValue={pastMonth}
        onMonthChange={handlePastMonthChange}
        yearValue={pastYear}
        onYearChange={handlePastYearChange}
      />
    </main>
  );
}
