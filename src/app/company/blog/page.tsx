import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import CompanyBlogPage from "@/app/company/components/CompanyBlogPage";
import {
  BLOG_LIST_SIZE,
  BLOG_STATUS_WHERE,
  blogDetailHref,
  fetchBlogCategories,
  toBlogCard,
  toCategoryMap,
} from "@/app/company/data/blogData";
import { fetchData } from "@/lib/pageDataApi";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl } from "@/lib/structuredData/builders";
import { WEBSITE_ID } from "@/lib/structuredData/siteConfig";

const PATHNAME = "/company/blog";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyBlogListPage() {
  const [meta, categories] = await Promise.all([fetchMenuMeta(PATHNAME), fetchBlogCategories()]);
  const categoryMap = toCategoryMap(categories);
  const res = await fetchData({
    slug: "blog-data",
    page: 0,
    size: BLOG_LIST_SIZE,
    where: BLOG_STATUS_WHERE,
    sort: "createdAt,desc",
    리턴함수: (rows) => rows.map((row) => toBlogCard(row, categoryMap)),
  });
  const currentUrl = pageUrl(PATHNAME);
  const graph = buildPageGraph([
    {
      "@type": "Blog",
      "@id": `${currentUrl}#blog`,
      url: currentUrl,
      name: meta.metaTitle,
      description: meta.metaDescription,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      blogPost: res.content.map((item, index) => ({
        "@type": "BlogPosting",
        "@id": `${pageUrl(blogDetailHref(item.id, item.slug))}#post`,
        headline: item.title,
        description: item.description,
        datePublished: item.rawDate,
        articleSection: item.categoryLabel,
        keywords: item.tags,
        url: pageUrl(blogDetailHref(item.id, item.slug)),
        position: index + 1,
      })),
    },
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(PATHNAME, currentUrl)),
  ]);
  return (
    <>
      <JsonLd data={graph} />
      <Suspense fallback={null}>
        <CompanyBlogPage />
      </Suspense>
    </>
  );
}
