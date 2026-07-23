import DevicesCategoryList from "@/app/()/products-systems/components/DevicesCategoryList";
import DevicesHelp from "@/app/()/products-systems/components/DevicesHelp";
import DevicesMarkets from "@/app/()/products-systems/components/DevicesMarkets";
import DevicesPageFooter from "@/app/()/products-systems/components/DevicesPageFooter";
import GenericProductDetail from "@/app/()/products-systems/components/product/GenericProductDetail";
import type { DevicesCategoryProduct } from "@/app/()/products-systems/data/vfdContent";
import {
  fetchCategoryBySlug,
  fetchProductsByCodePrefix,
  fetchProductBySlug,
} from "@/app/()/products-systems/data/productsSystemsData";
import "@/assets/css/devices-systems.css";

// 2depth 카테고리(우선) 또는 제품(폴백) 라우트. 예외 slug 없이 전부 동적.
// ① category-data depth2 를 seo.slug 로 조회 → 카테고리 리스트(DevicesCategoryList) 렌더
// ② 없으면 product-data 를 seo.slug 로 조회 → 제네릭 제품상세(GenericProductDetail) 렌더
//    (조회한 row를 그대로 전달, 내부 재조회 없음)
// ③ 둘 다 없어도 404로 바꾸지 않고 제품상세 레이아웃을 빈 상태(row=null)로 렌더 — 레이아웃 유지
const LANDING_HREF = "/products-category/lv-products-and-systems";

type ProductRangePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductRangeRoutePage({
  params,
}: ProductRangePageProps) {
  const { slug } = await params;

  // ① depth2 카테고리 우선
  const category = await fetchCategoryBySlug(slug, { depth: 2 });
  if (category) {
    // 카드 = 해당 카테고리 코드 접두사(L01-15-) 제품(product-data)
    const products = await fetchProductsByCodePrefix(`${category.code}-`);
    const productCards: DevicesCategoryProduct[] = products.map((p) => ({
      id: String(p.id),
      href: p.slug ? `/product/${p.slug}` : "",
      image: p.image,
      title: p.title,
      description: p.description,
    }));
    const intro = {
      parentLabel: "Products & Systems",
      parentHref: LANDING_HREF,
      title: category.title,
      description: category.description,
    };
    return (
      <main className="devices-page" id="Page_product_range">
        <DevicesCategoryList
          layout="stacked"
          intro={intro}
          products={productCards}
        />
        <DevicesMarkets />
        <DevicesHelp variant="overlay" />
        <DevicesPageFooter />
      </main>
    );
  }

  // ② 제품 폴백 — product-data 를 seo.slug 로 조회해 제네릭 제품상세로 렌더.
  //    카테고리도 제품도 안 맞으면 row=null → GenericProductDetail이 템플릿 기본값으로 빈 상태 렌더.
  const row = await fetchProductBySlug(slug);
  return <GenericProductDetail row={row} />;
}
