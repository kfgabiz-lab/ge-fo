// HW 제품상세(product-data) 실데이터를 ProductDetail(기본 레이아웃 틀)에 병합하는 헬퍼.
// series/description/image/specs/keyFeatures/youtubeVideoId/configuratorHref/lineUp은 실데이터 그대로 쓴다.
// Downloads/OtherProducts/Expert 배너는 정적 기본값을 그대로 유지한다.
import type { ProductDetail } from "./productDetailContent";
import { mapHwProductData } from "./productsSystemsData";
import { getYoutubeIdFromUrl } from "@/lib/youtubeEmbed";

// 병합된 상세 + productId(FAQ 동적 조회 키). row 없으면 productId:null → 호출부 FAQ 폴백.
// row는 호출부(라우트 page.tsx)에서 fetchProductBySlug로 이미 조회한 결과를 그대로 전달받는다.
// (예전엔 slug로 내부 재조회했으나, 라우트에서 존재확인용으로 이미 같은 조회를 하므로 중복 제거)
export function buildHwProductDetail(
  row: Record<string, unknown> | null,
  base: ProductDetail,
): { detail: ProductDetail; productId: number | null } {
  if (!row) return { detail: base, productId: null };

  const data = mapHwProductData(row);
  const detail: ProductDetail = {
    ...base,
    // 히어로 메인 제목 슬롯(series) = product.product_name
    series: data.name,
    description: data.description,
    image: data.image,
    specs: data.specs.map((s) => ({ label: s.title, value: s.content })),
    keyFeatures: data.keyFeatures.map((f, i) => ({
      id: `kf-${i + 1}`,
      title: f.title,
      description: f.content,
    })),
    // Video: product_etc.video(URL)에서 youtube id 추출
    youtubeVideoId: getYoutubeIdFromUrl(data.video),
    // Configurator: product_etc.connect_portal
    configuratorHref: data.connectPortal,
    // Lineup: product_etc.line_up (리치텍스트 HTML, 그대로 렌더)
    lineUp: data.lineUp,
  };
  return { detail, productId: Number(row._id) };
}
