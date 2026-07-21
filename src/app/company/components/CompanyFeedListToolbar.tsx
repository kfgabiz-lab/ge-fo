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

// 게시월 옵션(1~12월, 값은 BE month_ 파라미터 형식인 "01"~"12") — 전체 12개월 원본
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

// month 옵션 미전달 시 기본값: Jun~Oct(06~10) 5개월
const DEFAULT_MONTH_OPTIONS = ALL_MONTH_OPTIONS.filter(
  (m) => m.value >= "06" && m.value <= "10",
);

// year 옵션 미전달 시 방어용 fallback: 현재 연도 1개(실제로는 press/articles 페이지에서 항상 전달)
const DEFAULT_YEAR_OPTIONS = [String(new Date().getFullYear())];

// 정렬 옵션(최신/오래된순 + 제목 A-Z/Z-A). value는 데이터 헬퍼 sort 파라미터와 동일
const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// Select value(unknown) → 허용된 정렬값으로 좁히기(미허용 시 latest 폴백)
function toSortValue(raw: unknown): SortValue {
  return SORT_OPTIONS.some((o) => o.value === raw) ? (raw as SortValue) : "latest";
}

// 공통 피드 리스트 툴바 (Press/Articles). Month/Year/Search/Sort 필터 동일 구조
// - month/year/search/sort는 전부 optional(값+핸들러 짝) — 안 넘기면 기존처럼 비연동 장식 UI로 동작(articles 하위호환)
// - monthOptions/yearOptions 미전달 시 기본값(month: Jun~Oct, year: 현재연도) 사용
type CompanyFeedListToolbarProps = {
  variant: CompanyFeedVariant;
  monthValue?: string; // "" | "01"~"12"
  onMonthChange?: (value: string) => void;
  yearValue?: string; // "" | "YYYY"
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
