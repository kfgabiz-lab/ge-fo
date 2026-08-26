import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { mediaArticleDetailHero } from "@/app/company/data/mediaArticleDetailContent";
import {
  ARTICLES_STATUS_WHERE,
  articlesDetailHref,
  articlesImageSrc,
} from "@/app/company/data/articlesData";
import { fetchData } from "@/lib/pageDataApi";
import { buildPageDataSeoMetadata } from "@/lib/pageDataSeo";
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField, seoSlug } from "@/lib/pageData";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { getPreviewToken } from "@/lib/previewMode";
import { isNumericId } from "@/lib/isNumericId";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { buildContentDetailGraph } from "@/lib/structuredData/contentGraph";
import "@/assets/css/company.css";

type CompanyArticlesDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: CompanyArticlesDetailPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  if (!isNumericId(id)) notFound();
  const previewToken = await getPreviewToken("articles-data", id);

  return buildPageDataSeoMetadata(
    {
      slug: "articles-data",
      id,
      where: previewToken ? { previewToken } : { ...ARTICLES_STATUS_WHERE },
    },
    parent,
  );
}

export default async function CompanyArticlesDetailPage({
  params,
}: CompanyArticlesDetailPageProps) {
  const { id } = await params;
  if (!isNumericId(id)) notFound();
  const previewToken = await getPreviewToken("articles-data", id);
  const preview = previewToken !== null;

  const [detail, adjacent] = await Promise.all([
    fetchData({
      slug: "articles-data",
      id,
      where: previewToken ? { previewToken } : { ...ARTICLES_STATUS_WHERE },
      리턴함수: (x) => x,
    }),
    fetchData({
      slug: "articles-data",
      id,
      adjacent: true,
      sortField: "createdAt",
      titleField: "articles.title",
      slugField: "seo.slug",
      where: { ...ARTICLES_STATUS_WHERE },
    }),
  ]);

  const row: Record<string, unknown> = detail ? flattenPageDataItem(detail) : {};
  const contentHtml = sanitizeHtml((row.content as string) ?? "");

  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: articlesImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : mediaArticleDetailHero;

  const prev = adjacent.prev
    ? {
        href: articlesDetailHref(adjacent.prev.id, adjacent.prev.slug),
        title: adjacent.prev.title,
      }
    : undefined;
  const next = adjacent.next
    ? {
        href: articlesDetailHref(adjacent.next.id, adjacent.next.slug),
        title: adjacent.next.title,
      }
    : undefined;

  const jsonLdGraph = buildContentDetailGraph({
    postType: "Article",
    detailPathname: articlesDetailHref(id, seoSlug(row)),
    listPathname: "/company/articles",
    breadcrumbLabel: "Articles",
    title: (row.title as string) ?? "",
    metaDescription: (row["seo.meta_description"] as string) ?? "",
    contentHtml,
    publishedAt: (pickField(row, "publish_dttm", "publishDttm") as string) ?? "",
    updatedAt: (row.updatedAt as string) ?? "",
    imagePath: mediaId != null ? articlesImageSrc(mediaId) : null,
  });

  return (
    <>
      <JsonLd data={jsonLdGraph} />
      <CompanyArticleDetail
        variant="articles"
        pageId="Page_company_articles_detail"
        slug="articles-data"
        recordId={id}
        preview={preview}
        title={(row.title as string) ?? ""}
        date={formatDisplayDate((pickField(row, "publish_dttm", "publishDttm") as string) ?? "")}
        heroImage={heroImage}
        pagerAriaLabel="Media article navigation"
        prev={prev}
        next={next}
        listHref="/company/articles"
      >
        <div className={articleDetailClass("body")} data-slug="articles-data">
          <div
            data-slugkey="content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </CompanyArticleDetail>
    </>
  );
}
