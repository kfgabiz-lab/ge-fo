"use client";

import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import {
  blogDetailBullets,
  blogDetailContentImage,
  blogDetailHero,
  blogDetailPager,
  blogDetailParagraphs,
  blogDetailTags,
  blogDetailTailParagraphs,
} from "@/app/company/data/blogDetailContent";
import "@/assets/css/company.css";

export default function CompanyBlogDetailPage() {
  return (
    <CompanyArticleDetail
      variant="blog"
      pageId="Page_company_blog_detail"
      category="Power Distribution & Infrastructure"
      title="Control Panel Troubleshooting Tips Every Industrial Team Should Know"
      date="Dec 9, 2025"
      heroImage={blogDetailHero}
      pagerAriaLabel="Blog post navigation"
      prev={blogDetailPager.prev}
      next={blogDetailPager.next}
      listHref="/company/blog"
    >
      <div className={articleDetailClass("body")}>
        <p>{blogDetailParagraphs[0]}</p>
        <p className={articleDetailClass("body-title")}>{blogDetailParagraphs[1]}</p>
        <p>{blogDetailParagraphs[2]}</p>
        <ul className={articleDetailClass("list")}>
          {blogDetailBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{blogDetailParagraphs[3]}</p>
      </div>

      <img
        src={blogDetailContentImage.src}
        alt={blogDetailContentImage.alt}
        className={articleDetailClass("content-img")}
      />

      {blogDetailTailParagraphs.map((text) => (
        <p key={text} className={articleDetailClass("tail-text")}>
          {text}
        </p>
      ))}

      <div className={articleDetailClass("tags")}>
        <div className="company-blog__tags">
          {blogDetailTags.map((tag) => (
            <div key={tag} className="company-blog__tag">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </CompanyArticleDetail>
  );
}
