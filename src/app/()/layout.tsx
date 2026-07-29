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
