import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // BO 관리형 이미지(배너/히어로 등) 교체 반영 지연과 캐시 효율의 절충 — 1주일
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  /* 브라우저 → fo 서버 → bo-api(8080) 프록시 — bo/next.config.ts와 동일 패턴 */
  async rewrites() {
    return [
      {
        source: "/api/v1/fo/:path*",
        destination: `${process.env.API_PROXY_TARGET || "http://localhost:8080"}/api/v1/fo/:path*`,
      },
      {
        // Contact Us "View Response" 조회(IF_SRR_NAHP_CTP_0002) — 기존 CTP 전용 public API
        source: "/api/v1/public/:path*",
        destination: `${process.env.API_PROXY_TARGET || "http://localhost:8080"}/api/v1/public/:path*`,
      },
    ];
  },
  /* Products & Systems 라우팅 개편 — 구 /products-systems/... → seo.slug 기반 신규 URL(301).
     seo.slug 확정분만 매핑. explore-all(불변)은 제외.
     lv-automation/variable-frequency-drive는 카테고리 L01-15/L05-04 둘 다 seo.slug가
     "variable-frequency-drive"로 중복 등록돼 있어 동일 목적지로 매핑(첫 건 렌더링 정책과 동일 맥락).
     데이터 추가 보정으로 다른 slug 가 채워지면 매핑 갱신. */
  async redirects() {
    return [
      {
        source: "/products-systems/motor-control",
        destination: "/products-category/lv-products-and-systems",
        permanent: true,
      },
      {
        source: "/products-systems/motor-control/h100_plus",
        destination: "/product/h100-plus",
        permanent: true,
      },
      {
        source: "/products-systems/motor-control/metasol-ms",
        destination: "/product/metasol-ms",
        permanent: true,
      },
      {
        source: "/products-systems/motor-control/susol-ul-smart-mccb",
        destination: "/product/susol-ul-smart-mccb",
        permanent: true,
      },
      {
        source: "/products-systems/software/scada",
        destination: "/product-range/scada",
        permanent: true,
      },
      {
        source: "/products-systems/software/micro-grid",
        destination: "/product-range/micro-grid",
        permanent: true,
      },
      {
        source: "/products-systems/software/smart-factory",
        destination: "/product-range/smart-factory",
        permanent: true,
      },
      {
        source: "/products-systems/software/xems",
        destination: "/product-range/xems",
        permanent: true,
      },
      {
        source: "/products-systems/software",
        destination: "/products-category/software",
        permanent: true,
      },
      {
        source: "/products-systems/lv-automation",
        destination: "/product-range/variable-frequency-drive",
        permanent: true,
      },
      {
        source: "/products-systems/variable-frequency-drive",
        destination: "/product-range/variable-frequency-drive",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // public/ 정적 자원(fonts, ico, img, pub, video) — BO 관리형 파일 교체 반영 지연과
        // 캐시 효율의 절충으로 이미지(minimumCacheTTL)와 동일하게 1주일
        source: "/:dir(fonts|ico|img|pub|video)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ];
  }
};

export default nextConfig;
