import { notFound } from "next/navigation";
import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { pressDetailHero } from "@/app/company/data/pressDetailContent";
import {
  PRESS_STATUS_WHERE,
  pressDetailHref,
  pressImageSrc,
} from "@/app/company/data/pressData";
import { fetchData } from "@/lib/pageDataApi";
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField } from "@/lib/pageData";
import "@/assets/css/company.css";

type CompanyPressDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPressDetailPage({
  params,
}: CompanyPressDetailPageProps) {
  const { id } = await params;

  // 상세 단건 + 인접글(이전/다음) 병렬 조회(press엔 category 라벨 조회 불필요, wall-clock 1 round-trip)
  // - pager는 신규 adjacent 엔드포인트가 이웃을 직접 반환(FE 목록 index 계산 폐기)
  const [detail, adjacent] = await Promise.all([
    fetchData({
      slug: "press-data",
      id,
      where: { ...PRESS_STATUS_WHERE },
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

  // pager: adjacent 엔드포인트 응답 {prev, next}(id/title)를 그대로 매핑, id→상세 href 변환만 수행
  const prev = adjacent.prev
    ? { href: pressDetailHref(adjacent.prev.id), title: adjacent.prev.title }
    : undefined;
  const next = adjacent.next
    ? { href: pressDetailHref(adjacent.next.id), title: adjacent.next.title }
    : undefined;

  return (
    <CompanyArticleDetail
      variant="press"
      pageId="Page_company_press_detail"
      slug="press-data"
      recordId={id}
      title={(row.title as string) ?? ""}
      date={formatDisplayDate((pickField(row, "publish_dttm", "publishDttm") as string) ?? "")}
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
