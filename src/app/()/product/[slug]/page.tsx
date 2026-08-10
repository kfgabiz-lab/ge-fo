import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailRouter from "@/app/()/products-systems/components/product/ProductDetailRouter";
import {
  fetchProductBySlug,
  fetchProductSeoBySlug,
} from "@/app/()/products-systems/data/productsSystemsData";
import { parseCategoryContext } from "@/lib/navigation/categoryContext";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata(
  { params, searchParams }: ProductPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await searchParams;
  const categoryId = parseCategoryContext(category);

  const [seo, previous] = await Promise.all([
    fetchProductSeoBySlug(slug, { categoryId }),
    parent,
  ]);
  return mergeSeoMetadata(
    previous,
    seo?.metaTitle ?? "",
    seo?.metaDescription ?? "",
  );
}

export default async function ProductDetailRoutePage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const { category } = await searchParams;
  const categoryId = parseCategoryContext(category);

  const row = await fetchProductBySlug(slug, { categoryId });
  if (!row) notFound();

  return <ProductDetailRouter slug={slug} row={row} categoryId={categoryId} />;
}
