"use client";

import Link from "next/link";
import { FormControl, MenuItem } from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import type { EventsPastItem } from "@/app/company/data/eventsListContent";

type CompanyEventsPastSectionProps = {
  items: EventsPastItem[];
  currentPage?: number;
  totalPages?: number;
};

export default function CompanyEventsPastSection({
  items,
  currentPage = 1,
  totalPages = 5,
}: CompanyEventsPastSectionProps) {
  return (
    <section className="company-events-past">
      <div className="inner">
        <h2 className="company-events-past__heading">Past Events</h2>

        <div className="company-events-past__body">
          <div className="company-events-past__toolbar">
            <FormControl className="guide_field guide_field--w200">
              <GuideSelect
                defaultValue="Latest"
                displayEmpty
                IconComponent={GuideSelectIcon}
                inputProps={{ "aria-label": "Past events sort order" }}
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

          <ul className="company-events-past__grid">
            {items.map((item) => (
              <li key={item.id} className="company-events-past__item">
                <Link
                  href={item.href || "#"}
                  className="company-events-past__card"
                  aria-label={`${item.title}, ${item.dateRange}`}
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
            ariaLabel="Past events pagination"
          />
        </div>
      </div>
    </section>
  );
}
