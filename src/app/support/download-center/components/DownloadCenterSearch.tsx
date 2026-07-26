"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import {
  downloadCenterPage,
} from "@/data/support/downloadCenterContent";
import { logSearchKeyword } from "@/data/search/searchKeywordData";
import { useDownloadCenterQuery } from "./DownloadCenterFilterProvider";

type DownloadCenterSearchProps = {
  initialQuery?: string;
};

export default function DownloadCenterSearch({
  initialQuery = "",
}: DownloadCenterSearchProps) {
  // 입력값은 로컬 상태로 두고, Search 버튼/Enter/인기검색어 클릭 시에만 공유 컨텍스트(query)에 커밋 → 키 입력마다 재조회하지 않는다.
  const { setQuery: commitQuery, popularKeywords } = useDownloadCenterQuery();
  const [query, setQuery] = useState(initialQuery);
  const [isMobile, setIsMobile] = useState(false);
  const hasQuery = query.length > 0;

  // 인기 검색어 = 실집계(source=DOWNLOAD_CENTER). 폴백 없음 — 집계 데이터가 없으면 태그 영역 미노출.

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

  // Search 버튼/Enter — 사용자가 직접 입력해서 실행한 검색만 인기검색어 집계 대상(fire-and-forget, 실패해도 검색엔 영향 없음).
  const commit = () => {
    const trimmed = query.trim();
    void logSearchKeyword("DOWNLOAD_CENTER", trimmed);
    commitQuery(trimmed);
  };
  const clearAll = () => {
    setQuery("");
    commitQuery("");
  };
  // 인기검색어 태그 클릭 — 미리 정해진 값이라 사용자의 직접 입력이 아님 → 집계 로깅하지 않는다(기획 결정).
  const selectTag = (tag: string) => {
    setQuery(tag);
    commitQuery(tag);
  };

  return (
    <section className="support_download_search" id="support-download-search">
      <div className="inner support_download_search__inner">
        <TextField
          className={`guide_field guide_field--search support_download_search__field${hasQuery ? " support_download_search__field--filled" : ""
            }`}
          placeholder={placeholder}
          aria-label={downloadCenterPage.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
          }}
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
                      onClick={clearAll}
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
                    onClick={commit}
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
            {popularKeywords.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="support_download_search__tag"
                  onClick={() => selectTag(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>

          <ul className="support_download_search__tags support_download_search__tags-row support_download_search__tags--mo">
            {popularKeywords.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="support_download_search__tag"
                  onClick={() => selectTag(tag)}
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
