import { headers } from "next/headers";
import SubHeader from "@/components/layout/markets/SubHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import type { BreadcrumbCategoryFallback } from "@/components/layout/shared/HeaderBreadcrumb";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";
import { resolveFallbackCategoryId } from "@/app/()/products-systems/data/productsSystemsData";
import {
  CATEGORY_CONTEXT_PARAM,
  parseCategoryContext,
} from "@/lib/navigation/categoryContext";

// 컨텍스트(?category=) 없이 들어온 Lv2/제품 경로에서, 본문이 고른 레코드와 "같은" 카테고리를 산출한다.
// - 브레드크럼은 헤더(레이아웃)에 있어 페이지 조회 결과를 받을 수 없고, GNB 트리에서 slug 로 독립 매칭한다.
//   그 결과 중복 slug 항목에서 본문(조회 첫 건)과 크럼(트리 첫 매칭)이 서로 다른 카테고리를 가리켰다.
// - 현재 경로는 middleware 가 실어준 x-pathname 으로 얻는다(부모 레이아웃은 하위 세그먼트를 모름).
// - ?category= 가 이미 있으면 브레드크럼이 그 값을 쓰므로 계산 자체를 건너뛴다(불필요한 조회 방지).
async function resolveBreadcrumbCategoryFallback(): Promise<BreadcrumbCategoryFallback> {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname");
  if (!pathname) return null;

  const search = headerList.get("x-search") ?? "";
  const urlContext = parseCategoryContext(
    new URLSearchParams(search).get(CATEGORY_CONTEXT_PARAM),
  );
  if (urlContext !== undefined) return null;

  const categoryId = await resolveFallbackCategoryId(pathname);
  return categoryId === null ? null : { pathname, categoryId };
}

// products-category/product-range/product/products-systems 라우트 그룹 공용 헤더/푸터.
// company/services/support layout.tsx와 동일 패턴(SubHeader+SubFooter).
export default async function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [gnbMenuData, devicesMegaMenu, breadcrumbCategoryFallback] =
    await Promise.all([
      fetchGnbMenuData(),
      fetchDevicesMegaMenu(),
      resolveBreadcrumbCategoryFallback(),
    ]);

  return (
    <>
      <SubHeader
        gnbMenuData={gnbMenuData}
        devicesMegaMenu={devicesMegaMenu}
        breadcrumbCategoryFallback={breadcrumbCategoryFallback}
      />
      {children}
      <SubFooter />
    </>
  );
}
