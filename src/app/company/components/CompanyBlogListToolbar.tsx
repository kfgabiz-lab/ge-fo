"use client";

import { useState, type KeyboardEvent } from "react";
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

// 카테고리 옵션(BLOGCATEGORY 코드 목록)
type ToolbarCategory = { code: string; name: string };

type CompanyBlogListToolbarProps = {
  categories?: ToolbarCategory[];
  selectedCategory?: string; // 선택된 코드값("" = 전체)
  onCategoryChange?: (code: string) => void;
  searchValue?: string;
  onSearchSubmit?: (value: string) => void;
  sortValue?: "latest" | "oldest";
  onSortChange?: (value: "latest" | "oldest") => void;
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
  // 검색어는 제출(Enter 또는 검색 아이콘 클릭) 시에만 상위로 전달 — 타이핑마다 재조회하지 않음
  const [searchDraft, setSearchDraft] = useState(searchValue);
  const submitSearch = () => onSearchSubmit?.(searchDraft.trim());
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") submitSearch();
  };

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
        className="guide_field guide_field--search"
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
            onSortChange?.(event.target.value === "oldest" ? "oldest" : "latest")
          }
          renderValue={(value) => {
            const text = value === "oldest" ? "Oldest" : "Latest";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="latest">Latest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </GuideSelect>
      </FormControl>
    </div>
  );
}
