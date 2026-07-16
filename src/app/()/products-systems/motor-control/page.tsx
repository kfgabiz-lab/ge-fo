import DevicesHelp from "../components/DevicesHelp";
import DevicesHero from "../components/DevicesHero";
import DevicesMarkets from "../components/DevicesMarkets";
import DevicesPageFooter from "../components/DevicesPageFooter";
import {
  motorControlHero,
  type DevicesProductItem,
} from "../data/motorControlContent";
import {
  fetchCategoryByCode,
  fetchCategoryChildren,
  PRODUCTS_SYSTEMS_PLACEHOLDER,
} from "../data/productsSystemsData";
import "@/assets/css/devices-systems.css";

// category-data 카테고리 L01(depth1) 히어로 + depth2 카드 그리드(parentId=568)
const CATEGORY_CODE = "L01";
const CHILDREN_PARENT_ID = 568;
// depth2 카드 href 는 정적 라우팅 유지(데이터 필드 아님)
const CHILD_HREF = "/products-systems/lv-automation";

export default async function MotorControlPage() {
  const [hero, children] = await Promise.all([
    fetchCategoryByCode(CATEGORY_CODE, { depth: 1 }),
    fetchCategoryChildren(CHILDREN_PARENT_ID),
  ]);

  // 데이터 있으면 실데이터로, 없으면 undefined → DevicesProducts 정적 기본값 폴백
  const products: DevicesProductItem[] | undefined =
    children.length > 0
      ? children.map((child) => ({
          id: String(child.id),
          href: CHILD_HREF,
          image: child.image ?? PRODUCTS_SYSTEMS_PLACEHOLDER,
          title: child.title,
        }))
      : undefined;

  return (
    <main className="devices-page" id="Page_devices_motor_control">
      <DevicesHero
        withProducts
        title={hero?.title || motorControlHero.title}
        description={hero?.description || motorControlHero.description}
        products={products}
      />
      <DevicesMarkets />
      <DevicesHelp variant="overlay" />
      <DevicesPageFooter />
    </main>
  );
}
