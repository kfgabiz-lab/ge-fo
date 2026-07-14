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
import GuideSelect from "@/components/form/GuideSelect";
import type { CompanyFeedVariant } from "@/app/company/data/companyFeedContent";

// variant별 aria-label 텍스트 (기존 개별 툴바의 라벨을 그대로 이관)
const toolbarLabels: Record<CompanyFeedVariant, { capital: string; lower: string }> = {
  press: { capital: "Press", lower: "press" },
  articles: { capital: "Articles", lower: "articles" },
};

// 게시월 옵션(1~12월, 값은 BE month_ 파라미터 형식인 "01"~"12") — 기존 Jan/Feb/Mar 3개뿐이던 하드코딩을 전체 확장
const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// 공통 피드 리스트 툴바 (Press/Articles). Month/Year/Search/Sort 필터 동일 구조
// - month/year/search/sort는 전부 optional(값+핸들러 짝) — 안 넘기면 기존처럼 비연동 장식 UI로 동작(articles 하위호환)
// - Year 옵션 목록(2026/2025)은 기존 하드코딩 그대로 유지, 필터링 기능만 연동(설계문서 9-D 확장)
type CompanyFeedListToolbarProps = {
  variant: CompanyFeedVariant;
  monthValue?: string; // "" | "01"~"12"
  onMonthChange?: (value: string) => void;
  yearValue?: string; // "" | "2026" | "2025"
  onYearChange?: (value: string) => void;
  searchValue?: string;
  onSearchSubmit?: (value: string) => void;
  sortValue?: "latest" | "oldest";
  onSortChange?: (value: "latest" | "oldest") => void;
};

export default function CompanyFeedListToolbar({
  variant,
  monthValue = "",
  onMonthChange,
  yearValue = "",
  onYearChange,
  searchValue = "",
  onSearchSubmit,
  sortValue = "latest",
  onSortChange,
}: CompanyFeedListToolbarProps) {
  const label = toolbarLabels[variant];
  const prefix = `company-${variant}-list`;
  // 검색어는 제출(Enter 또는 검색 아이콘 클릭) 시에만 상위로 전달 — 타이핑마다 재조회하지 않음
  const [searchDraft, setSearchDraft] = useState(searchValue);
  const submitSearch = () => onSearchSubmit?.(searchDraft.trim());
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") submitSearch();
  };

  return (
    <div className={`${prefix}__toolbar`}>
      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          value={monthValue}
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": `${label.capital} month filter` }}
          onChange={(event: SelectChangeEvent<unknown>) =>
            onMonthChange?.(String(event.target.value))
          }
          renderValue={(value) => {
            const code = value ? String(value) : "";
            const text = code
              ? (MONTH_OPTIONS.find((m) => m.value === code)?.label ?? code)
              : "Month";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="">Month</MenuItem>
          {MONTH_OPTIONS.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </GuideSelect>
      </FormControl>

      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          value={yearValue}
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": `${label.capital} year filter` }}
          onChange={(event: SelectChangeEvent<unknown>) =>
            onYearChange?.(String(event.target.value))
          }
          renderValue={(value) => {
            const text = value ? String(value) : "Year";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="">Year</MenuItem>
          <MenuItem value="2026">2026</MenuItem>
          <MenuItem value="2025">2025</MenuItem>
        </GuideSelect>
      </FormControl>

      <TextField
        className="guide_field guide_field--search"
        placeholder="Search"
        aria-label={`Search ${label.lower}`}
        value={searchDraft}
        onChange={(event) => setSearchDraft(event.target.value)}
        onKeyDown={handleSearchKeyDown}
        slotProps={{
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
          inputProps={{ "aria-label": `${label.capital} sort order` }}
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
