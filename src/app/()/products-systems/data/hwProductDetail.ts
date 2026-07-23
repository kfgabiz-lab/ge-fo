// HW 제품상세(product-data) 실데이터를 정적 ProductDetail 기본값에 병합하는 헬퍼.
// - 히어로 title(series)/description/image/specs, Key Features 만 실데이터로 덮어쓴다.
// - Downloads/Lineup/Video/OtherProducts/배너 등 이번 범위 제외 필드는 정적 기본값 그대로 유지.
// - 데이터 없거나 개별 필드 비어 있으면 정적 기본값 폴백(화면 깨짐 방지).
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
    series: data.name || base.series,
    description: data.description || base.description,
    image: data.image,
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
    // Video: product_etc.video(URL)에서 id 추출, 실패 시 정적 기본값 폴백
    youtubeVideoId: getYoutubeIdFromUrl(data.video) || base.youtubeVideoId,
    // Configurator: product_etc.connect_portal 있으면 사용, 없으면 정적 기본값
    configuratorHref: data.connectPortal || base.configuratorHref,
  };
  return { detail, productId: Number(row._id) };
}
