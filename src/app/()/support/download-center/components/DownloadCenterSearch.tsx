"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { downloadCenterPage } from "@/data/support/downloadCenterContent";

export default function DownloadCenterSearch() {
  const [query, setQuery] = useState("");
  const hasQuery = query.length > 0;

  return (
    <section className="support_download_search" id="support-download-search">
      <div className="inner">
        <TextField
          className={`guide_field guide_field--search support_download_search__field${
            hasQuery ? " support_download_search__field--filled" : ""
          }`}
          placeholder={downloadCenterPage.searchPlaceholder}
          aria-label={downloadCenterPage.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  className="guide_field__search-adorn support_download_search__adorn"
                >
                  {hasQuery ? (
                    <button
                      type="button"
                      className="support_download_search__clear"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                    >
                      <span className="support_download_search__clear-icon" aria-hidden>
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

        <div className="support_download_search__popular">
          <span className="support_download_search__popular-label">
            {downloadCenterPage.popularSearchLabel}
          </span>
          <ul className="support_download_search__tags">
            {downloadCenterPage.popularTags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="support_download_search__tag"
                  onClick={() => setQuery(tag)}
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
