// HW 제품상세(product-data) 실데이터를 정적 ProductDetail 기본값에 병합하는 헬퍼.
// - 히어로 title(series)/description/image/specs, Key Features 만 실데이터로 덮어쓴다.
// - Downloads/Lineup/Video/OtherProducts/배너 등 이번 범위 제외 필드는 정적 기본값 그대로 유지.
// - 데이터 없거나 개별 필드 비어 있으면 정적 기본값 폴백(화면 깨짐 방지).
import type { ProductDetail } from "./productDetailContent";
import { fetchProductDetailBySlug, mapHwProductData } from "./productsSystemsData";

export async function buildHwProductDetail(
  slug: string,
  base: ProductDetail,
): Promise<ProductDetail> {
  const row = await fetchProductDetailBySlug(slug);
  if (!row) return base;

  const data = mapHwProductData(row);
  return {
    ...base,
    // 히어로 메인 제목 슬롯(series) = product.product_name
    series: data.name || base.series,
    description: data.description || base.description,
    image: data.image ?? base.image,
    specs:
      data.specs.length > 0
        ? data.specs.map((s) => ({ label: s.title, value: s.content }))
        : base.specs,
    keyFeatures:
      data.keyFeatures.length > 0
        ? data.keyFeatures.map((f, i) => ({
            id: `kf-${i + 1}`,
            title: f.title,
            description: f.content,
          }))
        : base.keyFeatures,
  };
}
