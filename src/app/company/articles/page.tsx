"use client";

import { useEffect, useMemo, useState } from "react";
import CompanyFeedFeatured from "@/app/company/components/CompanyFeedFeatured";
import CompanyFeedListSection from "@/app/company/components/CompanyFeedListSection";
import CompanyFeedTitle from "@/app/company/components/CompanyFeedTitle";
import type { CompanyFeedListItem } from "@/app/company/data/companyFeedContent";
import {
  fetchArticlesList,
  articlesDetailHref,
  toArticlesCard,
  type ArticlesRow,
} from "@/app/company/data/articlesData";
import "@/assets/css/company.css";

// 미디어 미등록 시 폴백 이미지(퍼블리싱 정적 이미지 재사용)
const FEATURED_FALLBACK_IMAGE = "/img/company/articles/hero.png";
const LIST_FALLBACK_IMAGE = "/img/company/articles/list_01.png";

// Articles 목록: articles-data slug 실데이터 연동(공용 CompanyFeed 컴포넌트 재사용, press와 동일 패턴)
// - Featured = 정렬된 목록의 1번째 글, 리스트는 featured 제외
// - 카테고리 필터 없음(articles-data엔 category 필드 자체가 없음, press와 동일)
export default function CompanyArticlesListPage() {
  // 현재 페이지(0-based, API)
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // 현재 페이지 목록 원본
  const [rows, setRows] = useState<ArticlesRow[]>([]);
  // Featured(목록 1번째 글) — page 0 조회 때만 갱신하여 페이지 이동 시 고정
  const [featuredRow, setFeaturedRow] = useState<ArticlesRow | null>(null);
  // 툴바(검색/정렬/월/연도) 상태 — articles-data.md 4절 B/C/D
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // 연도 필터 옵션: 2025 ~ 올해(내림차순) — "use client"라 런타임 계산 안전
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2025 + 1 },
    (_, i) => String(currentYear - i),
  );

  // 목록 조회: 페이지/검색/정렬/월/연도 변경 시
  useEffect(() => {
    let alive = true;
    fetchArticlesList({
      page: pageIndex,
      search: search || undefined,
      sort,
      month: month || undefined,
      year: year || undefined,
    })
      .then((res) => {
        if (!alive) return;
        setRows(res.rows);
        setTotalPages(res.totalPages || 1);
        // Featured 는 정렬된 목록의 1번째 글(page 0 조회 때만 갱신)
        if (pageIndex === 0) {
          setFeaturedRow(res.rows[0] ?? null);
        }
      })
      .catch(() => {
        if (alive) setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [pageIndex, search, sort, month, year]);

  // Featured 카드(단건) → CompanyFeedFeatured props 형태로 가공
  const featured = useMemo(() => {
    if (!featuredRow) return null;
    const card = toArticlesCard(featuredRow);
    return {
      title: card.title,
      description: card.description,
      date: card.date,
      image: card.imageSrc ?? FEATURED_FALLBACK_IMAGE,
      href: articlesDetailHref(card.id),
    };
  }, [featuredRow]);

  // 리스트 카드(다건) → CompanyFeedListItem 형태로 가공(featured 로 쓴 항목 제외)
  const listItems = useMemo<CompanyFeedListItem[]>(
    () =>
      rows
        .filter((row) => row.id !== featuredRow?.id)
        .map((row) => {
          const card = toArticlesCard(row);
          return {
            id: String(card.id),
            title: card.title,
            date: card.date,
            image: card.imageSrc ?? LIST_FALLBACK_IMAGE,
            href: articlesDetailHref(card.id),
          };
        }),
    [rows, featuredRow],
  );

  // PageNumbering(1-based) → API(0-based)
  const handlePageChange = (page: number) => {
    setPageIndex(Math.max(0, page - 1));
  };

  // 검색/정렬/월/연도 변경 시 첫 페이지로 이동 후 재조회(press와 동일 패턴)
  const handleSearchSubmit = (value: string) => {
    setSearch(value);
    setPageIndex(0);
  };
  const handleSortChange = (value: "latest" | "oldest") => {
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
