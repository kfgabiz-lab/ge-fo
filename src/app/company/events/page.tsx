import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import CompanyEventsPage from "@/app/company/components/CompanyEventsPage";
import {
  EVENTS_FALLBACK_IMAGE,
  eventsCalendarQuery,
  eventsDetailHref,
  eventsPastQuery,
  toCalendarMonths,
  toFeaturedItem,
} from "@/app/company/data/eventsData";
import { fetchData } from "@/lib/pageDataApi";
import { flattenPageDataItem, pickField } from "@/lib/pageData";
import { buildMenuSeoMetadata, fetchMenuMeta } from "@/lib/menuSeo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, buildPageGraph, crumbsFromBreadcrumbConfig, pageUrl } from "@/lib/structuredData/builders";
import { ORG_ID, WEBSITE_ID } from "@/lib/structuredData/siteConfig";

const PATHNAME = "/company/events";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return buildMenuSeoMetadata(PATHNAME, parent);
}

export default async function CompanyEventsListPage() {
  const [meta, res, calendarRes, pastRes] = await Promise.all([
    fetchMenuMeta(PATHNAME),
    fetchData({
      slug: "events-data",
      page: 0,
      size: 10,
      where: { exclude: "content" },
      sort: "events.period_from,desc",
      리턴함수: (rows) =>
        rows.map((raw) => {
          const row = flattenPageDataItem(raw);
          return {
            id: raw.id,
            slug: (row["seo.slug"] as string) || null,
            title: (row.title as string) ?? "",
            location: (row.location as string) ?? "",
            periodFrom: (pickField(row, "period_from", "periodFrom") as string) ?? "",
            periodTo: (pickField(row, "period_to", "periodTo") as string) ?? "",
          };
        }),
    }),
    fetchData({ ...eventsCalendarQuery(), 리턴함수: (rows) => rows }),
    fetchData(eventsPastQuery({ page: 0, sort: "latest", fallbackImage: EVENTS_FALLBACK_IMAGE })),
  ]);
  const calendarMonths = toCalendarMonths(calendarRes.content);
  const featuredItems = calendarRes.content
    .slice(0, 2)
    .map((row) => toFeaturedItem(row, EVENTS_FALLBACK_IMAGE));
  const currentUrl = pageUrl(PATHNAME);
  const graph = buildPageGraph([
    {
      "@type": "CollectionPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: meta.metaTitle,
      description: meta.metaDescription,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${currentUrl}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        "@id": `${currentUrl}#event-list`,
        itemListElement: res.content.map((item) => ({
          "@type": "ExhibitionEvent",
          "@id": `${pageUrl(eventsDetailHref(item.id, item.slug))}#event`,
          name: item.title,
          startDate: item.periodFrom,
          endDate: item.periodTo,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@type": "Place", name: item.location },
          performer: { "@id": ORG_ID },
          url: pageUrl(eventsDetailHref(item.id, item.slug)),
        })),
      },
    },
    breadcrumbList(currentUrl, crumbsFromBreadcrumbConfig(PATHNAME, currentUrl)),
  ]);
  return (
    <>
      <JsonLd data={graph} />
      <Suspense fallback={null}>
        <CompanyEventsPage
          initialFeaturedItems={featuredItems}
          initialCalendarMonths={calendarMonths}
          initialPastItems={pastRes.content}
          initialPastTotalPages={pastRes.totalPages}
        />
      </Suspense>
    </>
  );
}
