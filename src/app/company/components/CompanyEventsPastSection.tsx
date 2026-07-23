"use client";

import Link from "next/link";
import {
  FormControl,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import type { EventsPastItem } from "@/app/company/data/eventsListContent";

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
  // 정렬 — optional(값+핸들러 짝). 미지정 시 비연동 장식 UI 유지(press/blog 툴바와 동일 원칙)
  sortValue?: SortValue;
  onSortChange?: (value: SortValue) => void;
};

export default function CompanyEventsPastSection({
  items,
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  sortValue = "latest",
  onSortChange,
}: CompanyEventsPastSectionProps) {
  return (
    <section className="company-events-past">
      <div className="inner">
        <h2 className="company-events-past__heading">Past Events</h2>

        <div className="company-events-past__body">
          <div className="company-events-past__toolbar">
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
