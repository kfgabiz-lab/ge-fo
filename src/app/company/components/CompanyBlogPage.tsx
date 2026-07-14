"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CompanyFeedEmpty from "@/app/company/components/CompanyFeedEmpty";
import CompanyBlogListToolbar from "@/app/company/components/CompanyBlogListToolbar";
import {
  blogHeroBgImage,
  blogHeroMainImage,
} from "@/app/company/data/blogListContent";
import {
  blogDetailHref,
  fetchBlogCategories,
  fetchBlogList,
  toBlogCard,
  toCategoryMap,
  type BlogRow,
  type CodeItem,
} from "@/app/company/data/blogData";
import PageNumbering from "@/components/pagination/PageNumbering";
import "@/assets/css/company.css";

// 미디어 미등록 시 목록 카드 폴백 이미지
const LIST_FALLBACK_IMAGE = "/img/company/blog/list_01.jpg";

function BlogTag({ label }: { label: string }) {
  return <div className="company-blog__tag">{label}</div>;
}

type CompanyBlogPageProps = {
  empty?: boolean;
  pageId?: string;
};

export default function CompanyBlogPage({
  empty = false,
  pageId = "Page_company_blog",
}: CompanyBlogPageProps) {
  // 카테고리 코드→라벨 및 툴바 옵션(BLOGCATEGORY)
  const [categories, setCategories] = useState<CodeItem[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map());
  // 선택 카테고리 코드("" = 전체)
  const [categoryCode, setCategoryCode] = useState("");
  // 현재 페이지(0-based, API)
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // 현재 페이지 목록 원본
  const [rows, setRows] = useState<BlogRow[]>([]);
  // Featured(목록 1번째 글) — page 0 조회 때만 갱신하여 페이지 이동 시 고정
  const [featuredRow, setFeaturedRow] = useState<BlogRow | null>(null);

  // 카테고리 코드그룹 최초 1회 조회
  useEffect(() => {
    let alive = true;
    fetchBlogCategories()
      .then((codes) => {
        if (!alive) return;
        setCategories(codes ?? []);
        setCategoryMap(toCategoryMap(codes ?? []));
      })
      .catch(() => {
        // 실패 시 코드값 그대로 노출(라벨 변환 생략)
      });
    return () => {
      alive = false;
    };
  }, []);

  // 목록 조회: 카테고리/페이지 변경 시
  useEffect(() => {
    let alive = true;
    fetchBlogList({ page: pageIndex, category: categoryCode || undefined })
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
  }, [categoryCode, pageIndex]);

  // Featured 카드(단건)
  const featured = useMemo(
    () => (featuredRow ? toBlogCard(featuredRow, categoryMap) : null),
    [featuredRow, categoryMap],
  );

  // 리스트 카드(다건) — featured 로 쓴 항목 제외(정적 slice(1) 의도와 동일)
  const listItems = useMemo(
    () =>
      rows
        .filter((row) => row.id !== featuredRow?.id)
        .map((row) => toBlogCard(row, categoryMap)),
    [rows, featuredRow, categoryMap],
  );

  // 카테고리 변경 시 첫 페이지로 이동 후 재조회
  const handleCategoryChange = (code: string) => {
    setCategoryCode(code);
    setPageIndex(0);
  };

  // PageNumbering(1-based) → API(0-based)
  const handlePageChange = (page: number) => {
    setPageIndex(Math.max(0, page - 1));
  };

  const listSectionClass = empty
    ? "company-blog-list company-blog-list--no-data"
    : "company-blog-list";

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
          {/* data-slug: 블로그 단건(featured = 정렬된 목록의 1번째 글). 링크는 id 기반 동적 링크 */}
          {featured ? (
            <Link
              href={blogDetailHref(featured.id)}
              className="company-blog-featured__card"
              data-slug="blog-data"
              data-slugKey="id"
              data-slugKey-attr="href"
            >
              <div className="company-blog-featured__image">
                <img
                  src={featured.imageSrc ?? blogHeroMainImage}
                  alt={featured.title}
                  data-slugKey="image"
                  data-slugKey-attr="src"
                />
              </div>
              <div className="company-blog-featured__content">
                <p className="company-blog-featured__category" data-slugKey="category">
                  {featured.categoryLabel}
                </p>
                <h2 className="company-blog-featured__title" data-slugKey="title">
                  {featured.title}
                </h2>
                <p className="company-blog-featured__desc" data-slugKey="description">
                  {featured.description}
                </p>
                <p className="company-blog-featured__date" data-slugKey="date">
                  {featured.date}
                </p>
                {/* tags: 해시태그 배열 필드 */}
                <div className="company-blog-featured__tags" data-slugKey="tags">
                  {featured.tags.map((tag, tagIndex) => (
                    <div
                      key={`${tag}-${tagIndex}`}
                      className="company-blog-featured__tag"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <section className={listSectionClass}>
        <div className="inner">
          <CompanyBlogListToolbar
            categories={categories}
            selectedCategory={categoryCode}
            onCategoryChange={handleCategoryChange}
          />

          <div className="company-blog-list__body">
            {empty ? (
              <CompanyFeedEmpty variant="blog" />
            ) : (
              <>
                {/* data-slug: 블로그 다건 리스트 (동일 slug, 반복 렌더링). 링크는 id 기반 동적 링크 */}
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
                              href={blogDetailHref(item.id)}
                              aria-label={item.title}
                              data-slugKey="id"
                              data-slugKey-attr="href"
                            >
                              <img
                                src={item.imageSrc ?? LIST_FALLBACK_IMAGE}
                                alt={item.title}
                                data-slugKey="image"
                                data-slugKey-attr="src"
                              />
                            </Link>
                          </div>
                          <Link
                            href={blogDetailHref(item.id)}
                            className="company-blog-list__content"
                            data-slugKey="id"
                            data-slugKey-attr="href"
                          >
                            <p className="company-blog__category" data-slugKey="category">
                              {item.categoryLabel}
                            </p>
                            <h3 className="company-blog-list__title" data-slugKey="title">
                              {item.title}
                            </h3>
                            <p className="company-blog-list__desc" data-slugKey="description">
                              {item.description}
                            </p>
                            <p className="company-blog__date" data-slugKey="date">
                              {item.date}
                            </p>
                            <div className="company-blog-list__tags-row">
                              {/* tags: 해시태그 배열 필드 */}
                              <div className="company-blog__tags" data-slugKey="tags">
                                {item.tags.map((tag, tagIndex) => (
                                  <BlogTag
                                    key={`${item.id}-${tag}-${tagIndex}`}
                                    label={tag}
                                  />
                                ))}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <PageNumbering
                  className="company-blog-list__pagination"
                  currentPage={pageIndex + 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  ariaLabel="Blog pagination"
                />
              </>
            )}
          </div>

          {empty ? (
            <div className="company-blog-list__divider" aria-hidden="true" />
          ) : null}
        </div>
      </section>
    </main>
  );
}
