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
  const initialQuery =
    qParam !== null ? qParam : searchAllPage.defaultQuery;
  const [query, setQuery] = useState(initialQuery);
  const [isMobile, setIsMobile] = useState(false);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);

  const hasQuery = query.length > 0;

  useEffect(() => {
    setQuery(qParam !== null ? qParam : searchAllPage.defaultQuery);
  }, [qParam]);

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
    setQuery(nextQuery);
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
            onChange={(event) => setQuery(event.target.value)}
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
