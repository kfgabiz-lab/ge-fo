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
import { SITE_URL } from "@/lib/structuredData/siteConfig";

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

  const [seo, row, previous] = await Promise.all([
    fetchProductSeoById(Number(id)),
    fetchProductDetailById(Number(id)),
    parent,
  ]);

  if(!row) notFound();
  const imageArr = row["product_info.image"];
  const mediaId =
      Array.isArray(imageArr) && imageArr.length > 0
          ? Number(imageArr[0])
          : null;

  const imageUrl =
      mediaId != null && !Number.isNaN(mediaId)
          ? `${SITE_URL}/api/v1/fo/page-files/${mediaId}`
          : undefined;

  return mergeSeoMetadata(
    previous,
    seo?.metaTitle ?? "",
    seo?.metaDescription ?? "",
    imageUrl,
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
