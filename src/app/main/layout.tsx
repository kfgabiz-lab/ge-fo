import MainHeader from "@/components/layout/main/MainHeader";
import MainFooter from "@/components/layout/main/MainFooter";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      {children}
      <MainFooter />
    </>
  );
}
