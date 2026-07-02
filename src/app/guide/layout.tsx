import "@/assets/css/components/guide.css";

export default function GuideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <MegaMenu /> */}
      {children}
      {/* <CommonFooter /> */}
    </>
  );
}
