import SubHeader from "@/components/layout/markets/SubHeader";
import SubFooter from "@/components/layout/markets/SubFooter";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";

export default async function SearchLayout({
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
