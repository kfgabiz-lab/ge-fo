import MainHeader from "@/components/layout/main/MainHeader";
import MainFooter from "@/components/layout/main/MainFooter";
import { fetchGnbMenuData } from "@/data/gnb";
import MainLayoutShell from "./MainLayoutShell";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // GNB 트리 조회(실패 시 내부에서 빈 배열 폴백 → 정적 데이터 사용)
  const gnbMenuData = await fetchGnbMenuData();

  // 헤더/푸터는 서버에서 미리 렌더해 클라이언트 셸로 전달(쿠키 설정 경로에서 숨김 처리)
  return (
    <MainLayoutShell
      header={<MainHeader gnbMenuData={gnbMenuData} />}
      footer={<MainFooter />}
    >
      {children}
    </MainLayoutShell>
  );
}
