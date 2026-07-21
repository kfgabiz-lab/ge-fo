import { notFound } from "next/navigation";
import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { blogDetailHero } from "@/app/company/data/blogDetailContent";
import {
  blogDetailHref,
  blogImageSrc,
  fetchBlogAdjacent,
  fetchBlogCategories,
  fetchBlogDetail,
  splitHashtag,
  toCategoryMap,
} from "@/app/company/data/blogData";
import { formatDisplayDate } from "@/lib/formatDate";
import { flattenPageDataItem, pickField } from "@/lib/pageData";
import "@/assets/css/company.css";

type CompanyBlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyBlogDetailPage({
  params,
}: CompanyBlogDetailPageProps) {
  const { id } = await params;

  // 상세 단건 + 카테고리 라벨 + 인접글(이전/다음) 병렬 조회(wall-clock 1 round-trip)
  // - pager는 신규 adjacent 엔드포인트가 이웃을 직접 반환(FE 목록 index 계산 폐기)
  const [detail, categories, adjacent] = await Promise.all([
    fetchBlogDetail(id),
    fetchBlogCategories(),
    fetchBlogAdjacent(id),
  ]);

  // 존재하지 않거나 비공개(isVisible!=001) 글이면 404
  if (!detail) {
    notFound();
  }

  // flattenPageDataItem: blogForm/seo 섹션 간 키 충돌 없음 → title/category/hashtag/publishDttm/image/content가 root로 flat 병합됨
  const row = flattenPageDataItem(detail);
  const categoryMap = toCategoryMap(categories);
  const categoryCode = (row.category as string) ?? "";
  const categoryLabel = categoryMap.get(categoryCode) ?? categoryCode;
  const tags = splitHashtag(row.hashtag as string | undefined);
  const contentHtml = (row.content as string) ?? "";

  // hero 이미지: blogForm.image[0] → page-files, 미등록 시 정적 폴백
  const imageArr = row.image;
  const mediaId =
    Array.isArray(imageArr) && imageArr.length > 0 ? (imageArr[0] as number) : null;
  const heroImage =
    mediaId != null
      ? { src: blogImageSrc(mediaId), alt: (row.title as string) ?? "" }
      : blogDetailHero;

  // pager: adjacent 엔드포인트 응답 {prev, next}(id/title)를 그대로 매핑, id→상세 href 변환만 수행
  const prev = adjacent.prev
    ? { href: blogDetailHref(adjacent.prev.id), title: adjacent.prev.title }
    : undefined;
  const next = adjacent.next
    ? { href: blogDetailHref(adjacent.next.id), title: adjacent.next.title }
    : undefined;

  return (
    <CompanyArticleDetail
      variant="blog"
      pageId="Page_company_blog_detail"
      category={categoryLabel}
      title={(row.title as string) ?? ""}
      date={formatDisplayDate((pickField(row, "publish_dttm", "publishDttm") as string) ?? "")}
      heroImage={heroImage}
      pagerAriaLabel="Blog post navigation"
      prev={prev}
      next={next}
      listHref="/company/blog"
    >
      {/* data-slug: 블로그 상세 단건 레코드 (목록과 동일 slug, id로 조회). */}
      {/* category/title/date/heroImage/pager 는 CompanyArticleDetail props 로 전달(공용 컴포넌트 내부 렌더). */}
      <div data-slug="blog-data">
        {/* content: 에디터 리치텍스트 HTML 단일 필드(blogForm.content) */}
        <div
          className={articleDetailClass("body")}
          data-slugkey="content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* tags: 해시태그 배열 필드(hashtag split) */}
        <div className={articleDetailClass("tags")} data-slugkey="tags">
          <div className="company-blog__tags">
            {tags.map((tag, tagIndex) => (
              <div key={`${tag}-${tagIndex}`} className="company-blog__tag">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CompanyArticleDetail>
  );
}
