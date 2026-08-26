import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { blogDetailHero } from "@/app/company/data/blogDetailContent";
import {
  BLOG_STATUS_WHERE,
  blogDetailHref,
  blogImageSrc,
  fetchBlogCategories,
  splitHashtag,
  toCategoryMap,
} from "@/app/company/data/blogData";
import { fetchData } from "@/lib/pageDataApi";
import { buildPageDataSeoMetadata } from "@/lib/pageDataSeo";
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField, seoSlug } from "@/lib/pageData";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { getPreviewToken } from "@/lib/previewMode";
import { isNumericId } from "@/lib/isNumericId";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import HashtagLink from "@/components/ui/HashtagLink";
import JsonLd from "@/components/seo/JsonLd";
import { buildContentDetailGraph } from "@/lib/structuredData/contentGraph";
import "@/assets/css/company.css";

type CompanyBlogDetailPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export async function generateMetadata(
  { params }: CompanyBlogDetailPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  if (!isNumericId(id)) notFound();
  const previewToken = await getPreviewToken("blog-data", id);

  return buildPageDataSeoMetadata(
    {
      slug: "blog-data",
      id,
      where: previewToken ? { previewToken } : { ...BLOG_STATUS_WHERE },
    },
    parent,
  );
}

export default async function CompanyBlogDetailPage({
  params,
}: CompanyBlogDetailPageProps) {
  const { id } = await params;
  if (!isNumericId(id)) notFound();
  const previewToken = await getPreviewToken("blog-data", id);
  const preview = previewToken !== null;

  const [detail, categories, adjacent] = await Promise.all([
    fetchData({
      slug: "blog-data",
      id,
      where: previewToken ? { previewToken } : { ...BLOG_STATUS_WHERE },
      리턴함수: (x) => x,
    }),
    fetchBlogCategories(),
    fetchData({
      slug: "blog-data",
      id,
      adjacent: true,
      sortField: "blog.publish_dttm",
      titleField: "blog.title",
      slugField: "seo.slug",
      where: { ...BLOG_STATUS_WHERE },
    }),
  ]);

  const row: Record<string, unknown> = detail ? flattenPageDataItem(detail) : {};
  const categoryMap = toCategoryMap(categories);
  const categoryCode = (row.category as string) ?? "";
  const categoryLabel = categoryMap.get(categoryCode) ?? categoryCode;
  const tags = splitHashtag(row.hashtag as string | undefined);
  const contentHtml = sanitizeHtml((row.content as string) ?? "");

  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: blogImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : blogDetailHero;

  const prev = adjacent.prev
    ? {
        href: blogDetailHref(adjacent.prev.id, adjacent.prev.slug),
        title: adjacent.prev.title,
      }
    : undefined;
  const next = adjacent.next
    ? {
        href: blogDetailHref(adjacent.next.id, adjacent.next.slug),
        title: adjacent.next.title,
      }
    : undefined;

  const publishDttm = (pickField(row, "publish_dttm", "publishDttm") as string) ?? "";
  const jsonLdGraph = buildContentDetailGraph({
    postType: "BlogPosting",
    detailPathname: blogDetailHref(id, seoSlug(row)),
    listPathname: "/company/blog",
    breadcrumbLabel: "Blog",
    title: (row.title as string) ?? "",
    metaDescription: (row["seo.meta_description"] as string) ?? "",
    contentHtml,
    publishedAt: publishDttm,
    updatedAt: (row.updatedAt as string) ?? "",
    category: categoryLabel,
    tags,
    imagePath: mediaId != null ? blogImageSrc(mediaId) : null,
  });

  return (
    <>
      <JsonLd data={jsonLdGraph} />
      <CompanyArticleDetail
      variant="blog"
      pageId="Page_company_blog_detail"
      slug="blog-data"
      recordId={id}
      preview={preview}
      category={categoryLabel}
      title={(row.title as string) ?? ""}
      date={formatDisplayDate((pickField(row, "publish_dttm", "publishDttm") as string) ?? "")}
      heroImage={heroImage}
      pagerAriaLabel="Blog post navigation"
      prev={prev}
      next={next}
      listHref="/company/blog"
    >
      <div data-slug="blog-data">
        <div
          className={articleDetailClass("body")}
          data-slugkey="content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <div className={articleDetailClass("tags")} data-slugkey="tags">
          <div className="company-blog__tags">
            {tags.map((tag, tagIndex) => (
              <HashtagLink
                key={`${tag}-${tagIndex}`}
                tag={tag}
                className="company-blog__tag"
              />
            ))}
          </div>
        </div>
      </div>
    </CompanyArticleDetail>
    </>
  );
}
