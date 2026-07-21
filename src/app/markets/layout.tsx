import MarketsGroupHeader from "@/components/layout/markets/MarketsGroupHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";

export default async function MarketsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // GNB 트리 조회(실패 시 내부에서 빈 배열/폴백 → 정적 데이터 사용)
  const [gnbMenuData, devicesMegaMenu] = await Promise.all([
    fetchGnbMenuData(),
    fetchDevicesMegaMenu(),
  ]);

  return (
    <>
      <MarketsGroupHeader gnbMenuData={gnbMenuData} devicesMegaMenu={devicesMegaMenu} />
      {children}
      <SubFooter />
    </>
  );
}
