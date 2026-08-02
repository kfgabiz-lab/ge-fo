import type { Metadata } from "next";
import DevicesCategoryList from "@/app/()/products-systems/components/DevicesCategoryList";
import DevicesHelp from "@/app/()/products-systems/components/DevicesHelp";
import DevicesMarkets from "@/app/()/products-systems/components/DevicesMarkets";
import DevicesPageFooter from "@/app/()/products-systems/components/DevicesPageFooter";
import ProductDetailRouter from "@/app/()/products-systems/components/product/ProductDetailRouter";
import {
  fetchCategoryBySlug,
  fetchCategoryLv2Products,
  fetchProductBySlug,
  fetchProductSeoBySlug,
} from "@/app/()/products-systems/data/productsSystemsData";
import {
  parseCategoryContext,
  withCategoryContext,
} from "@/lib/navigation/categoryContext";
import { fetchCategoryInsightsLv2 } from "@/data/highlightNews";
import "@/assets/css/devices-systems.css";

type ProductRangePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: ProductRangePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category: categoryParam } = await searchParams;
  const categoryId = parseCategoryContext(categoryParam);

  const category = await fetchCategoryBySlug(slug, { depth: 2, categoryId });
  if (category) {
    return {
      title: category.metaTitle ?? "",
      description: category.metaDescription ?? "",
    };
  }

  const seo = await fetchProductSeoBySlug(slug, { categoryId });
  return {
    title: seo?.metaTitle ?? "",
    description: seo?.metaDescription ?? "",
  };
}

export default async function ProductRangeRoutePage({
  params,
  searchParams,
}: ProductRangePageProps) {
  const { slug } = await params;
  const { category: categoryParam } = await searchParams;
  const categoryId = parseCategoryContext(categoryParam);

  const category = await fetchCategoryBySlug(slug, { depth: 2, categoryId });
  if (category) {
    const productCards = await fetchCategoryLv2Products(category.id);
    const highlightItems = await fetchCategoryInsightsLv2(category.id);
    const intro = {
      parentLabel: "Products & Systems",
      title: category.title,
      description: category.description,
    };
    return (
      <main className="devices-page" id="Page_product_range">
        <DevicesCategoryList
          layout="stacked"
          intro={intro}
          products={productCards}
        />
        <DevicesMarkets />
        <DevicesHelp variant="overlay" />
        <DevicesPageFooter
          highlightItems={highlightItems}
          bannerLinkHref={withCategoryContext(
            "/support/contact-us",
            category.id,
          )}
        />
      </main>
    );
  }

  const row = await fetchProductBySlug(slug, { categoryId });
  return <ProductDetailRouter slug={slug} row={row} categoryId={categoryId} />;
}
