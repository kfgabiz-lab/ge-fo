import ProductDetailRouter from "@/app/()/products-systems/components/product/ProductDetailRouter";
import { fetchProductBySlug } from "@/app/()/products-systems/data/productsSystemsData";
import { parseCategoryContext } from "@/lib/navigation/categoryContext";

// 일반 3depth 제품 상세 라우트 — 예외 없이 seo.slug → product-data 조회 하나의 경로로 렌더.
// 조회한 row를 그대로 GenericProductDetail에 전달(재조회 없음).
// slug 가 product-data 에 없어도(row=null) 404로 바꾸지 않고 레이아웃 유지 + 빈 상태로 렌더.
// ?category={Lv2 id} — 제품 카드/GNB 에서 넘어온 카테고리 컨텍스트. seo.slug 가 겹치는 제품(VFD 6종)을
// 그 카테고리 소속 제품으로 확정하는 용도이며, 없으면 기존대로 slug 첫 건을 렌더한다(설계 2-1).
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

  const row = await fetchProductBySlug(slug, {
    categoryId: parseCategoryContext(category),
  });
  return <ProductDetailRouter slug={slug} row={row} />;
}
