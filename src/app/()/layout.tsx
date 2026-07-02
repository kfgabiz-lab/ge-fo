import MarketsGroupHeader from "@/components/layout/markets/MarketsGroupHeader";
import SubFooter from "@/components/layout/markets/SubFooter";

export default function MarketsGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MarketsGroupHeader />
      {children}
      <SubFooter />
    </>
  );
}
