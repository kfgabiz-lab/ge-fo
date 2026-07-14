"use client";

import {
  FormControl,
  InputAdornment,
  MenuItem,
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

// 공통 피드 리스트 툴바 (Press/Articles). Month/Year/Search/Sort 필터 동일 구조
type CompanyFeedListToolbarProps = {
  variant: CompanyFeedVariant;
};

export default function CompanyFeedListToolbar({ variant }: CompanyFeedListToolbarProps) {
  const label = toolbarLabels[variant];
  const prefix = `company-${variant}-list`;

  return (
    <div className={`${prefix}__toolbar`}>
      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          defaultValue=""
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": `${label.capital} month filter` }}
          renderValue={(value) => {
            const text = value ? String(value) : "Month";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="">Month</MenuItem>
          <MenuItem value="January">January</MenuItem>
          <MenuItem value="February">February</MenuItem>
          <MenuItem value="March">March</MenuItem>
        </GuideSelect>
      </FormControl>

      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          defaultValue=""
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": `${label.capital} year filter` }}
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
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end" className="guide_field__search-adorn">
                <button
                  type="button"
                  className="guide_field__search-icon-button"
                  aria-label="Search"
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
          defaultValue="Latest"
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": `${label.capital} sort order` }}
          renderValue={(value) => {
            const text = value ? String(value) : "Latest";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="Latest">Latest</MenuItem>
          <MenuItem value="Oldest">Oldest</MenuItem>
        </GuideSelect>
      </FormControl>
    </div>
  );
}
