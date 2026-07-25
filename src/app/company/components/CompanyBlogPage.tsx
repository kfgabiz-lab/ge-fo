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
  BLOG_LIST_SIZE,
  BLOG_STATUS_WHERE,
  blogDetailHref,
  fetchBlogCategories,
  toBlogCard,
  toCategoryMap,
  type BlogRow,
  type CodeItem,
} from "@/app/company/data/blogData";
import { fetchData } from "@/lib/pageDataApi";
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
  // 목록 조회 1회 이상 완료 여부 — 초기 렌더(rows=[])에서 "결과 없음"이 깜빡이는 것 방지
  const [loaded, setLoaded] = useState(false);
  // Featured(목록 1번째 글) — page 0 조회 때만 갱신하여 페이지 이동 시 고정
  const [featuredRow, setFeaturedRow] = useState<BlogRow | null>(null);
  // 툴바(검색/정렬) 상태 — 설계문서 9절 B/C
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest" | "az" | "za">("latest");

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

  // 목록 조회: 카테고리/검색/정렬/페이지 변경 시
  // - 리턴함수=identity로 raw BlogRow[]를 그대로 받아 categoryMap 비동기 로드 반응성을 보존(toBlogCard useMemo가 처리)
  useEffect(() => {
    let alive = true;
    fetchData({
      slug: "blog-data",
      page: pageIndex,
      size: BLOG_LIST_SIZE,
      // Featured/리스트 카드 설명(description)을 본문(content)에서 추출하므로 content 필드는 응답에 포함되어야 함(exclude 미사용)
      where: {
        ...BLOG_STATUS_WHERE,
        // contentKey blogForm→blog. dot-notation eq_는 래퍼키 정확일치 필요
        ...(categoryCode ? { "eq_blog.category": categoryCode } : {}),
        ...(search ? { "title|content": search } : {}),
      },
      // 정렬 분기(latest=미지정은 sort 생략하여 BE 기본 created_at DESC 유지)
      sort:
        sort === "oldest"
          ? "createdAt,asc"
          : sort === "az"
            ? "blog.title,asc"
            : sort === "za"
              ? "blog.title,desc"
              : undefined,
      리턴함수: (rows) => rows,
    })
      .then((res) => {
        if (!alive) return;
        setRows(res.content);
        setTotalPages(res.totalPages || 1);
        // Featured 는 정렬된 목록의 1번째 글(page 0 조회 때만 갱신)
        if (pageIndex === 0) {
          setFeaturedRow(res.content[0] ?? null);
        }
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

  // 검색/정렬 변경 시 첫 페이지로 이동 후 재조회(카테고리와 동일 패턴)
  const handleSearchSubmit = (value: string) => {
    setSearch(value);
    setPageIndex(0);
  };
  const handleSortChange = (value: "latest" | "oldest" | "az" | "za") => {
    setSort(value);
    setPageIndex(0);
  };

  // PageNumbering(1-based) → API(0-based)
  const handlePageChange = (page: number) => {
    setPageIndex(Math.max(0, page - 1));
  };

  // 조회 완료 후 결과 0건이면 "검색 결과 없음"(CompanyFeedEmpty) 표시.
  // (Featured가 목록 1번째 글이라 rows 기준 — rows>0이면 Featured가 렌더되므로 결과 없음이 아님)
  // empty prop이 명시적으로 true면 그대로 우선(정적 no-data 화면 용도 유지)
  const showEmpty = empty || (loaded && rows.length === 0);

  const listSectionClass = showEmpty
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
              data-slugkey="id"
              data-slugkey-attr="href"
              prefetch={false}
            >
              <div className="company-blog-featured__image">
                <img
                  src={featured.imageSrc ?? blogHeroMainImage}
                  alt={featured.title}
                  data-slugkey="image"
                  data-slugkey-attr="src"
                />
              </div>
              <div className="company-blog-featured__content">
                <p className="company-blog-featured__category" data-slugkey="category">
                  {featured.categoryLabel}
                </p>
                <h2 className="company-blog-featured__title" data-slugkey="title">
                  {featured.title}
                </h2>
                <p className="company-blog-featured__desc" data-slugkey="description">
                  {featured.description}
                </p>
                <p className="company-blog-featured__date" data-slugkey="date">
                  {featured.date}
                </p>
                {/* tags: 해시태그 배열 필드 */}
                <div className="company-blog-featured__tags" data-slugkey="tags">
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
            searchValue={search}
            onSearchSubmit={handleSearchSubmit}
            sortValue={sort}
            onSortChange={handleSortChange}
          />

          <div className="company-blog-list__body">
            {showEmpty ? (
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
                              data-slugkey="id"
                              data-slugkey-attr="href"
                              prefetch={false}
                            >
                              <img
                                src={item.imageSrc ?? LIST_FALLBACK_IMAGE}
                                alt={item.title}
                                data-slugkey="image"
                                data-slugkey-attr="src"
                              />
                            </Link>
                          </div>
                          <Link
                            href={blogDetailHref(item.id)}
                            className="company-blog-list__content"
                            data-slugkey="id"
                            data-slugkey-attr="href"
                            prefetch={false}
                          >
                            <p className="company-blog__category" data-slugkey="category">
                              {item.categoryLabel}
                            </p>
                            <h3 className="company-blog-list__title" data-slugkey="title">
                              {item.title}
                            </h3>
                            <p className="company-blog-list__desc" data-slugkey="description">
                              {item.description}
                            </p>
                            <p className="company-blog__date" data-slugkey="date">
                              {item.date}
                            </p>
                            <div className="company-blog-list__tags-row">
                              {/* tags: 해시태그 배열 필드 */}
                              <div className="company-blog__tags" data-slugkey="tags">
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

          {showEmpty ? (
            <div className="company-blog-list__divider" aria-hidden="true" />
          ) : null}
        </div>
      </section>
    </main>
  );
}
