"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { techHubPage } from "@/data/support/techHubContent";

type TechHubSearchProps = {
  initialQuery?: string;
};

export default function TechHubSearch({
  initialQuery = techHubPage.defaultSearchQuery,
}: TechHubSearchProps) {
  const [query, setQuery] = useState<string>(initialQuery);
  const hasQuery = query.length > 0;

  return (
    <section className="support_tech_hub_search" id="support-tech-hub-search">
      <div className="inner">
        <TextField
          className={`guide_field guide_field--search support_tech_hub_search__field${
            hasQuery ? " support_tech_hub_search__field--filled" : ""
          }`}
          placeholder={techHubPage.searchPlaceholder}
          aria-label={techHubPage.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  className="guide_field__search-adorn support_tech_hub_search__adorn"
                >
                  {hasQuery ? (
                    <button
                      type="button"
                      className="support_tech_hub_search__clear"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                    >
                      <span className="support_tech_hub_search__clear-icon" aria-hidden>
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
                    type="button"
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
      </div>
    </section>
  );
}
