import CommonBanner04 from "@/components/banners/CommonBanner04";
import DevicesExploreAll from "../components/DevicesExploreAll";
import {
  resolveExploreHref,
  withExploreProductCategory,
  type GnbExploreProduct,
} from "@/data/gnbExploreAllProducts";
import { fetchAllProductNames } from "../data/productsSystemsData";
import { fetchDevicesTreeRows } from "@/data/gnb/devicesTree";
import "@/assets/css/devices-systems.css";

export default async function ExploreAllProductsPage() {
  const [products, deviceRows] = await Promise.all([
    fetchAllProductNames(),
    fetchDevicesTreeRows(),
  ]);

  // ── 조건1: 카테고리 공개 게이트 (devices-tree 기반 판정, order_status와 완전 별개 로직) ──
  // 공개 depth1(Lv1) rowId 집합
  const visibleLv1Ids = new Set(
    deviceRows.filter((r) => r.depth === "1").map((r) => String(r.rowId)),
  );
  // 공개 depth2(Lv2) = 상위 Lv1이 공개인 depth2 행
  const visibleLv2Rows = deviceRows.filter(
    (r) => r.depth === "2" && r.parentId != null && visibleLv1Ids.has(r.parentId),
  );
  const visibleLv2Ids = new Set(visibleLv2Rows.map((r) => String(r.rowId)));
  // productId → 매핑된 Lv2(depth3 junction의 parentId) 집합 (전 depth3 행 기준, 설계 그대로)
  const productLv2Map = new Map<number, Set<string>>();
  for (const r of deviceRows) {
    if (r.depth !== "3" || r.productId == null || r.parentId == null) continue;
    const set = productLv2Map.get(r.productId) ?? new Set<string>();
    set.add(r.parentId);
    productLv2Map.set(r.productId, set);
  }

  // 제품 slug → 그 제품이 속한 공개 Lv2 id (링크에 카테고리 컨텍스트를 싣기 위한 표).
  // seo.slug 가 겹치는 제품(VFD 6종)이 있어 slug 만으로는 대상이 확정되지 않으므로,
  // GNB 링크와 동일하게 ?category={Lv2 id} 를 붙여 이동 대상을 확정한다.
  // 복수 Lv2 소속이면 devices-tree 정렬 순서상 첫 번째를 쓴다(GNB/Other Products 와 동일 규칙).
  const lv2IdBySlug = new Map<string, string>();
  for (const r of deviceRows) {
    if (r.depth !== "3" || !r.productSlug || r.parentId == null) continue;
    if (!visibleLv2Ids.has(r.parentId)) continue;
    if (!lv2IdBySlug.has(r.productSlug)) lv2IdBySlug.set(r.productSlug, r.parentId);
  }

  // ── 조건2/3: Lv1/Lv2 셀렉트 옵션 (devices-tree 공개 행 기반 cascading) ──
  // Lv1 옵션: 공개 depth1 전부(소속 제품 0건이어도 포함, 사용자 확정)
  const lv1Categories = deviceRows
    .filter((r) => r.depth === "1")
    .map((r) => ({ id: String(r.rowId), label: r.categoryTitle ?? "" }));
  // Lv2 옵션(선택 Lv1별 그룹): 공개 depth2를 상위 Lv1 rowId로 묶는다
  const lv2CategoriesByLv1: Record<string, { id: string; label: string }[]> = {};
  for (const r of visibleLv2Rows) {
    const parent = r.parentId as string;
    (lv2CategoriesByLv1[parent] ??= []).push({
      id: String(r.rowId),
      label: r.categoryTitle ?? "",
    });
  }

  // 게이트 통과 제품만 최종 노출: productLv2Map[id] 와 visibleLv2Ids 교집합이 있으면 통과.
  // 각 제품의 "노출 Lv2 집합"(공개 교집합)을 함께 전달해 클라 Lv1/Lv2 필터(OR 다중매핑)에 사용.
  // discontinued 는 order_status==='99' 실데이터로 판정(카테고리 게이트와 무관).
  const exploreProducts: GnbExploreProduct[] | undefined =
    products.length > 0
      ? products
          .map((p) => {
            const mapped = productLv2Map.get(p.id);
            const lv2Ids = mapped
              ? [...mapped].filter((id) => visibleLv2Ids.has(id))
              : [];
            return { p, lv2Ids };
          })
          .filter(({ lv2Ids }) => lv2Ids.length > 0)
          .map(({ p, lv2Ids }) => ({
            id: String(p.id),
            label: p.name,
            href: withExploreProductCategory(
              resolveExploreHref(p.name),
              lv2IdBySlug,
            ),
            discontinued: p.orderStatus === "99",
            lv2Ids,
          }))
      : undefined;

  return (
    <main className="devices-page" id="Page_devices_explore_all">
      <section className="devices_explore">
        <div className="inner">
          <header className="devices_explore__head">
            <h1 className="devices_explore__tit">
              Explore<span className="devices_explore__tit-space"> </span>
              <br className="devices_explore__tit-br" aria-hidden />
              <span className="devices_explore__tit-rest">All Products</span>
            </h1>
            <p className="devices_explore__desc">
              Find any LS ELECTRIC America product quickly — browse our full lineup,
              organized from A to Z.
            </p>
          </header>
          <DevicesExploreAll
            products={exploreProducts}
            lv1Categories={lv1Categories}
            lv2CategoriesByLv1={lv2CategoriesByLv1}
          />
        </div>
      </section>
      <CommonBanner04 />
    </main>
  );
}
