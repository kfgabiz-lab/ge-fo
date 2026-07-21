import { notFound } from "next/navigation";
import GenericProductDetail from "@/app/()/products-systems/components/product/GenericProductDetail";
import { fetchProductBySlug } from "@/app/()/products-systems/data/productsSystemsData";

// 일반 3depth 제품 상세 라우트 — 예외 없이 seo.slug → product-data 조회 하나의 경로로 렌더.
// 중복 slug 는 첫 건만(설계 2-1). slug 가 product-data 에 없으면 404.
type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailRoutePage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const row = await fetchProductBySlug(slug);
  if (!row) {
    notFound();
  }

  return <GenericProductDetail slug={slug} />;
}
