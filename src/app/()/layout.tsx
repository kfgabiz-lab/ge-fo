import SubHeader from "@/components/layout/markets/SubHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";

// products-category/product-range/product/products-systems 라우트 그룹 공용 헤더/푸터.
// company/services/support layout.tsx와 동일 패턴(SubHeader+SubFooter).
export default async function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [gnbMenuData, devicesMegaMenu] = await Promise.all([
    fetchGnbMenuData(),
    fetchDevicesMegaMenu(),
  ]);

  return (
    <>
      <SubHeader gnbMenuData={gnbMenuData} devicesMegaMenu={devicesMegaMenu} />
      {children}
      <SubFooter />
    </>
  );
}
