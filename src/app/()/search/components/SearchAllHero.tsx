"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  buildSearchAllHref,
  searchAllPage,
} from "@/data/search/searchAllContent";

export default function SearchAllHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q");
  const [draft, setDraft] = useState<string | null>(null);

  const query =
    draft !== null ? draft : qParam !== null ? qParam : searchAllPage.defaultQuery;
  const hasQuery = query.length > 0;

  useEffect(() => {
    setDraft(null);
  }, [searchParams]);

  const navigateToQuery = (nextQuery: string) => {
    setDraft(nextQuery);
    router.push(buildSearchAllHref(nextQuery));
  };

  return (
    <section className="search_all_hero" id="search-all-hero">
      <div className="inner">
        <form
          className="search_all_hero__form"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            navigateToQuery(query);
          }}
        >
          <TextField
            className={`guide_field guide_field--search search_all_hero__field${
              hasQuery ? " search_all_hero__field--filled" : ""
            }`}
            placeholder={searchAllPage.searchPlaceholder}
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
                            src="/ico/ico_clear_12.svg"
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

        <div className="search_all_hero__popular">
          <span className="search_all_hero__popular-label">
            {searchAllPage.popularSearchLabel}
          </span>
          <ul className="search_all_hero__popular-tags">
            {searchAllPage.popularTags.map((tag) => (
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
