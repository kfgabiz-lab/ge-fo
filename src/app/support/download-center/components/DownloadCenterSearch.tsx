"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import {
  downloadCenterPage,
} from "@/data/support/downloadCenterContent";

type DownloadCenterSearchProps = {
  initialQuery?: string;
};

export default function DownloadCenterSearch({
  initialQuery = "",
}: DownloadCenterSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isMobile, setIsMobile] = useState(false);
  const hasQuery = query.length > 0;
  const { popularTagsMobile } = downloadCenterPage;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 780px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const placeholder = isMobile
    ? downloadCenterPage.searchPlaceholderMobile
    : downloadCenterPage.searchPlaceholder;

  return (
    <section className="support_download_search" id="support-download-search">
      <div className="inner support_download_search__inner">
        <TextField
          className={`guide_field guide_field--search support_download_search__field${
            hasQuery ? " support_download_search__field--filled" : ""
          }`}
          placeholder={placeholder}
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
                    className="guide_field__search-icon-button support_download_search__search-btn"
                    aria-label="Search"
                  >
                    <img
                      src="/ico/ico_search_24.svg"
                      alt=""
                      className="support_download_search__search-icon support_download_search__search-icon--pc"
                      width={26}
                      height={26}
                    />
                    <img
                      src="/ico/ico_search_24.svg"
                      alt=""
                      className="support_download_search__search-icon support_download_search__search-icon--mo"
                      width={20}
                      height={20}
                    />
                  </button>
                </InputAdornment>
              ),
            },
          }}
        />

        <div className="support_download_search__popular">
          <span className="support_download_search__popular-label support_download_search__popular-label--pc">
            {downloadCenterPage.popularSearchLabel}
          </span>
          <span className="support_download_search__popular-label support_download_search__popular-label--mo">
            {downloadCenterPage.popularSearchLabelMobile}
          </span>

          <ul className="support_download_search__tags support_download_search__tags--pc">
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

          <ul className="support_download_search__tags support_download_search__tags-row support_download_search__tags--mo">
            {[...popularTagsMobile.row1, ...popularTagsMobile.row2].map((tag) => (
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
