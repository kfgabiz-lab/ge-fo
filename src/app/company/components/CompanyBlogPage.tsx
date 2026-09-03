"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CompanyFeedEmpty from "@/app/company/components/CompanyFeedEmpty";
import CompanyBlogListToolbar from "@/app/company/components/CompanyBlogListToolbar";
import { blogHeroBgImage } from "@/app/company/data/blogListContent";
import {
  BLOG_LIST_SIZE,
  BLOG_STATUS_WHERE,
  blogDetailHref,
  fetchBlogCategories,
  toBlogCard,
  toCategoryMap,
  type BlogCardItem,
  type BlogRow,
  type CodeItem,
} from "@/app/company/data/blogData";
import { useListPageMemory } from "@/app/company/useListPageMemory";
import { useFeaturedFeed } from "@/hooks/useFeaturedFeed";
import { fetchData } from "@/lib/pageDataApi";
import { handleImageFallback } from "@/lib/imageFallback";
import PageNumbering from "@/components/pagination/PageNumbering";
import HashtagLink from "@/components/ui/HashtagLink";
import {
  renderInlineTextHighlight,
  renderTitleTextHighlight,
} from "@/app/search/components/renderSearchTextHighlight";
import "@/assets/css/company.css";

const LIST_FALLBACK_IMAGE = "/img/devices/product/list_no_data.svg";

type CompanyBlogPageProps = {
  empty?: boolean;
  pageId?: string;
  initialRows?: BlogRow[];
  initialTotalPages?: number;
  initialCategories?: CodeItem[];
};

export default function CompanyBlogPage({
  empty = false,
  pageId = "Page_company_blog",
  initialRows = [],
  initialTotalPages = 1,
  initialCategories = [],
}: CompanyBlogPageProps) {
  const [categories, setCategories] = useState<CodeItem[]>(initialCategories);
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(
    toCategoryMap(initialCategories),
  );
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [rows, setRows] = useState<BlogRow[]>(initialRows);
  const [loaded, setLoaded] = useState(initialRows.length > 0);
  const { pageIndex, setPageIndex, goToPage, search, submitSearch, filters, updateFilters } =
    useListPageMemory("blog", "/company/blog");
  const categoryCode = filters.categoryCode ?? "";
  const sort = (filters.sort as "latest" | "oldest" | "az" | "za" | undefined) ?? "latest";

  useEffect(() => {
    if (initialCategories.length > 0) return;
    let alive = true;
    fetchBlogCategories()
      .then((codes) => {
        if (!alive) return;
        setCategories(codes ?? []);
        setCategoryMap(toCategoryMap(codes ?? []));
      })
      .catch(() => {
      });
    return () => {
      alive = false;
    };
  }, []);

  const toFeaturedCard = useCallback(
    (row: BlogRow) => toBlogCard(row, categoryMap),
    [categoryMap],
  );

  const { featured } = useFeaturedFeed<BlogCardItem>({
    slug: "blog-data",
    where: BLOG_STATUS_WHERE,
    sort: "blog.publish_dttm,desc",
    toCard: toFeaturedCard,
  });

  const skipInitialFetch = useRef(
    initialRows.length > 0 && pageIndex === 0 && !categoryCode && !search && sort === "latest",
  );

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    let alive = true;
    fetchData({
      slug: "blog-data",
      page: pageIndex,
      size: BLOG_LIST_SIZE,
      where: {
        ...BLOG_STATUS_WHERE,
        ...(categoryCode ? { "eq_blog.category": categoryCode } : {}),
        ...(search ? { "title|content|hashtag": search } : {}),
      },
      sort:
        sort === "oldest"
          ? "blog.publish_dttm,asc"
          : sort === "az"
            ? "blog.title,asc"
            : sort === "za"
              ? "blog.title,desc"
              : "blog.publish_dttm,desc",
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
  }, [categoryCode, search, sort, pageIndex]);

  const listItems = useMemo(
    () => rows.map((row) => toBlogCard(row, categoryMap)),
    [rows, categoryMap],
  );

  const handleCategoryChange = (code: string) => {
    updateFilters({ categoryCode: code });
    goToPage(1);
  };

  const handleSearchSubmit = (value: string) => {
    submitSearch(value);
    goToPage(1);
  };

  const handleViewAllClick = () => {
    // Clear search and reset category/sort filters so "View All" shows full list
    updateFilters({ categoryCode: "", sort: "latest" });
    setPageIndex(0);
    handleSearchSubmit("");
  };

  const handleSortChange = (value: "latest" | "oldest" | "az" | "za") => {
    updateFilters({ sort: value });
    goToPage(1);
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const showEmpty = empty || (loaded && rows.length === 0);

  const listSectionClass = showEmpty
    ? "company-blog-list company-blog-list--no-data"
    : "company-blog-list";

  const highlight = search.trim() || undefined;

  return (
    <main className="company-page company-page--blog" id={pageId}>
      <section className="company-blog-title">
        <div className="inner">
          <h1 className="company-blog-title__heading">Blog</h1>
          <p className="company-blog-title__desc">
            Your Knowledge Hub for Electrical Innovation
          </p>
        </div>
      </section>

      <section className="company-blog-top">
        <img src={blogHeroBgImage} alt="" className="company-blog-top__bg" />
        <div className="inner">
          {featured ? (
            <div className="company-blog-featured__card" data-slug="blog-data">
              <Link
                href={blogDetailHref(featured.id, featured.slug)}
                className="company-blog-featured__image"
                data-slugkey="id"
                data-slugkey-attr="href"
                prefetch={false}
              >
                <img
                  src={featured.imageSrc ?? LIST_FALLBACK_IMAGE}
                  alt={featured.title}
                  data-slugkey="image"
                  data-slugkey-attr="src"
                  onError={handleImageFallback}
                />
              </Link>
              <div className="company-blog-featured__content">
                <Link
                  href={blogDetailHref(featured.id, featured.slug)}
                  className="company-blog-featured__text"
                  data-slugkey="id"
                  data-slugkey-attr="href"
                  prefetch={false}
                >
                  <p className="company-blog-featured__category" data-slugkey="category">
                    {featured.categoryLabel}
                  </p>
                  <h2 className="company-blog-featured__title" data-slugkey="title">
                    {renderTitleTextHighlight(
                      featured.title,
                      highlight,
                      "company-blog-featured__mark",
                    )}
                  </h2>
                  <p className="company-blog-featured__desc" data-slugkey="description">
                    {featured.description}
                  </p>
                  <p className="company-blog-featured__date" data-slugkey="date">
                    {featured.date}
                  </p>
                </Link>
                <div className="company-blog-featured__tags" data-slugkey="tags">
                  {featured.tags.map((tag, tagIndex) => (
                    <HashtagLink
                      key={`${tag}-${tagIndex}`}
                      tag={tag}
                      className="company-blog-featured__tag"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className={listSectionClass}>
        <div className="inner">
          <CompanyBlogListToolbar
            categories={categories}
            selectedCategory={categoryCode}
            onCategoryChange={handleCategoryChange}
            searchValue={search}
            onSearchSubmit={handleSearchSubmit}
            sortValue={sort}
            onSortChange={handleSortChange}
          />

          <div className="company-blog-list__body">
            {showEmpty ? (
              <CompanyFeedEmpty variant="blog" onViewAllClick={handleViewAllClick}/>
            ) : (
              <>
                <ul
                  className="company-blog-list__items"
                  data-slug="blog-data"
                  data-slug-repeat="true"
                >
                  {listItems.map((item) => (
                    <li
                      key={item.id}
                      className="company-blog-list__item"
                      data-slug-item
                    >
                      <div className="company-blog-list__content-wrap">
                        <div className="company-blog-list__link">
                          <div className="company-blog-list__image">
                            <Link
                              href={blogDetailHref(item.id, item.slug)}
                              aria-label={item.title}
                              data-slugkey="id"
                              data-slugkey-attr="href"
                              prefetch={false}
                            >
                              <img
                                src={item.imageSrc ?? LIST_FALLBACK_IMAGE}
                                alt={item.title}
                                data-slugkey="image"
                                data-slugkey-attr="src"
                                onError={handleImageFallback}
                              />
                            </Link>
                          </div>
                          <div className="company-blog-list__content">
                            <Link
                              href={blogDetailHref(item.id, item.slug)}
                              className="company-blog-list__content-link"
                              data-slugkey="id"
                              data-slugkey-attr="href"
                              prefetch={false}
                            >
                              <p className="company-blog__category" data-slugkey="category">
                                {item.categoryLabel}
                              </p>
                              <h3 className="company-blog-list__title" data-slugkey="title">
                                {renderTitleTextHighlight(
                                  item.title,
                                  highlight,
                                  "company-blog__mark",
                                )}
                              </h3>
                              <p className="company-blog-list__desc" data-slugkey="description">
                                {highlight
                                  ? renderInlineTextHighlight(
                                      item.description,
                                      highlight,
                                      "company-blog__desc-mark",
                                    )
                                  : item.description}
                              </p>
                              <p className="company-blog__date" data-slugkey="date">
                                {item.date}
                              </p>
                            </Link>
                            {item.tags.length > 0 ? (
                              <div className="company-blog-list__tags-row">
                                <div className="company-blog__tags" data-slugkey="tags">
                                  {item.tags.map((tag, tagIndex) => (
                                    <HashtagLink
                                      key={`${item.id}-${tag}-${tagIndex}`}
                                      tag={tag}
                                      className="company-blog__tag"
                                      highlight={highlight}
                                      markClassName="company-blog__mark"
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {totalPages > 1 ? (
                  <PageNumbering
                    className="company-blog-list__pagination"
                    currentPage={pageIndex + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    ariaLabel="Blog pagination"
                  />
                ) : null}
              </>
            )}
          </div>

          {showEmpty ? (
            <div className="company-blog-list__divider" aria-hidden="true" />
          ) : null}
        </div>
      </section>
    </main>
  );
}
