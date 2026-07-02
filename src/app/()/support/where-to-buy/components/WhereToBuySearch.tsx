"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { whereToBuyPage } from "@/data/support/whereToBuyContent";

type WhereToBuySearchProps = {
  initialQuery?: string;
  /** Figma 5752:47215 — left column search inside contents */
  embedded?: boolean;
};

export default function WhereToBuySearch({
  initialQuery = "",
  embedded = false,
}: WhereToBuySearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const hasQuery = query.length > 0;

  const field = (
    <>
      <div className="support_where_to_buy_search__field-wrap">
        <TextField
          className={`guide_field guide_field--search support_where_to_buy_search__field${
            hasQuery ? " support_where_to_buy_search__field--filled" : ""
          }`}
          placeholder={whereToBuyPage.searchPlaceholder}
          aria-label={whereToBuyPage.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  className="guide_field__search-adorn support_where_to_buy_search__adorn"
                >
                  {hasQuery ? (
                    <button
                      type="button"
                      className="support_where_to_buy_search__clear"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                    >
                      <span
                        className="support_where_to_buy_search__clear-icon"
                        aria-hidden
                      >
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
                    aria-label="Search locations"
                  >
                    <img
                      src="/ico/ico_search_24.svg"
                      alt=""
                      width={embedded ? 18 : 26}
                      height={embedded ? 18 : 26}
                    />
                  </button>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <button type="button" className="support_where_to_buy_search__location">
        <img
          src="/ico/ico_location_20.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden
        />
        {whereToBuyPage.useMyLocationLabel}
      </button>
    </>
  );

  if (embedded) {
    return (
      <div
        className="support_where_to_buy_search support_where_to_buy_search--embedded"
        id="support-where-to-buy-search"
      >
        {field}
      </div>
    );
  }

  return (
    <section className="support_where_to_buy_search" id="support-where-to-buy-search">
      <div className="inner">{field}</div>
    </section>
  );
}
