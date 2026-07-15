"use client";

import { useState } from "react";
import { techHubPage } from "@/data/support/techHubContent";
import TechHubFilterModal from "./TechHubFilterModal";

export default function TechHubMobileControls() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <section className="support_download_mo-controls support_tech_hub_mo-controls" id="support-tech-hub-controls">
      <div className="inner">
        <button
          type="button"
          className="support_download_mo-toolbar__filter"
          onClick={() => setFilterOpen(true)}
        >
          <span className="support_download_mo-toolbar__filter-label">
            {techHubPage.filterByLabel}
          </span>
          <span className="support_download_mo-toolbar__filter-icon" aria-hidden>
            <img src="/ico/ico_filter_14.svg" alt="" width={14} height={14} />
          </span>
        </button>
      </div>
      <TechHubFilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />
    </section>
  );
}
