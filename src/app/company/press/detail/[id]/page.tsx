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
import { isPreviewActive } from "@/lib/previewMode";
import "@/assets/css/company.css";

type CompanyPressDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPressDetailPage({
  params,
}: CompanyPressDetailPageProps) {
  const { id } = await params;
  const preview = await isPreviewActive("press-data", id);

  const [detail, adjacent] = await Promise.all([
    fetchData({
      slug: "press-data",
      id,
      where: preview ? {} : { ...PRESS_STATUS_WHERE },
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
  const contentHtml = (row.content as string) ?? "";

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

  return (
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
  );
}
