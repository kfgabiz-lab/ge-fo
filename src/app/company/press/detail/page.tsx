"use client";

import { articleDetailClass } from "@/app/company/articleDetailClass";
import CompanyArticleDetail from "@/app/company/components/CompanyArticleDetail";
import {
  pressDetailDate,
  pressDetailHero,
  pressDetailPager,
  pressDetailParagraphs,
  pressDetailTitle,
  pressDetailYoutube,
} from "@/app/company/data/pressDetailContent";
import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";
import "@/assets/css/company.css";

export default function CompanyPressDetailPage() {
  return (
    <CompanyArticleDetail
      variant="press"
      pageId="Page_company_press_detail"
      title={pressDetailTitle}
      date={pressDetailDate}
      heroImage={pressDetailHero}
      afterHero={
        <DevicesProductVideoPlayer
          youtubeVideoId={pressDetailYoutube.videoId}
          title={pressDetailYoutube.title}
        />
      }
      pagerAriaLabel="Press post navigation"
      prev={pressDetailPager.prev}
      next={pressDetailPager.next}
      listHref="/company/press"
    >
      <div className={articleDetailClass("body")}>
        {pressDetailParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </CompanyArticleDetail>
  );
}
