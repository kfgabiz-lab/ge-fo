import CommonBanner04 from "@/components/banners/CommonBanner04";
import DevicesExploreAll from "../components/DevicesExploreAll";
import {
  resolveExploreHref,
  type GnbExploreProduct,
} from "@/data/gnbExploreAllProducts";
import { fetchAllProductNames, fetchTopCategories } from "../data/productsSystemsData";
import "@/assets/css/devices-systems.css";

export default async function ExploreAllProductsPage() {
  const [products, topCategories] = await Promise.all([
    fetchAllProductNames(),
    fetchTopCategories(),
  ]);
  const lv1Categories = topCategories.map((c) => ({
    id: c.slug || String(c.id),
    label: c.title,
  }));

  // product-data 있으면 실데이터로 A~Z 목록 구성, 없으면 undefined → 정적 폴백.
  // href 는 정적 라우팅(제품명 매핑), discontinued 는 대응 필드 불명확하여 기존 클라이언트 동작 유지(정적 false).
  const exploreProducts: GnbExploreProduct[] | undefined =
    products.length > 0
      ? products.map((p) => ({
          id: String(p.id),
          label: p.name,
          href: resolveExploreHref(p.name),
          discontinued: false,
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
          <DevicesExploreAll products={exploreProducts} lv1Categories={lv1Categories} />
        </div>
      </section>
      <CommonBanner04 />
    </main>
  );
}
