import NotFoundPage from "@/components/common/NotFoundPage";
import MarketsGroupHeader from "@/components/layout/markets/MarketsGroupHeader";
import SubFooter from "@/components/layout/markets/SubFooter";

/** Root unmatched routes — P-FO-COMMON-010000P (GNB SubHeader·Footer는 루트 not-found에서 직접 래핑) */
export default function NotFound() {
  return (
    <>
      <MarketsGroupHeader />
      <NotFoundPage />
      <SubFooter />
    </>
  );
}
