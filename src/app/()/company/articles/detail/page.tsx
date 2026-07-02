"use client";

import { articleDetailClass } from "@/app/()/company/articleDetailClass";
import CompanyArticleDetail from "@/app/()/company/components/CompanyArticleDetail";
import {
  mediaArticleDetailContentImage,
  mediaArticleDetailPager,
  mediaArticleDetailPullquote,
  mediaArticleDetailSections,
  mediaArticleDetailTailSections,
  mediaArticleDetailYoutube,
} from "@/app/()/company/data/mediaArticleDetailContent";
import "@/assets/css/company.css";

export default function CompanyArticlesDetailPage() {
  return (
    <CompanyArticleDetail
      variant="media"
      pageId="Page_company_articles_detail"
      title="LS ELECTRIC to shake up the industry in the era of a &lsquo;Supercycle&rsquo;"
      date="Dec 9, 2025"
      heroVideo={{
        youtubeVideoId: mediaArticleDetailYoutube.videoId,
        title: mediaArticleDetailYoutube.title,
      }}
      pagerAriaLabel="Media article navigation"
      prev={mediaArticleDetailPager.prev}
      next={mediaArticleDetailPager.next}
      listHref="/company/articles"
    >
      <div className={articleDetailClass("body")}>
        <h2 className={articleDetailClass("section-title")}>
          {mediaArticleDetailSections[0].title}
        </h2>
        <p>{mediaArticleDetailSections[0].paragraphs[0]}</p>

        <h3 className={articleDetailClass("subsection-title")}>
          {mediaArticleDetailSections[1].title}
        </h3>
        <p>{mediaArticleDetailSections[1].paragraphs[0]}</p>

        <p className={articleDetailClass("pullquote")}>{mediaArticleDetailPullquote}</p>
      </div>

      <img
        src={mediaArticleDetailContentImage.src}
        alt={mediaArticleDetailContentImage.alt}
        className={articleDetailClass("content-img")}
      />

      <div className={articleDetailClass("body")}>
        {mediaArticleDetailTailSections.map((section) => (
          <div key={section.id} className={articleDetailClass("body-block")}>
            <h3 className={articleDetailClass("subsection-title")}>{section.title}</h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ))}
      </div>
    </CompanyArticleDetail>
  );
}
