"use client";

import { InputAdornment, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gnbSearchContent } from "@/data/gnb/gnbSearchContent";
import { buildSearchAllHref } from "@/data/search/searchAllContent";

type GnbSearchPanelProps = {
  onNavigate?: () => void;
};

/** Figma 4288:54315 — #gnb-search-panel (body portal) */
export default function GnbSearchPanel({ onNavigate }: GnbSearchPanelProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [canPortal, setCanPortal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasQuery = query.length > 0;

  useEffect(() => {
    setCanPortal(true);
  }, []);

  useEffect(() => {
    const showFrame = requestAnimationFrame(() => {
      setIsVisible(true);
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
    });

    return () => cancelAnimationFrame(showFrame);
  }, []);

  if (!canPortal) {
    return null;
  }

  return createPortal(
    <div
      id="gnb-search-panel"
      className={isVisible ? "gnb_search is-open" : "gnb_search"}
    >
      <div className="gnb_search__inner">
        <form
          className="gnb_search__form"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(buildSearchAllHref(query));
            onNavigate?.();
          }}
        >
          <TextField
            inputRef={inputRef}
            className={`guide_field guide_field--search gnb_search__field${
              hasQuery ? " gnb_search__field--filled" : ""
            }`}
            placeholder={gnbSearchContent.searchPlaceholder}
            aria-label={gnbSearchContent.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className="guide_field__search-adorn gnb_search__adorn"
                  >
                    {hasQuery ? (
                      <button
                        type="button"
                        className="gnb_search__clear"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        <span className="gnb_search__clear-icon" aria-hidden>
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

        <div className="gnb_search__popular">
          <span className="gnb_search__popular-label">
            {gnbSearchContent.popularSearchLabel}
          </span>
          <ul className="gnb_search__tags">
            {gnbSearchContent.popularTags.map((tag) => (
              <li key={tag.label}>
                <Link
                  href={tag.href}
                  className="gnb_search__tag"
                  prefetch={false}
                  onClick={() => onNavigate?.()}
                >
                  {tag.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
