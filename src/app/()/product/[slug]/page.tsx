import type { Metadata } from "next";
import ProductDetailRouter from "@/app/()/products-systems/components/product/ProductDetailRouter";
import {
  fetchProductBySlug,
  fetchProductSeoBySlug,
} from "@/app/()/products-systems/data/productsSystemsData";
import { parseCategoryContext } from "@/lib/navigation/categoryContext";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await searchParams;
  const categoryId = parseCategoryContext(category);

  const seo = await fetchProductSeoBySlug(slug, { categoryId });
  return {
    title: seo?.metaTitle ?? "",
    description: seo?.metaDescription ?? "",
  };
}

export default async function ProductDetailRoutePage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const { category } = await searchParams;
  const categoryId = parseCategoryContext(category);

  const row = await fetchProductBySlug(slug, { categoryId });
  return <ProductDetailRouter slug={slug} row={row} categoryId={categoryId} />;
}
