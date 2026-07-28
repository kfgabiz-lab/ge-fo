import { Suspense } from "react";
import SearchAllHero from "./components/SearchAllHero";
import SearchAllTabContent from "./components/SearchAllTabContent";
import "@/assets/css/search.css";
import "@/assets/css/devices-product-detail.css";

/**
 * useSearchParams() 대기 중 main 이 비면 layout SubFooter 가 첫 화면에 노출됨.
 * Hero 만 Suspense 로 두고 탭 콘텐츠는 즉시 렌더.
 */
function SearchAllHeroFallback() {
  return (
    <section
      className="search_all_hero search_all_hero--pending"
      id="search-all-hero"
      aria-busy="true"
    >
      <div className="inner search_all_hero__inner">
        <div className="search_all_hero__form" />
        <div className="search_all_hero__popular" />
      </div>
    </section>
  );
}

export default function SearchAllRoutePage() {
  return (
    <main className="search-page" id="Page_search_all">
      <Suspense fallback={<SearchAllHeroFallback />}>
        <SearchAllHero />
      </Suspense>
      {/* SearchAllTabContent 도 useSearchParams(?q=) 사용 → Suspense 경계 필요 */}
      <Suspense fallback={null}>
        <SearchAllTabContent />
      </Suspense>
    </main>
  );
}
