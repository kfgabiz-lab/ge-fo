import MainFooter from "@/components/layout/main/MainFooter";

export default function SubFooter() {
  // data-center만 이관된 상태이므로 로고 링크는 현재 존재하는 markets 페이지로 연결
  return <MainFooter logoHref="/markets/data-center" />;
}
