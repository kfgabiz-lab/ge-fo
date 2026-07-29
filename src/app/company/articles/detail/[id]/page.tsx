import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { mediaArticleDetailHero } from "@/app/company/data/mediaArticleDetailContent";
import {
  ARTICLES_STATUS_WHERE,
  articlesDetailHref,
  articlesImageSrc,
} from "@/app/company/data/articlesData";
import { fetchData } from "@/lib/pageDataApi";
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField } from "@/lib/pageData";
import { isPreviewActive } from "@/lib/previewMode";
import "@/assets/css/company.css";

type CompanyArticlesDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyArticlesDetailPage({
  params,
}: CompanyArticlesDetailPageProps) {
  const { id } = await params;
  const preview = await isPreviewActive("articles-data", id);

  const [detail, adjacent] = await Promise.all([
    fetchData({
      slug: "articles-data",
      id,
      where: preview ? {} : { ...ARTICLES_STATUS_WHERE },
      리턴함수: (x) => x,
    }),
    fetchData({
      slug: "articles-data",
      id,
      adjacent: true,
      sortField: "createdAt",
      titleField: "articles.title",
      where: { ...ARTICLES_STATUS_WHERE },
    }),
  ]);

  const row: Record<string, unknown> = detail ? flattenPageDataItem(detail) : {};
  const contentHtml = (row.content as string) ?? "";

  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: articlesImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : mediaArticleDetailHero;

  const prev = adjacent.prev
    ? { href: articlesDetailHref(adjacent.prev.id), title: adjacent.prev.title }
    : undefined;
  const next = adjacent.next
    ? { href: articlesDetailHref(adjacent.next.id), title: adjacent.next.title }
    : undefined;

  return (
    <CompanyArticleDetail
      variant="articles"
      pageId="Page_company_articles_detail"
      slug="articles-data"
      recordId={id}
      preview={preview}
      title={(row.title as string) ?? ""}
      date={formatDisplayDate((pickField(row, "publish_dttm", "publishDttm") as string) ?? "")}
      heroImage={heroImage}
      pagerAriaLabel="Media article navigation"
      prev={prev}
      next={next}
      listHref="/company/articles"
    >
      <div className={articleDetailClass("body")} data-slug="articles-data">
        <div
          data-slugkey="content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </CompanyArticleDetail>
  );
}
