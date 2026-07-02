"use client";

import {
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import { guideSearchFieldMobileSlotProps } from "@/components/form/guideFieldMobileProps";
import GuideSelect from "@/components/form/GuideSelect";

export default function CompanyBlogListToolbar() {
  return (
    <div className="company-blog-list__toolbar">
      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          defaultValue=""
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": "Blog category filter" }}
          renderValue={(value) => {
            const text = value ? String(value) : "All";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Power Distribution & Infrastructure">
            Power Distribution & Infrastructure
          </MenuItem>
          <MenuItem value="Energy Solutions">Energy Solutions</MenuItem>
          <MenuItem value="Automation Solutions">Automation Solutions</MenuItem>
        </GuideSelect>
      </FormControl>

      <TextField
        className="guide_field guide_field--search"
        placeholder="Search"
        aria-label="Search blog"
        slotProps={{
          ...guideSearchFieldMobileSlotProps,
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
          inputProps={{ "aria-label": "Blog sort order" }}
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
