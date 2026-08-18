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
import GuideSelect from "@/components/form/GuideSelect";
import { guideSearchFieldMobileSlotProps } from "@/components/form/guideFieldMobileProps";
import type { CompanyFeedVariant } from "@/app/company/data/companyFeedContent";

const toolbarLabels: Record<CompanyFeedVariant, { capital: string; lower: string }> = {
  press: { capital: "Press", lower: "press" },
  articles: { capital: "Articles", lower: "articles" },
};

const ALL_MONTH_OPTIONS = [
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

const DEFAULT_MONTH_OPTIONS = ALL_MONTH_OPTIONS;

const DEFAULT_YEAR_OPTIONS = [String(new Date().getFullYear())];

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

type CompanyFeedListToolbarProps = {
  variant: CompanyFeedVariant;
  monthValue?: string;
  onMonthChange?: (value: string) => void;
  yearValue?: string;
  onYearChange?: (value: string) => void;
  monthOptions?: { value: string; label: string }[];
  yearOptions?: string[];
  searchValue?: string;
  onSearchSubmit?: (value: string) => void;
  sortValue?: SortValue;
  onSortChange?: (value: SortValue) => void;
};

export default function CompanyFeedListToolbar({
  variant,
  monthValue = "",
  onMonthChange,
  yearValue = "",
  onYearChange,
  monthOptions = DEFAULT_MONTH_OPTIONS,
  yearOptions = DEFAULT_YEAR_OPTIONS,
  searchValue = "",
  onSearchSubmit,
  sortValue = "latest",
  onSortChange,
}: CompanyFeedListToolbarProps) {
  const label = toolbarLabels[variant];
  const prefix = `company-${variant}-list`;
  const [searchDraft, setSearchDraft] = useState(searchValue);
  const hasQuery = searchDraft.length > 0;
  const submitSearch = () => onSearchSubmit?.(searchDraft.trim());
  // 검색어 초기화 — 입력값과 적용된 검색 조건을 함께 비운다
  const clearSearch = () => {
    setSearchDraft("");
    onSearchSubmit?.("");
    // Reset month/year selects too so "View all" shows full list
    onMonthChange?.("");
    onYearChange?.("");
  };
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") submitSearch();
  };

  useEffect(() => {
    setSearchDraft(searchValue);
  }, [searchValue]);

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
              ? (monthOptions.find((m) => m.value === code)?.label ?? code)
              : "Month";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="">Month</MenuItem>
          {monthOptions.map((month) => (
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
          {yearOptions.map((yr) => (
            <MenuItem key={yr} value={yr}>
              {yr}
            </MenuItem>
          ))}
        </GuideSelect>
      </FormControl>

      <TextField
        className={`guide_field guide_field--search${
          hasQuery ? " guide_field--search-filled" : ""
        }`}
        placeholder="Search"
        aria-label={`Search ${label.lower}`}
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
          inputProps={{ "aria-label": `${label.capital} sort order` }}
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
