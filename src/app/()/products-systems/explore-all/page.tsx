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

  const visibleLv1Ids = new Set(
    deviceRows.filter((r) => r.depth === "1").map((r) => String(r.rowId)),
  );
  const visibleLv2Rows = deviceRows.filter(
    (r) => r.depth === "2" && r.parentId != null && visibleLv1Ids.has(r.parentId),
  );
  const visibleLv2Ids = new Set(visibleLv2Rows.map((r) => String(r.rowId)));
  const productLv2Map = new Map<number, Set<string>>();
  for (const r of deviceRows) {
    if (r.depth !== "3" || r.productId == null || r.parentId == null) continue;
    const set = productLv2Map.get(r.productId) ?? new Set<string>();
    set.add(r.parentId);
    productLv2Map.set(r.productId, set);
  }

  const lv2IdBySlug = new Map<string, string>();
  for (const r of deviceRows) {
    if (r.depth !== "3" || !r.productSlug || r.parentId == null) continue;
    if (!visibleLv2Ids.has(r.parentId)) continue;
    if (!lv2IdBySlug.has(r.productSlug)) lv2IdBySlug.set(r.productSlug, r.parentId);
  }

  const lv1Categories = deviceRows
    .filter((r) => r.depth === "1")
    .map((r) => ({ id: String(r.rowId), label: r.categoryTitle ?? "" }));
  const lv2CategoriesByLv1: Record<string, { id: string; label: string }[]> = {};
  for (const r of visibleLv2Rows) {
    const parent = r.parentId as string;
    (lv2CategoriesByLv1[parent] ??= []).push({
      id: String(r.rowId),
      label: r.categoryTitle ?? "",
    });
  }

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
