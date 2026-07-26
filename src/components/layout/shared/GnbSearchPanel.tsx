"use client";

import { InputAdornment, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  gnbSearchContent,
  type GnbSearchTag,
} from "@/data/gnb/gnbSearchContent";
import { buildSearchAllHref } from "@/data/search/searchAllContent";
import {
  fetchPopularKeywords,
  logSearchKeyword,
} from "@/data/search/searchKeywordData";

type GnbSearchPanelProps = {
  isOpen: boolean;
  onNavigate?: () => void;
};

/** Figma 4288:54315 — #gnb-search-panel (body portal) */
export default function GnbSearchPanel({ isOpen, onNavigate }: GnbSearchPanelProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [canPortal, setCanPortal] = useState(false);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const keywordsRequestedRef = useRef(false);
  const hasQuery = query.length > 0;

  // 인기 검색어 = 통합검색 랭킹(source=UNIFIED_SEARCH). 폴백 없음 — 집계 데이터가 없으면 태그 영역 미노출.
  // 태그 클릭(<Link>)은 사용자의 직접 입력이 아니므로 집계 로깅 없이 이동만 한다(기획 결정).
  const popularTags: readonly GnbSearchTag[] = popularKeywords.map((label) => ({
    label,
    href: buildSearchAllHref(label),
  }));

  useEffect(() => {
    setCanPortal(true);
  }, []);

  // GNB 검색 패널은 모든 페이지에 상시 마운트되므로, 실제로 열렸을 때 1회만 인기검색어를 조회한다.
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

  // 열릴 때 검색 입력에 포커스
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  // 닫힐 때 검색어 초기화
  useEffect(() => {
    if (isOpen) return;
    setQuery("");
  }, [isOpen]);

  if (!canPortal) {
    return null;
  }

  return createPortal(
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
            // 사용자가 직접 입력해서 실행한 검색만 인기검색어 집계 대상(fire-and-forget, 실패해도 이동엔 영향 없음).
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

        <div className="gnb_search__popular">
          <span className="gnb_search__popular-label">
            {gnbSearchContent.popularSearchLabel}
          </span>
          <ul className="gnb_search__tags">
            {popularTags.map((tag) => (
              <li key={tag.label}>
                <Link
                  href={tag.href}
                  className="gnb_search__tag"
                  prefetch={false}
                  tabIndex={isOpen ? undefined : -1}
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
