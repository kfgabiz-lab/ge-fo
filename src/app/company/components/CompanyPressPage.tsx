"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CompanyFeedFeatured from "@/app/company/components/CompanyFeedFeatured";
import CompanyFeedListSection from "@/app/company/components/CompanyFeedListSection";
import CompanyFeedTitle from "@/app/company/components/CompanyFeedTitle";
import type { CompanyFeedListItem } from "@/app/company/data/companyFeedContent";
import {
  PRESS_LIST_SIZE,
  PRESS_STATUS_WHERE,
  pressDetailHref,
  toPressCard,
  type PressRow,
} from "@/app/company/data/pressData";
import { useListPageMemory } from "@/app/company/useListPageMemory";
import { useFeaturedFeed } from "@/hooks/useFeaturedFeed";
import { fetchData } from "@/lib/pageDataApi";
import "@/assets/css/company.css";

const FEATURED_FALLBACK_IMAGE = "/img/devices/product/list_no_data.svg";
const LIST_FALLBACK_IMAGE = "/img/devices/product/list_no_data.svg";

interface PressFeaturedCard {
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
}

function toPressFeaturedCard(row: PressRow): PressFeaturedCard {
  const card = toPressCard(row);
  return {
    title: card.title,
    description: card.description,
    date: card.date,
    image: card.imageSrc ?? FEATURED_FALLBACK_IMAGE,
    href: pressDetailHref(card.id, card.slug),
  };
}

type CompanyPressPageProps = {
  initialRows?: PressRow[];
  initialTotalPages?: number;
};

export default function CompanyPressPage({
  initialRows = [],
  initialTotalPages = 1,
}: CompanyPressPageProps) {
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [rows, setRows] = useState<PressRow[]>(initialRows);
  const [loaded, setLoaded] = useState(initialRows.length > 0);
  const [sort, setSort] = useState<"latest" | "oldest" | "az" | "za">("latest");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const { pageIndex, setPageIndex, goToPage, search, submitSearch } = useListPageMemory(
    "press",
    "/company/press",
  );

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2017 + 1 },
    (_, i) => String(currentYear - i),
  );

  const { featured } = useFeaturedFeed<PressFeaturedCard>({
    slug: "press-data",
    where: PRESS_STATUS_WHERE,
    sort: "press.publish_dttm,desc",
    toCard: toPressFeaturedCard,
  });

  const skipInitialFetch = useRef(
    initialRows.length > 0 &&
      pageIndex === 0 &&
      !search &&
      sort === "latest" &&
      !month &&
      !year,
  );

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    let alive = true;
    fetchData({
      slug: "press-data",
      page: pageIndex,
      size: PRESS_LIST_SIZE,
      where: {
        ...PRESS_STATUS_WHERE,
        ...(search ? { "title|content": search } : {}),
        ...(month ? { month_publish_dttm: month } : {}),
        ...(year ? { year_publish_dttm: year } : {}),
      },
      sort:
          sort === "oldest"
              ? "press.publish_dttm,asc"
              : sort === "az"
                  ? "press.title,asc"
                  : sort === "za"
                      ? "press.title,desc"
                      : "press.publish_dttm,desc",
      리턴함수: (rows) => rows,
    })
      .then((res) => {
        if (!alive) return;
        setRows(res.content);
        setTotalPages(res.totalPages || 1);
        setLoaded(true);
      })
      .catch(() => {
        if (!alive) return;
        setRows([]);
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [pageIndex, search, sort, month, year]);

  const listItems = useMemo<CompanyFeedListItem[]>(
    () =>
      rows.map((row) => {
        const card = toPressCard(row);
        return {
          id: String(card.id),
          title: card.title,
          date: card.date,
          image: card.imageSrc ?? LIST_FALLBACK_IMAGE,
          href: pressDetailHref(card.id, card.slug),
        };
      }),
    [rows, pageIndex],
  );

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleSearchSubmit = (value: string) => {
    submitSearch(value);
    goToPage(1);
  };
  const handleSortChange = (value: "latest" | "oldest" | "az" | "za") => {
    setSort(value);
    goToPage(1);
  };
  const handleMonthChange = (value: string) => {
    setMonth(value);
    goToPage(1);
  };
  const handleYearChange = (value: string) => {
    setYear(value);
    goToPage(1);
  };
  const handleViewAllClick = () => {
    // Clear search and reset month/year filters so "View All" shows full list
    setMonth("");
    setYear("");
    // Reset sort to latest and go back to first page
    setSort("latest");
    setPageIndex(0);
    handleSearchSubmit("");
  };
  

  return (
    <main className="company-page company-page--press" id="Page_company_press">
      <CompanyFeedTitle variant="press" />
      {featured ? (
        <CompanyFeedFeatured
          variant="press"
          title={featured.title}
          description={featured.description}
          date={featured.date}
          image={featured.image}
          href={featured.href}
          highlight={search}
        />
      ) : null}
      <CompanyFeedListSection
        variant="press"
        items={listItems}
        empty={loaded && rows.length === 0}
        currentPage={pageIndex + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        searchValue={search}
        onSearchSubmit={handleSearchSubmit}
        sortValue={sort}
        onSortChange={handleSortChange}
        monthValue={month}
        onMonthChange={handleMonthChange}
        yearValue={year}
        onYearChange={handleYearChange}
        yearOptions={yearOptions}
        onViewAllClick={handleViewAllClick}
      />
    </main>
  );
}
