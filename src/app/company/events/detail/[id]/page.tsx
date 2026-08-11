import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { eventsDetailHero } from "@/app/company/data/eventsDetailContent";
import {
  eventsAdjacentQuery,
  eventsDetailHref,
  eventsDetailQuery,
  eventsImageSrc,
} from "@/app/company/data/eventsData";
import { fetchData } from "@/lib/pageDataApi";
import { buildPageDataSeoMetadata } from "@/lib/pageDataSeo";
import { formatDisplayDateRange } from "@/lib/formatDate";
import { flattenPageDataItem, pickField } from "@/lib/pageData";
import { getPreviewToken } from "@/lib/previewMode";
import type { Metadata, ResolvingMetadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, pageUrl } from "@/lib/structuredData/builders";
import { SITE_URL, WEBSITE_ID } from "@/lib/structuredData/siteConfig";
import "@/assets/css/company.css";

type CompanyEventsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: CompanyEventsDetailPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const previewToken = await getPreviewToken("events-data", id);

  return buildPageDataSeoMetadata(eventsDetailQuery(id, { previewToken }), parent);
}

export default async function CompanyEventsDetailPage({
  params,
}: CompanyEventsDetailPageProps) {
  const { id } = await params;
  const previewToken = await getPreviewToken("events-data", id);
  const preview = previewToken !== null;

  const [detail, adjacent] = await Promise.all([
    fetchData(eventsDetailQuery(id, { previewToken })),
    fetchData(eventsAdjacentQuery(id)),
  ]);

  const row: Record<string, unknown> = detail ? flattenPageDataItem(detail) : {};
  const contentHtml = (row.content as string) ?? "";
  const periodFrom = (pickField(row, "period_from", "periodFrom") as string) ?? "";
  const periodTo = (pickField(row, "period_to", "periodTo") as string) ?? "";

  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: eventsImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : eventsDetailHero;

  const prev = adjacent.prev
    ? { href: eventsDetailHref(adjacent.prev.id), title: adjacent.prev.title }
    : undefined;
  const next = adjacent.next
    ? { href: eventsDetailHref(adjacent.next.id), title: adjacent.next.title }
    : undefined;

  const currentUrl = pageUrl(`/company/events/detail/${id}`);
  const title = (row.title as string) ?? "";
  const eventNode = {
    "@type": "ExhibitionEvent",
    "@id": `${currentUrl}#event`,
    name: title,
    startDate: periodFrom,
    endDate: periodTo,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      "@id": `${currentUrl}#event-location`,
      name: (row.location as string) ?? "",
    },
    performer: { "@id": `${SITE_URL}#organization` },
    url: currentUrl,
    ...(mediaId != null
      ? {
          image: {
            "@type": "ImageObject",
            "@id": "#event-image",
            url: pageUrl(eventsImageSrc(mediaId)),
          },
        }
      : {}),
  };
  const jsonLdGraph = buildPageGraph([
    {
      "@type": "WebPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: (row["seo.meta_title"] as string) || title,
      description: (row["seo.meta_description"] as string) ?? "",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: { "@id": `${currentUrl}#event` },
    },
    eventNode,
    breadcrumbList(currentUrl, [
      { name: "Company", url: `${SITE_URL}#company` },
      { name: "Events", url: pageUrl("/company/events") },
      { name: title, url: currentUrl },
    ]),
  ]);

  return (
    <>
      <JsonLd data={jsonLdGraph} />
      <CompanyArticleDetail
        variant="events"
        pageId="Page_company_events_detail"
        slug="events-data"
        recordId={id}
        preview={preview}
        title={title}
        eventsMeta={{
          venue: (row.location as string) ?? "",
          dates: formatDisplayDateRange(periodFrom, periodTo),
        }}
        heroImage={heroImage}
        pagerAriaLabel="Events post navigation"
        prev={prev}
        next={next}
        listHref="/company/events"
      >
        <div className={articleDetailClass("body")} data-slug="events-data">
          <div
            data-slugkey="content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </CompanyArticleDetail>
    </>
  );
}
