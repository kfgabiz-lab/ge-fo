"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  buildSearchAllHref,
  searchAllPage,
} from "@/data/search/searchAllContent";
import {
  fetchPopularKeywords,
  logSearchKeyword,
} from "@/data/search/searchKeywordData";

export default function SearchAllHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q");
  const [draft, setDraft] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // 인기 검색어 = 실집계(source=UNIFIED_SEARCH). 폴백 없음 — 집계 데이터가 없으면 태그 미노출(정적 배열 사용 금지).
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);

  const query =
    draft !== null ? draft : qParam !== null ? qParam : searchAllPage.defaultQuery;
  const hasQuery = query.length > 0;

  useEffect(() => {
    setDraft(null);
  }, [searchParams]);

  // "use client" 컴포넌트라 useEffect 에서 1회만 인기검색어 조회(검색어 유무와 무관하게 계속 노출).
  useEffect(() => {
    let alive = true;
    void fetchPopularKeywords("UNIFIED_SEARCH").then((list) => {
      if (alive) setPopularKeywords(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const placeholder = isMobile
    ? searchAllPage.searchPlaceholderMobile
    : searchAllPage.searchPlaceholder;

  const navigateToQuery = (nextQuery: string) => {
    setDraft(nextQuery);
    router.push(buildSearchAllHref(nextQuery));
  };

  return (
    <section className="search_all_hero" id="search-all-hero">
      <div className="inner search_all_hero__inner">
        <form
          className="search_all_hero__form"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            // 사용자가 직접 입력해서 실행한 검색만 인기검색어 집계 대상(fire-and-forget, 실패해도 이동엔 영향 없음).
            void logSearchKeyword("UNIFIED_SEARCH", query);
            navigateToQuery(query);
          }}
        >
          <TextField
            className={`guide_field guide_field--search search_all_hero__field${
              hasQuery ? " search_all_hero__field--filled" : ""
            }`}
            placeholder={placeholder}
            aria-label={searchAllPage.searchPlaceholder}
            value={query}
            onChange={(event) => setDraft(event.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className="guide_field__search-adorn search_all_hero__adorn"
                  >
                    {hasQuery ? (
                      <button
                        type="button"
                        className="search_all_hero__clear"
                        aria-label="Clear search"
                        onClick={() => navigateToQuery("")}
                      >
                        <span className="search_all_hero__clear-icon" aria-hidden>
                          <img
                            src="/ico/ico_clear_12_black.svg"
                            alt=""
                            width={12}
                            height={12}
                          />
                        </span>
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      className="guide_field__search-icon-button search_all_hero__search-btn"
                      aria-label="Search"
                    >
                      <img
                        src="/ico/ico_search_24.svg"
                        alt=""
                        className="search_all_hero__search-icon search_all_hero__search-icon--pc"
                        width={26}
                        height={26}
                      />
                      <img
                        src="/ico/ico_search_24.svg"
                        alt=""
                        className="search_all_hero__search-icon search_all_hero__search-icon--mo"
                        width={20}
                        height={20}
                      />
                    </button>
                  </InputAdornment>
                ),
              },
            }}
          />
        </form>

        <div className="search_all_hero__popular">
          <span className="search_all_hero__popular-label search_all_hero__popular-label--pc">
            {searchAllPage.popularSearchLabel}
          </span>
          <span className="search_all_hero__popular-label search_all_hero__popular-label--mo">
            {searchAllPage.popularSearchLabelMobile}
          </span>

          <ul className="search_all_hero__popular-tags search_all_hero__popular-tags--pc">
            {popularKeywords.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="search_all_hero__tag"
                  onClick={() => navigateToQuery(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>

          <ul className="search_all_hero__popular-tags search_all_hero__popular-tags--mo">
            {popularKeywords.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="search_all_hero__tag"
                  onClick={() => navigateToQuery(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
