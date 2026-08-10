import NotFoundPage from "@/components/common/NotFoundPage";
import MarketsGroupHeader from "@/components/layout/markets/MarketsGroupHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";

export default async function NotFound() {
  const [gnbMenuData, devicesMegaMenu] = await Promise.all([
    fetchGnbMenuData(),
    fetchDevicesMegaMenu(),
  ]);

  return (
    <>
      <MarketsGroupHeader gnbMenuData={gnbMenuData} devicesMegaMenu={devicesMegaMenu} />
      <NotFoundPage />
      <SubFooter />
    </>
  );
}
