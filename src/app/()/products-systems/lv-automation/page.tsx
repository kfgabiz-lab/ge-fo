import DevicesCategoryList from "../components/DevicesCategoryList";
import DevicesHelp from "../components/DevicesHelp";
import DevicesMarkets from "../components/DevicesMarkets";
import DevicesPageFooter from "../components/DevicesPageFooter";
import {
  lvAutomationIntro,
  lvAutomationProducts,
} from "../data/lvAutomationContent";
import type { DevicesCategoryProduct } from "../data/vfdContent";
import {
  fetchCategoryByCode,
  fetchProductsByCodePrefix,
  PRODUCTS_SYSTEMS_PLACEHOLDER,
} from "../data/productsSystemsData";
import "@/assets/css/devices-systems.css";

// 인트로: category-data 카테고리 코드 L01-15(단건)
const CATEGORY_CODE = "L01-15";
// 카드: product-data 중 product_code 접두사 L01-15- (VFD 제품 H100 Plus/SP100/G100/M100/S100/iS7)
const PRODUCT_CODE_PREFIX = "L01-15-";

export default async function LvAutomationPage() {
  const [intro, products] = await Promise.all([
    fetchCategoryByCode(CATEGORY_CODE),
    fetchProductsByCodePrefix(PRODUCT_CODE_PREFIX),
  ]);

  // parentLabel/parentHref 는 정적 브레드크럼 유지, title/description 만 실데이터 폴백
  const introData = {
    parentLabel: lvAutomationIntro.parentLabel,
    parentHref: lvAutomationIntro.parentHref,
    title: intro?.title || lvAutomationIntro.title,
    description: intro?.description || lvAutomationIntro.description,
  };

  // 데이터 있으면 실데이터, 없으면 정적 폴백
  const productCards: DevicesCategoryProduct[] =
    products.length > 0
      ? products.map((p) => ({
          id: String(p.id),
          href: p.slug ? `/products-systems/motor-control/${p.slug}` : "",
          image: p.image ?? PRODUCTS_SYSTEMS_PLACEHOLDER,
          title: p.title,
          description: p.description,
        }))
      : lvAutomationProducts;

  return (
    <main className="devices-page" id="Page_devices_lv_automation">
      <DevicesCategoryList
        layout="stacked"
        intro={introData}
        products={productCards}
      />
      <DevicesMarkets />
      <DevicesHelp variant="overlay" />
      <DevicesPageFooter />
    </main>
  );
}
