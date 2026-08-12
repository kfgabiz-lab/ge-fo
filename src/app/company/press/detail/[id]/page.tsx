import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { pressDetailHero } from "@/app/company/data/pressDetailContent";
import {
  PRESS_STATUS_WHERE,
  pressDetailHref,
  pressImageSrc,
} from "@/app/company/data/pressData";
import { fetchData } from "@/lib/pageDataApi";
import { buildPageDataSeoMetadata } from "@/lib/pageDataSeo";
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField } from "@/lib/pageData";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { getPreviewToken } from "@/lib/previewMode";
import type { Metadata, ResolvingMetadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildContentDetailGraph } from "@/lib/structuredData/contentGraph";
import "@/assets/css/company.css";

type CompanyPressDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: CompanyPressDetailPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const previewToken = await getPreviewToken("press-data", id);
  const preview = previewToken !== null;

  return buildPageDataSeoMetadata(
    {
      slug: "press-data",
      id,
      where: previewToken ? { previewToken } : { ...PRESS_STATUS_WHERE },
    },
    parent,
  );
}

export default async function CompanyPressDetailPage({
  params,
}: CompanyPressDetailPageProps) {
  const { id } = await params;
  const previewToken = await getPreviewToken("press-data", id);
  const preview = previewToken !== null;

  const [detail, adjacent] = await Promise.all([
    fetchData({
      slug: "press-data",
      id,
      where: previewToken ? { previewToken } : { ...PRESS_STATUS_WHERE },
      리턴함수: (x) => x,
    }),
    fetchData({
      slug: "press-data",
      id,
      adjacent: true,
      sortField: "createdAt",
      titleField: "press.title",
      where: { ...PRESS_STATUS_WHERE },
    }),
  ]);

  const row: Record<string, unknown> = detail ? flattenPageDataItem(detail) : {};
  const contentHtml = sanitizeHtml((row.content as string) ?? "");

  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: pressImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : pressDetailHero;

  const prev = adjacent.prev
    ? { href: pressDetailHref(adjacent.prev.id), title: adjacent.prev.title }
    : undefined;
  const next = adjacent.next
    ? { href: pressDetailHref(adjacent.next.id), title: adjacent.next.title }
    : undefined;

  const jsonLdGraph = buildContentDetailGraph({
    postType: "NewsArticle",
    detailPathname: `/company/press/detail/${id}`,
    listPathname: "/company/press",
    breadcrumbLabel: "Press",
    title: (row.title as string) ?? "",
    metaDescription: (row["seo.meta_description"] as string) ?? "",
    contentHtml,
    publishedAt: (pickField(row, "publish_dttm", "publishDttm") as string) ?? "",
    updatedAt: (row.updatedAt as string) ?? "",
    imagePath: mediaId != null ? pressImageSrc(mediaId) : null,
  });

  return (
    <>
      <JsonLd data={jsonLdGraph} />
      <CompanyArticleDetail
        variant="press"
        pageId="Page_company_press_detail"
        slug="press-data"
        recordId={id}
        preview={preview}
        title={(row.title as string) ?? ""}
        date={formatDisplayDate((pickField(row, "publish_dttm", "publishDttm") as string) ?? "")}
        heroImage={heroImage}
        pagerAriaLabel="Press post navigation"
        prev={prev}
        next={next}
        listHref="/company/press"
      >
        <div className={articleDetailClass("body")} data-slug="press-data">
          <div
            data-slugkey="content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </CompanyArticleDetail>
    </>
  );
}
