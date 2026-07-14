// Discover Our Products 섹션 — 서버 컴포넌트(진입점).
// - 서버에서 그룹 목록을 1회 fetch 하여 클라이언트 컴포넌트에 props 전달.
//   (기존 MainVisual → mainVisualData → BannerSwiper 패턴과 동일하게 서버fetch+클라이언트상태 분리)
// - 활성 탭 상태(useState)는 클라이언트 컴포넌트(MainProductsClient)가 보유.
// - 설계 문서: fo/docs/dev/main/prdGrp-data.md
import MainProductsClient from "./MainProductsClient";
import { fetchProductGroups } from "./mainProductsData";

export default async function MainProducts() {
  // 조회 실패 시 빈 배열로 폴백(화면 깨짐 방지)
  const groups = await fetchProductGroups().catch(() => []);

  // 그룹 0개(빈 배열)이면 섹션 자체를 렌더링하지 않음
  if (groups.length === 0) {
    return null;
  }

  return <MainProductsClient groups={groups} />;
}
