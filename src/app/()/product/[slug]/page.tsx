import GenericProductDetail from "@/app/()/products-systems/components/product/GenericProductDetail";
import { fetchProductBySlug } from "@/app/()/products-systems/data/productsSystemsData";

// 일반 3depth 제품 상세 라우트 — 예외 없이 seo.slug → product-data 조회 하나의 경로로 렌더.
// 중복 slug 는 첫 건만(설계 2-1). 조회한 row를 그대로 GenericProductDetail에 전달(재조회 없음).
// slug 가 product-data 에 없어도(row=null) 404로 바꾸지 않고 레이아웃 유지 + 빈 상태로 렌더.
type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailRoutePage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const row = await fetchProductBySlug(slug);
  return <GenericProductDetail row={row} />;
}
