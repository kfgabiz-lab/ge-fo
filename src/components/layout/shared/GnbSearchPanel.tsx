"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gnbSearchContent, type GnbSearchTag } from "@/data/gnb/gnbSearchContent";
import { buildSearchAllHref } from "@/data/search/searchAllContent";
import {
  fetchPopularKeywords,
  logSearchKeyword,
} from "@/data/search/searchKeywordData";

type GnbSearchPanelProps = {
  isOpen: boolean;
  onNavigate?: () => void;
};

function PopularTags({
  tags,
  className,
  isOpen,
  onSelect,
}: {
  tags: readonly GnbSearchTag[];
  className: string;
  isOpen: boolean;
  onSelect: (tag: GnbSearchTag) => void;
}) {
  return (
    <ul className={className}>
      {tags.map((tag) => (
        <li key={tag.label}>
          <button
            type="button"
            className="gnb_search__tag"
            tabIndex={isOpen ? undefined : -1}
            onClick={() => onSelect(tag)}
          >
            {tag.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

const emptySubscribe = () => () => {};

export default function GnbSearchPanel({
  isOpen,
  onNavigate,
}: GnbSearchPanelProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [isMobile, setIsMobile] = useState(false);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const keywordsRequestedRef = useRef(false);
  const canPortal = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const hasQuery = query.length > 0;

  const popularTags: readonly GnbSearchTag[] = popularKeywords.map((label) => ({
    label,
    href: buildSearchAllHref(label),
  }));

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setQuery("");
    }
  }

  useEffect(() => {
    const media = window.matchMedia("(max-width: 780px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isOpen || keywordsRequestedRef.current) return;
    keywordsRequestedRef.current = true;
    let alive = true;
    fetchPopularKeywords("UNIFIED_SEARCH").then((keywords) => {
      if (!alive) return;
      setPopularKeywords(keywords);
    });
    return () => {
      alive = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  if (!canPortal) {
    return null;
  }

  const placeholder = isMobile
    ? gnbSearchContent.searchPlaceholderMobile
    : gnbSearchContent.searchPlaceholder;

  const handleSelectTag = (tag: GnbSearchTag) => {
    router.push(tag.href);
    onNavigate?.();
  };

  return createPortal(
    <>
      {isOpen ? (
        <button
          type="button"
          className="gnb_search_dim"
          aria-label="검색 닫기"
          tabIndex={-1}
          onClick={() => onNavigate?.()}
        />
      ) : null}
      <div
        id="gnb-search-panel"
        className={isOpen ? "gnb_search is-open" : "gnb_search"}
        aria-hidden={!isOpen}
      >
        <div className="gnb_search__inner">
          <form
            className="gnb_search__form"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              void logSearchKeyword("UNIFIED_SEARCH", query);
              router.push(buildSearchAllHref(query));
              onNavigate?.();
            }}
          >
            <TextField
              inputRef={inputRef}
              className={`guide_field guide_field--search gnb_search__field${
                hasQuery ? " gnb_search__field--filled" : ""
              }`}
              placeholder={placeholder}
              aria-label={gnbSearchContent.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className="gnb_search__mark"
                      disableTypography
                    >
                      <img
                        src="/ico/ico_gnb_search_ai_32.svg"
                        alt=""
                        width={32}
                        height={36}
                        className="gnb_search__mark-icon"
                        aria-hidden
                      />
                    </InputAdornment>
                  ),
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
                              src="/ico/ico_clear_12_black.svg"
                              alt=""
                              width={12}
                              height={12}
                              className="gnb_search__clear-icon-pc"
                            />
                            <img
                              src="/ico/ico_gnb_search_clear_24.svg"
                              alt=""
                              width={24}
                              height={24}
                              className="gnb_search__clear-icon-mo"
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
                          className="gnb_search__search-icon gnb_search__search-icon--pc"
                          width={26}
                          height={26}
                        />
                        <img
                          src="/ico/ico_search_24.svg"
                          alt=""
                          className="gnb_search__search-icon gnb_search__search-icon--mo"
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

          <div className="gnb_search__popular">
            <span className="gnb_search__popular-label gnb_search__popular-label--pc">
              {gnbSearchContent.popularSearchLabel}
            </span>
            <span className="gnb_search__popular-label gnb_search__popular-label--mo">
              {gnbSearchContent.popularSearchLabel}
            </span>

            <PopularTags
              tags={popularTags}
              className="gnb_search__tags gnb_search__tags--pc"
              isOpen={isOpen}
              onSelect={handleSelectTag}
            />
            <PopularTags
              tags={popularTags}
              className="gnb_search__tags gnb_search__tags--mo"
              isOpen={isOpen}
              onSelect={handleSelectTag}
            />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
