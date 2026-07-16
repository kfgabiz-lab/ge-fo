import { notFound } from "next/navigation";
import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { pressDetailHero } from "@/app/company/data/pressDetailContent";
import {
  fetchPressDetail,
  fetchPressList,
  pressDetailHref,
  pressImageSrc,
} from "@/app/company/data/pressData";
import { flattenPageDataItem } from "@/lib/pageData";
import "@/assets/css/company.css";

type CompanyPressDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPressDetailPage({
  params,
}: CompanyPressDetailPageProps) {
  const { id } = await params;

  // 상세 단건 + pager 계산용 전체 목록 병렬 조회(press엔 category 라벨 조회 불필요)
  const [detail, listResult] = await Promise.all([
    fetchPressDetail(id),
    fetchPressList({ page: 0 }),
  ]);

  // 존재하지 않거나 비공개(isVisible!=001) 글이면 404
  if (!detail) {
    notFound();
  }

  // flattenPageDataItem: pressForm/seo 섹션 간 키 충돌 없음 → title/publishDttm/image/content가 root로 flat 병합됨
  const row = flattenPageDataItem(detail);
  const contentHtml = (row.content as string) ?? "";

  // hero 이미지: pressForm.image[0] → page-files, 미등록 시 정적 폴백(별도 heroImage 필드 없음)
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: pressImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : pressDetailHero;

  // pager: 정렬된 전체 목록에서 현재 id 의 index 로 prev(index-1)/next(index+1) 계산
  const rows = listResult.rows;
  const idx = rows.findIndex((r) => r.id === detail.id);
  const prevItem = idx > 0 ? rows[idx - 1] : null;
  const nextItem = idx >= 0 && idx < rows.length - 1 ? rows[idx + 1] : null;
  const prev = prevItem
    ? {
        href: pressDetailHref(prevItem.id),
        title: (flattenPageDataItem(prevItem).title as string) ?? "",
      }
    : undefined;
  const next = nextItem
    ? {
        href: pressDetailHref(nextItem.id),
        title: (flattenPageDataItem(nextItem).title as string) ?? "",
      }
    : undefined;

  return (
    <CompanyArticleDetail
      variant="press"
      pageId="Page_company_press_detail"
      title={(row.title as string) ?? ""}
      date={(row.publishDttm as string) ?? ""}
      heroImage={heroImage}
      pagerAriaLabel="Press post navigation"
      prev={prev}
      next={next}
      listHref="/company/press"
    >
      {/* data-slug: press-data (목록·상세 통합 slug). 상세 본문은 리치텍스트 HTML 단일 필드 content로 태깅 */}
      {/* 영상은 content(리치텍스트 HTML)에 iframe으로 이미 포함되어 dangerouslySetInnerHTML로 함께 렌더됨 */}
      {/* title/date/heroImage/pager 는 CompanyArticleDetail props 로 전달(공용 컴포넌트 내부 렌더). */}
      <div className={articleDetailClass("body")} data-slug="press-data">
        <div
          data-slugkey="content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </CompanyArticleDetail>
  );
}
