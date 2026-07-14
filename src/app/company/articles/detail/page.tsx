"use client";

import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import {
  mediaArticleDetailBullets,
  mediaArticleDetailContentImage,
  mediaArticleDetailHero,
  mediaArticleDetailPager,
  mediaArticleDetailParagraphs,
  mediaArticleDetailTailParagraphs,
} from "@/app/company/data/mediaArticleDetailContent";
import "@/assets/css/company.css";

export default function CompanyArticlesDetailPage() {
  return (
    <CompanyArticleDetail
      variant="articles"
      pageId="Page_company_articles_detail"
      title="LS ELECTRIC to shake up the industry in the era of a &lsquo;Supercycle&rsquo;"
      date="Dec 9, 2025"
      heroImage={mediaArticleDetailHero}
      pagerAriaLabel="Media article navigation"
      prev={mediaArticleDetailPager.prev}
      next={mediaArticleDetailPager.next}
      listHref="/company/articles"
    >
      <div className={articleDetailClass("body")}>
        <p>{mediaArticleDetailParagraphs[0]}</p>
        <p className={articleDetailClass("body-title")}>{mediaArticleDetailParagraphs[1]}</p>
        <p>{mediaArticleDetailParagraphs[2]}</p>
        <ul className={articleDetailClass("list")}>
          {mediaArticleDetailBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{mediaArticleDetailParagraphs[3]}</p>
      </div>

      <img
        src={mediaArticleDetailContentImage.src}
        alt={mediaArticleDetailContentImage.alt}
        className={articleDetailClass("content-img")}
      />

      {mediaArticleDetailTailParagraphs.map((text) => (
        <p key={text} className={articleDetailClass("tail-text")}>
          {text}
        </p>
      ))}
    </CompanyArticleDetail>
  );
}
