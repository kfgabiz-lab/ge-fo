"use client";

import { useEffect, useMemo, useState } from "react";
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
import { fetchData } from "@/lib/pageDataApi";
import "@/assets/css/company.css";

const FEATURED_FALLBACK_IMAGE = "/img/company/press/hero.png";
const LIST_FALLBACK_IMAGE = "/img/company/press/list_01.png";

export default function CompanyPressListPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState<PressRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [featuredRow, setFeaturedRow] = useState<PressRow | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest" | "az" | "za">("latest");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2017 + 1 },
    (_, i) => String(currentYear - i),
  );

  useEffect(() => {
    let alive = true;
    fetchData({
      slug: "press-data",
      size: 1,
      sort: "createdAt,desc",
      where: { ...PRESS_STATUS_WHERE },
      리턴함수: (rows) => rows,
    })
      .then((res) => {
        if (alive) setFeaturedRow(res.content[0] ?? null);
      })
      .catch(() => {
        if (alive) setFeaturedRow(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
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
        ...(featuredRow?.id != null ? { ne_id: String(featuredRow.id) } : {}),
      },
      sort:
        sort === "oldest"
          ? "createdAt,asc"
          : sort === "az"
            ? "press.title,asc"
            : sort === "za"
              ? "press.title,desc"
              : undefined,
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
  }, [pageIndex, search, sort, month, year, featuredRow?.id]);

  const featured = useMemo(() => {
    if (!featuredRow) return null;
    const card = toPressCard(featuredRow);
    return {
      title: card.title,
      description: card.description,
      date: card.date,
      image: card.imageSrc ?? FEATURED_FALLBACK_IMAGE,
      href: pressDetailHref(card.id),
    };
  }, [featuredRow]);

  const listItems = useMemo<CompanyFeedListItem[]>(
    () =>
      rows.map((row) => {
        const card = toPressCard(row);
        return {
          id: String(card.id),
          title: card.title,
          date: card.date,
          image: card.imageSrc ?? LIST_FALLBACK_IMAGE,
          href: pressDetailHref(card.id),
        };
      }),
    [rows],
  );

  const handlePageChange = (page: number) => {
    setPageIndex(Math.max(0, page - 1));
  };

  const handleSearchSubmit = (value: string) => {
    setSearch(value);
    setPageIndex(0);
  };
  const handleSortChange = (value: "latest" | "oldest" | "az" | "za") => {
    setSort(value);
    setPageIndex(0);
  };
  const handleMonthChange = (value: string) => {
    setMonth(value);
    setPageIndex(0);
  };
  const handleYearChange = (value: string) => {
    setYear(value);
    setPageIndex(0);
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
      />
    </main>
  );
}
