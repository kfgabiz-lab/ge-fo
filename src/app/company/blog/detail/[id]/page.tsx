import { notFound } from "next/navigation";
import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import { blogDetailHero } from "@/app/company/data/blogDetailContent";
import {
  blogDetailHref,
  blogImageSrc,
  fetchBlogCategories,
  fetchBlogDetail,
  fetchBlogList,
  splitHashtag,
  toCategoryMap,
} from "@/app/company/data/blogData";
import { flattenPageDataItem } from "@/lib/pageData";
import "@/assets/css/company.css";

type CompanyBlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyBlogDetailPage({
  params,
}: CompanyBlogDetailPageProps) {
  const { id } = await params;

  // 상세 단건 + 카테고리 라벨 + pager 계산용 전체 목록 병렬 조회
  const [detail, categories, listResult] = await Promise.all([
    fetchBlogDetail(id),
    fetchBlogCategories(),
    fetchBlogList({ page: 0 }),
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

  // pager: 정렬된 전체 목록에서 현재 id 의 index 로 prev(index-1)/next(index+1) 계산
  const rows = listResult.rows;
  const idx = rows.findIndex((r) => r.id === detail.id);
  const prevItem = idx > 0 ? rows[idx - 1] : null;
  const nextItem =
    idx >= 0 && idx < rows.length - 1 ? rows[idx + 1] : null;
  const prev = prevItem
    ? {
        href: blogDetailHref(prevItem.id),
        title: (flattenPageDataItem(prevItem).title as string) ?? "",
      }
    : undefined;
  const next = nextItem
    ? {
        href: blogDetailHref(nextItem.id),
        title: (flattenPageDataItem(nextItem).title as string) ?? "",
      }
    : undefined;

  return (
    <CompanyArticleDetail
      variant="blog"
      pageId="Page_company_blog_detail"
      category={categoryLabel}
      title={(row.title as string) ?? ""}
      date={(row.publishDttm as string) ?? ""}
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
          data-slugKey="content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* tags: 해시태그 배열 필드(hashtag split) */}
        <div className={articleDetailClass("tags")} data-slugKey="tags">
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
