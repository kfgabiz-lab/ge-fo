import type { Metadata } from "next";
import DevicesHelp from "@/app/()/products-systems/components/DevicesHelp";
import DevicesHero from "@/app/()/products-systems/components/DevicesHero";
import DevicesMarkets from "@/app/()/products-systems/components/DevicesMarkets";
import DevicesPageFooter from "@/app/()/products-systems/components/DevicesPageFooter";
import {
  fetchCategoryBySlug,
  fetchVisibleLv2Categories,
} from "@/app/()/products-systems/data/productsSystemsData";
import { fetchCategoryInsights } from "@/data/highlightNews";
import "@/assets/css/devices-systems.css";

// 1depth 카테고리 랜딩 — category-data depth1 을 seo.slug 로 조회(히어로 + depth2 카드 그리드).
// 컴포넌트는 기존 motor-control/page.tsx 와 100% 동일 조립.
// slug 미해결 시(category=null) 404로 바꾸지 않고 레이아웃 유지 + 빈 히어로/카드 없음으로 렌더.
type ProductsCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// SEO(설계 5절) — 히어로와 동일한 depth1 레코드의 seo.meta_title/seo.meta_description 을 그대로 매핑.
// 값이 없으면 undefined(정적 기본 타이틀/설명으로 폴백하지 않는다).
// page 컴포넌트와 동일 인자로 조회하므로 fetch memoization 으로 실제 요청은 1회.
export async function generateMetadata({
  params,
}: ProductsCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug, { depth: 1 });
  return {
    title: category?.metaTitle || undefined,
    description: category?.metaDescription || undefined,
  };
}

export default async function ProductsCategoryRoutePage({
  params,
}: ProductsCategoryPageProps) {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug, { depth: 1 });

  // category 없으면 하위 조회 생략(빈 배열) → 카드 0개, 히어로만 빈 값으로 렌더.
  // 0건이어도 undefined 를 넘기지 않는다 — DevicesProducts 의 items 기본값(정적 14개 목업)이
  // 노출되면 안 되므로 항상 배열로 전달한다(설계 7절 비고8).
  const products = category
    ? await fetchVisibleLv2Categories(category.id)
    : [];
  // Highlights(기획서 13번) — 해당 Lv1의 노출가능 제품에 맵핑된 게시글 최신 3건(BE 서버 필터).
  const highlightItems = category
    ? await fetchCategoryInsights(category.id)
    : [];

  return (
    <main className="devices-page" id="Page_products_category">
      <DevicesHero
        withProducts
        title={category?.title ?? ""}
        description={category?.description ?? ""}
        products={products}
      />
      <DevicesMarkets />
      <DevicesHelp variant="overlay" />
      <DevicesPageFooter
        highlightItems={highlightItems}
        bannerLinkHref="/support/contact-us"
      />
    </main>
  );
}
