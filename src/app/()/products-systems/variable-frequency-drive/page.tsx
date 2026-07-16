import DevicesCategoryList from "../components/DevicesCategoryList";
import DevicesHelp from "../components/DevicesHelp";
import DevicesPageFooter from "../components/DevicesPageFooter";
import { vfdIntro, vfdProducts } from "../data/vfdContent";
import type { DevicesCategoryProduct } from "../data/vfdContent";
import {
  fetchCategoryByCode,
  fetchProductsByCodePrefix,
  PRODUCTS_SYSTEMS_PLACEHOLDER,
} from "../data/productsSystemsData";
import "@/assets/css/devices-systems.css";

// ⚠️ vfd 카테고리 코드 미확정: DB 에 동일 VFD 모델이 L01-15 와 L05-04 두 계열로 중복 존재.
// lv-automation 은 L01-15 로 확정됐으나 vfd 페이지의 정확한 코드는 미확정 → 아래 상수로 쉽게 교체 가능하게 둔다.
const CATEGORY_CODE = "L01-15";
const PRODUCT_CODE_PREFIX = "L01-15-";

export default async function VariableFrequencyDrivePage() {
  const [intro, products] = await Promise.all([
    fetchCategoryByCode(CATEGORY_CODE),
    fetchProductsByCodePrefix(PRODUCT_CODE_PREFIX),
  ]);

  const introData = {
    parentLabel: vfdIntro.parentLabel,
    parentHref: vfdIntro.parentHref,
    title: intro?.title || vfdIntro.title,
    description: intro?.description || vfdIntro.description,
  };

  const productCards: DevicesCategoryProduct[] =
    products.length > 0
      ? products.map((p) => ({
          id: String(p.id),
          href: p.slug ? `/products-systems/motor-control/${p.slug}` : "",
          image: p.image ?? PRODUCTS_SYSTEMS_PLACEHOLDER,
          title: p.title,
          description: p.description,
        }))
      : vfdProducts;

  return (
    <main className="devices-page" id="Page_devices_vfd">
      <DevicesCategoryList intro={introData} products={productCards} />
      <DevicesHelp />
      <DevicesPageFooter />
    </main>
  );
}
