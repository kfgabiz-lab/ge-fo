"use client";

import { articleDetailClass } from "@/app/()/company/articleDetailClass";
import CompanyArticleDetail from "@/app/()/company/components/CompanyArticleDetail";
import {
  pressDetailBullets,
  pressDetailHero,
  pressDetailPager,
  pressDetailParagraphs,
  pressDetailYoutube,
} from "@/app/()/company/data/pressDetailContent";
import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";
import "@/assets/css/company.css";

export default function CompanyPressDetailPage() {
  return (
    <CompanyArticleDetail
      variant="press"
      pageId="Page_company_press_detail"
      title={
        <>
          LS ELECTRIC Showcases Capabilities in &ldquo;Energy Highway&rdquo; Business
          <br />
          Built on Unrivaled HVDC
        </>
      }
      date="Dec 9, 2025"
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
        <ul className={articleDetailClass("list")}>
          {pressDetailBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {pressDetailParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </CompanyArticleDetail>
  );
}
