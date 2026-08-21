"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CompanyFeedFeatured from "@/app/company/components/CompanyFeedFeatured";
import CompanyFeedListSection from "@/app/company/components/CompanyFeedListSection";
import CompanyFeedTitle from "@/app/company/components/CompanyFeedTitle";
import type { CompanyFeedListItem } from "@/app/company/data/companyFeedContent";
import {
  ARTICLES_LIST_SIZE,
  ARTICLES_STATUS_WHERE,
  articlesDetailHref,
  toArticlesCard,
  type ArticlesRow,
} from "@/app/company/data/articlesData";
import { useFeaturedFeed } from "@/hooks/useFeaturedFeed";
import { fetchData } from "@/lib/pageDataApi";
import "@/assets/css/company.css";

const FEATURED_FALLBACK_IMAGE = "/img/devices/product/list_no_data.svg";
const LIST_FALLBACK_IMAGE = "/img/devices/product/list_no_data.svg";

interface ArticlesFeaturedCard {
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
}

function toArticlesFeaturedCard(row: ArticlesRow): ArticlesFeaturedCard {
  const card = toArticlesCard(row);
  return {
    title: card.title,
    description: card.description,
    date: card.date,
    image: card.imageSrc ?? FEATURED_FALLBACK_IMAGE,
    href: articlesDetailHref(card.id, card.slug),
  };
}

export default function CompanyArticlesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageIndex, setPageIndex] = useState(() => {
    const fromUrl = Number.parseInt(searchParams.get("page") ?? "1", 10);
    return Number.isFinite(fromUrl) && fromUrl > 1 ? fromUrl - 1 : 0;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState<ArticlesRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest" | "az" | "za">("latest");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2025 + 1 },
    (_, i) => String(currentYear - i),
  );

  const { featured } = useFeaturedFeed<ArticlesFeaturedCard>({
    slug: "articles-data",
    where: ARTICLES_STATUS_WHERE,
    sort: "createdAt,desc",
    toCard: toArticlesFeaturedCard,
  });

  useEffect(() => {
    let alive = true;
    fetchData({
      slug: "articles-data",
      page: pageIndex,
      size: ARTICLES_LIST_SIZE,
      where: {
        ...ARTICLES_STATUS_WHERE,
        ...(search ? { "title|content": search } : {}),
        ...(month ? { month_publish_dttm: month } : {}),
        ...(year ? { year_publish_dttm: year } : {}),
      },
      sort:
        sort === "oldest"
          ? "createdAt,asc"
          : sort === "az"
            ? "articles.title,asc"
            : sort === "za"
              ? "articles.title,desc"
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
  }, [pageIndex, search, sort, month, year]);

  const listItems = useMemo<CompanyFeedListItem[]>(
    () =>
      rows.map((row) => {
        const card = toArticlesCard(row);
        return {
          id: String(card.id),
          title: card.title,
          date: card.date,
          image: card.imageSrc ?? LIST_FALLBACK_IMAGE,
          href: articlesDetailHref(card.id, card.slug, pageIndex + 1),
        };
      }),
    [rows, pageIndex],
  );

  const syncPageParam = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page > 1) {
        params.set("page", String(page));
      } else {
        params.delete("page");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const goToPage = useCallback(
    (page: number) => {
      const nextIndex = Math.max(0, page - 1);
      setPageIndex(nextIndex);
      syncPageParam(nextIndex + 1);
    },
    [syncPageParam],
  );

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleSearchSubmit = (value: string) => {
    setSearch(value);
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
    <main className="company-page company-page--articles" id="Page_company_articles">
      <CompanyFeedTitle variant="articles" />
      {featured ? (
        <CompanyFeedFeatured
          variant="articles"
          title={featured.title}
          description={featured.description}
          date={featured.date}
          image={featured.image}
          href={featured.href}
        />
      ) : null}
      <CompanyFeedListSection
        variant="articles"
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
