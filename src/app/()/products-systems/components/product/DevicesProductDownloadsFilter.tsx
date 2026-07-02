import type { ReactNode } from "react";

type DevicesProductDownloadsFilterProps = {
  children: ReactNode;
};

export default function DevicesProductDownloadsFilter({
  children,
}: DevicesProductDownloadsFilterProps) {
  return (
    <div className="devices_product_downloads__filter-stack">
      <aside className="devices_product_downloads__filter">{children}</aside>
    </div>
  );
}
