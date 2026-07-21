import { notFound } from "next/navigation";
import DevicesHelp from "@/app/()/products-systems/components/DevicesHelp";
import DevicesHero from "@/app/()/products-systems/components/DevicesHero";
import DevicesMarkets from "@/app/()/products-systems/components/DevicesMarkets";
import DevicesPageFooter from "@/app/()/products-systems/components/DevicesPageFooter";
import type { DevicesProductItem } from "@/app/()/products-systems/data/motorControlContent";
import {
  fetchCategoryBySlug,
  fetchCategoryChildren,
} from "@/app/()/products-systems/data/productsSystemsData";
import "@/assets/css/devices-systems.css";

// 1depth 카테고리 랜딩 — category-data depth1 을 seo.slug 로 조회(히어로 + depth2 카드 그리드).
// 컴포넌트는 기존 motor-control/page.tsx 와 100% 동일 조립. slug 미해결 시 notFound().
type ProductsCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductsCategoryRoutePage({
  params,
}: ProductsCategoryPageProps) {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug, { depth: 1 });
  if (!category) {
    notFound();
  }

  const children = await fetchCategoryChildren(category.id);
  // 하위 depth2 카드 → /product-range/{childSlug}. slug 없으면 링크 비활성("").
  const products: DevicesProductItem[] | undefined =
    children.length > 0
      ? children.map((child) => ({
          id: String(child.id),
          href: child.slug ? `/product-range/${child.slug}` : "",
          image: child.image,
          title: child.title,
        }))
      : undefined;

  return (
    <main className="devices-page" id="Page_products_category">
      <DevicesHero
        withProducts
        title={category.title}
        description={category.description}
        products={products}
      />
      <DevicesMarkets />
      <DevicesHelp variant="overlay" />
      <DevicesPageFooter />
    </main>
  );
}
