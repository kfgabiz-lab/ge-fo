"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  buildNotFoundSearchHref,
  notFoundPage,
} from "@/data/common/notFoundContent";
import {
  fetchPopularKeywords,
  logSearchKeyword,
} from "@/data/search/searchKeywordData";

export default function NotFoundSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [popularTags, setPopularTags] = useState<readonly string[]>([]);
  const hasQuery = query.length > 0;

  useEffect(() => {
    let cancelled = false;
    fetchPopularKeywords("UNIFIED_SEARCH").then((keywords) => {
      if (!cancelled) setPopularTags(keywords);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const navigateToQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    router.push(buildNotFoundSearchHref(nextQuery));
  };

  const submitQuery = (nextQuery: string) => {
    void logSearchKeyword("UNIFIED_SEARCH", nextQuery);
    navigateToQuery(nextQuery);
  };

  return (
    <section className="common_404_search" id="common-404-search">
      <div className="inner">
        <form
          className="common_404_search__form"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            submitQuery(query);
          }}
        >
          <TextField
            className={`guide_field guide_field--search common_404_search__field${
              hasQuery ? " common_404_search__field--filled" : ""
            }`}
            placeholder={notFoundPage.searchPlaceholder}
            aria-label={notFoundPage.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className="guide_field__search-adorn common_404_search__adorn"
                  >
                    {hasQuery ? (
                      <button
                        type="button"
                        className="common_404_search__clear"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        <span className="common_404_search__clear-icon" aria-hidden>
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
                      className="guide_field__search-icon-button"
                      aria-label="Search"
                    >
                      <img
                        src="/ico/ico_search_24.svg"
                        alt=""
                        width={26}
                        height={26}
                      />
                    </button>
                  </InputAdornment>
                ),
              },
            }}
          />
        </form>

        <div className="common_404_search__popular">
          <span className="common_404_search__popular-label">
            {notFoundPage.popularKeywordsLabel}
          </span>
          <ul className="common_404_search__tags">
            {popularTags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="common_404_search__tag"
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
