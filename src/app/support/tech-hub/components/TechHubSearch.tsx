"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { techHubPage } from "@/data/support/techHubContent";
import { useTechHubQuery } from "./TechHubFilterProvider";

type TechHubSearchProps = {
  initialQuery?: string;
};

export default function TechHubSearch({
  initialQuery = techHubPage.defaultSearchQuery,
}: TechHubSearchProps) {
  const { query, setQuery, resetSignal } = useTechHubQuery();
  const [value, setValue] = useState<string>(initialQuery);
  const [isMobile, setIsMobile] = useState(false);
  const hasQuery = value.length > 0;

  const prevResetSignal = useRef(resetSignal);
  useEffect(() => {
    if (prevResetSignal.current === resetSignal) return;
    prevResetSignal.current = resetSignal;
    setValue("");
  }, [resetSignal]);

  // LIST 버튼 복귀·뒤로가기로 검색어가 복원되는 경우처럼, 입력창 밖에서 query가
  // 바뀌면 그 값을 그대로 반영한다(타이핑 중 draft는 query가 바뀌지 않는 한 유지됨).
  useEffect(() => {
    setValue(query);
  }, [query]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 780px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const placeholder = isMobile
    ? techHubPage.searchPlaceholderMobile
    : techHubPage.searchPlaceholder;

  const commit = () => setQuery(value.trim());
  const clear = () => {
    setValue("");
    setQuery("");
  };

  return (
    <section className="support_tech_hub_search" id="support-tech-hub-search">
      <div className="inner">
        <TextField
          className={`guide_field guide_field--search support_tech_hub_search__field${
            hasQuery ? " support_tech_hub_search__field--filled" : ""
          }`}
          placeholder={placeholder}
          aria-label={techHubPage.searchPlaceholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
          }}
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
                      onClick={clear}
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
                    className="guide_field__search-icon-button support_tech_hub_search__search-btn"
                    aria-label="Search"
                    onClick={commit}
                  >
                    <img
                      src="/ico/ico_search_24.svg"
                      alt=""
                      className="support_tech_hub_search__search-icon support_tech_hub_search__search-icon--pc"
                      width={26}
                      height={26}
                    />
                    <img
                      src="/ico/ico_search_24.svg"
                      alt=""
                      className="support_tech_hub_search__search-icon support_tech_hub_search__search-icon--mo"
                      width={20}
                      height={20}
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
