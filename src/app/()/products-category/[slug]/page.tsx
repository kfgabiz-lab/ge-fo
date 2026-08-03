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

type ProductsCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductsCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug, { depth: 1 });
  return {
    title: category?.metaTitle ?? "",
    description: category?.metaDescription ?? "",
  };
}

export default async function ProductsCategoryRoutePage({
  params,
}: ProductsCategoryPageProps) {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug, { depth: 1 });

  const [products, highlightItems] = category
    ? await Promise.all([
        fetchVisibleLv2Categories(category.id),
        fetchCategoryInsights(category.id),
      ])
    : [[], []];

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
