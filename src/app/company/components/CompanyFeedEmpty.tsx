import Link from "next/link";
import { emptyStateIconSrc } from "@/data/commonAssets";
import React from "react";

type CompanyFeedEmptyVariant = "press" | "articles" | "blog";

type CompanyFeedEmptyProps = {
  variant: CompanyFeedEmptyVariant;
  viewAllHref?: string;
  onViewAllClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
};

export default function CompanyFeedEmpty({
  variant,
  viewAllHref = `/company/${variant}`,
  onViewAllClick,
}: CompanyFeedEmptyProps) {
  const prefix = `company-${variant}-list`;

  return (
    <div className={`${prefix}__empty`}>
      <div className={`${prefix}__empty-icon`} aria-hidden="true">
        <img src={emptyStateIconSrc} alt="" />
      </div>
      <div className={`${prefix}__empty-text`}>
        <p className={`${prefix}__empty-title`}>There are no results</p>
        <p className={`${prefix}__empty-desc`}>
          Try adjusting your filters or search terms.
        </p>
      </div>
      <Link
        href={viewAllHref}
        onClick={(e) => {
          if (onViewAllClick) {
            e.preventDefault();
            onViewAllClick(e);
          }
        }}
        className={`btn-base btn-lv01 btn-lv01--solid ${prefix}__empty-btn`}
      >
        View All
      </Link>
    </div>
  );
}
