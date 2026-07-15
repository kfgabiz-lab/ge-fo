"use client";

import { useState } from "react";
import DownloadCenterFilterModal from "./DownloadCenterFilterModal";
import DownloadCenterMobileToolbar from "./DownloadCenterMobileToolbar";

export default function DownloadCenterMobileControls() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <section className="support_download_mo-controls" id="support-download-controls">
      <div className="inner">
        <DownloadCenterMobileToolbar onFilterOpen={() => setFilterOpen(true)} />
      </div>
      <DownloadCenterFilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />
    </section>
  );
}
