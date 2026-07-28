import SearchAllHero from "./SearchAllHero";
import SearchAllTabContent from "./SearchAllTabContent";

/** page.tsx 에서 Hero 는 Suspense 로 분리 — 조합 참고용 */
export default function SearchAllPage() {
  return (
    <>
      <SearchAllHero />
      <SearchAllTabContent />
    </>
  );
}
