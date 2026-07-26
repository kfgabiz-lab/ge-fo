import NotFoundHelpfulLinks from "@/components/common/not-found/NotFoundHelpfulLinks";
import NotFoundSearch from "@/components/common/not-found/NotFoundSearch";
import NotFoundTitle from "@/components/common/not-found/NotFoundTitle";
import { fetchPopularKeywords } from "@/data/search/searchKeywordData";
import "@/assets/css/common-404.css";

/** P-FO-COMMON-010000P — Figma 7334:130743 · 404 Not found */
export default async function NotFoundPage() {
  // 인기 검색어(통합검색 랭킹) — 서버 컴포넌트에서 조회 후 검색 폼(client)에 전달.
  // 실패/미집계 시 빈 배열이 내려가고, NotFoundSearch 가 정적 태그로 폴백한다.
  const popularKeywords = await fetchPopularKeywords("UNIFIED_SEARCH");

  return (
    <main className="common-page common-page--404" id="P-FO-COMMON-010000P">
      <NotFoundTitle />
      <NotFoundSearch popularKeywords={popularKeywords} />
      <NotFoundHelpfulLinks />
    </main>
  );
}
