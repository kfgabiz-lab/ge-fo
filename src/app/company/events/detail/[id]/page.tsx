import { notFound } from "next/navigation";
import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { eventsDetailHero } from "@/app/company/data/eventsDetailContent";
import {
  fetchEventsAdjacent,
  fetchEventsDetail,
  eventsDetailHref,
  eventsImageSrc,
} from "@/app/company/data/eventsData";
import { flattenPageDataItem, pickField } from "@/lib/pageData";
import "@/assets/css/company.css";

type CompanyEventsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyEventsDetailPage({
  params,
}: CompanyEventsDetailPageProps) {
  const { id } = await params;

  // 상세 단건 + 인접 이벤트(이전/다음) 병렬 조회(wall-clock 1 round-trip)
  // - pager는 신규 adjacent 엔드포인트가 이웃을 직접 반환(FE Past 목록 index 계산 폐기)
  // - 상세 게이트(공개만)와 인접 스코프 게이트(공개+과거)가 다름은 eventsData.ts 각 함수에서 처리
  const [detail, adjacent] = await Promise.all([
    fetchEventsDetail(id),
    fetchEventsAdjacent(id),
  ]);

  // 존재하지 않거나 비공개/미게시 이벤트면 404
  if (!detail) {
    notFound();
  }

  // flattenPageDataItem: eventsForm/seo 섹션 간 키 충돌 없음 → title/content/location/period_from/period_to가 root로 flat 병합됨
  const row = flattenPageDataItem(detail);
  const contentHtml = (row.content as string) ?? "";
  // 신규(period_from/period_to)/구(periodFrom/periodTo) 스키마 모두 지원 — 신규 우선
  const periodFrom = (pickField(row, "period_from", "periodFrom") as string) ?? "";
  const periodTo = (pickField(row, "period_to", "periodTo") as string) ?? "";

  // hero 이미지: eventsForm.image[0] → page-files, 미등록 시 정적 폴백(별도 heroImage 필드 없음)
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: eventsImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : eventsDetailHero;

  // pager: adjacent 엔드포인트 응답 {prev, next}(id/title)를 그대로 매핑, id→상세 href 변환만 수행
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
          data-slugkey="content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </CompanyArticleDetail>
  );
}
