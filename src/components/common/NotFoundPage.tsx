import NotFoundHelpfulLinks from "@/components/common/not-found/NotFoundHelpfulLinks";
import NotFoundSearch from "@/components/common/not-found/NotFoundSearch";
import NotFoundTitle from "@/components/common/not-found/NotFoundTitle";
import { fetchPopularKeywords } from "@/data/search/searchKeywordData";
import "@/assets/css/common-404.css";

export default async function NotFoundPage() {
  const popularKeywords = await fetchPopularKeywords("UNIFIED_SEARCH");

  return (
    <main className="common-page common-page--404" id="P-FO-COMMON-010000P">
      <NotFoundTitle />
      <NotFoundSearch popularKeywords={popularKeywords} />
      <NotFoundHelpfulLinks />
    </main>
  );
}
