"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import type { EventsPastItem } from "@/app/company/data/eventsListContent";

// 게시월 옵션(1~12월, 값은 BE month_ 파라미터 형식인 "01"~"12") — press/blog 툴바와 동일 목록
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

type CompanyEventsPastSectionProps = {
  items: EventsPastItem[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // 검색/정렬/월/연도 — 전부 optional(값+핸들러 짝). 미지정 시 비연동 장식 UI 유지(press/blog 툴바와 동일 원칙)
  searchValue?: string;
  onSearchSubmit?: (value: string) => void;
  sortValue?: SortValue;
  onSortChange?: (value: SortValue) => void;
  monthValue?: string;
  onMonthChange?: (value: string) => void;
  yearValue?: string;
  onYearChange?: (value: string) => void;
};

export default function CompanyEventsPastSection({
  items,
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  searchValue = "",
  onSearchSubmit,
  sortValue = "latest",
  onSortChange,
  monthValue = "",
  onMonthChange,
  yearValue = "",
  onYearChange,
}: CompanyEventsPastSectionProps) {
  // 검색어는 제출(Enter 또는 검색 아이콘 클릭) 시에만 상위로 전달 — 타이핑마다 재조회하지 않음(press/blog와 동일 패턴)
  const [searchDraft, setSearchDraft] = useState(searchValue);
  const submitSearch = () => onSearchSubmit?.(searchDraft.trim());
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") submitSearch();
  };

  return (
    <section className="company-events-past">
      <div className="inner">
        <h2 className="company-events-past__heading">Past Events</h2>

        <div className="company-events-past__body">
          <div className="company-events-past__toolbar">
            <FormControl className="guide_field guide_field--w200">
              <GuideSelect
                value={monthValue}
                displayEmpty
                IconComponent={GuideSelectIcon}
                inputProps={{ "aria-label": "Past events month filter" }}
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
                inputProps={{ "aria-label": "Past events year filter" }}
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
              aria-label="Search past events"
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
                inputProps={{ "aria-label": "Past events sort order" }}
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

          <ul className="company-events-past__grid">
            {items.map((item) => (
              <li key={item.id} className="company-events-past__item">
                <Link
                  href={item.href || "#"}
                  className="company-events-past__card"
                  aria-label={`${item.title}, ${item.dateRange}`}
                  prefetch={false}
                >
                  <div className="company-events-past__image">
                    <img src={item.image} alt="" />
                  </div>
                  <div className="company-events-past__content">
                    <h3 className="company-events-past__title">{item.title}</h3>
                    <p className="company-events-past__date">{item.dateRange}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <PageNumbering
            className="company-events-past__pagination"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            ariaLabel="Past events pagination"
          />
        </div>
      </div>
    </section>
  );
}
