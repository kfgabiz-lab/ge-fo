import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/structuredData/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /preview: BO 미리보기 전용 라우트, /search: 검색 결과(중복/씬 콘텐츠), /main/cookie-setting: 쿠키 설정 UI
      disallow: ["/api/", "/preview", "/search", "/main/cookie-setting"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
