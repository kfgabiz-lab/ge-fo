import NotFoundPage from "@/components/common/NotFoundPage";
import MarketsGroupHeader from "@/components/layout/markets/MarketsGroupHeader";
import SubFooter from "@/components/layout/markets/SubFooter";

export default function NotFound() {
  return (
    <>
      <MarketsGroupHeader />
      <NotFoundPage />
      <SubFooter />
    </>
  );
}
