import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
