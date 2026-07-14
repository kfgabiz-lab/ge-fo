import { notFound } from "next/navigation";
import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { eventsDetailHero } from "@/app/company/data/eventsDetailContent";
import {
  fetchEventsDetail,
  fetchEventsPast,
  eventsImageSrc,
} from "@/app/company/data/eventsData";
import { flattenPageDataItem } from "@/lib/pageData";
import "@/assets/css/company.css";

type CompanyEventsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyEventsDetailPage({
  params,
}: CompanyEventsDetailPageProps) {
  const { id } = await params;

  // 상세 단건 + pager 계산용 지난(Past) 목록 병렬 조회(정렬된 목록에서 인접 id 계산, press와 동일 패턴)
  const [detail, pastResult] = await Promise.all([
    fetchEventsDetail(id),
    fetchEventsPast({ page: 0, sort: "latest", fallbackImage: eventsDetailHero.src }),
  ]);

  // 존재하지 않거나 비공개/미게시 이벤트면 404
  if (!detail) {
    notFound();
  }

  // flattenPageDataItem: eventsForm/seo 섹션 간 키 충돌 없음 → title/content/location/period_from/period_to가 root로 flat 병합됨
  const row = flattenPageDataItem(detail);
  const contentHtml = (row.content as string) ?? "";
  const periodFrom = (row.period_from as string) ?? "";
  const periodTo = (row.period_to as string) ?? "";

  // hero 이미지: eventsForm.image[0] → page-files, 미등록 시 정적 폴백(별도 heroImage 필드 없음)
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: eventsImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : eventsDetailHero;

  // pager: Past 목록에서 현재 id 의 index 로 prev(index-1)/next(index+1) 계산(press와 동일 패턴)
  const rows = pastResult.items;
  const idx = rows.findIndex((r) => r.id === String(detail.id));
  const prevItem = idx > 0 ? rows[idx - 1] : null;
  const nextItem = idx >= 0 && idx < rows.length - 1 ? rows[idx + 1] : null;
  const prev = prevItem ? { href: prevItem.href, title: prevItem.title } : undefined;
  const next = nextItem ? { href: nextItem.href, title: nextItem.title } : undefined;

  return (
    <CompanyArticleDetail
      variant="events"
      pageId="Page_company_events_detail"
      title={(row.title as string) ?? ""}
      eventsMeta={{
        venue: (row.location as string) ?? "",
        dates: periodFrom && periodTo ? `${periodFrom}~ ${periodTo}` : periodFrom || periodTo,
      }}
      heroImage={heroImage}
      pagerAriaLabel="Events post navigation"
      prev={prev}
      next={next}
      listHref="/company/events"
    >
      {/* data-slug: events-data (목록·상세 통합 slug). 상세 본문은 리치텍스트 HTML 단일 필드 content로 태깅 */}
      {/* venue/dates 는 CompanyArticleDetail의 eventsMeta prop 으로 전달(공용 컴포넌트 내부 렌더). */}
      <div className={articleDetailClass("body")} data-slug="events-data">
        <div
          data-slugKey="content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </CompanyArticleDetail>
  );
}
