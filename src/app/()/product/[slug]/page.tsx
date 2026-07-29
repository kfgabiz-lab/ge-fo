import ProductDetailRouter from "@/app/()/products-systems/components/product/ProductDetailRouter";
import { fetchProductBySlug } from "@/app/()/products-systems/data/productsSystemsData";
import { parseCategoryContext } from "@/lib/navigation/categoryContext";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
};

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
