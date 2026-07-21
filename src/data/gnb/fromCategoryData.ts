// Products & Systems(devices) GNB 메가메뉴 — category-data/product-data 실데이터로 동적 조립.
// depth1(category-data depth=1) → depth2(fetchCategoryChildren) → depth3 제품카드(fetchProductsByCodePrefix)
// products-category/product-range 페이지가 쓰는 것과 동일한 헬퍼를 재사용한다(신규 API 없음).
import { GNB_MEGA_PANEL_ID } from "@/data/gnb/panelIds";
import type { GnbDevicesMegaMenu, GnbMegaDepth3, GnbMegaProduct } from "@/data/gnb/types";
import {
  fetchCategoryChildren,
  fetchProductsByCodePrefix,
  fetchTopCategories,
} from "@/app/()/products-systems/data/productsSystemsData";

async function buildDepth3(child: {
  id: number;
  code: string;
  title: string;
  slug: string;
}): Promise<GnbMegaDepth3> {
  const products = await fetchProductsByCodePrefix(`${child.code}-`);
  const megaProducts: GnbMegaProduct[] = products.map((p) => ({
    id: String(p.slug || `product-${p.id}`),
    title: p.title,
    subtitle: p.description,
    image: p.image,
    href: p.slug ? `/product/${p.slug}` : "",
  }));

  return {
    id: child.slug || String(child.id),
    label: child.title,
    panelTitle: child.title,
    href: child.slug ? `/product-range/${child.slug}` : "",
    product: megaProducts,
  };
}

// devices 메가메뉴 전체 트리 — 서버(레이아웃)에서 조회해 GnbMenu에 prop으로 내려준다.
// 실패/0건 시 categories: [] 반환(호출부가 정적 폴백 여부를 판단).
export async function fetchDevicesMegaMenu(): Promise<GnbDevicesMegaMenu> {
  const topCategories = await fetchTopCategories();

  const categories = await Promise.all(
    topCategories.map(async (top) => {
      const children = await fetchCategoryChildren(top.id);
      const depth3List = await Promise.all(children.map(buildDepth3));

      return {
        id: top.slug || String(top.id),
        label: top.title,
        href: top.slug ? `/products-category/${top.slug}` : "",
        children: depth3List,
      };
    }),
  );

  return {
    type: "devices",
    panelId: GNB_MEGA_PANEL_ID.devices,
    categories,
  };
}
