import MainHeader from "@/components/layout/main/MainHeader";
import MainFooter from "@/components/layout/main/MainFooter";
import { fetchDevicesMegaMenu, fetchGnbMenuData } from "@/data/gnb";
import MainLayoutShell from "./MainLayoutShell";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [gnbMenuData, devicesMegaMenu] = await Promise.all([
    fetchGnbMenuData(),
    fetchDevicesMegaMenu(),
  ]);

  return (
    <MainLayoutShell
      header={<MainHeader gnbMenuData={gnbMenuData} devicesMegaMenu={devicesMegaMenu} />}
      footer={<MainFooter />}
    >
      {children}
    </MainLayoutShell>
  );
}
