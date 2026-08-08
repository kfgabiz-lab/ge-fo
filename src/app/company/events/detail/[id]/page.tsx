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

  return (
    <CompanyArticleDetail
      variant="events"
      pageId="Page_company_events_detail"
      slug="events-data"
      recordId={id}
      preview={preview}
      title={(row.title as string) ?? ""}
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
  );
}
