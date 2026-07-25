// 제품상세 진입 라우터 — product-data 단건(row)의 page_type으로 SW/HW 렌더러를 분기한다.
// - row.page_type === "SW"  → SwProductDetail(4종 slug 전용 구성, 미등록 slug는 내부에서 GenericProductDetail 폴백)
// - 그 외(HW 등) 또는 row=null → 기존 GenericProductDetail(HW 63종 무회귀, 한 글자도 수정하지 않음)
// ⚠️ page_type은 dataJson 최상위(top-level) 필드다. flattenPageDataItem은 최상위 키를 그대로 보존하고
//    (utils: ...restDataJson), dot-notation 키(product.page_type)는 "객체 섹션" 하위 필드에만 생성한다.
//    page_type은 문자열 top-level 값이라 섹션이 아니므로 row.page_type 으로 접근한다(DB/flatten 코드 실측 확정).
import GenericProductDetail from "./GenericProductDetail";
import SwProductDetail from "./SwProductDetail";

export default function ProductDetailRouter({
  slug,
  row,
}: {
  slug: string;
  row: Record<string, unknown> | null;
}) {
  const isSw = row?.["page_type"] === "SW";

  if (isSw) {
    return <SwProductDetail slug={slug} row={row} />;
  }
  return <GenericProductDetail row={row} />;
}
