import type { ReactNode } from "react";

type DevicesProductDownloadsFilterProps = {
  children: ReactNode;
  className?: string;
};

export default function DevicesProductDownloadsFilter({
  children,
  className,
}: DevicesProductDownloadsFilterProps) {
  const stackClassName = className
    ? `devices_product_downloads__filter-stack ${className}`
    : "devices_product_downloads__filter-stack";

  return (
    <div className={stackClassName}>
      <aside className="devices_product_downloads__filter">{children}</aside>
    </div>
  );
}
