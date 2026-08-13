"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import { guideSearchFieldMobileSlotProps } from "@/components/form/guideFieldMobileProps";
import GuideSelect from "@/components/form/GuideSelect";

type ToolbarCategory = { code: string; name: string };

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function toSortValue(raw: unknown): SortValue {
  return SORT_OPTIONS.some((o) => o.value === raw) ? (raw as SortValue) : "latest";
}

type CompanyBlogListToolbarProps = {
  categories?: ToolbarCategory[];
  selectedCategory?: string;
  onCategoryChange?: (code: string) => void;
  searchValue?: string;
  onSearchSubmit?: (value: string) => void;
  sortValue?: SortValue;
  onSortChange?: (value: SortValue) => void;
};

export default function CompanyBlogListToolbar({
  categories = [],
  selectedCategory = "",
  onCategoryChange,
  searchValue = "",
  onSearchSubmit,
  sortValue = "latest",
  onSortChange,
}: CompanyBlogListToolbarProps) {
  const [searchDraft, setSearchDraft] = useState(searchValue);
  const hasQuery = searchDraft.length > 0;
  const submitSearch = () => onSearchSubmit?.(searchDraft.trim());
  // 검색어 초기화 — 입력값과 적용된 검색 조건을 함께 비운다
  const clearSearch = () => {
    setSearchDraft("");
    onSearchSubmit?.("");
  };
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") submitSearch();
  };

  useEffect(() => {
  setSearchDraft(searchValue);
}, [searchValue]);

  return (
    <div className="company-blog-list__toolbar">
      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          value={selectedCategory}
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": "Blog category filter" }}
          onChange={(event: SelectChangeEvent<unknown>) =>
            onCategoryChange?.(String(event.target.value))
          }
          renderValue={(value) => {
            const code = value ? String(value) : "";
            const text = code
              ? (categories.find((c) => c.code === code)?.name ?? code)
              : "All";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.code} value={category.code}>
              {category.name}
            </MenuItem>
          ))}
        </GuideSelect>
      </FormControl>

      <TextField
        className={`guide_field guide_field--search${
          hasQuery ? " guide_field--search-filled" : ""
        }`}
        placeholder="Search"
        aria-label="Search blog"
        value={searchDraft}
        onChange={(event) => setSearchDraft(event.target.value)}
        onKeyDown={handleSearchKeyDown}
        slotProps={{
          ...guideSearchFieldMobileSlotProps,
          input: {
            endAdornment: (
              <InputAdornment position="end" className="guide_field__search-adorn">
                {hasQuery ? (
                  <button
                    type="button"
                    className="guide_field__search-clear"
                    aria-label="Clear search"
                    onClick={clearSearch}
                  >
                    <span className="guide_field__search-clear-icon" aria-hidden>
                      <img
                        loading="lazy"
                        decoding="async"
                        src="/ico/ico_clear_12_black.svg"
                        alt=""
                        width={10}
                        height={10}
                      />
                    </span>
                  </button>
                ) : null}
                <button
                  type="button"
                  className="guide_field__search-icon-button"
                  aria-label="Search"
                  onClick={submitSearch}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src="/ico/ico_search_24.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </button>
              </InputAdornment>
            ),
          },
        }}
      />

      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          value={sortValue}
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": "Blog sort order" }}
          onChange={(event: SelectChangeEvent<unknown>) =>
            onSortChange?.(toSortValue(event.target.value))
          }
          renderValue={(value) => {
            const text =
              SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Latest";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </GuideSelect>
      </FormControl>
    </div>
  );
}
