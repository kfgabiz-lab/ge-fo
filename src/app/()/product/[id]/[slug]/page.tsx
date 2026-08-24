import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailRouter from "@/app/()/products-systems/components/product/ProductDetailRouter";
import {
  fetchProductDetailById,
  fetchProductSeoById,
} from "@/app/()/products-systems/data/productsSystemsData";
import { parseCategoryContext } from "@/lib/navigation/categoryContext";
import { mergeSeoMetadata } from "@/lib/pageDataSeo";
import { isNumericId } from "@/lib/isNumericId";

type ProductPageProps = {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  if (!isNumericId(id)) notFound();

  const [seo, previous] = await Promise.all([
    fetchProductSeoById(Number(id)),
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
  const { id, slug } = await params;
  if (!isNumericId(id)) notFound();
  const { category } = await searchParams;
  const categoryId = parseCategoryContext(category);

  const row = await fetchProductDetailById(Number(id));
  if (!row) notFound();

  return <ProductDetailRouter slug={slug} row={row} categoryId={categoryId} />;
}
